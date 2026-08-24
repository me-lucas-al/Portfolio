"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VRMLoaderPlugin, VRM, VRMUtils } from "@pixiv/three-vrm";
import { useVisemeDriver } from "./use-viseme-driver";
import { useIdleMotion } from "./use-idle-motion";

interface AvatarCanvasProps {
  analyserNode: AnalyserNode | null;
  emotion: "neutral" | "happy" | "sad" | "surprised" | "relaxed";
}

export default function AvatarCanvas({ analyserNode, emotion }: AvatarCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vrmRef = useRef<VRM | null>(null);

  useVisemeDriver(vrmRef, analyserNode);
  useIdleMotion(vrmRef, emotion);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(30.0, width / height, 0.1, 20.0);
    camera.position.set(0.0, 1.45, 1.2); 

    const scene = new THREE.Scene();
    const light = new THREE.DirectionalLight(0xffffff, 2.0);
    light.position.set(1.0, 1.0, 1.0).normalize();
    scene.add(light);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      "/avatar.vrm",
      (gltf) => {
        const vrm = gltf.userData.vrm;
        VRMUtils.removeUnnecessaryJoints(gltf.scene);
        vrm.scene.rotation.y = Math.PI;
        scene.add(vrm.scene);
        vrmRef.current = vrm;
      },
      undefined,
      (error) => console.error(error)
    );

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (vrmRef.current) {
        vrmRef.current.update(delta);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
}
