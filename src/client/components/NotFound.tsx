import { Link } from "react-router";
import { Notice } from "#client/components/Notice.tsx";
import { buttonVariants } from "#client/components/ui/button.tsx";

export function NotFound() {
  return (
    <Notice title="Page not found">
      <Link to="/" className={buttonVariants({ variant: "outline" })}>
        Go home
      </Link>
    </Notice>
  );
}
