import { useIsOnline } from "#client/api/connectivity.ts";

export function OfflineBanner() {
  const online = useIsOnline();
  if (online) return null;
  return (
    <div role="status" className="sticky top-0 z-10 bg-warning px-4 py-2 text-center text-sm text-warning-foreground">
      You're offline. Your changes will sync when you're back.
    </div>
  );
}
