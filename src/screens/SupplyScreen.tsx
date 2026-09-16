import { useState } from "react";
import { SUPPLY_ITEMS, type SupplyItem } from "../data";
import { Badge, priorityVariant, ScreenWrapper, ScreenHeader, StatRow } from "../shared";

type RouteState = "original" | "alternate";

const CATEGORY_ICON: Record<string, string> = {
  Healthcare: "💊",
  "Food Security": "🌾",
  Energy: "⚡",
};

function SupplyDetail({
  item,
  routeState,
  onApply,
  onBack,
}: {
  item: SupplyItem;
  routeState: RouteState;
  onApply: () => void;
  onBack: () => void;
}) {
  const applied = routeState === "alternate";

  return (
    <ScreenWrapper>
      <ScreenHeader
        title={item.commodity}
        subtitle={`${item.category} · Vehicle ${item.vehicleId}`}
        onBack={onBack}
        actions={<Badge variant={priorityVariant(item.priority)}>{item.priority}</Badge>}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 flex flex-col gap-4">
          {/* Overview card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
                {CATEGORY_ICON[item.category] || "📦"}
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900" style={{ fontFamily: "var(--font-jakarta)" }}>
                  {item.commodity}
                </h2>
                <p className="text-[11px] text-slate-500">
                  {item.origin} → {item.destination}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Carrier: {item.vehicleId} · Delivery ID: {item.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Original ETA", value: item.etaOriginal, strike: applied },
                { label: "Updated ETA", value: item.etaUpdated, highlight: true },
                { label: "Delay", value: item.delay, warn: true },
              ].map((f) => (
                <div key={f.label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1">{f.label}</p>
                  <p
                    className={`text-base font-black ${f.warn ? "text-amber-600" : f.highlight ? (applied ? "text-amber-600" : "text-slate-800") : f.strike ? "text-slate-400 line-through" : "text-slate-800"}`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {f.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3">Supply Chain Impact</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                <p className="text-[9px] text-red-400 uppercase tracking-wider font-semibold mb-1">Critical Impact</p>
                <p className="text-sm font-bold text-red-800">{item.impact}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <p className="text-[9px] text-blue-400 uppercase tracking-wider font-semibold mb-1">Beneficiaries</p>
                <p className="text-sm font-bold text-blue-800">{item.beneficiaries}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold mb-2">Affected Districts</p>
              <div className="flex gap-2 flex-wrap">
                {item.districts.map((d) => (
                  <span key={d} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-1 rounded-lg">
                    📍 {d}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Route / resolution */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3">Resolution</p>
            {item.alternateAvailable ? (
              <>
                <div className={`rounded-lg p-3 mb-3 border ${applied ? "bg-emerald-50 border-emerald-200" : "bg-blue-50 border-blue-100"}`}>
                  <p className="text-[10px] font-bold text-blue-800 mb-1">
                    {applied ? "✅ Alternate route applied" : "🗺 Alternate route available"}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {applied
                      ? `${item.vehicleId} rerouted via NH-717A · ETA updated to ${item.etaUpdated}`
                      : `NH-717A Rongli Bypass can bypass the NH-10 disruption with a ${item.delay} delay.`}
                  </p>
                </div>
                {!applied && (
                  <button
                    onClick={onApply}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg py-2.5 transition-colors"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    Apply Alternate Route → Update ETA
                  </button>
                )}
              </>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-[10px] font-bold text-amber-800 mb-1">⚠ No direct alternate available</p>
                <p className="text-[11px] text-amber-700">
                  Fuel tanker requires specialized road clearance. Contingency: draw from Rangpo emergency reserve (48h capacity).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3">Delivery Info</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Delivery ID", value: item.id },
                { label: "Vehicle", value: item.vehicleId },
                { label: "Category", value: item.category },
                { label: "Alt. Route", value: item.alternateAvailable ? "Available" : "Not Available" },
              ].map((f) => (
                <div key={f.label} className="flex justify-between text-[11px] py-1.5 border-b border-slate-50">
                  <span className="text-slate-400">{f.label}</span>
                  <span className={`font-semibold ${f.label === "Alt. Route" ? (item.alternateAvailable ? "text-emerald-600" : "text-red-500") : "text-slate-700"}`}>
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3">Priority Justification</p>
            <div className={`rounded-lg p-3 ${item.priority === "CRITICAL" ? "bg-red-50 border border-red-100" : item.priority === "HIGH" ? "bg-amber-50 border border-amber-100" : "bg-blue-50 border border-blue-100"}`}>
              <Badge variant={priorityVariant(item.priority)}>{item.priority} PRIORITY</Badge>
              <p className="text-[11px] text-slate-700 mt-2 leading-snug">{item.impact}</p>
            </div>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
}

export function SupplyScreen({
  routeState,
  onApply,
}: {
  routeState: RouteState;
  onApply: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const item = selected ? SUPPLY_ITEMS.find((s) => s.id === selected) : null;

  if (item) {
    return <SupplyDetail item={item} routeState={routeState} onApply={onApply} onBack={() => setSelected(null)} />;
  }

  const critical = SUPPLY_ITEMS.filter((s) => s.priority === "CRITICAL").length;
  const delayed = SUPPLY_ITEMS.filter((s) => s.delay !== "0").length;

  return (
    <ScreenWrapper>
      <ScreenHeader
        title="Supply Impact"
        subtitle="Essential commodity delivery status during NH-10 disruption"
      />

      <StatRow
        items={[
          { label: "Active Deliveries", value: String(SUPPLY_ITEMS.length), color: "text-slate-900" },
          { label: "Critical", value: String(critical), color: "text-red-600" },
          { label: "Delayed", value: String(delayed), color: "text-amber-600" },
          { label: "Alternate Available", value: String(SUPPLY_ITEMS.filter((s) => s.alternateAvailable).length), color: "text-emerald-600" },
        ]}
      />

      {/* Commodity cards */}
      <div className="mt-4 flex flex-col gap-3">
        {SUPPLY_ITEMS.map((s) => {
          const applied = routeState === "alternate";
          return (
            <div
              key={s.id}
              className={`bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all ${s.priority === "CRITICAL" ? "border-red-200" : "border-slate-100"}`}
              onClick={() => setSelected(s.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                    {CATEGORY_ICON[s.category] || "📦"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-jakarta)" }}>{s.commodity}</p>
                      <Badge variant={priorityVariant(s.priority)}>{s.priority}</Badge>
                    </div>
                    <p className="text-[11px] text-slate-500">{s.origin} → {s.destination}</p>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {s.districts.map((d) => (
                        <span key={d} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">📍 {d}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider">ETA</p>
                      <p
                        className={`text-[13px] font-black ${applied ? "text-amber-600" : "text-slate-800"}`}
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {applied ? s.etaUpdated : s.etaOriginal}
                      </p>
                    </div>
                    {applied && (
                      <div className="text-right">
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider">Delay</p>
                        <p className="text-[11px] font-bold text-amber-600" style={{ fontFamily: "var(--font-mono)" }}>{s.delay}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-medium ${s.alternateAvailable ? "text-emerald-600" : "text-red-500"}`}>
                      {s.alternateAvailable ? "✓ Alt. route available" : "✗ No alternate"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                <p className="text-[10px] text-slate-500">{s.impact}</p>
                <span className="text-[10px] text-blue-500 font-semibold">View impact →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall CTA */}
      {routeState === "original" && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-amber-900" style={{ fontFamily: "var(--font-jakarta)" }}>
              3 of 4 supply deliveries can be rerouted now
            </p>
            <p className="text-[11px] text-amber-700">Applying alternate route minimises delay to +25–40 min across all deliveries</p>
          </div>
          <button
            onClick={onApply}
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg px-4 py-2 transition-colors flex-shrink-0"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            Apply Alternate Route
          </button>
        </div>
      )}
    </ScreenWrapper>
  );
}
