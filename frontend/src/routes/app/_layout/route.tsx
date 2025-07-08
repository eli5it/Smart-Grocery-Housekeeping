import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1 className="font-bold">I am shared</h1>
      <Outlet />
    </div>
  );
}
