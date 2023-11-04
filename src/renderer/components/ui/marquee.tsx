import React, { useEffect, useRef, useState } from "react";

interface MarqueeProps {
  children: React.ReactNode;
}

export default function Marquee({ children }: MarqueeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<NodeJS.Timeout>();

  const [scrollAmount, setScrollAmount] = useState(0);

  useEffect(() => {
    const element = wrapperRef.current;

    if (!element) return;

    animationRef.current = setInterval(() => {
      if (scrollAmount > element.scrollWidth) {
        setScrollAmount(0);
      } else {
        setScrollAmount((scrollAmount) => scrollAmount + 1);
      }
    }, 20);

    return () => clearInterval(animationRef.current);
  });

  return (
    <div className="w-full overflow-hidden whitespace-nowrap" ref={wrapperRef}>
      <div className="inline-block pl-[100%]" style={{ transform: `translateX(${-scrollAmount}px)` }}>
        {children}
      </div>
    </div>
  );
}
