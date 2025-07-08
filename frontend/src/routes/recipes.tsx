import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/recipes")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="text-red-600 text-3xl">Hello "/recipes"!</div>;
}
