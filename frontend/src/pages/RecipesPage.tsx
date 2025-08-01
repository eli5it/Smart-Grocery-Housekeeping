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
    <>
      <h1 className="font-bold text-3xl">Recipes</h1>
      {isPending && <h2>Fetching Recipes ...</h2>}
      {error && (
        <h2>An unexpected error has occured. Please try again later.</h2>
      )}
      <h2 className="text-2xl my-5">Reccomended for you</h2>
      {data && <RecipeList recipes={data.data.recipes}></RecipeList>}
    </>
  );
};
export default RecipePage;
