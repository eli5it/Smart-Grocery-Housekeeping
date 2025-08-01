import { createFileRoute } from "@tanstack/react-router";
import RecipesPage from "../../../pages/RecipesPage";

export const Route = createFileRoute("/app/_layout/recipes")({
  component: RecipesPage,
});
