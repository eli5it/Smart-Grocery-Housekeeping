import type { Recipe } from "../lib/types";
import { Link } from "@tanstack/react-router";

type RecipeListProps = {
  recipes: Recipe[];
};
const RecipeList = ({ recipes }: RecipeListProps) => {
  return (
    <div className="min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition duration-200 sm:min-w-[300px]"
        >
          <h3 className="text-xl font-semibold mb-2 capitalize">
            {recipe.name}
          </h3>
          <Link
            to="/app/recipe/$recipeId"
            params={{ recipeId: recipe.id.toString() }}
            className="text-blue-600 hover:underline font-medium"
          >
            View Recipe →
          </Link>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
