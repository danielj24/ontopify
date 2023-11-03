import React from "react";

import type { Lyric } from "@/type/lyrics";

export interface LyricRendererProps {
  lyrics?: Lyric[];
  currentTimeMs: number;
}

export default function LyricRenderer(props: LyricRendererProps) {
  const { lyrics, currentTimeMs } = props;

  if (!lyrics) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <div className="font-bold text-white/50 text-lg">No lyrics available</div>
      </div>
    );
  }

  const ix = lyrics
    .sort((a, b) => +b.startTimeMs - +a.startTimeMs)
    .findIndex((lyric) => +lyric.startTimeMs <= currentTimeMs);

  const currentLyric = lyrics[ix];
  const previousLyrics = lyrics[ix + 1];
  const nextLyrics = lyrics[ix - 1];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center">
      <div className="font-bold text-white/50 text-lg">{previousLyrics?.words}</div>
      <div className="font-bold text-white text-lg">{currentLyric?.words}</div>
      <div className="font-bold text-white/50 text-lg">{nextLyrics?.words}</div>
    </div>
  );
}
