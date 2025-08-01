import { Link } from "@tanstack/react-router";
const DashboardPage = () => {
  return (
    <>
      <h1 className="font-bold text-center md:text-left text-3xl">Dashboard</h1>
      <div className="py-7">
        <div className="flex justify-center gap-4">
          <div className="flex flex-col flex-1/2">
            <div className="bg-lighter-green px-6 py-6 lg:py-12 mb-6 rounded-lg flex gap-2 flex-1/2">
              <img
                className="w-13 lg:w-36 xl:w-44 h-auto"
                src="/hourglass.png"
                alt="hourglass"
              />
              <p className="font-bold text-2xl lg:text-4xl xl:text-6xl lg:self-center">
                4 Items Expiring Soon
              </p>
            </div>
            <div className="bg-light-blue flex flex-1/2 rounded-lg min-h-[112px] px-6 py-6 gap-2">
              <img
                className="w-13 lg:w-48 xl:w-44 h-auto"
                src="/warning.png"
                alt="warning"
              />
              <p className="font-bold text-2xl lg:text-4xl xl:text-6xl lg:self-center">
                5 Expired Items
              </p>
            </div>
          </div>
          <div className="flex-1/2 flex flex-col items-center justify-center gap-4">
            <img
              className="w-24 lg:w-48 xl:w-60 h-auto"
              src="/calendar.png"
              alt="Calendar"
            />
            <Link
              className="font-bold text-2xl bg-light-red px-6 py-5 rounded-2xl"
              to="/app/reports"
            >
              View Reports
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
