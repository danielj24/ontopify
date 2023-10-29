import { app, BrowserWindow, ipcMain, protocol, session } from "electron";
import path from "path";
import { getToken, deleteTokens, refreshToken } from "@/util/token";
import { TokenType } from "./type/token";
import AppWindow from "@/main/window/app";
import AuthWindow, { handleAuthCode } from "@/main/window/auth";
import WebPlayerTokenWindow from "@/main/window/wp-token";
import { SPOTIFY_REDIRECT_URI } from "~/env";
import getMainWindow from "./util/getMainWindow";
import { fetchLyrics } from "./api/lyrics";

if (require("electron-squirrel-startup")) {
  app.quit();
}

let wpToken: string | null = null;

app.whenReady().then(() => {
  AppWindow();

  protocol.handle("ontopify", (req): Response => {
    const code = req.url.replace(SPOTIFY_REDIRECT_URI + "/?code=", "");

    handleAuthCode(code);

    return req.clone();
  });

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    if (details.url.startsWith("https://spclient.wg.spotify.com")) {
      details.requestHeaders["Origin"] = "https://spclient.wg.spotify.com";
    }
    callback({ requestHeaders: details.requestHeaders });
  });

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

  ipcMain.handle("wp-token", async () => {
    const main = getMainWindow();

    if (!main) {
      throw new Error("Main window not found");
    }

    const response = (await WebPlayerTokenWindow()) as {
      clientId: string;
      accessToken: string;
      accessTokenExpirationTimestampMs: number;
      isAnonymous: boolean;
    };

    wpToken = response.accessToken;
  });
});

ipcMain.handle("lyrics:fetch", async (event, trackId) => {
  if (!wpToken) return null;

  // "4JhmSvV4j4kMw8w7FHu7DI" - no lyrics
  // "6tsN6iV90fo6pyJ2U0f7Uk" - lyrics

  return fetchLyrics(wpToken, trackId);
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
