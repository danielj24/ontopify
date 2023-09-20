import { fetchProfile } from '@/api/user'
import { getToken } from '@/util/token'
import { TokenType } from '@/type/token'

export default async function checkAuth(): Promise<boolean> {
  const spotifyKey = getToken(TokenType.ACCESS)

  if (spotifyKey === null || spotifyKey === '') return false

  const profileData = await fetchProfile(spotifyKey)

  if (profileData === undefined || profileData.error !== undefined) return false

  return true
}
