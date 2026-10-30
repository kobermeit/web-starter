import { useQuery } from "@tanstack/react-query";
import { QueryBoundary } from "#client/components/QueryBoundary.tsx";
import { Button } from "#client/components/ui/button.tsx";
import { Input } from "#client/components/ui/input.tsx";
import { TodoItem } from "#client/features/todos/TodoItem.tsx";
import { todosQuery, useSaveTodo } from "#client/features/todos/todos.api.ts";

export function TodosPage() {
  const query = useQuery(todosQuery);
  const saveTodo = useSaveTodo();

  function addTodo(formData: FormData) {
    const title = formData.get("title")?.toString().trim();
    if (title) saveTodo({ id: crypto.randomUUID(), title, done: false, deleted: false });
  }

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Todos</h1>
      <form action={addTodo} className="mb-4 flex gap-2">
        <Input name="title" placeholder="Add a todo" aria-label="New todo" autoComplete="off" />
        <Button type="submit">Add</Button>
      </form>
      <QueryBoundary query={query}>
        {(todos) =>
          todos.length === 0 ? (
            <p className="text-muted-foreground">Nothing to do.</p>
          ) : (
            <ul>
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>
          )
        }
      </QueryBoundary>
    </>
  );
}
