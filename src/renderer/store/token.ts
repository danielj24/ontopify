import { create } from "zustand";
import { Tokens } from "@/enum/token";

interface TokenStore {
  [Tokens.SPOTIFY]: string;
  setSpotifyToken: (token: string) => void;
}

export const useTokenStore = create<TokenStore>((set) => ({
  [Tokens.SPOTIFY]: "",
  setSpotifyToken: (token: string) => set({ [Tokens.SPOTIFY]: token }),
}));
