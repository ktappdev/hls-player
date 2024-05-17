"use client";
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const HLSPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource("http://localhost:8080/stream/artist1/song1");
      hls.attachMedia(audio);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audio.play();
      });
    } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
      audio.src = "index.m3u8";
      audio.addEventListener("loadedmetadata", () => {
        audio.play();
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  return (
    <div>
      <audio ref={audioRef} autoPlay controls />
    </div>
  );
};

export default HLSPlayer;
