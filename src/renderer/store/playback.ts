import SpotifyPlaybackState from '@/type/playback'
import { create } from 'zustand'

interface PlaybackStore {
  playbackState: SpotifyPlaybackState | null
  setPlaybackState: (state: SpotifyPlaybackState) => void
  setIsPlaying: (isPlaying: boolean) => void
}

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  playbackState: null,

  setIsPlaying: (isPlaying: boolean) => {
    const state = get().playbackState

    if (state === null) return

    set({
      playbackState: {
        ...state,
        is_playing: isPlaying,
      },
    })
  },

  setPlaybackState: (state: SpotifyPlaybackState) =>
    set({ playbackState: state }),
}))
