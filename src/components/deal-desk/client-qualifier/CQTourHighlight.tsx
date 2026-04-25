import { useLayoutEffect, useState } from "react";

type Box = { top: number; left: number; width: number; height: number };

type Props = { targetId: string; active: boolean };

export function CQTourHighlight({ targetId, active }: Props) {
  const [box, setBox] = useState<Box | null>(null);

  useLayoutEffect(() => {
    if (!active) {
      setBox(null);
      return;
    }
    const update = () => {
      const el = document.getElementById(targetId);
      if (!el) {
        setBox(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setBox({
        top: r.top - 6,
        left: r.left - 6,
        width: r.width + 12,
        height: r.height + 12,
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [targetId, active]);

  if (!active || !box) return null;

  return (
    <div
      aria-hidden
      className="ihl-tour-highlight ihl-tour-pulse pointer-events-none fixed z-[9997] rounded-[10px] border-[2.5px] border-[#C6A15B] max-sm:border-2"
      style={{
        top: box.top,
        left: box.left,
        width: box.width,
        height: box.height,
        transition:
          "top 0.4s cubic-bezier(0.16, 1, 0.3, 1), left 0.4s cubic-bezier(0.16, 1, 0.3, 1), width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    />
  );
}
