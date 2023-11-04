import React from "react";
import { usePlaybackStore } from "@/renderer/store/playback";
import PlaybackBar from "@/renderer/components/playback-bar";
import Marquee from "@/renderer/components/ui/marquee";
import { cn } from "@/util/global";

interface PlaybackControlsProps {
  className?: string;
}

export default function PlaybackControls(props: PlaybackControlsProps): JSX.Element {
  const { className } = props;

  const nowPlaying = usePlaybackStore((s) =>
    s.playbackState?.item != null ? `${s.playbackState?.item.name} - ${s.playbackState?.item.artists[0].name}` : "",
  );

  return (
    <div className={cn("h-full w-full flex flex-col items-center justify-center", className)}>
      <Marquee>
        <p className="titlebar w-full text-center text-white py-2">{nowPlaying}</p>
      </Marquee>
      <div className="z-10 px-3 w-full">
        <PlaybackBar />
      </div>
    </div>
  );
}
