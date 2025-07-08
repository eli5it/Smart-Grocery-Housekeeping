import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@udecode/cn";
import ModalContainer from "./ModalContainer";
import "./SidebarIcon.css";

type SidebarModalProps = {};

// link order
// Dashboard, Groceries, Inventory, Recipes, Reports

// sidebar component, should be visible on larger viewports, collapsible on mobile
const Sidebar = () => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  return (
    <div>
      <button
        className={cn("menu-icon", {
          open: showMobileSidebar,
        })}
        onClick={() => {
          setShowMobileSidebar(!showMobileSidebar);
        }}
      >
        <div className="bar top"></div>
        <div className="bar bottom"></div>
      </button>
      {showMobileSidebar && (
        <ModalContainer close={() => setShowMobileSidebar(false)}>
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

export default Sidebar;
