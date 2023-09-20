import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI, ElectronAPI } from '@electron-toolkit/preload'
import { TokenErrorResponse } from '@/type/TokenErrorResponse'

interface Api {
  isDev: boolean
  getToken: () => Promise<string>
  refreshToken: () => Promise<string> | Promise<TokenErrorResponse>
  unauth: () => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}

const api = {
  isDev: process.env.NODE_ENV === 'development',
  getToken: async () => await ipcRenderer.invoke('token:get'),
  refreshToken: async () => await ipcRenderer.invoke('token:refresh'),
  unauth: async () => await ipcRenderer.invoke('unauth'),
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
