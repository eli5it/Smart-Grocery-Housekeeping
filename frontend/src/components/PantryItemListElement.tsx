import type { PantryItem } from "../lib/types";
import { useState } from "react";

type PantryItemListElement = {
  pantryItem: PantryItem;
  setPantryItems: React.Dispatch<React.SetStateAction<PantryItem[]>>;
  mode?: "duplicate" | "new";
};

const PantryItemListElement = ({
  pantryItem,
  setPantryItems,
  mode = "duplicate",
}: PantryItemListElement) => {
  const { product_name, image_url, ingredient_name, barcode } = pantryItem;
  const [productName, setProductName] = useState(product_name);
  const [ingredientName, setIngredientName] = useState(ingredient_name);

  const newItem = {
    barcode,
    product_name: productName,
    ingredient_name: ingredientName,
    image_url: image_url,
  };

  const duplicateItem = () => {
    setPantryItems((prevItems) =>
      [...prevItems]
        .concat(newItem)
        .sort((item) => parseInt(item.ingredient_name))
    );
  };

  return (
    <li className="bg-gray-200 px-3 py-3 max-w-[400px]">
      <div className="flex items-center gap-4">
        {image_url ? (
          <img
            className="rounded-md w-20 h-20"
            src={image_url}
            alt={`A picture of ${product_name}`}
          />
        ) : (
          <div className="bg-gray-300 w-20 h-20 rounded-md"></div>
        )}
        <div className="flex flex-col gap-2">
          <label>
            Product Name:
            <input
              className="block outline-blue-300 border border-black"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              type="text"
            />
          </label>
          <label>
            Ingredient Name:
            <input
              className="block outline-blue-300 border border-black"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              type="text"
            />
          </label>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <button
          onClick={duplicateItem}
          className="bg-blue-800 text-white font-bold rounded-lg px-4 py-2"
        >
          {mode === "duplicate" ? "Add another?" : "Submit"}
        </button>
      </div>
    </li>
  );
};

export default PantryItemListElement;
