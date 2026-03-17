import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL is not set");
}

export const convex = new ConvexReactClient(convexUrl, {
  // Suppress verbose WebSocket reconnect logs in production
  // (code 1006 / InactiveServer disconnects are normal on the free tier)
  verbose: import.meta.env.DEV,
});
