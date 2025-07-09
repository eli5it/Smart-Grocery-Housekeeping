import { createFileRoute, Outlet } from "@tanstack/react-router";
import Sidebar from "../../../components/Sidebar";

export const Route = createFileRoute("/app/_layout")({
  component: RouteComponent,
});

// this component contains a template saved by all /app subroutes
function RouteComponent() {
  return (
    <div className="relative lg:max-w-[1024px] lg:m-auto">
      <header className="px-4 py-3 flex items-center gap-4">
        <h1 className="relative mt-1.5 left-16 font-bold text-2xl h-full md:w-full md:text-center md:text-4xl">
          Smart Grocery Housekeeping
        </h1>
      </header>
      <Sidebar></Sidebar>
      <main className="pl-[224px]">
        <Outlet />
      </main>
    </div>
  );
}
