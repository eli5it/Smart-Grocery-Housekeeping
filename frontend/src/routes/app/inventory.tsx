import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/inventory")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="font-extrabold text-red-300">Hello "/app/inventory"!</div>
  );
}
