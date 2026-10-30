import { cn } from "cn";
import { Link } from "react-router";
import { Button, buttonVariants } from "#client/components/ui/button.tsx";
import { Checkbox } from "#client/components/ui/checkbox.tsx";
import { useSaveTodo } from "#client/features/todos/todos.api.ts";
import type { Todo } from "#shared/todos.ts";

export function TodoItem({ todo }: { todo: Todo }) {
  const saveTodo = useSaveTodo();
  const current = { id: todo.id, title: todo.title, done: todo.done, deleted: false };

  return (
    <li className="flex items-center gap-2 border-b py-2">
      <label className={cn("flex flex-1 items-center gap-3", todo.done && "text-muted-foreground line-through")}>
        <Checkbox checked={todo.done} onCheckedChange={(done) => saveTodo({ ...current, done })} />
        {todo.title}
      </label>
      <Link to={`/todos/${todo.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
        Details
      </Link>
      <Button variant="ghost" size="sm" onClick={() => saveTodo({ ...current, deleted: true })} aria-label={`Delete ${todo.title}`}>
        Delete
      </Button>
    </li>
  );
}
