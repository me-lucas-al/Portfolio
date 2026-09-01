// One-off generation script for `web/public/avatar/sprites/*.png` - NOT part
// of the app (see `../src/modules/portfolio/avatar/README.md`, "Assets").
// Uses the Gemini image model (`@google/genai`, already a dependency for the
// assistant's chat/TTS calls - see `../src/lib/assistant/tts-provider.ts` for
// the sibling pattern this mirrors) with `dados-pessoais/avatar_lucas.jpg` as
// a reference image, so the generated bust resembles the portfolio's owner.
//
// Run from `web/`: `node scripts/generate-avatar-sprites.mjs`
// Requires `GEMINI_API_KEY` (read from `web/.env.local` if present, else the
// environment - same variable `/api/chat` and `/api/tts` already use).
//
// The model is asked for a flat chroma-key background (`CHROMA_KEY_RGB`)
// instead of a real transparent background, because none of the response
// formats this SDK version's `interactions.create` accepts for images
// (`ImageResponseFormatMimeType` on this SDK is jpeg-only - see
// `node_modules/@google/genai/dist/genai.d.ts`) reliably preserves alpha.
// `removeChromaKeyAndResize` below does the alpha punch-out locally instead.

import { GoogleGenAI } from "@google/genai"
import sharp from "sharp"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const WEB_ROOT = path.resolve(SCRIPT_DIR, "..")
const REPO_ROOT = path.resolve(WEB_ROOT, "..")
const REFERENCE_IMAGE_PATH = path.resolve(REPO_ROOT, "dados-pessoais/avatar_lucas.jpg")
const OUTPUT_DIR = path.resolve(WEB_ROOT, "public/avatar/sprites")
const ENV_LOCAL_PATH = path.resolve(WEB_ROOT, ".env.local")
// Raw (pre-chroma-key) bytes straight off the model, keyed by frame name -
// so tuning `removeChromaKeyAndResize` doesn't need a fresh (paid, and
// non-deterministic) generation call every time. `--force` bypasses it.
const RAW_CACHE_DIR = path.resolve(WEB_ROOT, ".cache/avatar-sprites-raw")

// Same dimensions as the placeholders it replaces - `sprite-frames.ts` has
// no idea (nor cares) what size the PNGs are, but keeping it identical means
// no layout/CSS anywhere needs to change.
const SPRITE_SIZE = 512

// Matches the `#00FF00` chroma-key color requested in every prompt below.
const CHROMA_KEY_RGB = { r: 0, g: 255, b: 0 }
// Below this Euclidean RGB distance from the key color, a pixel is
// background - fully transparent. Above it, fully opaque. Between the two,
// alpha is interpolated (feathered) instead of a hard cutoff, which is what
// actually gets rid of the thin bright-green fringe a binary threshold
// leaves behind on anti-aliased edges (hair strands, jacket collar).
const CHROMA_FULLY_TRANSPARENT_DISTANCE = 120
const CHROMA_FULLY_OPAQUE_DISTANCE = 220

const MODEL = process.env.AVATAR_SPRITE_MODEL || "gemini-3.1-flash-image"
const RETRY_ATTEMPTS = 3
const RETRY_BASE_DELAY_MS = 1500

const EXPRESSION_PROMPTS = {
  neutral: "a calm, neutral, friendly resting expression - relaxed eyebrows, relaxed eyes, closed relaxed lips",
  positive: "a warm, happy, confident smiling expression - slightly raised eyebrows, smiling eyes",
  apologetic: "an apologetic, sheepish, slightly embarrassed expression - eyebrows raised inward, a small awkward closed-lip smile, head very slightly tilted",
  surprised: "a surprised, wide-eyed expression - eyebrows raised high, eyes wide open",
}

const MOUTH_PROMPTS = {
  closed: "the mouth fully closed",
  open: "the mouth open mid-speech, as if talking, teeth barely visible",
}

// The 9 combinations `sprite-frames.ts` reads by file name - this list IS
// the contract, matching `FRAME_URLS` there exactly.
const FRAMES = [
  { name: "neutral-closed", expression: "neutral", mouth: "closed", blink: false },
  { name: "neutral-open", expression: "neutral", mouth: "open", blink: false },
  { name: "neutral-blink", expression: "neutral", mouth: "closed", blink: true },
  { name: "positive-closed", expression: "positive", mouth: "closed", blink: false },
  { name: "positive-open", expression: "positive", mouth: "open", blink: false },
  { name: "apologetic-closed", expression: "apologetic", mouth: "closed", blink: false },
  { name: "apologetic-open", expression: "apologetic", mouth: "open", blink: false },
  { name: "surprised-closed", expression: "surprised", mouth: "closed", blink: false },
  { name: "surprised-open", expression: "surprised", mouth: "open", blink: false },
]

function buildPrompt(frame) {
  const eyes = frame.blink ? "the eyes fully closed, mid-blink" : "the eyes open, looking directly at the camera"

  return [
    "Redraw the exact same person shown in the attached reference photo as a single 2D flat-vector illustration character portrait - same face shape, same hairstyle, same skin tone, same identity, but as flat illustrated character art, NOT a photo, NOT 3D, NOT photorealistic.",
    "Head-and-shoulders bust crop, centered in frame, facing forward, camera at eye level. This exact framing, zoom level, and camera angle must stay identical across every generation of this character - do not crop tighter or wider, do not tilt the camera.",
    `Expression: ${EXPRESSION_PROMPTS[frame.expression]}.`,
    `Mouth: ${MOUTH_PROMPTS[frame.mouth]}.`,
    `Eyes: ${eyes}.`,
    "Flat, even, soft studio-style lighting with a consistent color palette and consistent line-art style across every version of this character - no dramatic shadows, no rim light.",
    "Background: fill the ENTIRE background with a single solid, flat, evenly lit chroma-key color #00FF00 (pure green) - no gradients, no shadows, no texture, no props, nothing else touching the background.",
    "Clean digital vector-illustration style, crisp outlines, no photographic texture, no watermark, no text, no border, no frame.",
  ].join(" ")
}

