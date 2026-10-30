# Code map

Where things live. Update this file in the same commit as any change that adds, moves, renames or deletes a file, route, endpoint or table.

## Pages

| URL | Page | File |
|---|---|---|
| `/` | Todo list | `src/client/features/todos/TodosPage.tsx` |
| `/todos/:id` | Todo detail | `src/client/features/todos/TodoPage.tsx` |
| anything else | Not found | `src/client/components/NotFound.tsx` |

Routes are declared in `src/client/App.tsx`.

## Shared components

| Component | Use | File |
|---|---|---|
| `QueryBoundary` | Renders query data, or loading, offline, not found and error states | `src/client/components/QueryBoundary.tsx` |
| `OfflineBanner` | Banner at the top of every page while offline | `src/client/components/OfflineBanner.tsx` |
| `OfflineNotice` | "Oops, you're offline" for a page whose data was never cached | `src/client/components/OfflineNotice.tsx` |
| `NotFound` | Page not found | `src/client/components/NotFound.tsx` |
| `Notice` | Centred full-page message with a title and actions (used by the offline, not found and error states) | `src/client/components/Notice.tsx` |
| `Button`, `Input`, `Checkbox` | shadcn base components | `src/client/components/ui/` |

## Features

### Todos

| What | File |
|---|---|
| Queries, writes and offline sync | `src/client/features/todos/todos.api.ts` |
| One row in the list | `src/client/features/todos/TodoItem.tsx` |
| API: `GET /api/todos`, `GET /api/todos/:id`, `PUT /api/todos/:id` | `src/server/features/todos/todos.routes.ts` |
| Table `todos` | `src/server/features/todos/todos.table.ts` |
| Types shared by client and server | `src/shared/todos.ts` |

## App-wide

| To change | Go to |
|---|---|
| Routes, providers, what wraps every page | `src/client/App.tsx` |
| Startup, registering offline writes | `src/client/main.tsx` |
| Theme colours, fonts, global styles | `src/client/styles.css` |
| shadcn settings (where `npx shadcn add` puts components) | `components.json` |
| How requests are sent, timeouts | `src/client/api/http.ts` |
| Caching, retries, offline persistence | `src/client/api/queryClient.ts` |
| Online/offline detection | `src/client/api/connectivity.ts` |
| Offline page loading (service worker) | `src/client/sw.js` |
| Registering API routes, serving the client | `src/server/app.ts` |
| Server startup, migrations | `src/server/index.ts` |
| Environment variables | `src/server/env.ts`, `.env.example` |
| Database connection | `src/server/db.ts` |
| Build, dev proxy | `vite.config.ts` |
| Production image | `Dockerfile` |
