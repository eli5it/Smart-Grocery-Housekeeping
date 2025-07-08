import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_pathlessLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1 className="font-bold text-red-700">Pathless Layout</h1>
      <Outlet />
    </div>
  );
}
