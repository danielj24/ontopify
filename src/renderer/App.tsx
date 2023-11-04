import React, { useEffect } from "react";
import { useInterval } from "usehooks-ts";
import { Loader2Icon } from "lucide-react";
import { useTokenStore } from "@renderer/store/token";
import { usePlaybackStore } from "@renderer/store/playback";
import { useLyricsStore } from "@/renderer/store/lyrics";
import { usePlaybackLifecycle } from "@/renderer/hooks/usePlaybackLifecycle";
import useLayout from "@/renderer/hooks/useLayout";
import Header from "@/renderer/components/header";
import Small from "@/renderer/layouts/small";
import Medium from "@/renderer/layouts/medium";
import Large from "@/renderer/layouts/large";
import { Layout } from "@/enum/layout";
import { fetchPlaybackState } from "@/api/playback";

import type { Item, PlaybackErrorResponse, SpotifyPlaybackState } from "@/type/playback";
import type { TokenErrorResponse } from "@/type/token";

function App(): JSX.Element {
  const layout = useLayout();

  const token = useTokenStore((s) => s.spotify);
  const setSpotifyToken = useTokenStore((s) => s.setSpotifyToken);

  const setPlaybackState = usePlaybackStore((s) => s._setPlaybackState);
  const albumImg = usePlaybackStore((s) => s.playbackState?.item?.album?.images?.[0]?.url);

  const showLyrics = useLyricsStore((s) => s.showLyrics);
  const setLyrics = useLyricsStore((s) => s.setCurrent);

  usePlaybackLifecycle({
    onTrackChange: (track: Item) => {
      if (!showLyrics || !track) return;

      setLyrics(track.id);
    },
  });

  function renderLayout(): JSX.Element {
    switch (layout) {
      case Layout.SMALL:
        return <Small />;
      case Layout.MEDIUM:
        return <Medium />;
      case Layout.LARGE:
        return <Large />;
      default:
        return <></>;
    }
  }

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

  if (!token) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-zinc-950 text-white titlebar">
        <Loader2Icon className="animate-spin mr-2" /> Authorising spotify...
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-zinc-950 relative transition-all">
      {/* background image */}
      <img
        src={albumImg}
        alt=""
        className="h-full w-full object-cover absolute top-0 blur-xl pointer-events-none z-0"
      />

      <Header />

      {renderLayout()}
    </div>
  );
}

export default App;
