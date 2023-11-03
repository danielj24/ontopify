import { create } from "zustand";

import type { Lyrics } from "@/type/lyrics";

interface LyricsStore {
  showLyrics: boolean;
  setShowLyrics: (open: boolean) => void;

  current: Lyrics | null;
  setCurrent: (trackId: string) => void;
}

export const useLyricsStore = create<LyricsStore>((set) => ({
  showLyrics: false,
  setShowLyrics: (open: boolean) => set({ showLyrics: open }),

  current: null,
  setCurrent: async (trackId: string) => {
    const storedLyrics = JSON.parse(window.localStorage.getItem(trackId) as string) as Lyrics;

    if (storedLyrics) {
      console.log("Lyrics found in local storage");
      console.log(storedLyrics);

      set({ current: storedLyrics });
      return;
    }

    try {
      const lyricsResp = await window.api.fetchLyrics(trackId);

      if (!lyricsResp) {
        set({ current: null });
        console.log("No lyrics found");

        return;
      }

      const lyrics: Lyrics = {
        trackId,
        lyrics: lyricsResp,
      };

      window.localStorage.setItem(trackId, JSON.stringify(lyrics));

      set({ current: lyrics });
    } catch (error) {
      set({ current: null });
      console.log(error);
    }
  },
}));
