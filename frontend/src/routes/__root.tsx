import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Dashboard
        </Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/groceries">Groceries</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/suggestions">Suggestions</Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
