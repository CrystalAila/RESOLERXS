import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";

const navItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/inventory", label: "Inventory" },
  { path: "/sales", label: "Sales" },
  { path: "/reports", label: "Reports" },
  { path: "/users", label: "Users" },
];

const AppSidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const location = useLocation();

  return (
    <>
      {!isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 sm:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 border-r border-rx-border bg-rx-surface transition-transform ${
          isOpen ? "-translate-x-full" : "translate-x-0"
        } sm:translate-x-0`}
      >
        <div className="flex h-full flex-col px-4 py-6">
          <Link to="/dashboard" className="mb-10 px-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rx-muted">
              Shoe Store
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              RESOLER<span className="text-rx-accent">XS</span>
            </h1>
          </Link>
          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 640 && toggleSidebar()}
                  className={`rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
                    active
                      ? "bg-rx-accent text-white"
                      : "text-rx-muted hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
