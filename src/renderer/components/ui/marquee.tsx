import React from "react";

export function Marquee({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="flex w-max space-x-2 animate-marquee-left">{children}</div>
      </div>
    </div>
  );
}
