import React, { useState } from "react";
import PlaybackMedia from "@/renderer/components/playback-media";
import PlaybackControls from "@/renderer/components/playback-controls";
import { cn } from "~/src/util/global";

export default function Medium(): JSX.Element {
  const [controlsVisible, setControlsVisible] = useState(true);

  function toggleControls() {
    setControlsVisible((v) => !v);
  }

  return (
    <div className="relative">
      <PlaybackMedia />

      <div
        className={cn("absolute bottom-0 pb-4 w-full transition-transform", !controlsVisible && "translate-y-[80%]")}
      >
        <div
          className={cn(
            "bg-gradient-to-t from-zinc-950 to-zinc-900/0 h-[200%] w-full absolute bottom-0 left-0 pointer-events-none opacity-0 transition-opacity",
            controlsVisible && "opacity-100",
          )}
        />

        <button className="block z-10 relative mx-auto mb-2 p-2 group" onClick={toggleControls}>
          <div className="w-8 h-1 bg-white rounded transition-all group-hover:w-10 group-hover:h-1.5 shadow-xl drop-shadow-xl" />
        </button>

        <PlaybackControls className="z-20" />
      </div>
    </div>
  );
}
