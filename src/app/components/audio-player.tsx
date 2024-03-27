"use client"

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface AudioPlayerProps {
        artist: string;
        song: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ artist, song }) => {
        const audioRef = useRef<HTMLAudioElement>(null);
        const hlsRef = useRef<Hls | null>(null);
        const [isPlaying, setIsPlaying] = useState(false);

        useEffect(() => {
                const audio = audioRef.current;

                if (audio) {
                        const hls = new Hls();
                        hlsRef.current = hls;

                        hls.attachMedia(audio);
                        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                                hls.loadSource(`http://localhost:8080/stream/${artist}/${song}`);
                        });

                        return () => {
                                if (hlsRef.current) {
                                        hlsRef.current.destroy();
                                }
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
                        console.error('HLS instance is not yet created');
                }
        };

        return (
                <div className="flex items-center p-4 rounded-lg bg-gray-200 dark:bg-gray-800">
                        <audio ref={audioRef} controls autoPlay />
                        <button onClick={handlePlayPause}>
                                {isPlaying ? 'Pause' : 'Play'}
                        </button>
                </div>
        );
};

export default AudioPlayer;
