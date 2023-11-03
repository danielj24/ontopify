export interface Lyric {
  startTimeMs: number;
  endTimeMs: number;
  words: string;
  syllables?: string[];
}

export interface Lyrics {
  trackId: string;
  lyrics: Lyric[];
}
