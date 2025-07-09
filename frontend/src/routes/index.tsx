import { createFileRoute } from "@tanstack/react-router";
import SplashPage from "../pages/SplashPage";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SplashPage />
    </>
  );
}
