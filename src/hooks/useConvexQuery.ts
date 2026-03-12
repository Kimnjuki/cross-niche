import { useQuery } from "convex/react";
import { useEffect, useState } from "react";

/**
 * Wraps Convex useQuery with optional error state and timeout detection.
 * Use when you want to show a "Failed to load / Retry" UI after a long loading period.
 */
export function useConvexQuery(
  query: any,
  args?: object | "skip",
) {
  const data = useQuery(query, args as any);
  const [timeoutError, setTimeoutError] = useState<Error | null>(null);

  useEffect(() => {
    if (data !== undefined) {
      setTimeoutError(null);
      return;
    }
    const t = setTimeout(() => {
      setTimeoutError(
        new Error("Query timeout – check Convex connection"),
      );
    }, 10000);
    return () => clearTimeout(t);
  }, [data]);

  return {
    data,
    isLoading: data === undefined && !timeoutError,
    error: timeoutError,
  };
}
