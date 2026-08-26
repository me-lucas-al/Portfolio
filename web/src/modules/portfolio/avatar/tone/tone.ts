/**
 * Tone taxonomy. Purely data - no DOM, no rendering dependency, safe to
 * import from anywhere (including a plain `vitest` unit test, see
 * `classify-tone.spec.ts`).
 *
 * `../sprite/tone-expression-map.ts` reduces these six values down to the
 * four visual expressions this module has sprite frames for - this file
 * itself carries no visual weights of its own (the three.js version of this
 * module used to map each tone to blendshape weights here; that mapping was
 * removed along with the three.js engine, see `../README.md`).
 */
export type Tone = "neutral" | "positive" | "enthusiastic" | "explanatory" | "apologetic" | "surprised"
