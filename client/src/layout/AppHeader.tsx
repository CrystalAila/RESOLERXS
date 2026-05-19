import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useHeader } from "../contexts/HeaderContext";
import { useSidebar } from "../contexts/SidebarContext";
import ReportService from "../services/ReportService";

const AppHeader = () => {
  const { isOpen, toggleUserMenu } = useHeader();
  const { toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    ReportService.dashboard()
      .then((res) => setLowStockCount(res.data.stats.low_stock_count))
      .catch(() => setLowStockCount(0));
  }, []);

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await logout();
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={toggleUserMenu} />
      )}
      <header className="fixed top-0 right-0 left-0 z-40 border-b border-rx-border bg-rx-bg/90 backdrop-blur-md sm:left-64">
        <div className="flex items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-lg p-2 text-rx-muted hover:bg-white/5 sm:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
              </svg>
            </button>
            {lowStockCount > 0 && (
              <span className="rounded-full bg-rx-accent/20 px-3 py-1 text-xs font-semibold text-rx-accent">
                {lowStockCount} low stock alert{lowStockCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={toggleUserMenu}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5"
            >
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs uppercase tracking-wider text-rx-muted">
                  {user?.role}
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rx-accent text-sm font-bold text-white">
                {user?.name?.charAt(0) ?? "R"}
              </div>
            </button>
            <div
              className={`absolute right-0 top-12 min-w-48 rounded-lg border border-rx-border bg-rx-card py-2 shadow-xl ${
                isOpen ? "block" : "hidden"
              }`}
            >
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5 disabled:opacity-50"
              >
                {isLoading ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default AppHeader;
