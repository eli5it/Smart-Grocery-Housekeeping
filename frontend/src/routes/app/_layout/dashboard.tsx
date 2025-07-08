import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_layout/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return <div className="p-2">Hello from About!</div>;
}
