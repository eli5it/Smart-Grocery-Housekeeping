import type { PantryItem } from "../lib/types";

type PantryItemListProps = {
  pantryItems: PantryItem[];
};

type PantryItemListElement = {
  pantryItem: PantryItem;
};

const PantryItemListElement = ({ pantryItem }: PantryItemListElement) => {
  // image, Name          ,
  //
  //        IngredientName,
  const { product_name, quantity, image_url, ingredient_name } = pantryItem;

  return (
    <li className="flex gap-4 items-center bg-gray-200 px-3 py-3">
      <img
        className="rounded-md h-20"
        src={image_url}
        alt={`A picture of ${product_name}`}
      />
      <div className="flex flex-col gap-2">
        <label>
          Product Name:
          <input
            className="block outline-blue-300 border border-black"
            value={product_name}
            type="text"
          />
        </label>
        <label>
          Ingredient Name:
          <input
            className="block outline-blue-300 border border-black"
            value={ingredient_name}
            type="text"
          />
        </label>
        <label>
          Quantity
          <input
            className="block outline-blue-300 border border-black"
            value={quantity}
            type="number"
          />
        </label>
      </div>
    </li>
  );
};

const PantryItemList = ({ pantryItems }: PantryItemListProps) => {
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    // submit changes to the db
    e.preventDefault();

    // on succesful change redirect to dashboard?

    // on unsuccesful change,display toast?
  };

  return (
    <>
      <h2 className="font-bold text-3xl text-center mt-4">
        Edit Pantry Items below
      </h2>
      {pantryItems.length > 0 && (
        <form onSubmit={submitHandler}>
          <ul className="py-5 max-w-[400px] m-auto">
            {pantryItems.map((pantryItem) => (
              <PantryItemListElement
                key={pantryItem.barcode}
                pantryItem={pantryItem}
              />
            ))}
          </ul>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white px-3 py-4 rounded-3xl font-bold"
              type="submit"
            >
              Submit Changes
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default PantryItemList;
