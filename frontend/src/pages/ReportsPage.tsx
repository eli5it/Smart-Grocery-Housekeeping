import type { PantryStats } from "../lib/types";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import PieChart from "../components/PieChart";
import RecentWaste from "../components/RecentWaste";

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

  // contains stats for entries currently in the pantry
  let currentPieChartData;

  // contains stats for discarded/used entriess
  let outOfStockPieChartData;

  if (stats) {
    const { expiring, expired, total, used, discarded } = stats;

    currentPieChartData = [
      {
        name: "Available",
        value: total - (expiring + expired),
        color: "#2E7D32",
      },
      {
        name: "Expired",
        value: expired,
        color: "#C62828",
      },
      {
        name: "Expiring",
        value: expiring,
        color: "#F9A825",
      },
    ];

    outOfStockPieChartData = [
      {
        name: "Used",
        value: used,
        color: "#2E7D32",
      },
      {
        name: "Discarded",
        value: discarded,
        color: "#C62828",
      },
    ];
  }

  return (
    <>
      <h2 className="font-bold text-3xl mb-6">Summary</h2>
      <div className="flex justify-between gap-4">
        <div className="bg-light-green flex-1 px-4 py-2 lg:py-4 rounded-lg text-center flex flex-col justify-between">
          <p className="text-xl lg:text-2xl lg:mb-4">Items in Pantry</p>
          <p className="font-bold text-lg lg:text-2xl">
            {stats ? stats.available : ""}
          </p>
        </div>
        <div className="bg-yellow flex-1 px-4 py-2 lg:py-4 rounded-lg text-center flex flex-col justify-between">
          <p className="text-xl lg:text-2xl lg:mb-4">Expiring Soon</p>
          <p className="font-bold text-lg lg:text-2xl">
            {stats ? stats.expiring : ""}
          </p>
        </div>
        <div className="bg-light-red flex-1 px-4 py-2 lg:py-4 rounded-lg text-center flex flex-col justify-between">
          <p className="text-xl lg:text-2xl lg:mb-4">Expired</p>
          <p className="font-bold text-lg lg:text-2xl">
            {stats ? stats.expired : ""}
          </p>
        </div>
      </div>
      <h2 className="font-bold text-3xl my-6">Charts</h2>
      <section className="flex flex-col items-center md:flex-row">
        {currentPieChartData && <PieChart data={currentPieChartData} />}
        {outOfStockPieChartData && <PieChart data={outOfStockPieChartData} />}
      </section>
      <section>
        <h2 className="font-bold text-3xl my-6">Tables</h2>
        <RecentWaste />
      </section>
    </>
  );
};

export default ReportsPage;
