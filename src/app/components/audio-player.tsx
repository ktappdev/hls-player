"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface AudioPlayerProps {
  artist: string;
  song: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ artist, song }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.attachMedia(audio);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(`http://server.lugetech.com/stream/${artist}/${song}`);
      });
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [artist, song]);

  const handlePlayPause = () => {
    if (hlsRef.current) {
      if (isPlaying) {
        hlsRef.current.media?.pause();
        setIsPlaying(false);
      } else {
        hlsRef.current.media?.play();
        setIsPlaying(true);
      }
    } else {
      console.error("HLS instance is not yet created");
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-between p-4 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="flex items-center mb-4">
        <button onClick={handlePlayPause} className="mr-4 focus:outline-none">
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        <div className="text-white">
          <div className="text-xl font-bold">{song}</div>
          <div className="text-sm">{artist}</div>
        </div>
      </div>
      <div className="w-full">
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => {
            if (audioRef.current) {
              audioRef.current.currentTime = parseFloat(e.target.value);
            }
          }}
          className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-white">
          <div>{formatTime(currentTime)}</div>
          <div>-{formatTime(duration - currentTime)}</div>
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  );
};

export default AudioPlayer;
