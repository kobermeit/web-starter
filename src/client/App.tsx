import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { BrowserRouter, Route, Routes } from "react-router";
import { persistOptions, queryClient } from "#client/api/queryClient.ts";
import { NotFound } from "#client/components/NotFound.tsx";
import { OfflineBanner } from "#client/components/OfflineBanner.tsx";
import { TodoPage } from "#client/features/todos/TodoPage.tsx";
import { TodosPage } from "#client/features/todos/TodosPage.tsx";

export function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
      // Not awaited: the provider keeps showing "restoring" until onSuccess settles, and while offline the queued
      // writes don't settle until the connection is back.
      onSuccess={() => void queryClient.resumePausedMutations()}
    >
      <BrowserRouter>
        <OfflineBanner />
        <main className="mx-auto max-w-2xl p-4">
          <Routes>
            <Route path="/" element={<TodosPage />} />
            <Route path="/todos/:id" element={<TodoPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </PersistQueryClientProvider>
  );
}
