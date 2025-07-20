import { Link } from "@tanstack/react-router";

const SplashPage = () => {
  return (
    <div className="bg-[#FDFCF5] min-h-screen flex flex-col items-center px-6 py-12">
      {/* Main Heading */}
      <h1 className="font-bold text-4xl text-center text-gray-900">
        Smart Grocery Housekeeping
      </h1>

      {/* Intro Text */}
      <p className="mt-4 max-w-2xl text-center text-lg text-gray-700">
        Take control of your pantry and reduce food waste. This app helps you track your groceries, get personalized recipes, and shop smarter — all at once!
      </p>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 my-6">
        <Link className="bg-lime-600 hover:bg-lime-700 text-white font-semibold px-6 py-3 rounded-2xl" to="/login">
          Login
        </Link>
        <Link className="bg-lime-600 hover:bg-lime-700 text-white font-semibold px-6 py-3 rounded-2xl" to="/register">
          Register
        </Link>
      </div>

      {/* Problem and Solution */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl text-center">
        <div>
          <img src="/apple.png" alt="Problem" className="mx-auto h-16 mb-2" />
          <h2 className="text-xl font-semibold">The Problem</h2>
          <p className="text-gray-700 mt-2">
            Wasted or expired groceries, and last-minute dinner stress
          </p>
        </div>
        <div>
          <img src="/shopping-bag.png" alt="Solution" className="mx-auto h-16 mb-2" />
          <h2 className="text-xl font-semibold">Our Solution</h2>
          <p className="text-gray-700 mt-2">
            Real-time pantry tracking, recipe recommendations, and shopping lists
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-16 max-w-5xl">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <img src="/scan.png" alt="Scan Items" className="mx-auto h-16 mb-2" />
            <h3 className="font-semibold">Scan or Log Items</h3>
            <p className="text-gray-700 text-sm mt-1">
              Quickly add items from your phone or computer
            </p>
          </div>
          <div>
            <img src="/recipe.png" alt="Recipe Ideas" className="mx-auto h-16 mb-2" />
            <h3 className="font-semibold">Get Recipe Ideas</h3>
            <p className="text-gray-700 text-sm mt-1">
              Instantly see meals you can make with what’s at hand
            </p>
          </div>
          <div>
            <img src="/schedule.png" alt="Track Pantry" className="mx-auto h-16 mb-2" />
            <h3 className="font-semibold">Track Pantry & Shop Smarter</h3>
            <p className="text-gray-700 text-sm mt-1">
              Receive reminders and create shopping lists
            </p>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="mt-16 max-w-4xl">
        <h2 className="text-2xl font-semibold text-center mb-6">Feature Highlights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          <div>
            ✅ Real-time Inventory<br />
            <span className="text-gray-600">Know what you have at a glance</span>
          </div>
          <div>
            ✅ Expiration Date Alerts<br />
            <span className="text-gray-600">Stay informed before food wastes</span>
          </div>
          <div>
            ✅ Custom Recipe Suggestions<br />
            <span className="text-gray-600">Personalized meal ideas</span>
          </div>
          <div>
            ✅ Smart Shopping Lists<br />
            <span className="text-gray-600">Plan grocery trips efficiently</span>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <footer className="mt-16 text-sm text-gray-500 text-center">
        Icons made by{" "}
        <a
          href="https://www.flaticon.com/authors/freepik"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          Freepik
        </a>{" "}
        from{" "}
        <a
          href="https://www.flaticon.com/"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          www.flaticon.com
        </a>
      </footer>
    </div>
  );
};

export default SplashPage;
