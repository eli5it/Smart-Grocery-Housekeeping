import { useLoaderData } from "@tanstack/react-router";
import type { Recipe } from "../lib/types";

const RecipePage = () => {
  const recipe: Recipe = useLoaderData({
    from: "/app/_layout/recipe/$recipeId",
  });

  const { ingredients, instructions } = recipe;
  return (
    <>
      <h1 className="font-bold text-4xl text-center capitalize">
        {recipe.name}
      </h1>

      <h2 className="font-bold text-3xl text-center my-4">Ingredients</h2>
      <ol className="text-center">
        {ingredients.map((ing) => (
          <li key={ing}>{ing}</li>
        ))}
      </ol>
      <h2 className="font-bold text-3xl text-center">Instructions</h2>
      <ol className="text-center">
        {instructions.map((instruction, idx) => (
          <li>
            {idx + 1}. {instruction}
          </li>
        ))}
      </ol>
    </>
  );
};

export default RecipePage;
