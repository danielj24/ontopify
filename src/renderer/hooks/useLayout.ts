import { useEffect, useState } from "react";
import { Layout, LayoutHeight } from "@/enum/layout";

export default function useLayout() {
  const [layout, setLayout] = useState<Layout>(Layout.LARGE);

  useEffect(() => {
    function resize() {
      const height = window.innerHeight;

      if (height <= LayoutHeight.SMALL) {
        setLayout(Layout.SMALL);
        return;
      }

      if (height <= LayoutHeight.MEDIUM) {
        setLayout(Layout.MEDIUM);
        return;
      }

      setLayout(Layout.LARGE);
    }

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return layout;
}
