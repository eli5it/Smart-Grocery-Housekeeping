import { useQuery } from "@tanstack/react-query";
import type { WastedIngredient } from "../lib/types";
import axios from "axios";

type RecentWasteAPIResponse = {
  recent_waste: WastedIngredient[];
  count: number;
};
const RecentWaste = () => {
  const getRecentWaste = () => {
    const token = localStorage.getItem("access_token");
    return axios.get<RecentWasteAPIResponse>("/api/reports/recent-waste", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const recentWasteQuery = useQuery({
    queryKey: ["recentWaste"],
    queryFn: getRecentWaste,
  });

  const { data: data } = recentWasteQuery;

  const recentWaste = data?.data;

  const wastedItems = recentWaste?.recent_waste;
  if (wastedItems?.length !== 0) {
    return (
      <table className="min-w-full">
        <caption className="font-bold text-2xl text-left">
          Recently Wasted Items
        </caption>
        <thead>
          <tr>
            <th className="px-5 py-2 text-left" scope="col">
              Ingredient Name
            </th>
            <th className="px-5 py-2 text-left" scope="col">
              Date added
            </th>
            <th className="px-5 py-2 text-left" scope="col">
              Expiration Date
            </th>
          </tr>
        </thead>
        <tbody>
          {wastedItems?.map((item, idx) => {
            return (
              <tr className="border-t border-gray-500" key={idx}>
                <td className="px-5 py-2">{item.ingredient_name}</td>
                <td className="px-5 py-2">{item.date_added}</td>
                <td className="px-5 py-2">{item.expiration_date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  } else if (wastedItems?.length === 0) {
    return (
      <div>
        <p className="font-bold text-black text-3xl">No Wasted Items {":)"}</p>
      </div>
    );
  } else {
    return null;
  }
};

export default RecentWaste;
