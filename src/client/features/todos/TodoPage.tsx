import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router";
import { QueryBoundary } from "#client/components/QueryBoundary.tsx";
import { buttonVariants } from "#client/components/ui/button.tsx";
import { todoQuery } from "#client/features/todos/todos.api.ts";

export function TodoPage() {
  const { id = "" } = useParams();
  const query = useQuery(todoQuery(id));

  return (
    <>
      <Link to="/" className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-4" })}>
        <ArrowLeftIcon />
        All todos
      </Link>
      <QueryBoundary query={query}>
        {(todo) => (
          <article className="space-y-1">
            <h1 className="text-2xl font-semibold">{todo.title}</h1>
            <p>{todo.done ? "Done" : "Not done"}</p>
            <p className="text-sm text-muted-foreground">Last changed {new Date(todo.updatedAt).toLocaleString("en-AU")}</p>
          </article>
        )}
      </QueryBoundary>
    </>
  );
}
