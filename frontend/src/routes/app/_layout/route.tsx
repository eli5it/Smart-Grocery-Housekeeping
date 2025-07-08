import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_layout")({
  component: RouteComponent,
  loader: () => {
    // redirect to dashboard page
    throw redirect({ to: "/app/dashboard" });
  },
});

function RouteComponent() {
  return (
    <div>
      <h1>I am shared</h1>
      <Outlet />
    </div>
  );
}