async function loadApiKey() {
  try {
    process.loadEnvFile(ENV_LOCAL_PATH)
  } catch {
    // No web/.env.local (e.g. CI) - fall back to whatever's already in the environment.
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error(`GEMINI_API_KEY is not set (checked ${ENV_LOCAL_PATH} and the environment).`)
  }
  return apiKey
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Mirrors `steps[0].content[0]` extraction in `../src/lib/assistant/tts-provider.ts`,
// but scans every `model_output` step for an image content item instead of
// assuming position 0 - image responses aren't verified against this SDK
// version the way that TTS call already was.
function extractImageContent(response) {
  const steps = response?.steps ?? []
  for (const step of steps) {
    if (step?.type !== "model_output") continue
    const items = step.content ?? []
    const image = items.find((item) => item?.type === "image" && item.data)
    if (image) return image
  }
  return undefined
}

async function generateFrame(ai, referenceBase64, frame) {
  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt += 1) {
    try {
      const response = await ai.interactions.create({
        model: MODEL,
        input: [
          { type: "text", text: buildPrompt(frame) },
          { type: "image", mime_type: "image/jpeg", data: referenceBase64 },
        ],
        response_format: { type: "image", aspect_ratio: "1:1" },
      })

      const image = extractImageContent(response)
      if (!image) throw new Error(`No image content in response for "${frame.name}"`)

      return Buffer.from(image.data, "base64")
    } catch (error) {
      const isLastAttempt = attempt === RETRY_ATTEMPTS - 1
      if (isLastAttempt) throw error
      console.warn(`[avatar-sprites] "${frame.name}" attempt ${attempt + 1} failed, retrying:`, error?.message ?? error)
      await sleep(RETRY_BASE_DELAY_MS * (attempt + 1))
    }
  }
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value))
}

// Punches the chroma-key background to transparency (feathered, not a hard
// cutoff - see the two DISTANCE constants above), suppresses green spill on
// the remaining edge pixels, then resizes to the sprites' fixed 512x512 -
// same post-processing every frame gets, so there's nothing left to do to a
// batch by hand before it's droppable straight into `public/avatar/sprites/`.
async function removeChromaKeyAndResize(inputBuffer) {
  const { data, info } = await sharp(inputBuffer)
    .resize(SPRITE_SIZE, SPRITE_SIZE, { fit: "cover" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    const dr = r - CHROMA_KEY_RGB.r
    const dg = g - CHROMA_KEY_RGB.g
    const db = b - CHROMA_KEY_RGB.b
    const distance = Math.sqrt(dr * dr + dg * dg + db * db)

    const opacity = clamp01(
      (distance - CHROMA_FULLY_TRANSPARENT_DISTANCE) /
        (CHROMA_FULLY_OPAQUE_DISTANCE - CHROMA_FULLY_TRANSPARENT_DISTANCE)
    )
    data[i + 3] = Math.round(opacity * 255)

    // Green-screen spill: edge pixels blended with the key color read as a
    // sickly green tint even once alpha is punched out. Gated to the
    // feathered (not fully opaque) zone only - a fully-opaque interior pixel
    // is definitely real character art, never background bleed, and could
    // legitimately be green (e.g. a green prop) without this being spill.
    if (opacity < 1) {
      const maxRb = Math.max(r, b)
      if (g > maxRb) data[i + 1] = maxRb
    }
  }

  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } }).png().toBuffer()
}

async function readRawCache(frame) {
  try {
    return await readFile(path.join(RAW_CACHE_DIR, frame.name))
  } catch {
    return null
  }
}

async function main() {
  const force = process.argv.includes("--force")

  const referenceBuffer = await readFile(REFERENCE_IMAGE_PATH)
  const referenceBase64 = referenceBuffer.toString("base64")

  await mkdir(OUTPUT_DIR, { recursive: true })
  await mkdir(RAW_CACHE_DIR, { recursive: true })

  // Only touched if at least one frame is missing from the cache (or
  // `--force` is passed) - re-running purely to tune post-processing never
  // needs an API key at all.
  let ai = null

  for (const frame of FRAMES) {
    let rawImage = force ? null : await readRawCache(frame)

    if (!rawImage) {
      if (!ai) ai = new GoogleGenAI({ apiKey: await loadApiKey() })
      process.stdout.write(`[avatar-sprites] generating ${frame.name}... `)
      rawImage = await generateFrame(ai, referenceBase64, frame)
      await writeFile(path.join(RAW_CACHE_DIR, frame.name), rawImage)
      console.log("generated")
    } else {
      console.log(`[avatar-sprites] ${frame.name}: reusing cached generation (pass --force to regenerate)`)
    }

    const processedImage = await removeChromaKeyAndResize(rawImage)
    const outputPath = path.join(OUTPUT_DIR, `${frame.name}.png`)
    await writeFile(outputPath, processedImage)
  }

  console.log(
    "\n[avatar-sprites] All 9 frames written. Open web/public/avatar/sprites/*.png and compare them " +
      "side by side before trusting this batch - same crop/zoom, same palette/lighting, mouth open vs " +
      "closed clearly different, no head-angle drift between frames of the same expression."
  )
}

main().catch((error) => {
  console.error("[avatar-sprites] failed:", error)
  process.exitCode = 1
})
