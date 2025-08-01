import type { PantryEntry, PantryEntryByProductName } from "../lib/types";
import PantryTable from "../components/PantryTable";
import { useState } from "react";
import InventoryAdditionView from "./InventoryAdditionPage";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { PantryStats } from "../lib/types";

const InventoryPage = () => {
  const [mode, setMode] = useState<"add" | "view">("view");
  const getPantry = () => {
    const token = localStorage.getItem("access_token");
    return axios.get<PantryEntry[]>("/api/pantry", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const pantryQuery = useQuery({ queryKey: ["pantry"], queryFn: getPantry });
  const getStats = () => {
    const token = localStorage.getItem("access_token");
    return axios.get<PantryStats>("/api/pantry/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const statsQuery = useQuery({ queryKey: ["stats"], queryFn: getStats });

  const { data: statsData } = statsQuery;

  const { data, isPending, error } = pantryQuery;

  // this is a really hacky solution, should replace w/subroutes later
  if (mode == "view") {
    if (isPending) {
      return <div className="font-bold text-3xl">Fetching your pantry</div>;
    }

    if (error) {
      return (
        <div className="font-bold text-3xl">
          An Unexpected error has occured. Please try again later
        </div>
      );
    }

    // axios returns an object with a data property
    const responseData = data.data;

    let entries: PantryEntryByProductName = {};

    entries = responseData.reduce((acc, curr) => {
      if (acc[curr.product_name]) {
        acc[curr.product_name].push(curr);
      } else {
        acc[curr.product_name] = [curr];
      }
      return acc;
    }, entries);

    return (
      <>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold my-6">Inventory</h1>
          <button
            onClick={() => setMode("add")}
            className="bg-light-green text-white flex justify-center items-center h-10 rounded-2xl px-3 py-2"
          >
            Add Item
          </button>
        </div>
        <ul className="flex gap-5 max-w-[1000px]">
          <li className="flex flex-1 bg-light-green rounded-lg px-2 py-3 gap-2">
            <img
              className="w-8 md:w-12 h-auto"
              src="/broccoli.png"
              alt="broccoli"
            />
            <div className="">
              <p className="md:text-2xl">Total Items</p>
              <p className="font-bold md:text-2xl">
                {statsData ? statsData?.data.total : ""}
              </p>
            </div>
          </li>
          <li className="flex flex-1 bg-yellow rounded-lg px-2 py-3 gap-2">
            <img
              className="w-8 md:w-12 h-auto"
              src="/hourglass.png"
              alt="hourglass"
            />
            <div className="">
              <p className="md:text-2xl">Expiring Soon</p>
              <p className="font-bold md:text-2xl">
                {" "}
                {statsData ? statsData?.data.expiring : ""}
              </p>
            </div>
          </li>
          <li className="flex flex-1 bg-light-red rounded-lg px-2 py-3 gap-2">
            <img
              className="w-8 md:w-12 h-auto"
              src="/warning.png"
              alt="warning"
            />
            <div className="">
              <p className="md:text-2xl">Expired</p>
              <p className="font-bold md:text-2xl">
                {statsData ? statsData?.data.expired : ""}
              </p>
            </div>
          </li>
        </ul>
        <PantryTable pantryEntries={entries} />
      </>
    );
  }

  return <InventoryAdditionView switchView={() => setMode("view")} />;
};

export default InventoryPage;
