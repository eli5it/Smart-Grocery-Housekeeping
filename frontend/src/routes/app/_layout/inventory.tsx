import { createFileRoute } from "@tanstack/react-router";
import InventoryPage from "../../../pages/InventoryPage";

export const Route = createFileRoute("/app/_layout/inventory")({
  component: InventoryPage,
});
