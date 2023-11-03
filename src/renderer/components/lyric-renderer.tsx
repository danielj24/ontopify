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

  const prevLyric = lyrics[ix + 1];
  const currentLyric = lyrics[ix];
  const nextLyric = lyrics[ix - 1];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center overflow-hidden">
      <div className="relative w-full h-full">
        {prevLyric && (
          <div className="font-bold text-white/20 text-lg absolute top-1/4 -translate-y-1/2 w-full text-center">
            {prevLyric?.words}
          </div>
        )}

        <div className="font-bold text-white text-lg absolute top-1/2 -translate-y-1/2 text-center w-full">
          {currentLyric?.words}
        </div>

        {nextLyric && (
          <div className="font-bold text-white/20 text-lg absolute bottom-1/4 translate-y-1/2 w-full text-center">
            {nextLyric?.words}
          </div>
        )}
      </div>
    </div>
  );
}
