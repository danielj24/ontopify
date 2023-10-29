import { BrowserWindow, shell } from "electron";
import { join } from "path";

export default function AppWindow() {
  const mainWindow = new BrowserWindow({
    width: 300,
    minWidth: 300,
    maxWidth: 450,
    height: 385,
    minHeight: 120,
    maxHeight: 400,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "./preload.js"),
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.setAlwaysOnTop(true, "floating");
  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.setFullScreenable(false);

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // const filter = ["https://spclient.wg.spotify.com/*"];

  // mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
  //   callback({ requestHeaders: { Origin: "*", ...details.requestHeaders } });
  // });

  // mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: {
  //       "Access-Control-Allow-Origin": ["*"],
  //       ...details.responseHeaders,
  //     },
  //   });
  // });
}
