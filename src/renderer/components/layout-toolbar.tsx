import React, { useState } from "react";
import { EyeIcon, ChevronRight, PanelBottom, RectangleHorizontal, Square } from "lucide-react";
import { cn } from "@/util/global";

interface LayoutToolbarProps {
  openBy?: number;
}

export default function LayoutToolbar(props: LayoutToolbarProps) {
  const { openBy } = props;

  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-full">
      <div
        className="w-full h-full relative translate-x-0 transition-transform duration-500 flex items-center"
        style={{ transform: (open && (openBy ? `translateX(${openBy}px)` : "translateX(100%)")) || "" }}
      >
        <div className="inline-flex items-center gap-x-3 h-full absolute right-full mr-5">
          <PanelBottom
            className="titlebar-button cursor-pointer text-zinc-50/70 hover:text-zinc-50"
            onClick={() => window.api.resize("lg")}
          />
          <Square
            className="titlebar-button cursor-pointer text-zinc-50/70 hover:text-zinc-50"
            onClick={() => window.api.resize("md")}
          />
          <RectangleHorizontal
            className="titlebar-button cursor-pointer text-zinc-50/70 hover:text-zinc-50"
            onClick={() => window.api.resize("sm")}
          />
        </div>

        <button
          className={cn(
            "inline-flex ml-3 text-zinc-50/70 hover:text-zinc-50 titlebar-button transition-colors",
            open && "text-zinc-50",
          )}
          onClick={() => setOpen(!open)}
        >
          <EyeIcon />
          <ChevronRight
            className={cn("transition-transform duration-500 origin-left w-10 relative -left-3", open && "rotate-180")}
          />
        </button>
      </div>
    </div>
  );
}
