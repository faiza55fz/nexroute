import type { ReactNode } from "react";
import type { Priority } from "./data";

// ─── Badge ────────────────────────────────────────────────────────────────────

export type BadgeVariant = "default" | "danger" | "warning" | "success" | "info" | "purple";

export function Badge({ children, variant = "default" }: { children: ReactNode; variant?: BadgeVariant }) {
  const styles: Record<BadgeVariant, string> = {
    default: "bg-slate-100 text-slate-600",
    danger: "bg-red-50 text-red-700 border border-red-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${styles[variant]}`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {children}
    </span>
  );
}

export function priorityVariant(p: Priority): BadgeVariant {
  return p === "CRITICAL" ? "danger" : p === "HIGH" ? "warning" : p === "MEDIUM" ? "info" : "default";
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

export function KpiCard({
  label,
  value,
  sub,
  accent,
  onClick,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col gap-1 min-w-0 ${onClick ? "cursor-pointer hover:border-blue-200 hover:shadow-md transition-all" : ""}`}
      onClick={onClick}
    >
      <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{label}</span>
      <span className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-jakarta)" }}>
        {value}
      </span>
      {sub && <span className={`text-[11px] font-medium ${accent || "text-slate-400"}`}>{sub}</span>}
      {onClick && <span className="text-[9px] text-blue-400 mt-0.5">Click to view →</span>}
    </div>
  );
}

// ─── Screen Wrapper ───────────────────────────────────────────────────────────

export function ScreenWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto p-5" style={{ animation: "fade-in 0.3s ease-out" }}>
      {children}
    </div>
  );
}

// ─── Screen Header ────────────────────────────────────────────────────────────

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  actions,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        {onBack && (
          <>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
            >
              ← Back
            </button>
            <div className="h-4 w-px bg-slate-200" />
          </>
        )}
        <div>
          <h1 className="text-lg font-extrabold text-slate-900" style={{ fontFamily: "var(--font-jakarta)" }}>
            {title}
          </h1>
          {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ─── Stat Row ─────────────────────────────────────────────────────────────────

export function StatRow({
  items,
}: {
  items: { label: string; value: string; color?: string }[];
}) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
      {items.map((item) => (
        <div key={item.label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{item.label}</p>
          <p
            className={`text-2xl font-black ${item.color || "text-slate-900"}`}
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

export const Icons = {
  Check: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Arrow: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Clock: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 3.5V6L7.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
};
