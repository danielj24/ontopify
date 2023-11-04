import React from "react";
import PlaybackMedia from "@/renderer/components/playback-media";
import PlaybackControls from "@/renderer/components/playback-controls";

export default function Large(): JSX.Element {
  return (
    <div className="flex flex-col">
      <PlaybackMedia />

      <div className="absolute bottom-0 pb-3 w-full">
        <div className="bg-gradient-to-t from-zinc-950 to-zinc-900/0 h-full w-full absolute bottom-0 left-0 pointer-events-none" />

        <PlaybackControls />
      </div>
    </div>
  );
}
