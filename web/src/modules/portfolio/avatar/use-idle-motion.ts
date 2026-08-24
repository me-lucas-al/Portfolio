import { RefObject, useEffect, useRef } from "react";
import { VRM } from "@pixiv/three-vrm";
import * as THREE from "three";

export function useIdleMotion(vrmRef: RefObject<VRM | null>, emotion: "neutral" | "happy" | "sad" | "surprised" | "relaxed") {
  const nextBlinkRef = useRef(0);
  const isBlinkingRef = useRef(false);
  const blinkStartRef = useRef(0);

  useEffect(() => {
    let frameId: number;
    let clock = new THREE.Clock();

    const emotions = ["happy", "sad", "surprised", "relaxed"];

    const update = () => {
      frameId = requestAnimationFrame(update);
      const vrm = vrmRef.current;
      if (!vrm) return;

      const time = clock.getElapsedTime();

      // Sway / breathing
      if (vrm.humanoid) {
        const spine = vrm.humanoid.getNormalizedBoneNode("spine");
        if (spine) {
          spine.rotation.x = Math.sin(time * 2) * 0.01;
          spine.rotation.z = Math.cos(time * 1.5) * 0.01;
        }
        const head = vrm.humanoid.getNormalizedBoneNode("head");
        if (head) {
          head.rotation.x = Math.sin(time * 1.2) * 0.005;
          head.rotation.y = Math.cos(time * 0.8) * 0.01;
        }
      }

      // Blink logic
      if (vrm.expressionManager) {
        if (!isBlinkingRef.current && time > nextBlinkRef.current) {
          isBlinkingRef.current = true;
          blinkStartRef.current = time;
        }

        if (isBlinkingRef.current) {
          const blinkDuration = 0.15;
          let blinkValue = 0;
          const blinkTime = time - blinkStartRef.current;

          if (blinkTime < blinkDuration) {
            // Blinking down
            blinkValue = Math.sin((blinkTime / blinkDuration) * Math.PI);
            vrm.expressionManager.setValue("blink", blinkValue);
          } else {
            // Blink finished
            isBlinkingRef.current = false;
            vrm.expressionManager.setValue("blink", 0);
            nextBlinkRef.current = time + 2 + Math.random() * 4; // next blink in 2 to 6 seconds
          }
        }

        // Apply base emotion
        for (const e of emotions) {
          if (e === emotion) {
            vrm.expressionManager.setValue(e, 1);
          } else {
            vrm.expressionManager.setValue(e, 0);
          }
        }
      }
    };

    update();
    return () => cancelAnimationFrame(frameId);
  }, [vrmRef, emotion]);
}
