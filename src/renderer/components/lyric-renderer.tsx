import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePlaybackStore } from "@/renderer/store/playback";
import { Badge } from "@/renderer/components/ui/badge";
import { cn } from "@/util/global";

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

  const parentRef = useRef<HTMLDivElement>(null);
  const lyricRefs = useRef<HTMLDivElement[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [noSync, setNoSync] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [currentLyricIx, setCurrentLyricIx] = useState(0);

  const seek = usePlaybackStore((s) => s.seek);

  const renderLyrics = useMemo(() => {
    return [...lyrics].sort((a, b) => a.startTimeMs - b.startTimeMs);
  }, [lyrics]);

  useEffect(() => {
    const noStartTimes = renderLyrics.every((lyric) => +lyric.startTimeMs === 0);

    setNoSync(noStartTimes);

    setCurrentLyricIx(0);
  }, [renderLyrics]);

  useEffect(() => {
    if (noSync) return;

    const ix = renderLyrics.filter((lyric) => lyric.startTimeMs <= currentTimeMs).length - 1;

    if (ix === -1) return;

    setCurrentLyricIx(ix);
  }, [currentTimeMs, renderLyrics]);

  useEffect(() => {
    if (noSync || scrolling) return;

    scrollToIx(currentLyricIx);
  }, [currentLyricIx]);

  function scrollToIx(ix: number) {
    const scrollPos = lyricRefs.current[ix]?.offsetTop - (scrollRef.current?.offsetTop || 0);
    const lyricHeight = lyricRefs.current[ix]?.offsetHeight || 0;
    const parentHeight = parentRef.current?.offsetHeight || 0;
    const top = scrollPos - parentHeight / 2 + lyricHeight / 2;

    scrollRef.current?.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center relative" ref={parentRef}>
      {/* {noSync && <p className="text-white underline text-xs w-full py-2">No sync available for this song</p>} */}
      <div
        ref={scrollRef}
        className="relative w-full h-full overflow-y-scroll overflow-x-hidden titlebar-button py-4"
        onWheel={() => {
          setScrolling(true);
        }}
      >
        {noSync && (
          <Badge variant="destructive" className="mb-4">
            No sync available for this song
          </Badge>
        )}
        {renderLyrics.map((lyric, ix) => {
          const isCurrent = ix === currentLyricIx;

          return (
            <div
              key={ix}
              ref={(el) => (lyricRefs.current[ix] = el as HTMLDivElement)}
              onClick={async () => {
                if (noSync) return;

                seek(lyric.startTimeMs);
                setScrolling(false);
                scrollToIx(ix);
              }}
              className={cn(
                "font-bold text-white/20 w-full text-center p-2 text-sm transition-all cursor-pointer",
                !noSync && isCurrent && "text-white scale-110",
                noSync && "text-white/80",
              )}
            >
              {lyric.words}
            </div>
          );
        })}
      </div>
      {scrolling && !noSync && (
        <Badge
          variant="secondary"
          className="absolute bottom-4 mx-auto titlebar-button cursor-pointer"
          onClick={() => {
            setScrolling(false);
            scrollToIx(currentLyricIx);
          }}
        >
          Back to current line
        </Badge>
      )}
    </div>
  );
}
