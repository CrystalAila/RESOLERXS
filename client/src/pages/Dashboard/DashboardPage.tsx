import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import { Spinner } from "../../components/Spinner/Spinner";
import type { DashboardStats, LowStockProduct } from "../../Interfaces/ReportInterface";
import type { SaleColumns } from "../../Interfaces/SaleInterface";
import ReportService from "../../services/ReportService";
import { formatCurrency, formatDate } from "../../utils/format";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [recentSales, setRecentSales] = useState<SaleColumns[]>([]);

  useEffect(() => {
    document.title = "Dashboard | RESOLERXS";
    ReportService.dashboard()
      .then((res) => {
        setStats(res.data.stats);
        setLowStock(res.data.low_stock_products);
        setRecentSales(res.data.recent_sales);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-rx-muted">Overview of your shoe store performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today's Revenue" value={formatCurrency(stats.today_revenue)} accent />
        <StatCard label="Today's Profit" value={formatCurrency(stats.today_profit)} />
        <StatCard label="Products" value={String(stats.total_products)} sub={`${stats.low_stock_count} low stock`} />
        <StatCard label="Inventory Value" value={formatCurrency(stats.inventory_value)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-rx-border bg-rx-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Low Stock Alerts</h2>
            <Link to="/inventory" className="text-xs font-semibold uppercase tracking-wider text-rx-accent hover:underline">
              View inventory
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-rx-muted">All products are above threshold.</p>
          ) : (
            <ul className="space-y-3">
              {lowStock.map((p) => (
                <li key={p.product_id} className="flex items-center justify-between border-b border-rx-border pb-3 last:border-0">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-rx-muted">{p.brand} · Size {p.size}</p>
                  </div>
                  <span className="rounded-full bg-rx-accent/20 px-3 py-1 text-xs font-bold text-rx-accent">
                    {p.quantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-rx-border bg-rx-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent Sales</h2>
            <Link to="/sales" className="text-xs font-semibold uppercase tracking-wider text-rx-accent hover:underline">
              New sale
            </Link>
          </div>
          {recentSales.length === 0 ? (
            <p className="text-sm text-rx-muted">No sales recorded yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentSales.map((sale) => (
                <li key={sale.sale_id} className="flex items-center justify-between border-b border-rx-border pb-3 last:border-0">
                  <div>
                    <p className="font-semibold">{formatCurrency(Number(sale.total_amount))}</p>
                    <p className="text-xs text-rx-muted">
                      {formatDate(sale.sale_date)} · {sale.user?.name}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-emerald-400">
                    +{formatCurrency(Number(sale.total_profit))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Month Revenue" value={formatCurrency(stats.month_revenue)} />
        <StatCard label="Month Profit" value={formatCurrency(stats.month_profit)} accent />
      </div>
    </div>
  );
};

export default DashboardPage;
