import React, { useEffect } from "react";
import { useInterval } from "usehooks-ts";
import { XCircleIcon } from "lucide-react";
import PlaybackBar from "@renderer/components/PlaybackBar";
import { useTokenStore } from "@renderer/store/token";
import { usePlaybackStore } from "@renderer/store/playback";
import { fetchPlaybackState } from "@/api/playback";
import SpotifyPlaybackState, { PlaybackErrorResponse } from "@/type/playback";
import { TokenErrorResponse } from "@/type/token";

function App(): JSX.Element {
  const tokenStore = useTokenStore();
  const setPlaybackState = usePlaybackStore((s) => s.setPlaybackState);

  const nowPlaying = usePlaybackStore((s) =>
    s.playbackState?.item != null ? `${s.playbackState?.item.name} - ${s.playbackState?.item.artists[0].name}` : "",
  );
  const albumImg = usePlaybackStore((s) => s.playbackState?.item?.album?.images?.[0]?.url);

  async function update(): Promise<void> {
    const state = await fetchPlaybackState(tokenStore.spotify);

    if (typeof tokenStore.spotify !== "string") console.log(tokenStore.spotify);

    if ((state as PlaybackErrorResponse)?.error?.status === 401) {
      const resp = await window.api.refreshToken();

      console.log("=== check for refresh ===");
      console.log(resp);

      if ((resp as TokenErrorResponse)?.error === "invalid_grant") {
        console.log("=== re-auth app ===");
        await window.api.unauth();

        return;
      }

      tokenStore.setSpotifyToken(resp as string);
    }

    setPlaybackState(state as SpotifyPlaybackState);
  }

  useInterval(update, 1_000);

  useEffect(() => {
    async function getSetToken(): Promise<void> {
      const key = await window.api.getToken();

      if (key === null || key === "") {
        await window.api.unauth();
        return;
      }

      tokenStore.setSpotifyToken(key);
    }

    getSetToken();
  }, []);

  if (tokenStore.spotify === null) return <div>Loading...</div>;

  return (
    <div className="h-full w-full bg-zinc-950 relative transition-all">
      <img src={albumImg} alt="" className="h-full w-full object-cover absolute top-0 blur-xl pointer-events-none" />
      <div className="absolute right-0 top-0 z-30 w-10 h-10 opacity-100" onClick={() => console.log("kill app")}>
        <div className="h-24 w-24 bg-[radial-gradient(at_right_top,_black,#00000000,#00000000)] absolute -top-1 -right-1 pointer-events-none" />
        <XCircleIcon className="titlebar-button text-zinc-200 hover:text-white w-6 cursor-pointer z-10 absolute top-2 right-2" />
      </div>
      <div className="titlebar flex h-full justify-center relative tall:pb-24">
        <div className="w-full h-full hidden tall:flex items-center justify-center p-4 pb-8 pointer-events-none">
          <img
            src={albumImg}
            alt=""
            className="h-full w-full object-cover z-10 shadow-2xl drop-shadow-xl rounded-lg overflow-hidden"
          />
        </div>

        <div className="bg-gradient-to-t from-zinc-950/50 to-zinc-900/10 h-full w-full absolute bottom-0 left-0" />

        <div className="titlebar w-full flex flex-col justify-around items-center tall:absolute bottom-0 p-3 pt-0 tall:h-28 h-full">
          <div className="bg-gradient-to-t from-zinc-950 to-transparent h-full w-full absolute bottom-0 left-0" />
          <p className="titlebar w-full text-center text-white z-10 h-10 truncate px-4 pb-2 tall:pb-0 mt-4 tall:mt-0">
            {nowPlaying}
          </p>
          <PlaybackBar />
        </div>
      </div>
    </div>
  );
}

export default App;
