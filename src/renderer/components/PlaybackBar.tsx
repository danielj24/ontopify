import React from "react";
import { MenuIcon, PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon, ZapIcon } from "lucide-react";
import { useTokenStore } from "@renderer/store/token";
import { usePlaybackStore } from "@renderer/store/playback";
import { play, pause, next, previous } from "@/api/playback";

function PlaybackBar() {
  const token = useTokenStore((s) => s.spotify);
  const currentTrackID = usePlaybackStore((s) => s.playbackState?.item?.id);
  const playbackState = usePlaybackStore((s) => s.playbackState);
  const setIsPlaying = usePlaybackStore((s) => s.setIsPlaying);

  const seekerPostion = playbackState ? playbackState?.progress_ms / playbackState?.item?.duration_ms : 0;

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

    const lyrics = await window.api.fetchLyrics(currentTrackID);

    console.log(lyrics);
  }

  return (
    <div className="flex flex-col w-full z-10">
      {/* Track scrubber */}
      <div className="relative">
        <div className="w-full h-1 rounded-full bg-white/20 mb-2" />
        <div
          className="w-3 h-3 rounded-full bg-white absolute -top-1 transition-all"
          style={{ left: `${seekerPostion * 100}%` }}
        />
      </div>

      {/* Playback controls */}
      <div className="flex w-full items-center justify-around">
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
        <ZapIcon
          onClick={toggleLyrics}
          className="titlebar-button h-7 w-7 fill-yellow-400 stroke-yellow-600 hover:animate-spin"
        />
      </div>
    </div>
  );
}

export default PlaybackBar;
