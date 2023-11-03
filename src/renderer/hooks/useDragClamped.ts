import { useState, useEffect } from "react";

type ClampDirection = "x" | "y";

interface UseDragClampedOptions {
  clampToNode: HTMLElement | null;
  direction: ClampDirection;
}

export default function useDragClamped({ clampToNode, direction }: UseDragClampedOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (event: MouseEvent) => {
    if (isDragging && clampToNode) {
      const newPosition = { ...position };

      if (direction === "x") {
        const minX = clampToNode.getBoundingClientRect().left;
        const maxX = clampToNode.getBoundingClientRect().right;

        newPosition.x = Math.min(Math.max(event.clientX, minX), maxX);
      } else {
        const minY = clampToNode.getBoundingClientRect().top;
        const maxY = clampToNode.getBoundingClientRect().bottom;

        newPosition.y = Math.min(Math.max(event.clientY, minY), maxY);
      }

      setPosition(newPosition);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, position]);

  return { position: position[direction], onMouseDown, isDragging };
}
