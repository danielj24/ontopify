import axios from "axios";
import crypto from "crypto";
import { BrowserWindow } from "electron";
import { saveToken } from "@/util/token";
import { TokenType } from "@/type/token";
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from "~/env";

const SCOPES = ["user-read-private", "user-read-email", "user-read-playback-state", "user-modify-playback-state"];

const CODE_VERIFIER = generateCodeVerifier();
const CODE_CHALLENGE = generateCodeChallenge(CODE_VERIFIER);

const MAIN_WINDOW_TITLE = "ontopify";
const AUTH_WINDOW_TITLE = "Authorize - Spotify";

export default function AuthWindow() {
  const existingAuthWindow = BrowserWindow.getAllWindows().find((window) => window.title === AUTH_WINDOW_TITLE);

  if (existingAuthWindow) {
    existingAuthWindow.focus();
    return;
  }

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

export async function handleAuthCode(code: string) {
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

      const mainWindow = BrowserWindow.getAllWindows().find((window) => window.title === MAIN_WINDOW_TITLE);
      const remainingWindows = BrowserWindow.getAllWindows().filter((window) => window.title !== MAIN_WINDOW_TITLE);

      if (!mainWindow) {
        throw new Error("Main window not found");
      }

      remainingWindows.forEach((window) => window.close());
      mainWindow.webContents.send("token:set", access_token);
    } catch (error) {
      console.error(error);
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
