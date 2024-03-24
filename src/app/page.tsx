import Image from "next/image";
import AudioPlayer from "./components/audio-player";
import { Player } from "@/components/player";

export default function Home() {
        return (
                <main className="flex min-h-screen flex-col items-center justify-between p-24">
                        <h1>HLS Audio Player</h1>
                        <AudioPlayer />
                        <Player />
                </main>
        );
}
