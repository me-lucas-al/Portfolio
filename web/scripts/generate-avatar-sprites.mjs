
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

const RAW_CACHE_DIR = path.resolve(WEB_ROOT, ".cache/avatar-sprites-raw")

const SPRITE_SIZE = 512

const CHROMA_KEY_RGB = { r: 0, g: 255, b: 0 }

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

const FRAMES = [
  { name: "neutral-closed", expression: "neutral", mouth: "closed", blink: false },
  { name: "neutral-open", expression: "neutral", mouth: "open", blink: false },
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
