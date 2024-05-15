// import Image from "next/image";
import AudioPlayer from "./components/audio-player";
// import { Player } from "@/components/player";
import { PlayerComponent } from "@/components/player-component";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col w-full items-center justify-between gap-2">
        {/* <AudioPlayer artist="artist1" song="song1" /> */}
        <AudioPlayer artist="artist2" song="song2" />
        <PlayerComponent artist="artist1" song="song1" />
      </div>
    </main>
  );
}
