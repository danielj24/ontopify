// usePlaybackLifecycle.ts

import { useEffect, useState } from "react";
import { usePlaybackStore } from "@/renderer/store/playback";

import type { Item } from "@/type/playback";

interface PlaybackLifecycle {
  onPlay: () => void;
  onPause: () => void;
  onTrackChange: (track: Item) => void;
}

export function usePlaybackLifecycle({ onPlay, onPause, onTrackChange }: PlaybackLifecycle) {
  const playbackState = usePlaybackStore((state) => state.playbackState);

  const [previousPlaybackState, setPreviousPlaybackState] = useState(playbackState);

  useEffect(() => {
    if (previousPlaybackState?.is_playing === false && playbackState?.is_playing === true) {
      onPlay();
    }

    if (previousPlaybackState?.is_playing === true && playbackState?.is_playing === false) {
      onPause();
    }

    if (previousPlaybackState?.item?.id !== playbackState?.item?.id) {
      onTrackChange(playbackState?.item as Item);
    }

    if (previousPlaybackState !== playbackState) {
      setPreviousPlaybackState(playbackState);
    }
  }, [playbackState]);

  return {
    onPlay,
  };
}
