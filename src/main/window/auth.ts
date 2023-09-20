import axios from 'axios'
import crypto from 'crypto'
import { BrowserWindow } from 'electron'
import { resolveWindow } from '@/main/directive/window'
import { saveToken } from '@/util/token'
import { TokenType } from '@/type/token'
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '~/env'

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
]

export default function AuthWindow() {
  const authWindow = new BrowserWindow({
    width: 400,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const codeVerifier = generateCodeVerifier()
  const codeChallenge = generateCodeChallenge(codeVerifier)
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&code_challenge_method=S256&code_challenge=${codeChallenge}&scope=${encodeURIComponent(
    SCOPES.join(' '),
  )}`

  authWindow.loadURL(authUrl)
  authWindow.show()

  authWindow.webContents.on('did-navigate', async (_, url) => {
    const parsedUrl = new URL(url)

    if (parsedUrl.origin === new URL(SPOTIFY_REDIRECT_URI).origin) {
      const code = parsedUrl.searchParams.get('code')

      if (code) {
        try {
          const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            null,
            {
              params: {
                client_id: SPOTIFY_CLIENT_ID,
                grant_type: 'authorization_code',
                code,
                redirect_uri: SPOTIFY_REDIRECT_URI,
                code_verifier: codeVerifier,
              },
            },
          )

          const { access_token, refresh_token } = response.data

          console.log('[auth window] refresh token')
          console.log(refresh_token)

          saveToken(TokenType.ACCESS, access_token)
          saveToken(TokenType.REFRESH, refresh_token)

          authWindow.close()
        } finally {
          resolveWindow()
        }
      }
    }
  })
}

function generateCodeVerifier() {
  return crypto.randomBytes(64).toString('hex')
}

function generateCodeChallenge(verifier: string) {
  return crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
