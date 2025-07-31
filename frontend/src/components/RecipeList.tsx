type RecipeListProps = {
  recipes: any[];
};
const RecipeList = ({ recipes }: RecipeListProps) => {
  console.log(recipes);
  return (
    <ul>
      {recipes.map((recipe) => (
        <li>Hello</li>
      ))}
    </ul>
  );
};

export default RecipeList;
