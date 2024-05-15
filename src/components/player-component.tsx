"use client";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface PlayerComponentProps {
  artist: string;
  song: string;
}

export function PlayerComponent({ artist, song }: PlayerComponentProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const server = "http://localhost:8080/stream";
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.attachMedia(audio);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(`${server}/${artist}/${song}`);
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

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
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md rounded-lg overflow-hidden shadow-lg">
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">{song}</h2>
          <p className="text-gray-400">{artist}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button size="icon" variant="ghost" onClick={handlePlayPause}>
                {isPlaying ? (
                  <PauseIcon className="w-8 h-8" />
                ) : (
                  <PlayIcon className="w-8 h-8" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost">
                <Volume2Icon className="w-6 h-6" />
              </Button>
              <Slider
                className="w-24 [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:transition-transform"
                value={[volume]}
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
          <div className="w-full">
            <Slider
              className="w-full [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:transition-transform"
              value={[currentTime]}
              max={duration}
              onValueChange={(value: number[]) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = value[0];
                }
              }}
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(duration - currentTime)}</span>
            </div>
          </div>
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  );
}

function ForwardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 17 20 12 15 7" />
      <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
    </svg>
  );
}

function PlayIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function RewindIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 19 2 12 11 5 11 19" />
      <polygon points="22 19 13 12 22 5 22 19" />
    </svg>
  );
}

function Volume2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function PauseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}
