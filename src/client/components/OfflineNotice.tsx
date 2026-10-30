import { useNavigate } from "react-router";
import { Notice } from "#client/components/Notice.tsx";
import { Button } from "#client/components/ui/button.tsx";

export function OfflineNotice() {
  const navigate = useNavigate();
  // React Router tracks its own history index. Index 0 means this page was opened directly, so there's no "back".
  const goBack = () => (window.history.state?.idx ? navigate(-1) : navigate("/"));

  return (
    <Notice title="Oops, you're offline">
      <p className="text-muted-foreground">This page needs a connection. It will load by itself once you're back online.</p>
      <Button variant="outline" onClick={goBack}>
        Go back
      </Button>
    </Notice>
  );
}
