import { useState } from "react";
import { VEHICLES, type Vehicle } from "../data";
import { Badge, priorityVariant, ScreenWrapper, ScreenHeader, StatRow } from "../shared";

type RouteState = "original" | "alternate";

// ─── Vehicle Detail ───────────────────────────────────────────────────────────

function VehicleDetail({
  vehicle,
  routeState,
  onApply,
  onBack,
}: {
  vehicle: Vehicle;
  routeState: RouteState;
  onApply: () => void;
  onBack: () => void;
}) {
  const isAffected = vehicle.routeAffected;
  const applied = routeState === "alternate";

  return (
    <ScreenWrapper>
      <ScreenHeader
        title={`Vehicle ${vehicle.id}`}
        subtitle={`${vehicle.cargoType} · ${vehicle.origin} → ${vehicle.destination}`}
        onBack={onBack}
        actions={<Badge variant={priorityVariant(vehicle.priority)}>{vehicle.priority}</Badge>}
      />

      <div className="grid grid-cols-12 gap-4">
        {/* Left column */}
        <div className="col-span-8 flex flex-col gap-4">
          {/* Vehicle profile */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-3xl flex-shrink-0">
                🚐
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-black text-slate-900" style={{ fontFamily: "var(--font-jakarta)" }}>
                    {vehicle.id}
                  </h2>
                  <Badge variant={applied && isAffected ? "success" : isAffected ? "warning" : "success"}>
                    {applied && isAffected ? "Rerouted" : vehicle.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500">{vehicle.cargoType}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Driver: {vehicle.driver} · {vehicle.contact}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-5">
              {[
                { label: "Origin", value: vehicle.origin },
                { label: "Destination", value: vehicle.destination },
                { label: "Original ETA", value: vehicle.etaOriginal, strike: applied && isAffected },
                { label: "Updated ETA", value: vehicle.etaUpdated, highlight: isAffected },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1">{item.label}</p>
                  <p
                    className={`text-[12px] font-bold leading-snug ${
                      item.highlight ? (applied ? "text-amber-600" : "text-slate-700") : item.strike ? "text-slate-400 line-through" : "text-slate-800"
                    }`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Route status */}
          {isAffected && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3">Route Status</p>

              {/* Current / affected route */}
              <div className={`rounded-lg border p-3 mb-3 ${applied ? "bg-slate-50 border-slate-200" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Current Route</p>
                  <Badge variant={applied ? "default" : "danger"}>{applied ? "BYPASSED" : "BLOCKED"}</Badge>
                </div>
                <p className="text-[12px] text-slate-700 font-semibold">NH-10 · Teesta Valley Corridor</p>
                <div className="flex gap-4 mt-1">
                  <span className="text-[10px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>72 km</span>
                  <span className="text-[10px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>ETA: {vehicle.etaOriginal}</span>
                  <span className="text-[10px] text-red-500 font-semibold">Landslide Risk: 78%</span>
                </div>
              </div>

              {/* Alternate */}
              <div className={`rounded-lg border p-3 ${applied ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Alternate Route</p>
                  <Badge variant={applied ? "success" : "default"}>{applied ? "ACTIVE" : "RECOMMENDED"}</Badge>
                </div>
                <p className="text-[12px] text-slate-700 font-semibold">NH-717A · Rongli Bypass</p>
                <div className="flex gap-4 mt-1">
                  <span className="text-[10px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>89 km</span>
                  <span className="text-[10px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>ETA: {vehicle.etaUpdated}</span>
                  <span className="text-[10px] text-amber-600 font-semibold">+25 min delay</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-slate-500 font-medium">Route Progress</p>
                  <p className="text-[10px] font-bold text-slate-700" style={{ fontFamily: "var(--font-mono)" }}>{vehicle.progress}%</p>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${applied ? "bg-emerald-500" : "bg-blue-500"}`}
                    style={{ width: `${vehicle.progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-slate-400">Siliguri</span>
                  <span className="text-[9px] text-slate-400">Gangtok</span>
                </div>
              </div>

              {!applied && (
                <button
                  onClick={onApply}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg py-2.5 transition-colors"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  Apply Alternate Route for {vehicle.id}
                </button>
              )}
              {applied && (
                <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-semibold">Alternate route applied · ETA updated to {vehicle.etaUpdated}</p>
                </div>
              )}
            </div>
          )}

          {!isAffected && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 text-emerald-600">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm font-semibold">No disruption affecting this vehicle</p>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                {vehicle.id} is on a clear route with no active disruptions. ETA unchanged at {vehicle.etaOriginal}.
              </p>
            </div>
          )}
        </div>

        {/* Right: cargo + timeline */}
        <div className="col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3">Cargo Details</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Type", value: vehicle.cargoType },
                { label: "Priority", value: vehicle.priority },
                { label: "Cargo ID", value: vehicle.id + "-CARGO" },
                { label: "Perishable", value: vehicle.cargo.includes("Perishable") || vehicle.cargo.includes("Medicine") ? "Yes" : "No" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-[11px] py-1.5 border-b border-slate-50">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="font-semibold text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3">Live Status</p>
            <div className="flex flex-col gap-2">
              {[
                { time: "14:20", event: "Disruption detected on NH-10", icon: "⚠️" },
                { time: "14:29", event: `${vehicle.id} route flagged`, icon: "🚐" },
                { time: "14:31", event: "Alternate route recommended", icon: "🗺" },
                ...(applied ? [{ time: "14:33", event: "Route updated to NH-717A", icon: "✅" }] : []),
              ].map((e, i, arr) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[9px]">{e.icon}</div>
                    {i < arr.length - 1 && <div className="w-px h-3 bg-slate-200 mt-0.5" />}
                  </div>
                  <div className="flex gap-1.5">
                    <span className="text-[9px] text-blue-500 font-bold" style={{ fontFamily: "var(--font-mono)" }}>{e.time}</span>
                    <span className="text-[10px] text-slate-600">{e.event}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
}

// ─── Vehicle List ─────────────────────────────────────────────────────────────

function statusColor(s: string) {
  if (s === "En Route" || s === "On Schedule") return "text-emerald-600";
  if (s === "At Risk") return "text-amber-600";
  if (s === "Rerouted") return "text-blue-600";
  if (s === "Delayed") return "text-red-500";
  return "text-slate-600";
}

function statusDot(s: string) {
  if (s === "On Schedule") return "bg-emerald-400";
  if (s === "At Risk") return "bg-amber-400";
  if (s === "Rerouted") return "bg-blue-500";
  if (s === "Delayed") return "bg-red-400";
  return "bg-slate-400";
}

export function VehiclesScreen({
  routeState,
  onApply,
}: {
  routeState: RouteState;
  onApply: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const vehicle = selected ? VEHICLES.find((v) => v.id === selected) : null;

  if (vehicle) {
    return (
      <VehicleDetail
        vehicle={vehicle}
        routeState={routeState}
        onApply={onApply}
        onBack={() => setSelected(null)}
      />
    );
  }

  const affected = VEHICLES.filter((v) => v.routeAffected);
  const critical = VEHICLES.filter((v) => v.priority === "CRITICAL");

  return (
    <ScreenWrapper>
      <ScreenHeader
        title="Active Vehicles"
        subtitle="Real-time logistics fleet · North Eastern Region"
      />

      <StatRow
        items={[
          { label: "Total Active", value: "24", color: "text-slate-900" },
          { label: "Affected by Disruption", value: String(affected.length), color: "text-amber-600" },
          { label: "Critical Priority", value: String(critical.length), color: "text-red-600" },
          { label: "On Schedule", value: String(VEHICLES.filter((v) => !v.routeAffected).length), color: "text-emerald-600" },
        ]}
      />

      <div className="mt-4 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          {["Vehicle ID", "Cargo", "Destination", "Status", "Priority", "ETA", ""].map((h) => (
            <div
              key={h}
              className={`text-[9px] uppercase tracking-widest font-bold text-slate-400 ${h === "Cargo" ? "col-span-3" : h === "Destination" ? "col-span-3" : h === "" ? "col-span-1" : "col-span-2"}`}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {VEHICLES.map((v) => {
          const isApplied = routeState === "alternate" && v.routeAffected;
          const displayStatus = isApplied && v.id === "MED-07" ? "Rerouted" : v.status;

          return (
            <div
              key={v.id}
              className={`grid grid-cols-12 gap-3 px-4 py-3.5 border-b border-slate-50 cursor-pointer hover:bg-blue-50/50 transition-colors items-center ${v.priority === "CRITICAL" ? "bg-red-50/30" : ""}`}
              onClick={() => setSelected(v.id)}
            >
              <div className="col-span-2 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot(displayStatus)} blink`} />
                <span className="font-bold text-slate-900 text-[12px]" style={{ fontFamily: "var(--font-mono)" }}>{v.id}</span>
              </div>
              <div className="col-span-3">
                <p className="text-[11px] font-semibold text-slate-800">{v.cargo}</p>
                <p className="text-[10px] text-slate-400">{v.cargoType}</p>
              </div>
              <div className="col-span-3">
                <p className="text-[11px] text-slate-700 truncate">{v.destination}</p>
              </div>
              <div className="col-span-1">
                <span className={`text-[11px] font-semibold ${statusColor(displayStatus)}`}>{displayStatus}</span>
              </div>
              <div className="col-span-1">
                <Badge variant={priorityVariant(v.priority)}>{v.priority}</Badge>
              </div>
              <div className="col-span-1">
                <span
                  className={`text-[11px] font-bold ${isApplied ? "text-amber-600" : "text-slate-700"}`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {isApplied ? v.etaUpdated : v.etaOriginal}
                </span>
              </div>
              <div className="col-span-1 flex justify-end">
                <span className="text-[10px] text-blue-500 font-semibold">View →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Affected callout */}
      {routeState === "original" && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-amber-900" style={{ fontFamily: "var(--font-jakarta)" }}>
              {affected.length} vehicles affected by NH-10 disruption
            </p>
            <p className="text-[11px] text-amber-700">MED-07 is highest priority — carrying essential medicines to Gangtok</p>
          </div>
          <button
            onClick={onApply}
            className="bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-lg px-4 py-2 transition-colors flex-shrink-0"
          >
            Apply Alternate Route (All)
          </button>
        </div>
      )}
      {routeState === "alternate" && (
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">
            Alternate route applied — affected vehicles rerouted via NH-717A · ETAs updated
          </p>
        </div>
      )}
    </ScreenWrapper>
  );
}
