import React from "react";
import { MenuIcon, PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon, ZapIcon } from "lucide-react";
import { useTokenStore } from "@renderer/store/token";
import { usePlaybackStore } from "@renderer/store/playback";
import { play, pause, next, previous } from "@/api/playback";

function PlaybackBar() {
  const token = useTokenStore();
  const playbackState = usePlaybackStore((s) => s.playbackState);
  const setIsPlaying = usePlaybackStore((s) => s.setIsPlaying);

  async function togglePlayback() {
    if (playbackState == null) return;

    if (playbackState.is_playing) {
      await pause(token.spotify);
      setIsPlaying(false);
      return;
    }

    await play(token.spotify);
    setIsPlaying(true);
  }

  async function handleNext() {
    await next(token.spotify);
  }

  async function handlePrevious() {
    await previous(token.spotify);
  }

  return (
    <div className="flex w-full items-center justify-around z-10">
      <MenuIcon className="titlebar-button stroke-zinc-500 h-7 w-7 cursor-not-allowed" />
      <SkipBackIcon
        className="titlebar-button stroke-zinc-200 fill-transparent hover:fill-zinc-200 h-7 w-7 cursor-pointer transition-colors"
        onClick={handlePrevious}
      />
      <button className="w-14 h-14 flex justify-center items-center bg-white/20 hover:bg-white/30 transition-colors rounded-full p-3">
        {playbackState?.is_playing ? (
          <PauseIcon
            className="titlebar-button stroke-zinc-200 fill-zinc-200 h-14 w-14 cursor-pointer transition-colors"
            onClick={togglePlayback}
          />
        ) : (
          <PlayIcon
            className="titlebar-button stroke-zinc-200 fill-zinc-200 h-14 w-14 cursor-pointer transition-colors ml-1"
            onClick={togglePlayback}
          />
        )}
      </button>
      <SkipForwardIcon
        className="titlebar-button stroke-zinc-200 fill-transparent hover:fill-zinc-200 h-7 w-7 cursor-pointer transition-colors"
        onClick={handleNext}
      />
      <ZapIcon className="titlebar-button h-7 w-7 fill-yellow-400 stroke-yellow-600 hover:animate-spin" />
    </div>
  );
}

export default PlaybackBar;
