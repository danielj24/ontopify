import { app, BrowserWindow, ipcMain, protocol, session } from "electron";
import path from "path";
import AppWindow from "@/main/window/app";
import WebPlayerTokenWindow from "@/main/window/wp-token";
import AuthWindow, { handleAuthCode } from "@/main/window/auth";
import { getToken, deleteTokens, refreshToken } from "@/util/token";
import getMainWindow from "@/util/getMainWindow";
import { fetchLyrics } from "@/api/lyrics";
import { Layout, LayoutHeight, LayoutWidth } from "@/enum/layout";
import { TokenType } from "@/enum/token";

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

  const easeInOutCubic = (t: number): number => {
    return t < 0.5
      ? 4 * t * t * t // ease in
      : 1 - Math.pow(-2 * t + 2, 3) / 2; // ease out
  };

  function lerp(start: number, end: number, time: number) {
    return start + (end - start) * easeInOutCubic(time);
  }

  function animateResize(window: BrowserWindow, targetWidth: number, targetHeight: number, duration: number) {
    const startTime = Date.now();
    const [startWidth, startHeight] = window.getSize();

    const step = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);

      const currentWidth = Math.round(lerp(startWidth, targetWidth, t));
      const currentHeight = Math.round(lerp(startHeight, targetHeight, t));
      window.setSize(currentWidth, currentHeight);

      if (t < 1) {
        setImmediate(step);
      }
    };

    setImmediate(step);
  }

  ipcMain.handle("resize", async (event, size: Layout) => {
    const main = getMainWindow();

    if (!main) {
      throw new Error("Main window not found");
    }

    switch (size) {
      case Layout.SMALL:
        animateResize(main, LayoutWidth.SMALL, LayoutHeight.SMALL, 400);
        break;
      case Layout.MEDIUM:
        animateResize(main, LayoutWidth.MEDIUM, LayoutHeight.MEDIUM, 400);
        break;
      case Layout.LARGE:
        animateResize(main, LayoutWidth.LARGE, LayoutHeight.LARGE, 400);
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
