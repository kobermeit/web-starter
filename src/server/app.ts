import { existsSync } from "node:fs";
import { join } from "node:path";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import { todosRoutes } from "#server/features/todos/todos.routes.ts";

const clientDir = join(import.meta.dirname, "../../dist/client");

export async function buildApp() {
  const app = Fastify({ logger: true });

  app.get("/api/health", async () => ({ ok: true }));
  await app.register(todosRoutes, { prefix: "/api/todos" });

  // The built client only exists after `npm run build`. In dev, Vite serves it.
  if (existsSync(clientDir)) {
    await app.register(fastifyStatic, {
      root: clientDir,
      cacheControl: false,
      setHeaders: (reply, path) =>
        reply.header("cache-control", path.includes("/assets/") ? "public, max-age=31536000, immutable" : "no-cache"),
    });

    // Client-side routes all serve the app shell, so a deep link or refresh never 404s.
    app.setNotFoundHandler((request, reply) => {
      if (request.method === "GET" && !request.url.startsWith("/api/")) {
        return reply.header("cache-control", "no-cache").sendFile("index.html");
      }
      return reply.code(404).send({ error: "Not found" });
    });
  }

  return app;
}
