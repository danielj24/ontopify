import { BrowserWindow } from "electron";
import path from "path";

export default function WebPlayerTokenWindow() {
  return new Promise((resolve) => {
    const window = new BrowserWindow({
      width: 400,
      height: 600,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, "./preload.js"),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    const url = "https://open.spotify.com/get_access_token?reason=transport&productType=web_player";

    window.loadURL(url);
    window.setAlwaysOnTop(true, "floating");
    window.setVisibleOnAllWorkspaces(true);
    window.setFullScreenable(false);

    window.on("ready-to-show", () => {
      window.webContents.openDevTools();
    });

    window.webContents.on("dom-ready", async () => {
      const json = await window.webContents.executeJavaScript(`
        function getHTML() {
          return new Promise((resolve) => {
            const html = document.body.textContent;
            resolve(html);
          });
        }
        getHTML();`);

      resolve(JSON.parse(json));

      window.close();
    });
  });
}
