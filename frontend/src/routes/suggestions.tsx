import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/suggestions")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/suggestions"!</div>;
}
