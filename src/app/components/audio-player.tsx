"use client"
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
interface AudioPlayerProps { }

const AudioPlayer: React.FC<AudioPlayerProps> = () => {
        const audioRef = useRef<HTMLAudioElement>(null);
        const hlsRef = useRef<Hls | null>(null);
        const [isPlaying, setIsPlaying] = useState(false); // Track play/pause state

        useEffect(() => {
                const audio = audioRef.current;
                const hls = new Hls();

                hlsRef.current = hls;

                hls.attachMedia(audio!);
                hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                        hls.loadSource('http://localhost:8080/stream'); // Adjust URL if needed
                });

                return () => {
                        if (hlsRef.current) {
                                hlsRef.current.destroy();
                        }
                };
        }, []);

        const handlePlayPause = () => {
                if (hlsRef.current) { // Check if hlsRef.current is not null
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
                </div>
        );
};

export default AudioPlayer;
