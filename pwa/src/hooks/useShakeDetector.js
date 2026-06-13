import { useEffect } from "react";

export function useShakeDetector(onShake, threshold = 15) {
  useEffect(() => {
    let last = { x: 0, y: 0, z: 0 };

    function handleMotion(e) {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const delta = Math.abs(acc.x - last.x) + Math.abs(acc.y - last.y) + Math.abs(acc.z - last.z);
      if (delta > threshold) onShake();
      last = { x: acc.x, y: acc.y, z: acc.z };
    }

    if (typeof DeviceMotionEvent !== "undefined") {
      window.addEventListener("devicemotion", handleMotion);
    }
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [onShake, threshold]);
}