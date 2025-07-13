import { createFileRoute, Outlet } from "@tanstack/react-router";
import Sidebar from "../../../components/Sidebar";
import { redirect } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute("/app/_layout")({
  component: RouteComponent,
  beforeLoad: async ({}) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw redirect({
        to: "/login",
      });
    }

    try {
      await axios.get("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

// this component contains a template saved by all /app subroutes
function RouteComponent() {
  return (
    <div className="relative lg:m-auto h-screen">
      <header className="px-4 py-3 flex items-center gap-4 justify-center">
        <h1 className="relative mt-1.5 left-16 font-bold text-2xl h-full md:text-center md:text-4xl">
          Smart Grocery Housekeeping
        </h1>
      </header>
      <Sidebar></Sidebar>
      <main className="px-4 py-2 md:pl-[224px]">
        <Outlet />
      </main>
    </div>
  );
}
