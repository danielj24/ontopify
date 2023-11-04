import { create } from "zustand";
import { useTokenStore } from "@/renderer/store/token";
import { seek } from "@/api/playback";

import type { SpotifyPlaybackState } from "@/type/playback";

interface PlaybackStore {
  playbackState: SpotifyPlaybackState | null;

  _setPlaybackState: (state: SpotifyPlaybackState) => void;
  _setIsPlaying: (isPlaying: boolean) => void;

  seek: (positionMs: number) => Promise<void>;
}

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  playbackState: null,

  _setPlaybackState: (state: SpotifyPlaybackState) => set({ playbackState: state }),

  _setIsPlaying: (isPlaying: boolean) => {
    const state = get().playbackState;

    if (state === null) return;

    set({
      playbackState: {
        ...state,
        is_playing: isPlaying,
      },
    });
  },

  seek: async (positionMs: number) => {
    const token = useTokenStore.getState().spotify;

    try {
      await seek(token, positionMs);
    } catch (error) {
      console.log(error);
    }
  },
}));
