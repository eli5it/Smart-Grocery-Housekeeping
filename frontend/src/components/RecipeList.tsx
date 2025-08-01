import type { Recipe } from "../lib/types";
import { Link } from "@tanstack/react-router";

type RecipeListProps = {
  recipes: Recipe[];
};
const RecipeList = ({ recipes }: RecipeListProps) => {
  return (
    <ul>
      {recipes.map((recipe) => (
        <li className="capitalize">
          <Link
            to="/app/recipe/$recipeId"
            params={{
              recipeId: recipe.id.toString(),
            }}
          >
            {recipe.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default RecipeList;
