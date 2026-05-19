import type { FC, ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  icon?: ReactNode;
}

const StatCard: FC<StatCardProps> = ({ label, value, sub, accent, icon }) => (
  <div
    className={`rounded-xl border border-rx-border bg-rx-card p-6 transition hover:scale-[1.02] ${
      accent ? "border-rx-accent/40" : ""
    }`}
  >
    <div className="mb-3 flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rx-muted">
        {label}
      </p>
      {icon}
    </div>
    <p className={`text-3xl font-extrabold ${accent ? "text-rx-accent" : "text-white"}`}>
      {value}
    </p>
    {sub && <p className="mt-1 text-sm text-rx-muted">{sub}</p>}
  </div>
);

export default StatCard;
