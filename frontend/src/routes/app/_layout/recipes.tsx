import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_layout/recipes")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="text-red-600 text-3xl">Hello "/recipes"!</div>;
}
