import { RefObject, useEffect, useRef } from "react";
import { VRM } from "@pixiv/three-vrm";
import { Lipsync, VISEMES } from "wawa-lipsync";
import { VISEME_TO_VRM_MAP } from "./viseme-map";

export function useVisemeDriver(vrmRef: RefObject<VRM | null>, analyserNode: AnalyserNode | null) {
  const lipsyncRef = useRef<Lipsync | null>(null);

  useEffect(() => {
    if (!analyserNode) return;

    // wawa-lipsync API expects an HTMLMediaElement, but we have an AnalyserNode
    // that's already connected to our PCM playback. We can inject our analyser directly
    // since we're in JS and we can bypass TS private modifiers.
    const lipsync = new Lipsync();
    
    // @ts-ignore
    lipsync.analyser = analyserNode;
    // @ts-ignore
    lipsync.audioContext = analyserNode.context;

    lipsyncRef.current = lipsync;

    let frameId: number;
    const update = () => {
      frameId = requestAnimationFrame(update);
      const vrm = vrmRef.current;
      if (!vrm) return;

      // Reset all blendshapes
      for (const shape of Object.values(VISEME_TO_VRM_MAP)) {
        if (shape !== "neutral") {
          vrm.expressionManager?.setValue(shape, 0);
        }
      }

      lipsync.processAudio();
      const currentViseme = lipsync.viseme;
      
      const vrmShape = VISEME_TO_VRM_MAP[currentViseme.replace("viseme_", "")];
      if (vrmShape && vrmShape !== "neutral") {
        // Here we could implement smooth transitions, but let's stick to direct application for now
        // Wawa lipsync already has some smoothing internally, or we can just set it to 1.0
        vrm.expressionManager?.setValue(vrmShape, 1.0);
      }
      
      // Update is called in the render loop in AvatarCanvas, no need to call update here
    };

    update();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [analyserNode, vrmRef]);
}
