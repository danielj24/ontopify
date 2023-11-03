// usePlaybackLifecycle.ts

import { useEffect, useState } from "react";
import { usePlaybackStore } from "@/renderer/store/playback";

import type { Item } from "@/type/playback";

interface PlaybackLifecycle {
  onPlay?: (track: Item) => void;
  onPause?: (track: Item) => void;
  onTrackChange?: (track: Item) => void;
}

export function usePlaybackLifecycle({ onPlay, onPause, onTrackChange }: PlaybackLifecycle) {
  const playbackState = usePlaybackStore((state) => state.playbackState);

  const [previousPlaybackState, setPreviousPlaybackState] = useState(playbackState);

  useEffect(() => {
    const track = playbackState?.item as Item;

    if (previousPlaybackState?.is_playing === false && playbackState?.is_playing === true) {
      onPlay?.(track);
    }

    if (previousPlaybackState?.is_playing === true && playbackState?.is_playing === false) {
      onPause?.(track);
    }

    if (previousPlaybackState?.item?.id !== playbackState?.item?.id) {
      onTrackChange?.(track);
    }

    if (previousPlaybackState !== playbackState) {
      setPreviousPlaybackState(playbackState);
    }
  }, [playbackState]);

  return {
    onPlay,
  };
}
