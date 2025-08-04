import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import RecipeList from "../components/RecipeList";
import type { Recipe } from "../lib/types";

const RecipePage = () => {
  const getRecipes = async () => {
    const token = localStorage.getItem("access_token");
    return axios.get<{ recipes: Recipe[] }>("/api/recipes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const recipeQuery = useQuery({ queryKey: ["recipes"], queryFn: getRecipes });

  const { data, isPending, error } = recipeQuery;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="font-bold text-4xl text-center mb-2">Recipes</h1>
      <p className="text-lg text-gray-600 text-center mb-8">
        Recommended for you based on your pantry
      </p>

      {isPending && <p className="text-center">Fetching recipes...</p>}
      {error && (
        <p className="text-center text-red-500">
          An unexpected error has occurred. Please try again later.
        </p>
      )}

      {data && <RecipeList recipes={data.data.recipes} />}
    </div>
  );
};
export default RecipePage;
