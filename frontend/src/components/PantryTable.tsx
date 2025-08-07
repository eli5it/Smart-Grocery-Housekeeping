import { useState } from "react";
import type { PantryEntry, PantryEntryByProductName } from "../lib/types";
import { cn } from "@udecode/cn";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "../lib/queryClient";
import Popover from "./EntryPopover";

type SubEntryProps = {
  entry: PantryEntry;
  updateEntry: ({
    entryId,
    newStatus,
  }: {
    entryId: number;
    newStatus: "used" | "discarded" | "deleted";
  }) => void;
};
const SubEntry = ({ entry, updateEntry }: SubEntryProps) => {
  // Displays entries that are hidden until user clicks the ">" button
  return (
    <tr className="border-t border-gray-500">
      <td className="px-10 py-2">{entry.product_name}</td>
      <td className="px-5 py-2">{entry.ingredient.name}</td>
      <td className="px-5 py-2">{entry.expiration_date}</td>

      <td>
        <Popover updateEntry={updateEntry} entryId={entry.id}></Popover>
      </td>
    </tr>
  );
};

type PantryTableEntryProps = {
  entries: PantryEntry[];
  updateEntry: ({
    entryId,
    newStatus,
  }: {
    entryId: number;
    newStatus: "used" | "discarded" | "deleted";
  }) => void;
};

const PantryTableEntry = ({ entries, updateEntry }: PantryTableEntryProps) => {
  // This component represents an individual row in the pantry entry table
  const [expanded, setExpanded] = useState(false);

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

        <td>
          <Popover entryId={entries[0].id} updateEntry={updateEntry} />
        </td>
      </tr>
      {expanded &&
        entries.slice(1).map((entry) => {
          return <SubEntry updateEntry={updateEntry} entry={entry}></SubEntry>;
        })}
    </>
  );
};

type PantryTableProps = {
  pantryEntries: PantryEntryByProductName;
};

const PantryTable = ({ pantryEntries }: PantryTableProps) => {
  const updatePantryEntry = async (vars: {
    entryId: number;
    newStatus: "discarded" | "used" | "deleted";
  }) => {
    const token = localStorage.getItem("access_token");

    if (vars.newStatus === "deleted") {
      return axios.delete(`/api/pantry/${vars.entryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // use PATCH route to discard or waste a pantry item
    return axios.patch(
      `/api/pantry/${vars.entryId}`,
      {
        status: vars.newStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const updateMutation = useMutation({
    mutationFn: updatePantryEntry,
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
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(pantryEntries).map((product_name, idx) => (
              <PantryTableEntry
                updateEntry={updateMutation.mutate}
                entries={pantryEntries[product_name]}
                key={idx}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PantryTable;
