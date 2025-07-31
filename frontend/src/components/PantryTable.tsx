import type { PantryEntry, PantryEntryByProductName } from "../lib/types";

type PantryTableEntryProps = {
  entries: PantryEntry[];
};
const PantryTableEntry = ({ entries }: PantryTableEntryProps) => {
  // this is emergency error handling, entries should always have a non-zero length
  if (entries.length === 0) {
    return <></>;
  }

  return (
    <tr className="border-t border-gray-500">
      <td className="px-5 py-2">{entries[0].product_name}</td>
      <td className="px-5 py-2">{entries[0].ingredient.name}</td>
      <td className="px-5 py-2">{entries[0].expiration_date}</td>
    </tr>
  );
};

type PantryTableProps = {
  pantryEntries: PantryEntryByProductName;
};
const PantryTable = ({ pantryEntries }: PantryTableProps) => {
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
            {Object.keys(pantryEntries).map((product_name) => (
              <PantryTableEntry entries={pantryEntries[product_name]} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PantryTable;
