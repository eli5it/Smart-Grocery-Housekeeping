import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

// This file just exists to redirect from /app to /app => dashboard
// I have thus far not beed able to find a less janky solutions
export const Route = createFileRoute("/app/")({
  component: () => <></>,
  beforeLoad: () => {
    throw redirect({ to: "/app/dashboard" });
  },
});
