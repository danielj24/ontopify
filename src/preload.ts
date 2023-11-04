import { contextBridge, ipcRenderer } from "electron";
import { electronAPI, ElectronAPI } from "@electron-toolkit/preload";

import type { Lyric } from "@/type/lyrics";
import type { TokenErrorResponse } from "@/type/token";
interface Api {
  isDev: boolean;

  getToken: () => Promise<string>;
  refreshToken: () => Promise<string> | Promise<TokenErrorResponse>;
  unauth: () => Promise<void>;
  reauth: () => Promise<void>;
  kill: () => Promise<void>;
  resize: (size: "sm" | "md" | "lg") => Promise<void>;

  getWebPlayerToken: () => Promise<void>;

  fetchLyrics: (trackId: string) => Promise<Lyric[]>;

  handleSetToken: (callback: (event: Electron.IpcRendererEvent, token: string) => void) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: Api;
  }
}

const api: Api = {
  isDev: process.env.NODE_ENV === "development",

  // get token from os keychain
  getToken: async () => await ipcRenderer.invoke("token:get"),
  // refresh token from spotify
  refreshToken: async () => await ipcRenderer.invoke("token:refresh"),
  // delete tokens
  unauth: async () => await ipcRenderer.invoke("unauth"),
  // delete tokens and reauth
  reauth: async () => await ipcRenderer.invoke("reauth"),
  // kill the app
  kill: async () => await ipcRenderer.invoke("kill"),
  // resize the app
  resize: async (size: "sm" | "md" | "lg") => await ipcRenderer.invoke("resize", size),

  // get web player token from spotify
  getWebPlayerToken: async () => await ipcRenderer.invoke("wp-token"),

  // fetch lyrics from spotify
  fetchLyrics: async (trackId: string) => await ipcRenderer.invoke("lyrics:fetch", trackId),

  // used to set the token in the store from the main process
  handleSetToken: (callback: (event: Electron.IpcRendererEvent, token: string) => void) => {
    ipcRenderer.on("token:set", callback);
  },
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
