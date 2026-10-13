import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const mobileBottomNavItems = [
  { to: "/", icon: "dashboard", label: "Dashboard" },
  { to: "/results", icon: "warning", label: "Registry" },
  { to: "/upload", icon: "upload_file", label: "Upload" },
  { to: "/simulator", icon: "model_training", label: "Simulator" },
  { to: "/predict", icon: "person_search", label: "Predict" },
];

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body-md antialiased min-h-screen">
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 bg-surface-container-low border-b border-outline-variant flex justify-between items-center w-full px-3 sm:px-gutter h-14 z-50">
        <div className="flex items-center gap-2 sm:gap-gutter">
          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-1.5 -ml-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-md transition-colors"
            aria-label="Toggle navigation menu"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>

          <Link to="/" className="font-headline-md text-sm sm:text-headline-md font-bold text-on-surface flex items-center gap-1.5 sm:gap-2">
            <span className="material-symbols-outlined text-primary text-xl sm:text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              analytics
            </span>
            <span className="truncate tracking-tight">WorkforceIntel</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-component-gap-md">
          <Link
            to="/upload"
            className="flex items-center gap-1.5 bg-primary text-on-primary px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-md font-label-caps text-xs font-bold hover:bg-primary-fixed transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            <span className="hidden sm:inline">Upload CSV</span>
          </Link>
        </div>
      </header>

      {/* SideNavBar (Desktop persistent + Mobile slide-over drawer) */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content: responsive margin and padding, pb-20 on mobile for bottom bar */}
      <main className="md:ml-64 ml-0 pt-16 pb-24 md:pb-8 px-3.5 sm:px-6 md:px-8 min-h-screen flex flex-col gap-component-gap-md w-full max-w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar (Thumb-friendly for smartphone users) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-low/95 backdrop-blur-md border-t border-outline-variant flex items-center justify-around z-40 px-1 safe-area-bottom">
        {mobileBottomNavItems.map((item) => {
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] rounded-md transition-colors ${
                isActive
                  ? "text-primary font-bold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

