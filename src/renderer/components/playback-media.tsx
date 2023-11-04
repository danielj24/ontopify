import React from "react";
import LyricRenderer from "@/renderer/components/lyric-renderer";
import { usePlaybackStore } from "@/renderer/store/playback";
import { useLyricsStore } from "@/renderer/store/lyrics";
import { cn } from "@/util/global";

interface PlaybackMediaProps {
  className?: string;
}

export default function PlaybackMedia(props: PlaybackMediaProps): JSX.Element {
  const { className } = props;

  const lyrics = useLyricsStore((s) => s.current);
  const showLyrics = useLyricsStore((s) => s.showLyrics);
  const playbackState = usePlaybackStore((s) => s.playbackState);
  const albumImg = usePlaybackStore((s) => s.playbackState?.item?.album?.images?.[0]?.url);
  const albumName = usePlaybackStore((s) => s.playbackState?.item?.album?.name);

  return (
    <div className={cn("w-full flex p-4", className)}>
      <div className="relative">
        <img
          src={albumImg}
          alt={albumName + " - " + playbackState?.item?.artists[0].name + " Album Cover"}
          title={albumName + " - " + playbackState?.item?.artists[0].name + " Album Cover"}
          className="w-full z-0 object-cover rounded-lg pointer-events-none user-select-none"
        />
        {showLyrics && (
          <div className="absolute left-0 top-0 w-full aspect-square rounded-lg bg-zinc-950/80 px-3">
            <LyricRenderer lyrics={lyrics?.lyrics} currentTimeMs={playbackState?.progress_ms || 0} />
          </div>
        )}
      </div>
    </div>
  );
}
