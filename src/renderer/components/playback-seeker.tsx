import React, { useRef, useState } from "react";
import { usePlaybackStore } from "@/renderer/store/playback";
import { useTokenStore } from "@/renderer/store/token";
import { Slider } from "@/renderer/components/ui/slider";
import { seek } from "@/api/playback";

export default function PlaybackSeeker() {
  const token = useTokenStore((s) => s.spotify);
  const playbackState = usePlaybackStore((s) => s.playbackState);
  const setPlaybackState = usePlaybackStore((s) => s.setPlaybackState);

  const [mouseDown, setMouseDown] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);

  const barRef = useRef<HTMLDivElement>(null);

  const seekerPostion =
    playbackState && !dragging ? (playbackState?.progress_ms / playbackState?.item?.duration_ms) * 100 : dragPosition;

  async function seekByPercent(value: number) {
    if (playbackState == null) return;

    const newProgress = ~~((value / 100) * playbackState.item.duration_ms);

    try {
      await seek(token, newProgress);
      setPlaybackState({ ...playbackState, progress_ms: newProgress });
    } catch (error) {
      console.log(error);
    }
  }

  function getSelectionByPercent(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const bar = barRef.current;

    if (bar == null) return 0;

    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;

    return ~~percent;
  }

  function handleMouseDown() {
    setMouseDown(true);
  }

  function handleMouseUp(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setMouseDown(false);

    const percent = getSelectionByPercent(e);

    seekByPercent(percent);

    setTimeout(() => {
      setDragging(false);
    }, 500);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!mouseDown) return;

    setDragging(true);
    setDragPosition(getSelectionByPercent(e));
  }

  function handleMouseOut() {
    if (!mouseDown) return;

    setMouseDown(false);
    setDragging(false);
  }

  return (
    <div className="relative cursor-pointer z-10 opacity-100 h-2">
      <div
        ref={barRef}
        className="absolute w-full h-full z-10"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
      />
      <Slider className="cursor-pointer" value={[seekerPostion]} min={0} max={100} step={1} />
    </div>
  );
}
