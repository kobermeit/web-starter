import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ApiError } from "#client/api/http.ts";
import { NotFound } from "#client/components/NotFound.tsx";
import { Notice } from "#client/components/Notice.tsx";
import { OfflineNotice } from "#client/components/OfflineNotice.tsx";

interface QueryBoundaryProps<T> {
  query: UseQueryResult<T>;
  children: (data: T) => ReactNode;
}

/** Renders a query's data, or a loading, offline or error state while there's none. Cached data still renders offline. */
export function QueryBoundary<T>({ query, children }: QueryBoundaryProps<T>) {
  if (query.data !== undefined) return children(query.data);
  if (query.fetchStatus === "paused") return <OfflineNotice />;
  if (query.error instanceof ApiError && query.error.status === 404) return <NotFound />;
  if (query.isError) {
    return (
      <Notice title="Something went wrong">
        <p className="text-muted-foreground">Refresh the page to try again.</p>
      </Notice>
    );
  }
  return <p className="text-muted-foreground">Loading…</p>;
}
