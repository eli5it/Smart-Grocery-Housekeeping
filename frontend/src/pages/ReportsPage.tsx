import type { PantryStats } from "../lib/types";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const ReportsPage = () => {
  const getStats = () => {
    const token = localStorage.getItem("access_token");
    return axios.get<PantryStats>("/api/pantry/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const statsQuery = useQuery({ queryKey: ["stats"], queryFn: getStats });

  const { data: data } = statsQuery;

  const stats = data?.data;

  return (
    <>
      <h2 className="font-bold text-3xl mb-6">Summary</h2>
      <div className="flex justify-between gap-4">
        <div className="bg-light-green flex-1 px-4 py-2 lg:py-4 rounded-lg text-center flex flex-col justify-between">
          <p className="text-xl lg:text-2xl lg:mb-4">Items in Pantry</p>
          <p className="font-bold text-lg lg:text-2xl">
            {stats ? stats.total : ""}
          </p>
        </div>
        <div className="bg-yellow flex-1 px-4 py-2 lg:py-4 rounded-lg text-center flex flex-col justify-between">
          <p className="text-xl lg:text-2xl lg:mb-4">Expiring Soon</p>
          <p className="font-bold text-lg lg:text-2xl">
            {stats ? stats.total : ""}
          </p>
        </div>
        <div className="bg-light-red flex-1 px-4 py-2 lg:py-4 rounded-lg text-center flex flex-col justify-between">
          <p className="text-xl lg:text-2xl lg:mb-4">Expired</p>
          <p className="font-bold text-lg lg:text-2xl">
            {stats ? stats.total : ""}
          </p>
        </div>
      </div>
      <h2 className="font-bold text-3xl my-6">Charts</h2>
    </>
  );
};

export default ReportsPage;
