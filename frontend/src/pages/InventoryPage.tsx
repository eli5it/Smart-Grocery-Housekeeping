import type { PantryListItem } from "../lib/types";
import PantryTable from "../components/PantryTable";
import { useState } from "react";
import InventoryAdditionView from "./Inventory_addition_page";

const InventoryPage = () => {
  const [mode, setMode] = useState<"add" | "view">("view");
  const expiringCount = 3;
  const expiredCount = 4;
  const totalItemCount = 5;

  const pantryItems: PantryListItem[] = [
    {
      product_name: "Milk",
      ingredient_name: "Milk",
      expiration_date: "01/01/2025",
    },
    {
      product_name: "Milk",
      ingredient_name: "Milk",
      expiration_date: "01/01/2025",
    },
    {
      product_name: "Milk",
      ingredient_name: "Milk",
      expiration_date: "01/01/2025",
    },
    {
      product_name: "Milk",
      ingredient_name: "Milk",
      expiration_date: "01/01/2025",
    },
    {
      product_name: "Milk",
      ingredient_name: "Milk",
      expiration_date: "01/01/2025",
    },
    {
      product_name: "Milk",
      ingredient_name: "Milk",
      expiration_date: "01/01/2025",
    },
    {
      product_name: "Milk",
      ingredient_name: "Milk",
      expiration_date: "01/01/2025",
    },
  ];

  // this is a really hacky solution, should replace w/subroutes later
  if (mode == "view") {
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
              <p className="font-bold md:text-2xl">{totalItemCount}</p>
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
              <p className="font-bold md:text-2xl">{expiringCount}</p>
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
              <p className="font-bold md:text-2xl">{expiredCount}</p>
            </div>
          </li>
        </ul>
        <PantryTable entries={pantryItems} />
      </>
    );
  }

  return <InventoryAdditionView switchView={() => setMode("view")} />;
};

export default InventoryPage;
