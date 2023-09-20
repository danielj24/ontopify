import Store from 'electron-store'
import { safeStorage } from 'electron'
import { TokenType } from '@/type/token'
import { SPOTIFY_CLIENT_ID } from '~/env'

const store = new Store()

export function saveToken(type: TokenType, token: string): void {
  const encrypted = safeStorage.encryptString(token)
  store.set(type, encrypted)
}

export function getToken(type: TokenType): string | null {
  const encrypted = store.get(type) as string | undefined

  if (encrypted === undefined || encrypted === '') return null

  return safeStorage.decryptString(Buffer.from(encrypted))
}

export function deleteTokens(): void {
  const types = Object.values(TokenType)

  for (const type of types) {
    store.delete(type)
  }
}

export async function refreshToken() {
  const token = getToken(TokenType.REFRESH)

  if (token === null) return null

  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token,
      client_id: SPOTIFY_CLIENT_ID as string,
    }),
  })

  const json = await result.json()

  if (json.error !== undefined) return null

  saveToken(TokenType.ACCESS, json.access_token)
  saveToken(TokenType.REFRESH, json.refresh_token)

  return json
}
