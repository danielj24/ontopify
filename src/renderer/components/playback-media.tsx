import React from "react";
import LyricRenderer from "@/renderer/components/lyric-renderer";
import { usePlaybackStore } from "@/renderer/store/playback";
import { useLyricsStore } from "@/renderer/store/lyrics";

export default function PlaybackMedia() {
  const lyrics = useLyricsStore((s) => s.current);
  const showLyrics = useLyricsStore((s) => s.showLyrics);
  const playbackState = usePlaybackStore((s) => s.playbackState);
  const albumImg = usePlaybackStore((s) => s.playbackState?.item?.album?.images?.[0]?.url);

  return (
    <div className="w-full hidden tall:flex p-4">
      <div className="relative">
        <img src={albumImg} alt="" className="w-full z-0 object-cover rounded-lg" />
        {showLyrics && (
          <div className="absolute left-0 top-0 w-full aspect-square z-10 rounded-lg bg-zinc-950/80 p-3">
            <LyricRenderer lyrics={lyrics?.lyrics} currentTimeMs={playbackState?.progress_ms || 0} />
          </div>
        )}
      </div>
    </div>
  );
}
