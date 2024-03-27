import Image from "next/image";
import AudioPlayer from "./components/audio-player";
import { Player } from "@/components/player";

export default function Home() {
        return (
                <main className="flex min-h-screen flex-col items-center justify-between p-24">
                        <div>
                                <h1>Listen to your favorite songs</h1>
                                <AudioPlayer artist="artist1" song="song1" />
                                <AudioPlayer artist="artist2" song="song2" />
                        </div>
                </main>
        );
}
