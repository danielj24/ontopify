import { app, BrowserWindow, dialog, ipcMain, protocol } from "electron";
import path from "path";
import { resolveWindow } from "@/main/directive/window";
import { getToken, deleteTokens, refreshToken } from "@/util/token";
import { TokenType } from "./type/token";
import { handleAuthCallback, processAuthCode } from "./main/window/auth";
import { SPOTIFY_REDIRECT_URI } from "~/env";

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

  protocol.handle("ontopify", (req) => {
    console.log("PROTOCOL ontopify");
    console.log(req.url);
    

    const code = req.url.replace(SPOTIFY_REDIRECT_URI + "/?code=", "");

  
     dialog.showMessageBox({
      message: code,
    });

    processAuthCode(code);
  });
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

app.removeAsDefaultProtocolClient("ontopify");

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("ontopify", process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient("ontopify");
}
