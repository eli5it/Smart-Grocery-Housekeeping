import type { PantryListItem } from "../lib/types";

type PantryTableEntryProps = {
  entry: PantryListItem;
};
const PantryTableEntry = ({ entry }: PantryTableEntryProps) => {
  return (
    <tr className="border-t border-gray-500">
      <td className="px-5 py-2">{entry.product_name}</td>
      <td className="px-5 py-2">{entry.ingredient_name}</td>
      <td className="px-5 py-2">{entry.expiration_date}</td>
    </tr>
  );
};

type PantryTableProps = {
  entries: PantryListItem[];
};
const PantryTable = ({ entries }: PantryTableProps) => {
  return (
    <>
      <div className="px-2 py-4 max-w-[800px]">
        <table className="min-w-full">
          <caption className="font-bold text-2xl text-left">Pantry</caption>
          <thead>
            <tr>
              <th className="px-5 py-2 text-left" scope="col">
                Product
              </th>
              <th className="px-5 py-2 text-left" scope="col">
                Ingredient
              </th>
              <th className="px-5 py-2 text-left" scope="col">
                Expiration Date
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <PantryTableEntry entry={entry} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PantryTable;
