import type { PantryItem } from "../lib/types";
import PantryItemListElement from "./PantryItemListElement";

type PantryItemListProps = {
  pantryItems: PantryItem[];
  setPantryItems: React.Dispatch<React.SetStateAction<PantryItem[]>>;
};

const PantryItemList = ({
  pantryItems,
  setPantryItems,
}: PantryItemListProps) => {
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    // submit changes to the db
    e.preventDefault();

    // on succesful change redirect to dashboard?

    // on unsuccesful change,display toast?
  };

  return (
    <>
      {pantryItems.length > 0 && (
        <div>
          <ul className="py-5 max-w-[400px] m-auto">
            {pantryItems.map((pantryItem) => (
              <PantryItemListElement
                setPantryItems={setPantryItems}
                key={pantryItem.barcode}
                pantryItem={pantryItem}
              />
            ))}
          </ul>
          <div className="flex justify-center"></div>
        </div>
      )}
    </>
  );
};

export default PantryItemList;
