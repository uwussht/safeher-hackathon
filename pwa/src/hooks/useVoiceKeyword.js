import { useEffect, useRef } from "react";

export function useVoiceKeyword(keyword = "help me", onDetected) {
  const recogRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.lang = "en-US";
    recogRef.current = recog;

    recog.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript.toLowerCase())
        .join(" ");
      if (transcript.includes(keyword.toLowerCase())) {
        onDetected();
      }
    };

    recog.start();
    return () => recog.stop();
  }, [keyword, onDetected]);
}