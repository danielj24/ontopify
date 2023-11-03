import SpotifyPlaybackState, { PlaybackErrorResponse } from "@/type/playback";

export async function fetchPlaybackState(token: string): Promise<SpotifyPlaybackState | PlaybackErrorResponse> {
  if (!token) return {} as SpotifyPlaybackState;

  const result = await fetch("https://api.spotify.com/v1/me/player?market=GB", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await result.json();
}

export async function play(token: string) {
  if (!token) return;

  await fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function pause(token: string) {
  if (!token) return;

  await fetch("https://api.spotify.com/v1/me/player/pause", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function next(token: string) {
  if (!token) return;

  await fetch("https://api.spotify.com/v1/me/player/next", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function previous(token: string) {
  if (!token) return;

  await fetch("https://api.spotify.com/v1/me/player/previous", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function seek(token: string, positionMs: number) {
  if (!token || !positionMs) return;

  await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${positionMs}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
}
