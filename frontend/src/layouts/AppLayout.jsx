import { Outlet, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  return (
    <div className="bg-surface-container-lowest text-on-surface font-body-md antialiased min-h-screen">
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 bg-surface-container-low border-b border-outline-variant flex justify-between items-center w-full px-gutter h-14 z-50">
        <div className="flex items-center gap-gutter">
          <Link to="/" className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              analytics
            </span>
            WorkforceIntel
          </Link>
          <div className="hidden md:flex items-center gap-component-gap-md ml-4 text-on-surface-variant text-body-sm">
            <span className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant text-xs font-mono text-primary">
              Model v1.0.4
            </span>
          </div>
        </div>

        <div className="flex items-center gap-component-gap-md">
          <Link
            to="/upload"
            className="hidden md:flex items-center gap-2 bg-primary text-on-primary px-3 py-1.5 rounded-md font-label-caps text-xs font-bold hover:bg-primary-fixed transition-colors"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            Upload CSV
          </Link>
        </div>
      </header>

      {/* SideNavBar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 pt-16 p-container-padding min-h-screen flex flex-col gap-component-gap-md">
        <Outlet />
      </main>
    </div>
  );
}
