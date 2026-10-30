import { onlineManager } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";

const PROBE_INTERVAL_MS = 5000;

let probe: ReturnType<typeof setInterval> | undefined;

/**
 * Marks the app offline after a request couldn't reach the server, then polls the health endpoint until it can.
 * Queued writes and paused queries resume as soon as it's back.
 */
export function markOffline() {
  if (probe) return;
  onlineManager.setOnline(false);
  probe = setInterval(async () => {
    try {
      const response = await fetch("/api/health", { cache: "no-store", signal: AbortSignal.timeout(PROBE_INTERVAL_MS) });
      if (response.ok) onlineManager.setOnline(true);
    } catch {
      // Still unreachable. The next interval tries again.
    }
  }, PROBE_INTERVAL_MS);
}

// TanStack Query assumes it starts online. Starting from the browser's state keeps writes restored after an offline
// reload queued, instead of failing once first and being left out of storage until they pause.
onlineManager.setOnline(navigator.onLine);

onlineManager.subscribe((online) => {
  if (!online || !probe) return;
  clearInterval(probe);
  probe = undefined;
});

export function useIsOnline() {
  return useSyncExternalStore(
    (listener) => onlineManager.subscribe(listener),
    () => onlineManager.isOnline(),
  );
}
