// Displays expired pantry items on the dashboard
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { PantryEntry } from "../lib/types";

type ExpiryAPIResponse = {
  expired_items: PantryEntry[];
  expiring_items: PantryEntry[];
};

type DashboardExpiryProps = {
  mode: "expired" | "expiring";
};
const DashboardExpired = ({ mode }: DashboardExpiryProps) => {
  const getExpiredItems = () => {
    const token = localStorage.getItem("access_token");
    return axios.get<ExpiryAPIResponse>("/api/pantry/expired", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const expiredQuery = useQuery({
    queryKey: ["expired"],
    queryFn: getExpiredItems,
  });

  const { data } = expiredQuery;

  const pantryItems = data?.data[`${mode}_items`];

  let pantryObject: { [productName: string]: PantryEntry[] } = {};

  if (pantryItems) {
    pantryItems.reduce((prev, curr) => {
      if (!(curr.product_name in prev)) {
        prev[curr.product_name] = [curr];
      } else {
        prev[curr.product_name].push(curr);
      }
      return prev;
    }, pantryObject);
  }

  console.log(mode);

  if (pantryItems) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="bg-white m-auto w-[40%] px-3 py-2 rounded-2xl">
          <p className="font-bold text-center capitalize my-2 ">{mode} Items</p>
          <ul className="max-h-[350px] overflow-scroll">
            {Object.keys(pantryObject).map((key) => {
              return (
                <li key={key}>
                  <span className="mr-2">{pantryObject[key].length}x</span>
                  <span>{key}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
  return null;
};

export default DashboardExpired;
