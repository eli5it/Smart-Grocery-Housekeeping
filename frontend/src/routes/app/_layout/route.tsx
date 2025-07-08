import { createFileRoute, Outlet } from "@tanstack/react-router";
import Sidebar from "../../../components/Sidebar";

export const Route = createFileRoute("/app/_layout")({
  component: RouteComponent,
});

// this component contains a template saved by all /app subroutes
function RouteComponent() {
  return (
    <div>
      <header className="px-4 py-3 flex items-center gap-4">
        <Sidebar></Sidebar>

        <h1 className="font-bold text-2xl h-full">
          Smart Grocery Housekeeping
        </h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
