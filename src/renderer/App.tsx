import React, { useEffect } from "react";
import { useInterval } from "usehooks-ts";
import { Loader2Icon, XCircleIcon } from "lucide-react";
import PlaybackBar from "@renderer/components/playback-bar";
import { Marquee } from "@/renderer/components/ui/marquee";
import { useTokenStore } from "@renderer/store/token";
import { usePlaybackStore } from "@renderer/store/playback";
import { fetchPlaybackState } from "@/api/playback";

import type { Item, PlaybackErrorResponse, SpotifyPlaybackState } from "@/type/playback";
import type { TokenErrorResponse } from "@/type/token";
import PlaybackMedia from "./components/playback-media";
import { usePlaybackLifecycle } from "./hooks/usePlaybackLifecycle";
import { useLyricsStore } from "./store/lyrics";

function App(): JSX.Element {
  const token = useTokenStore((s) => s.spotify);
  const setSpotifyToken = useTokenStore((s) => s.setSpotifyToken);

  const setPlaybackState = usePlaybackStore((s) => s.setPlaybackState);
  const albumImg = usePlaybackStore((s) => s.playbackState?.item?.album?.images?.[0]?.url);
  const nowPlaying = usePlaybackStore((s) =>
    s.playbackState?.item != null ? `${s.playbackState?.item.name} - ${s.playbackState?.item.artists[0].name}` : "",
  );

  const showLyrics = useLyricsStore((s) => s.showLyrics);
  const setLyrics = useLyricsStore((s) => s.setCurrent);

  usePlaybackLifecycle({
    onTrackChange: (track: Item) => {
      if (!showLyrics) return;

      setLyrics(track.id);
    },
  });

  // @TODO: abstract this and the interval into a hook?
  async function update(): Promise<void> {
    if (!token) return;

    if (typeof token !== "string") console.log(token);

    const state = await fetchPlaybackState(token);

    if ((state as PlaybackErrorResponse)?.error?.status === 401) {
      const resp = await window.api.refreshToken();

      console.log("=== check for refresh ===");
      console.log(resp);

      if ((resp as TokenErrorResponse)?.error === "invalid_grant") {
        await window.api.reauth();

        return;
      }

      setSpotifyToken(resp as string);
    }

    setPlaybackState(state as SpotifyPlaybackState);
  }

  useInterval(update, 1_000);

  useEffect(() => {
    // @TODO: check this actually works, should this live here?
    async function getSetToken(): Promise<void> {
      console.log("=== get set token ===");
      const key = await window.api.getToken();

      if (key === null || key === "") {
        await window.api.reauth();
        return;
      }

      setSpotifyToken(key);
    }

    getSetToken();
  }, []);

  useEffect(() => {
    // get web player token from spotify and set in main process
    window.api.getWebPlayerToken();

    // listen for token changes from main process and update it in the zustand store
    window.api.handleSetToken(async (_: Electron.IpcRendererEvent, token: string) => {
      setSpotifyToken(token);
      update();
    });
  }, []);

  if (!token)
    return (
      <div className="flex w-full h-full items-center justify-center bg-zinc-950 text-white titlebar">
        <Loader2Icon className="animate-spin mr-2" /> Authorising spotify...
      </div>
    );

  return (
    <div className="h-full w-full bg-zinc-950 relative transition-all">
      {/* background image */}
      <img
        src={albumImg}
        alt=""
        className="h-full w-full object-cover absolute top-0 blur-xl pointer-events-none z-0"
      />

      {/* main app */}
      <div className="titlebar flex h-full justify-center relative tall:pb-24">
        {/* album cover and lyrics */}
        <PlaybackMedia />

        {/* background gradient */}
        <div className="bg-gradient-to-t from-zinc-950/50 to-zinc-900/10 h-full w-full absolute bottom-0 left-0" />

        {/* playback bar wrapper */}
        <div className="titlebar w-full flex flex-col justify-around items-center tall:absolute bottom-0 p-4 pt-0 tall:h-32 h-full">
          {/* backgroudn gradient */}
          <div className="bg-gradient-to-t from-zinc-950 to-transparent h-full w-full absolute bottom-0 left-0" />
          {/* @TODO: improve marquee, use js to calculate width of text and animate it */}
          <Marquee>
            <p className="titlebar w-full text-center text-white z-10 h-10 truncate px-4 pb-2 tall:pb-0 mt-4 tall:mt-0">
              {nowPlaying}
            </p>
          </Marquee>

          <PlaybackBar />
        </div>
      </div>

      {/* exit button top right */}
      <button className="absolute right-0 top-0 z-30 w-10 h-10 opacity-100" onClick={window.api.kill}>
        <div className="h-24 w-24 bg-[radial-gradient(at_right_top,_black,#00000000,#00000000)] absolute -top-1 -right-1 pointer-events-none" />
        <XCircleIcon className="titlebar-button text-zinc-200/70 hover:text-zinc-200 transition-colors w-6 cursor-pointer z-10 absolute top-2 right-2" />
      </button>
    </div>
  );
}

export default App;
