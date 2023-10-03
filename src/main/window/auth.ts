import axios from "axios";
import crypto from "crypto";
import { BrowserWindow, app } from "electron";
import { resolveWindow } from "@/main/directive/window";
import { saveToken } from "@/util/token";
import { TokenType } from "@/type/token";
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from "~/env";

const SCOPES = ["user-read-private", "user-read-email", "user-read-playback-state", "user-modify-playback-state"];

const CODE_VERIFIER = generateCodeVerifier();
const CODE_CHALLENGE = generateCodeChallenge(CODE_VERIFIER);

export default function AuthWindow() {
  const authWindow = new BrowserWindow({
    width: 400,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&code_challenge_method=S256&code_challenge=${CODE_CHALLENGE}&scope=${encodeURIComponent(
    SCOPES.join(" "),
  )}`;

  authWindow.loadURL(authUrl);
  authWindow.show();

  authWindow.webContents.openDevTools();
}

app.on("open-url", (_: unknown, url: string) => handleAuthCallback(url));
app.on("second-instance", (_: unknown, commandLine: string[]) => {
  // @TODO: Continue on Windows
  const windows = BrowserWindow.getAllWindows();

  console.log(windows);

  // if (mainWindow) {
  //   if (mainWindow.isMinimized()) mainWindow.restore()
  //   mainWindow.focus()
  // }

  const url = commandLine.pop();

  if (!url) return;

  handleAuthCallback(url);
});

export async function handleAuthCallback(url: string) {
  if (!url.startsWith(SPOTIFY_REDIRECT_URI)) return;

  const code = new URL(url).searchParams.get("code");

  if (code) {
    try {
      const response = await axios.post("https://accounts.spotify.com/api/token", null, {
        params: {
          client_id: SPOTIFY_CLIENT_ID,
          grant_type: "authorization_code",
          code,
          redirect_uri: SPOTIFY_REDIRECT_URI,
          code_verifier: CODE_VERIFIER,
        },
      });

      const { access_token, refresh_token } = response.data;

      saveToken(TokenType.ACCESS, access_token);
      saveToken(TokenType.REFRESH, refresh_token);

      BrowserWindow.getAllWindows().forEach((window) => window.close());
    } finally {
      resolveWindow();
    }
  }
}

function generateCodeVerifier() {
  return crypto.randomBytes(64).toString("hex");
}

function generateCodeChallenge(verifier: string) {
  return crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
