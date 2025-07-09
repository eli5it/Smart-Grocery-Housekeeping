import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@udecode/cn";
import ModalContainer from "./ModalContainer";
import { House, ChefHat, Camera, ClipboardMinus, Milk } from "lucide-react";
import "./SidebarIcon.css";

type MobileSidebarProps = {
  toggleSidebarVisibility: () => void;
  showMobileSidebar: boolean;
};
const MobileSidebar = ({
  toggleSidebarVisibility,
  showMobileSidebar,
}: MobileSidebarProps) => {
  return (
    <div className="absolute top-4 left-4 md:hidden">
      <button
        className={cn("menu-icon", {
          open: showMobileSidebar,
        })}
        onClick={toggleSidebarVisibility}
      >
        <div className="bar top"></div>
        <div className="bar bottom"></div>
      </button>
      {showMobileSidebar && (
        <ModalContainer close={toggleSidebarVisibility}>
          <nav className="flex flex-col items-center justify-center px-2 py-3 h-full">
            <ul className="flex flex-col font-bold gap-6 text-3xl">
              <li className="hover:text-blue-800">
                <Link to="/app/dashboard">Dashboard</Link>
              </li>
              <li className="hover:text-blue-800">
                <Link to="/app/groceries">Groceries</Link>
              </li>
              <li className="hover:text-blue-800">
                <Link to="/app/inventory">Inventory</Link>
              </li>
              <li className="hover:text-blue-800">
                <Link to="/app/recipes">Recipes</Link>
              </li>
              <li className="hover:text-blue-800">
                <Link to="/app/reports">Reports</Link>
              </li>
            </ul>
          </nav>
        </ModalContainer>
      )}
    </div>
  );
};

// dashboard, inventory, recipes, reports
const DesktopSidebar = () => {
  return (
    <aside className="hidden px-10 md:flex md:flex-col md:absolute">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-10 h-10 rounded-full border border-black"></div>
        <p>Hi, Friend {";)"}</p>
      </div>
      <ul className="flex flex-col gap-3 px-2.5">
        <li className="flex text-xl gap-1.5 items-center">
          <House />
          <Link className="hover:text-blue-700" to="/app/dashboard">
            Dashboard
          </Link>
        </li>
        <li className="flex text-xl gap-1.5 items-center">
          <Camera />
          <Link className="hover:text-blue-700" to="/app/inventory">
            Inventory
          </Link>
        </li>
        <li className="flex text-xl gap-1.5 items-center">
          <Milk />
          <Link className="hover:text-blue-700" to="/app/groceries">
            Groceries
          </Link>
        </li>
        <li className="flex text-xl gap-1.5 items-center">
          <ChefHat />
          <Link className="hover:text-blue-700" to="/app/recipes">
            Recipes
          </Link>
        </li>
        <li className="flex text-xl gap-1.5 items-center">
          <ClipboardMinus />
          <Link className="hover:text-blue-700" to="/app/reports">
            Reports
          </Link>
        </li>
      </ul>
    </aside>
  );
};

// sidebar component, should be visible on larger viewports, collapsible on mobile
const Sidebar = () => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  return (
    <>
      <MobileSidebar
        toggleSidebarVisibility={() => setShowMobileSidebar(!showMobileSidebar)}
        showMobileSidebar={showMobileSidebar}
      />
      <DesktopSidebar></DesktopSidebar>
    </>
  );
};

export default Sidebar;
