import 'dotenv/config'

import { app, BrowserWindow, ipcMain } from 'electron'
import { resolveWindow } from '@/main/directive/window'
import { getToken, deleteTokens, refreshToken } from '@/util/token'
import { TokenType } from './type/token'

ipcMain.handle('token:get', async () => await getToken(TokenType.ACCESS))

ipcMain.handle('token:refresh', refreshToken)

ipcMain.handle('unauth', async () => {
  deleteTokens()
  await resolveWindow()
})

// eslint-disable-next-line @typescript-eslint/no-var-requires
if (require('electron-squirrel-startup') as boolean) {
  app.quit()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  resolveWindow().catch(console.error)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    resolveWindow().catch(console.error)
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
