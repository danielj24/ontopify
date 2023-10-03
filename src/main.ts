import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { resolveWindow } from "@/main/directive/window";
import { getToken, deleteTokens, refreshToken } from "@/util/token";
import { TokenType } from "./type/token";

ipcMain.handle("token:get", async () => await getToken(TokenType.ACCESS));

ipcMain.handle("token:refresh", refreshToken);

ipcMain.handle("unauth", async () => {
  deleteTokens();
  await resolveWindow();
});

if (require("electron-squirrel-startup")) {
  app.quit();
}

app.on("ready", () => {
  resolveWindow().catch(console.error);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    resolveWindow().catch(console.error);
  }
});

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("ontopify", process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient("ontopify");
}
