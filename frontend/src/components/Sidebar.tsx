import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@udecode/cn";
import ModalContainer from "./ModalContainer";
import { House, ChefHat, Camera, ClipboardMinus } from "lucide-react";
import { Apple } from "lucide-react";

type MobileSidebarProps = {
  toggleSidebarVisibility: () => void;
  showMobileSidebar: boolean;
};

const MobileSidebar = ({
  toggleSidebarVisibility,
  showMobileSidebar,
}: MobileSidebarProps) => {
  // This component is rendered on screens with viewports < 768px
  // It displays a modal containing navigation links

  return (
    <div className="absolute top-4 left-4 md:hidden">
      <button
        className={cn("menu-icon h-10 w-10 relative cursor-pointer", {
          open: showMobileSidebar,
        })}
        onClick={toggleSidebarVisibility}
      >
        <div className="bar absolute top left-0 right-0 h-1 bg-black rounded-[2px] top-3"></div>
        <div className="bar absolute bottom left-0 right-0 h-1 bg-black rounded-[2px] bottom-3"></div>
      </button>

      {showMobileSidebar && (
        <ModalContainer close={toggleSidebarVisibility}>
          <nav className="flex flex-col items-center justify-center px-2 py-3 h-full">
            <ul className="flex flex-col font-bold gap-6 text-3xl">
              <li className="hover:text-blue-800">
                <Link to="/app/dashboard">Dashboard</Link>
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

const DesktopSidebar = () => {
  // This Component is hidden when a viewport width is < 768px
  // It displays a navbar full of navigation links to all of the application's
  return (
    <aside className="hidden px-10 md:flex md:flex-col md:absolute">
      <div className="flex items-center gap-2 mb-5">
        <Apple />
        <p>Welcome back!</p>
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
