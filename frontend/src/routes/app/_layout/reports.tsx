import { createFileRoute } from "@tanstack/react-router";
import ReportsPage from "../../../pages/ReportsPage";

export const Route = createFileRoute("/app/_layout/reports")({
  component: ReportsPage,
});
