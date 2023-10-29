import { app, BrowserWindow, dialog, ipcMain, protocol } from "electron";
import path from "path";
import { getToken, deleteTokens, refreshToken } from "@/util/token";
import { TokenType } from "./type/token";
import AppWindow from "@/main/window/app";
import AuthWindow, { handleAuthCode } from "@/main/window/auth";
import { SPOTIFY_REDIRECT_URI } from "~/env";

ipcMain.handle("token:get", async () => await getToken(TokenType.ACCESS));

ipcMain.handle("token:refresh", refreshToken);

ipcMain.handle("unauth", async () => {
  deleteTokens();
});

ipcMain.handle("reauth", async () => {
  deleteTokens();
  AuthWindow();
});

ipcMain.handle("kill", async () => {
  app.quit();
});

if (require("electron-squirrel-startup")) {
  app.quit();
}

app.on("ready", () => {
  AppWindow();

  protocol.handle("ontopify", (req): Response => {
    const code = req.url.replace(SPOTIFY_REDIRECT_URI + "/?code=", "");

    handleAuthCode(code);

    return req.clone();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    AppWindow();
  }
});

app.removeAsDefaultProtocolClient("ontopify");

if (process.argv.length >= 2) {
  app.setAsDefaultProtocolClient("ontopify", process.execPath, [path.resolve(process.argv[1])]);
} else {
  app.setAsDefaultProtocolClient("ontopify");
}
