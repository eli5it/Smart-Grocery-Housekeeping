import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

// This file just exists to redirect from /app to /app => dashboard
// I have not thus far found a less janky solutions
export const Route = createFileRoute("/app/")({
  component: RouteComponent,
  beforeLoad: () => {
    throw redirect({ to: "/app/dashboard" });
  },
});

function RouteComponent() {
  return <div>Hello "/app/"!</div>;
}
