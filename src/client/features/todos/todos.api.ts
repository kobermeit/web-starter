import { queryOptions, useMutation } from "@tanstack/react-query";
import { request } from "#client/api/http.ts";
import { queryClient } from "#client/api/queryClient.ts";
import type { Todo, TodoWrite } from "#shared/todos.ts";

const saveTodoKey = ["todos", "save"] as const;

export const todosQuery = queryOptions({
  queryKey: ["todos"],
  queryFn: ({ signal }) => request<Todo[]>("/todos", { signal }),
});

export function todoQuery(id: string) {
  return queryOptions({
    queryKey: ["todos", id],
    queryFn: ({ signal }) => request<Todo>(`/todos/${id}`, { signal }),
    initialData: () => queryClient.getQueryData(todosQuery.queryKey)?.find((todo) => todo.id === id),
    initialDataUpdatedAt: () => queryClient.getQueryState(todosQuery.queryKey)?.dataUpdatedAt,
  });
}

function applyWrite(todos: Todo[] = [], write: TodoWrite): Todo[] {
  if (write.deleted) return todos.filter((todo) => todo.id !== write.id);
  const todo = { id: write.id, title: write.title, done: write.done, updatedAt: new Date(write.changedAt).toISOString() };
  return todos.some(({ id }) => id === write.id)
    ? todos.map((existing) => (existing.id === write.id ? todo : existing))
    : [...todos, todo];
}

/**
 * Registers how todo writes run. Defaults survive a page reload where `useMutation` callbacks don't, so writes
 * queued while offline still replay. Call once in `main.tsx`, before the app renders.
 */
export function registerTodoWrites() {
  queryClient.setMutationDefaults<Todo, Error, TodoWrite>(saveTodoKey, {
    mutationFn: ({ id, ...body }) => request<Todo>(`/todos/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    onMutate: async (write) => {
      await queryClient.cancelQueries({ queryKey: todosQuery.queryKey });
      queryClient.setQueryData(todosQuery.queryKey, (todos) => applyWrite(todos, write));
    },
    // A rejected write (409 when the item changed elsewhere after this write was made) is dropped silently.
    // The refetch replaces the optimistic state with the server's. Waiting for the last queued write avoids
    // a refetch landing between writes and briefly undoing them on screen.
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: saveTodoKey }) === 1) {
        return queryClient.invalidateQueries({ queryKey: todosQuery.queryKey });
      }
    },
  });
}

/** Saves a todo's full state. Shows immediately, and while offline it's queued until the server is reachable. */
export function useSaveTodo() {
  const { mutate } = useMutation<Todo, Error, TodoWrite>({ mutationKey: saveTodoKey });
  return (todo: Omit<TodoWrite, "changedAt">) => mutate({ ...todo, changedAt: Date.now() });
}
