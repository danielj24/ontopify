import { create } from "zustand";

import type { SpotifyPlaybackState } from "@/type/playback";

interface PlaybackStore {
  playbackState: SpotifyPlaybackState | null;
  setPlaybackState: (state: SpotifyPlaybackState) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  playbackState: null,

  setPlaybackState: (state: SpotifyPlaybackState) => set({ playbackState: state }),

  setIsPlaying: (isPlaying: boolean) => {
    const state = get().playbackState;

    if (state === null) return;

    set({
      playbackState: {
        ...state,
        is_playing: isPlaying,
      },
    });
  },
}));
