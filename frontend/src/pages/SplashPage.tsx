import { Link } from "@tanstack/react-router";

const SplashPage = () => {
  return (
    <>
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 p-20 min-h-screen">
        <h1 className="font-bold text-4xl text-center text-white">
          Smart Grocery Housekeeping
        </h1>
        <main className="p-4 mt-8 flex flex-col items-center text-xl text-white">
          <p className="max-w-xl text-center">
            This will be the landing page for Smart Grocery Housekeeping.
            Potential users, and users who are not currently logged in will be
            redirected here. They will likely want access to the login or home
            pages. Good thing there are links below!
          </p>
          <div className="flex justify-center gap-4 my-7">
            <Link className="bg-lime-700 p-3 rounded-2xl" to="/login">
              Login
            </Link>
            <Link className="bg-lime-700 p-3 rounded-2xl" to="/register">
              Register
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default SplashPage;
