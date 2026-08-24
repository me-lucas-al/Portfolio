// wawa-lipsync visemes mapped to VRM blendshapes
export const VISEME_TO_VRM_MAP: Record<string, string> = {
  a: "aa",
  e: "ee",
  i: "ih",
  o: "oh",
  u: "ou",
  // wawa-lipsync might emit different keys depending on the internal dictionary
  // Let's assume standard formants or wawa's specific visemes
  // If it emits standard OVR visemes:
  sil: "neutral",
  PP: "neutral", // closed mouth
  FF: "ih",
  TH: "ih",
  DD: "ee",
  kk: "ee",
  CH: "ee",
  SS: "ee",
  nn: "ee",
  RR: "ee",
  aa: "aa",
  E: "ee",
  I: "ih",
  O: "oh",
  U: "ou",
};
