import React from "react";
import { BackwardIcon, ForwardIcon } from "@heroicons/react/24/outline";
import { BoltIcon, PlayCircleIcon, PauseCircleIcon, Bars4Icon } from "@heroicons/react/24/solid";
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
      <Bars4Icon className="titlebar-button text-zinc-500 h-8 w-8 cursor-not-allowed" />
      <BackwardIcon
        className="titlebar-button text-zinc-200 h-8 w-8 cursor-pointer hover:text-white transition-colors"
        onClick={handlePrevious}
      />
      {playbackState?.is_playing ? (
        <PauseCircleIcon
          className="titlebar-button text-zinc-200 h-14 w-14 cursor-pointer hover:text-white transition-colors"
          onClick={togglePlayback}
        />
      ) : (
        <PlayCircleIcon
          className="titlebar-button text-zinc-200 h-14 w-14 cursor-pointer hover:text-white transition-colors"
          onClick={togglePlayback}
        />
      )}
      <ForwardIcon
        className="titlebar-button text-zinc-200 h-8 w-8 cursor-pointer hover:text-white transition-colors"
        onClick={handleNext}
      />
      <BoltIcon className="titlebar-button h-8 w-8 text-yellow-400 stroke-yellow-600 hover:animate-spin" />
    </div>
  );
}

export default PlaybackBar;
