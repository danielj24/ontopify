import { app, BrowserWindow, ipcMain, protocol, session } from "electron";
import path from "path";
import AppWindow from "@/main/window/app";
import WebPlayerTokenWindow from "@/main/window/wp-token";
import AuthWindow, { handleAuthCode } from "@/main/window/auth";
import { getToken, deleteTokens, refreshToken } from "@/util/token";
import getMainWindow from "@/util/getMainWindow";
import { fetchLyrics } from "@/api/lyrics";

// create into enum/token.ts instead
import { TokenType } from "@/type/token";

import { SPOTIFY_REDIRECT_URI } from "~/env";

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

  ipcMain.handle("resize", async (event, size: "sm" | "md" | "lg") => {
    const main = getMainWindow();

    if (!main) {
      throw new Error("Main window not found");
    }

    switch (size) {
      case "sm":
        main.setSize(300, 150);
        break;
      case "md":
        main.setSize(300, 300);
        break;
      case "lg":
        main.setSize(300, 430);
        break;
    }
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

  try {
    const response = await fetchLyrics(wpToken, trackId);

    if (!response?.lyrics) return null;

    return response.lyrics.lines;
  } catch (error) {
    console.log(error);
    return null;
  }
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
