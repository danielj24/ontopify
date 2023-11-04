import React from "react";
import PlaybackControls from "@/renderer/components/playback-controls";

export default function Small(): JSX.Element {
  return (
    <div>
      <div className="bg-gradient-to-t from-zinc-950 to-zinc-900/0 h-full w-full absolute bottom-0 left-0 pointer-events-none" />

      <PlaybackControls className="pt-6" />
    </div>
  );
}
