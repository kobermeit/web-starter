import { and, asc, eq, isNull, lte } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { db } from "#server/db.ts";
import { todos } from "#server/features/todos/todos.table.ts";
import type { Todo, TodoWrite } from "#shared/todos.ts";

const idParams = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", format: "uuid" } },
} as const;

const writeBody = {
  type: "object",
  required: ["title", "done", "deleted", "changedAt"],
  additionalProperties: false,
  properties: {
    title: { type: "string", minLength: 1, maxLength: 500 },
    done: { type: "boolean" },
    deleted: { type: "boolean" },
    changedAt: { type: "integer", minimum: 0 },
  },
} as const;

function toTodo(row: typeof todos.$inferSelect): Todo {
  return { id: row.id, title: row.title, done: row.done, updatedAt: row.updatedAt.toISOString() };
}

export async function todosRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const rows = await db.select().from(todos).where(isNull(todos.deletedAt)).orderBy(asc(todos.createdAt));
    return rows.map(toTodo);
  });

  app.get<{ Params: { id: string } }>("/:id", { schema: { params: idParams } }, async (request, reply) => {
    const [row] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, request.params.id), isNull(todos.deletedAt)));
    if (!row) return reply.code(404).send({ error: "Not found" });
    return toTodo(row);
  });

  // Creates, updates and deletes are all this one upsert. It only applies when the write was made after the row's
  // last change, so a device replaying old offline writes can't overwrite a newer change made elsewhere.
  app.put<{ Params: { id: string }; Body: Omit<TodoWrite, "id"> }>(
    "/:id",
    { schema: { params: idParams, body: writeBody } },
    async (request, reply) => {
      const { title, done, deleted, changedAt } = request.body;
      // A client clock running ahead would otherwise block every later write to this item.
      const updatedAt = new Date(Math.min(changedAt, Date.now()));
      const changes = { title, done, updatedAt, ...(deleted && { deletedAt: updatedAt }) };

      const [row] = await db
        .insert(todos)
        .values({ id: request.params.id, ...changes })
        .onConflictDoUpdate({ target: todos.id, set: changes, setWhere: lte(todos.updatedAt, updatedAt) })
        .returning();

      if (!row) return reply.code(409).send({ error: "Item changed after this write was made" });
      return toTodo(row);
    },
  );
}
