import { createFileRoute } from "@tanstack/react-router";
import GroceryPage from "../../../pages/GroceryPage";

export const Route = createFileRoute("/app/_layout/groceries")({
  component: GroceryPage,
});
