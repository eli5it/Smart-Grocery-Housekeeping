import { useState } from "react";
import type { PantryEntry, PantryEntryByProductName } from "../lib/types";
import { cn } from "@udecode/cn";
import { X, Pencil } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "../lib/queryClient";

type SubEntryProps = {
  entry: PantryEntry;
  deleteEntry: (entryId: number) => void;
};
const SubEntry = ({ entry, deleteEntry }: SubEntryProps) => {
  const [editing, setEditing] = useState(false);
  return (
    <tr className="border-t border-gray-500">
      <td className="px-10 py-2">{entry.product_name}</td>
      <td className="px-5 py-2">{entry.ingredient.name}</td>
      <td className="px-5 py-2">{entry.expiration_date}</td>
      <td className="px-5">
        <button onClick={() => setEditing(!editing)}>
          {!editing ? <Pencil /> : <X />}
        </button>
      </td>
      <td className="px-5">
        <button onClick={() => deleteEntry(entry.id)}>
          <X />
        </button>
      </td>
    </tr>
  );
};

type PantryTableEntryProps = {
  entries: PantryEntry[];
  deleteEntry: (entryId: number) => void;
};
const PantryTableEntry = ({ entries, deleteEntry }: PantryTableEntryProps) => {
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
        <td className="px-5">
          <button onClick={() => setEditing(!editing)}>
            {!editing ? <Pencil /> : <X />}
          </button>
        </td>
        <td>
          <button onClick={() => deleteEntry(entries[0].id)} className="px-5">
            <X />
          </button>
        </td>
      </tr>
      {expanded &&
        entries.slice(1).map((entry) => {
          return <SubEntry deleteEntry={deleteEntry} entry={entry}></SubEntry>;
        })}
    </>
  );
};

type PantryTableProps = {
  pantryEntries: PantryEntryByProductName;
};
const PantryTable = ({ pantryEntries }: PantryTableProps) => {
  const deletePantryEntry = (entryId: number) => {
    const token = localStorage.getItem("access_token");
    return axios.delete(`/api/pantry/${entryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const mutation = useMutation({
    mutationFn: deletePantryEntry,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["pantry"] });
    },
  });
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
              <th className="px-5 py-2 text-left" scope="col">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(pantryEntries).map((product_name) => (
              <PantryTableEntry
                deleteEntry={mutation.mutate}
                entries={pantryEntries[product_name]}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PantryTable;
