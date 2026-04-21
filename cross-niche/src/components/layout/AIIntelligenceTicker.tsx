import { useMemo } from "react";
import { useAIPulse } from "@/hooks/useAIPulse";

export function AIIntelligenceTicker() {
  const { items } = useAIPulse();

  const snippets = useMemo(() => {
    return items
      .map((item) => item.futurePrediction?.prediction)
      .filter((v): v is string => Boolean(v))
      .slice(0, 12);
  }, [items]);

  if (snippets.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[rgba(193,255,0,0.2)] bg-black/70 backdrop-blur-md">
      <div className="overflow-hidden whitespace-nowrap py-2">
        <div className="inline-block min-w-full animate-ticker-scroll">
          {[...snippets, ...snippets].map((s, idx) => (
            <span
              key={`${s}-${idx}`}
              className="mx-6 inline-block font-mono text-xs text-zinc-300"
            >
              <span className="mr-2 text-grid-neon">AI //</span>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

