import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_layout/groceries")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/grocery"!</div>;
}
