import { useState } from "react";
import type { PantryEntry, PantryEntryByProductName } from "../lib/types";
import { cn } from "@udecode/cn";
import { X, Pencil } from "lucide-react";

type SubEntryProps = {
  entry: PantryEntry;
};
const SubEntry = ({ entry }: SubEntryProps) => {
  return (
    <tr className="border-t border-gray-500">
      <td className="px-10 py-2">{entry.product_name}</td>
      <td className="px-5 py-2">{entry.ingredient.name}</td>
      <td className="px-5 py-2">{entry.expiration_date}</td>
      <td>Edit</td>
    </tr>
  );
};

type PantryTableEntryProps = {
  entries: PantryEntry[];
};
const PantryTableEntry = ({ entries }: PantryTableEntryProps) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  // this is emergency error handling, entries should always have a non-zero length
  if (entries.length === 0) {
    return <></>;
  }

  return (
    <>
      <tr className="border-t border-gray-500">
        <td className="px-5 py-2">
          {entries.length > 1 && (
            <button className="mr-1" onClick={() => setExpanded(!expanded)}>
              {">"}
            </button>
          )}

          <span
            className={cn("", {
              "ml-3": entries.length < 2,
            })}
          >
            {entries[0].product_name}
          </span>
        </td>
        <td className="px-5 py-2">{entries[0].ingredient.name}</td>
        <td className="px-5 py-2">{entries[0].expiration_date}</td>
        <td className="px-5">{!editing ? <Pencil /> : <X />}</td>
      </tr>
      {expanded &&
        entries.slice(1).map((entry) => {
          return <SubEntry entry={entry}></SubEntry>;
        })}
    </>
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
              <th className="px-5 py-2 text-left" scope="col">
                Edit
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
