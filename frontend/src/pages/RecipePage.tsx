import { useLoaderData } from "@tanstack/react-router";
import type { Recipe } from "../lib/types";

const RecipePage = () => {
  const recipe: Recipe = useLoaderData({
    from: "/app/_layout/recipe/$recipeId",
  });

  const { ingredients, instructions } = recipe;
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 mt-6 shadow-lg rounded-xl">
      <h1 className="font-bold text-4xl text-center capitalize mb-6">
        {recipe.name}
      </h1>
  
      <section className="mb-8">
        <h2 className="font-semibold text-2xl mb-4">Ingredients</h2>
        <ul className="list-disc list-inside space-y-1">
          {ingredients.map((ing) => (
            <li key={ing}>{ing}</li>
          ))}
        </ul>
      </section>
  
      <section>
        <h2 className="font-semibold text-2xl mb-4">Instructions</h2>
        <ol className="list-decimal list-inside space-y-2">
          {instructions.map((instruction, idx) => (
            <li key={idx}>{instruction}</li>
          ))}
        </ol>
      </section>
    </div>
  );  
};

export default RecipePage;
