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
  const { product_name, image_url, ingredient_name, barcode, expiration_date } =
    pantryItem;
  const [productName, setProductName] = useState(product_name);
  const [ingredientName, setIngredientName] = useState(ingredient_name);
  const [expirationDate, setExpirationDate] = useState(expiration_date);

  const newItem = {
    barcode,
    product_name: productName,
    ingredient_name: ingredientName,
    image_url: image_url,
    expiration_date: expirationDate,
  };

  const duplicateItem = () => {
    // updates pantry item state to include additional copy of pantryItem
    setPantryItems((prevItems) =>
      [...prevItems]
        .concat(newItem)
        .sort((item) => parseInt(item.ingredient_name))
    );
  };

  return (
    <li className="bg-white px-3 py-3 w-[250px] rounded-lg list-none border border-gray-500">
      {mode === "new" && (
        <p className="font-bold text-2xl text-center">Add new Item</p>
      )}
      <form className="flex items-center gap-4 my-2">
        <div className="flex flex-col gap-2">
          <label>
            Product Name:
            <input
              className="block outline-blue-300 border border-black rounded-md pl-1"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              type="text"
            />
          </label>
          <label>
            Ingredient Name:
            <input
              className="block outline-blue-300 border border-black rounded-md pl-1"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              type="text"
            />
          </label>
          <label>
            Expiration Date:
            <input
              className="block outline-blue-300 border border-black w-full rounded-md pl-1"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              type="date"
            />
          </label>
        </div>
      </form>
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
