import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", icon: "dashboard", label: "Dashboard" },
  { to: "/upload", icon: "dataset", label: "Ingestion Workbench" },
  { to: "/results", icon: "warning", label: "Risk Registry" },
  { to: "/simulator", icon: "model_training", label: "Simulator" },
  { to: "/predict", icon: "person_search", label: "Single Predict" },
  { to: "/history", icon: "history", label: "History" },
];

export default function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant flex flex-col pt-16 pb-4 z-40">
      <div className="px-4 py-3 mb-2 flex items-center gap-3 border-b border-outline-variant">
        <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden flex-shrink-0 border border-outline-variant flex items-center justify-center text-primary font-bold text-xs">
          HQ
        </div>
        <div className="flex flex-col">
          <span className="font-body-sm text-body-sm font-bold text-on-surface truncate">
            Operations
          </span>
          <span className="font-label-caps text-xs text-on-surface-variant">
            Enterprise Mode
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-component-gap-md px-3.5 py-2 transition-all duration-150 ease-in-out text-body-sm rounded-md ${
                isActive
                  ? "text-primary bg-surface-container font-bold border-l-4 border-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low border-l-4 border-transparent"
              }`
            }
          >
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {item.icon}
            </span>
            <span className="font-label-caps text-xs uppercase tracking-wider">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
