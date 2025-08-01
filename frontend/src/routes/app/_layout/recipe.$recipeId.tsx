import { createFileRoute } from "@tanstack/react-router";
import RecipePage from "../../../pages/RecipePage";
import axios from "axios";
import type { Recipe } from "../../../lib/types";

export const Route = createFileRoute("/app/_layout/recipe/$recipeId")({
  component: RecipePage,
  loader: ({ params: { recipeId } }) => fetchRecipe(recipeId),
});

const fetchRecipe = async (recipeId: string) => {
  const token = localStorage.getItem("access_token");
  const res = await axios.get<Recipe>(`/api/recipes/${recipeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
