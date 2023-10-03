import { create } from "zustand";

enum Tokens {
  SPOTIFY = "spotify",
}

interface TokenStore {
  [Tokens.SPOTIFY]: string;
  setSpotifyToken: (token: string) => void;
}

export const useTokenStore = create<TokenStore>((set) => ({
  spotify: "",
  setSpotifyToken: (token: string) => set({ spotify: token }),
}));
