import React from "react";
import { intervalToDuration } from "date-fns";
import { MenuIcon, MicIcon, PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon } from "lucide-react";
import { useTokenStore } from "@renderer/store/token";
import { useLyricsStore } from "@/renderer/store/lyrics";
import { usePlaybackStore } from "@renderer/store/playback";
import PlaybackSeeker from "@/renderer/components/playback-seeker";
import { play, pause, next, previous } from "@/api/playback";

function PlaybackBar() {
  const token = useTokenStore((s) => s.spotify);

  const currentTrackID = usePlaybackStore((s) => s.playbackState?.item?.id);
  const playbackState = usePlaybackStore((s) => s.playbackState);
  const setIsPlaying = usePlaybackStore((s) => s.setIsPlaying);

  const setLyrics = useLyricsStore((s) => s.setCurrent);
  const lyrics = useLyricsStore((s) => s.current);
  const setShowLyrics = useLyricsStore((s) => s.setShowLyrics);
  const showLyrics = useLyricsStore((s) => s.showLyrics);

  const currentTime = intervalToDuration({ start: 0, end: playbackState?.progress_ms || 0 });
  const duration = intervalToDuration({ start: 0, end: playbackState?.item?.duration_ms || 0 });

  async function togglePlayback() {
    if (playbackState == null) return;

    if (playbackState.is_playing) {
      await pause(token);
      setIsPlaying(false);
      return;
    }

    await play(token);
    setIsPlaying(true);
  }

  async function handleNext() {
    await next(token);
  }

  async function handlePrevious() {
    await previous(token);
  }

  async function toggleLyrics() {
    if (currentTrackID == null) return;

    if (showLyrics) {
      setShowLyrics(false);
      return;
    }

    setLyrics(currentTrackID);
    setShowLyrics(!showLyrics);
  }

  return (
    <div className="flex flex-col w-full z-10">
      {/* Track seeker */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-white text-xs">
          {currentTime.minutes}:{`${currentTime.seconds}`.padStart(2, "0")}
        </span>
        <div className="w-4/5 titlebar-button">
          <PlaybackSeeker />
        </div>
        <span className="text-white text-xs">
          {duration.minutes}:{`${duration.seconds}`.padStart(2, "0")}
        </span>
      </div>

      {/* Playback controls */}
      <div className="flex w-full items-center justify-around">
        <MenuIcon className="titlebar-button stroke-zinc-500 h-7 w-7 cursor-not-allowed" />
        <SkipBackIcon
          className="titlebar-button stroke-zinc-200 fill-transparent h-7 w-7 cursor-pointer transition-colors bg-transparent hover:bg-zinc-200/10 rounded-full p-3 box-content"
          onClick={handlePrevious}
        />
        <button className="w-14 h-14 flex justify-center items-center bg-white/20 hover:bg-white/30 transition-colors rounded-full p-3 group">
          {playbackState?.is_playing ? (
            <PauseIcon
              className="titlebar-button stroke-transparent fill-zinc-100 h-14 w-14 cursor-pointer transition-colors group-hover:fill-zinc-50"
              onClick={togglePlayback}
            />
          ) : (
            <PlayIcon
              className="titlebar-button stroke-transparent fill-zinc-100 h-14 w-14 cursor-pointer transition-colors ml-1 group-hover:fill-zinc-50"
              onClick={togglePlayback}
            />
          )}
        </button>
        <SkipForwardIcon
          className="titlebar-button stroke-zinc-200 fill-transparent h-7 w-7 cursor-pointer transition-colors bg-transparent hover:bg-zinc-200/10 rounded-full p-3 box-content"
          onClick={handleNext}
        />
        <div className="relative">
          {showLyrics && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-zinc-200 -rotate-45 after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-0.5 after:bg-zinc-950/60 after:content-['']" />
          )}
          <MicIcon
            onClick={toggleLyrics}
            className="titlebar-button cursor-pointer h-7 w-7 stroke-zinc-200 transition-colors bg-transparent hover:bg-zinc-200/10 rounded-full p-3 box-content"
          />
        </div>
      </div>
    </div>
  );
}

export default PlaybackBar;
