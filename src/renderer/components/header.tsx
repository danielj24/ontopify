import React from "react";
import { XCircleIcon } from "lucide-react";
import LayoutToolbar from "@/renderer/components/layout-toolbar";

export default function Header(): JSX.Element {
  return (
    <header className="w-full h-10 fixed z-30 titlebar">
      {/* toolbar gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-zinc-950/50 to-zinc-950/0 titlebar z-10" />

      {/* layout toolbar */}
      <div className="absolute left-0 top-0 z-10 w-full h-full pr-20">
        <LayoutToolbar openBy={130} />
      </div>

      {/* exit button */}
      <button className="absolute right-0 top-0 z-30 w-10 h-full opacity-100" onClick={window.api.kill}>
        <XCircleIcon className="titlebar-button text-zinc-50/70 hover:text-zinc-50 transition-colors w-6 cursor-pointer z-10 absolute top-2 right-2" />
      </button>
    </header>
  );
}
