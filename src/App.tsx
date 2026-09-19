import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";


import React, { useState, type ReactNode } from "react";
import { VehiclesScreen } from "./screens/VehiclesScreen";
import { RoutesScreen } from "./screens/RoutesScreen";
import { SupplyScreen } from "./screens/SupplyScreen";
import { ControlRoomScreen } from "./screens/ControlRoomScreen";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "dashboard" | "vehicles" | "routes" | "supply" | "disruption" | "controlroom";
type RouteState = "original" | "alternate";

// ─── Inline Icons ─────────────────────────────────────────────────────────────

const Icon = {
  Overview: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  Network: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2" fill="currentColor" />
      <circle cx="3" cy="3" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="13" cy="3" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="3" cy="13" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="13" cy="13" r="1.5" fill="currentColor" opacity="0.6" />
      <line x1="8" y1="8" x2="3" y2="3" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="8" y1="8" x2="13" y2="3" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="8" y1="8" x2="3" y2="13" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="8" y1="8" x2="13" y2="13" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  ),
  Vehicle: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="5" width="14" height="7" rx="2" fill="currentColor" opacity="0.9" />
      <rect x="4" y="3" width="8" height="4" rx="1" fill="currentColor" opacity="0.5" />
      <circle cx="4.5" cy="12.5" r="1.5" fill="currentColor" />
      <circle cx="11.5" cy="12.5" r="1.5" fill="currentColor" />
    </svg>
  ),
  Disruption: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L14.5 13H1.5L8 2Z" fill="currentColor" opacity="0.8" />
      <line x1="8" y1="6.5" x2="8" y2="9.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="#fff" />
    </svg>
  ),
  Routes: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 13 C4 13 4 3 8 3 C12 3 12 13 14 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="2" cy="13" r="1.5" fill="currentColor" />
      <circle cx="14" cy="13" r="1.5" fill="currentColor" />
    </svg>
  ),
  Supply: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="6" width="12" height="8" rx="1.5" fill="currentColor" opacity="0.8" />
      <rect x="5" y="3" width="6" height="5" rx="1" fill="currentColor" opacity="0.5" />
      <line x1="8" y1="8" x2="8" y2="12" stroke="#fff" strokeWidth="1.2" />
      <line x1="5.5" y1="10" x2="10.5" y2="10" stroke="#fff" strokeWidth="1.2" />
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2C9 2 4 4 4 10V13H14V10C14 4 9 2 9 2Z" fill="currentColor" opacity="0.7" />
      <path d="M7.5 13C7.5 13.8 8.17 14.5 9 14.5C9.83 14.5 10.5 13.8 10.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <line x1="9" y1="2" x2="9" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Check: () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ─── Badge (local copy for Dashboard) ─────────────────────────────────────────

function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "danger" | "warning" | "success" | "info";
}) {
  const styles: Record<string, string> = {
    default: "bg-slate-100 text-slate-700",
    danger: "bg-red-50 text-red-700 border border-red-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${styles[variant]}`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {children}
    </span>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
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

// ─── Map SVG ──────────────────────────────────────────────────────────────────
// ─── Real GIS Map ─────────────────────────────────────────────────────────────

function NexRouteMap({
  routeState,
  onDisruptionClick,
}: {
  routeState: RouteState;
  onDisruptionClick: () => void;
}) {
  // Siliguri → Gangtok demo coordinates
  // These are geographic coordinates used for the MVP visualization.
  const siliguri: [number, number] = [26.7271, 88.3953];

  const gangtok: [number, number] = [27.3389, 88.6065];

  // Current route — simplified demo geometry
  const currentRoute: [number, number][] = [
    [26.7271, 88.3953],
    [26.82, 88.42],
    [26.92, 88.47],
    [27.02, 88.51],
    [27.12, 88.55],
    [27.22, 88.58],
    [27.3389, 88.6065],
  ];

  // Alternate route — simplified demo geometry
  const alternateRoute: [number, number][] = [
    [26.7271, 88.3953],
    [26.79, 88.34],
    [26.88, 88.37],
    [26.99, 88.43],
    [27.10, 88.48],
    [27.21, 88.55],
    [27.3389, 88.6065],
  ];

  // Approximate disruption location for the MVP scenario
  const disruption: [number, number] = [27.02, 88.51];

  // Vehicle position changes after alternate route is applied
  const vehiclePosition: [number, number] =
    routeState === "original"
      ? [26.92, 88.47]
      : [26.88, 88.37];

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <MapContainer
        center={gangtok}
        zoom={9}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        {/* OpenStreetMap base map */}
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Current / original route */}
        <Polyline
          positions={currentRoute}
          pathOptions={{
            color: routeState === "original" ? "#3B82F6" : "#EF4444",
            weight: routeState === "original" ? 5 : 3,
            opacity: routeState === "original" ? 1 : 0.45,
            dashArray: routeState === "original" ? undefined : "8 8",
          }}
        />

        {/* Alternate route */}
        <Polyline
          positions={alternateRoute}
          pathOptions={{
            color: routeState === "alternate" ? "#10B981" : "#94A3B8",
            weight: routeState === "alternate" ? 5 : 3,
            opacity: routeState === "alternate" ? 1 : 0.65,
            dashArray: routeState === "alternate" ? undefined : "6 6",
          }}
        />

        {/* Siliguri origin */}
        <CircleMarker
          center={siliguri}
          radius={7}
          pathOptions={{
            color: "#334155",
            fillColor: "#475569",
            fillOpacity: 1,
            weight: 2,
          }}
        >
          <Popup>
            <strong>Siliguri</strong>
            <br />
            Vehicle origin
          </Popup>
        </CircleMarker>

        {/* Gangtok destination */}
        <CircleMarker
          center={gangtok}
          radius={9}
          pathOptions={{
            color: "#4C1D95",
            fillColor: "#7C3AED",
            fillOpacity: 1,
            weight: 2,
          }}
        >
          <Popup>
            <strong>Gangtok Medical Supply Hub</strong>
            <br />
            Essential goods destination
          </Popup>
        </CircleMarker>

        {/* Disruption marker */}
        <CircleMarker
          center={disruption}
          radius={13}
          pathOptions={{
            color: "#EF4444",
            fillColor: "#FECACA",
            fillOpacity: 0.8,
            weight: 3,
          }}
          eventHandlers={{
            click: onDisruptionClick,
          }}
        >
          <Popup>
            <strong>⚠ Landslide Risk</strong>
            <br />
            NH-10 corridor
            <br />
            <span className="text-slate-500">
              Click to view disruption details
            </span>
          </Popup>
        </CircleMarker>

        {/* Vehicle marker */}
        <CircleMarker
          center={vehiclePosition}
          radius={10}
          pathOptions={{
            color: routeState === "original" ? "#2563EB" : "#059669",
            fillColor: routeState === "original" ? "#DBEAFE" : "#D1FAE5",
            fillOpacity: 1,
            weight: 3,
          }}
        >
          <Popup>
            <strong>MED-07</strong>
            <br />
            Essential Medicines
            <br />
            Destination: Gangtok Medical Supply Hub
            <br />
            Status:{" "}
            {routeState === "original"
              ? "Affected by disruption"
              : "Rerouted"}
          </Popup>
        </CircleMarker>
      </MapContainer>

      {/* Live / demo status */}
      <div className="absolute top-3 right-10 z-[1000] flex items-center gap-1.5 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-sm">
        <div className="w-2 h-2 rounded-full bg-emerald-500 blink" />
        <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
          Live Map
        </span>
      </div>

      {/* Map legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2.5 shadow-sm">
        <div className="text-[9px] font-bold text-slate-500 tracking-wider mb-2">
          MAP LEGEND
        </div>

        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-5 h-1 rounded bg-blue-500" />
          <span className="text-[9px] text-slate-600">
            Current Route
          </span>
        </div>

        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-5 h-1 rounded bg-emerald-500" />
          <span className="text-[9px] text-slate-600">
            Alternate Route
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-200" />
          <span className="text-[9px] text-slate-600">
            Disruption
          </span>
        </div>
      </div>

      {/* Map source */}
      <div className="absolute bottom-1 right-2 z-[1000] text-[8px] text-slate-500 bg-white/80 px-1.5 py-0.5 rounded">
        © OpenStreetMap contributors
      </div>
    </div>
  );
}

// ─── Accessibility Panel ──────────────────────────────────────────────────────

function AccessibilityPanel() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Road Segment</p>
          <p className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-jakarta)" }}>NH-10 Corridor</p>
        </div>
        <Badge variant="danger">HIGH RISK</Badge>
      </div>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Before</p>
          <div className="relative h-2 bg-emerald-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "91%" }} />
          </div>
          <p className="text-[11px] font-bold text-emerald-600 mt-1" style={{ fontFamily: "var(--font-mono)" }}>91/100</p>
        </div>
        <div className="text-slate-300 mb-4">→</div>
        <div className="flex-1">
          <p className="text-[9px] text-red-400 uppercase tracking-wider mb-1">Current</p>
          <div className="relative h-2 bg-red-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: "32%" }} />
          </div>
          <p className="text-[11px] font-bold text-red-600 mt-1" style={{ fontFamily: "var(--font-mono)" }}>32/100</p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {[
          { label: "Heavy rainfall", icon: "🌧" },
          { label: "Landslide probability: 78%", icon: "⛰" },
          { label: "Road obstruction reported", icon: "🚧" },
        ].map((r) => (
          <div key={r.label} className="flex items-center gap-2 text-[11px] text-slate-600">
            <span>{r.icon}</span>
            <span>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Route Card ───────────────────────────────────────────────────────────────

function RouteCard({ routeState, onApply }: { routeState: RouteState; onApply: () => void }) {
  const applied = routeState === "alternate";
  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">AI</span>
        </div>
        <p className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-jakarta)" }}>
          AI Recommended Route
        </p>
      </div>
      <div className={`rounded-lg p-3 border ${applied ? "bg-red-50 border-red-100" : "bg-blue-50 border-blue-100"}`}>
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Current Route</p>
          <Badge variant={applied ? "danger" : "info"}>{applied ? "BLOCKED" : "ACTIVE"}</Badge>
        </div>
        <p className="text-[11px] text-slate-700 font-medium">NH-10 via Teesta Valley</p>
        <div className="flex gap-3 mt-1.5">
          <span className="text-[10px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>72 km</span>
          <span className="text-[10px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>ETA: 2h 10m</span>
        </div>
      </div>
      <div className={`rounded-lg p-3 border ${applied ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Recommended Alternative</p>
          <Badge variant={applied ? "success" : "default"}>{applied ? "ACTIVE" : "SUGGESTED"}</Badge>
        </div>
        <p className="text-[11px] text-slate-700 font-medium">Via NH-717A · Rongli Bypass</p>
        <div className="flex gap-3 mt-1.5">
          <span className="text-[10px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>89 km</span>
          <span className="text-[10px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>ETA: 2h 35m</span>
          <span className="text-[10px] text-amber-600 font-semibold" style={{ fontFamily: "var(--font-mono)" }}>+25 min</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Avoids high-risk NH-10 corridor</p>
      </div>
      {applied ? (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 text-white">
            <Icon.Check />
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">Alternate route applied</p>
        </div>
      ) : (
        <button
          onClick={onApply}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg py-2.5 transition-colors"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Apply Alternate Route
        </button>
      )}
    </div>
  );
}

// ─── Vehicle Card ─────────────────────────────────────────────────────────────

function VehicleCard({ routeState }: { routeState: RouteState }) {
  const applied = routeState === "alternate";
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-lg">🚐</div>
          <div>
            <p className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-jakarta)" }}>MED-07</p>
            <p className="text-[10px] text-slate-400">Essential Medicines · Refrigerated</p>
          </div>
        </div>
        <Badge variant="danger">CRITICAL</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Destination", value: "Gangtok Medical Hub", full: true },
          { label: "Current ETA", value: "2h 10m", strikethrough: applied },
          { label: "Updated ETA", value: "2h 35m", highlight: applied },
        ].map((item) => (
          <div key={item.label} className={`${item.full ? "col-span-2" : ""} flex flex-col gap-0.5`}>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">{item.label}</p>
            <p
              className={`text-[11px] font-semibold ${
                item.highlight ? "text-amber-600" : item.strikethrough ? "text-slate-400 line-through" : "text-slate-700"
              }`}
              style={{ fontFamily: (item.strikethrough || item.highlight) ? "var(--font-mono)" : undefined }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
      {applied && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 blink" />
          <p className="text-[10px] text-emerald-600 font-semibold">Route automatically updated</p>
        </div>
      )}
    </div>
  );
}

// ─── Impact Panel ─────────────────────────────────────────────────────────────

function ImpactPanel() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-3">
      <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Predicted Impact</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { value: "1", label: "Major corridor", color: "text-red-600" },
          { value: "6", label: "Vehicles affected", color: "text-amber-600" },
          { value: "2", label: "Supply delays", color: "text-orange-600" },
          { value: "1", label: "Alt. corridor", color: "text-emerald-600" },
        ].map((item) => (
          <div key={item.label} className="flex flex-col">
            <p className={`text-xl font-black ${item.color}`} style={{ fontFamily: "var(--font-jakarta)" }}>{item.value}</p>
            <p className="text-[10px] text-slate-500 leading-tight">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function Timeline({ routeState }: { routeState: RouteState }) {
  const events = [
    { time: "14:20", label: "Heavy rainfall detected", icon: "🌧" },
    { time: "14:24", label: "Landslide risk increased", icon: "⛰" },
    { time: "14:27", label: "NH-10 accessibility reduced", icon: "⚠️" },
    { time: "14:29", label: "MED-07 route affected", icon: "🚐" },
    { time: "14:31", label: "Alternate route recommended", icon: "✅" },
    ...(routeState === "alternate"
      ? [{ time: "14:33", label: "Route applied — MED-07 rerouted", icon: "🗺️" }]
      : []),
  ];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-2">
      <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">Event Timeline</p>
      <div className="flex flex-col gap-1.5">
        {events.map((e, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[9px]">{e.icon}</div>
              {i < events.length - 1 && <div className="w-px h-3 bg-slate-200 mt-0.5" />}
            </div>
            <div className="flex gap-1.5 items-baseline">
              <span className="text-[9px] text-blue-500 font-bold flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{e.time}</span>
              <span className="text-[10px] text-slate-600 leading-snug">{e.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Disruption Details Screen ────────────────────────────────────────────────

function DisruptionScreen({
  onBack,
  routeState,
  onApply,
}: {
  onBack: () => void;
  routeState: RouteState;
  onApply: () => void;
}) {
  const [simulated, setSimulated] = useState(routeState === "alternate");
  const applied = simulated || routeState === "alternate";

  const handleSimulate = () => {
    setSimulated(true);
    onApply();
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-5 overflow-y-auto" style={{ animation: "fade-in 0.3s ease-out" }}>
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
          ← Back
        </button>
        <div className="h-4 w-px bg-slate-200" />
        <span className="text-sm text-slate-400">Disruption Details</span>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 flex flex-col gap-4">
          {/* Header */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">Active Disruption</span>
                </div>
                <h2 className="text-xl font-black text-slate-900" style={{ fontFamily: "var(--font-jakarta)" }}>
                  Landslide Risk — NH-10 Corridor
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">Detected at 14:20 · Sikkim-West Bengal Border Section</p>
              </div>
              <Badge variant="danger">SEVERITY: HIGH</Badge>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Disruption Type", value: "Landslide Risk", icon: "⛰" },
                { label: "Affected Corridor", value: "NH-10 · 34km", icon: "🛣" },
                { label: "Accessibility Score", value: "32 / 100", icon: "📊" },
                { label: "Probability", value: "78%", icon: "📈" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1 bg-slate-50 rounded-lg p-3">
                  <span className="text-base">{item.icon}</span>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">{item.label}</p>
                  <p className="text-sm font-bold text-slate-800" style={{ fontFamily: "var(--font-mono)" }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weather + vehicles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3">Weather Conditions</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: "Rainfall", value: "82 mm/hr", status: "Critical", color: "text-red-600" },
                  { label: "Visibility", value: "< 200m", status: "Poor", color: "text-red-500" },
                  { label: "Wind Speed", value: "34 km/h", status: "Moderate", color: "text-amber-600" },
                  { label: "Soil Saturation", value: "94%", status: "Dangerous", color: "text-red-700" },
                ].map((w) => (
                  <div key={w.label} className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-600">{w.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-800" style={{ fontFamily: "var(--font-mono)" }}>{w.value}</span>
                      <span className={`text-[9px] font-semibold uppercase ${w.color}`}>{w.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3">Affected Vehicles</p>
              <div className="flex flex-col gap-2">
                {[
                  { id: "MED-07", cargo: "Essential Medicines", priority: "CRITICAL", color: "border-red-200 bg-red-50" },
                  { id: "AGR-12", cargo: "Food Supplies", priority: "HIGH", color: "border-amber-200 bg-amber-50" },
                  { id: "FUL-03", cargo: "Fuel Tanker", priority: "HIGH", color: "border-amber-200 bg-amber-50" },
                ].map((v) => (
                  <div key={v.id} className={`rounded-lg border px-3 py-2 ${v.color} flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🚐</span>
                      <div>
                        <p className="text-[11px] font-bold text-slate-800">{v.id}</p>
                        <p className="text-[9px] text-slate-500">{v.cargo}</p>
                      </div>
                    </div>
                    <Badge variant={v.priority === "CRITICAL" ? "danger" : "warning"}>{v.priority}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Supply impact */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3">Predicted Supply Impact</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Medical Supplies Delayed", risk: "HIGH", desc: "2 hospitals affected" },
                { label: "Food Supply Disruption", risk: "MEDIUM", desc: "3 districts impacted" },
                { label: "Fuel Distribution", risk: "MEDIUM", desc: "Emergency reserve: 48h" },
              ].map((s) => (
                <div key={s.label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <Badge variant={s.risk === "HIGH" ? "danger" : "warning"}>{s.risk}</Badge>
                  <p className="text-[11px] font-semibold text-slate-800 mt-2 leading-snug">{s.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">AI</span>
              </div>
              <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Recommended Action</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 mb-3">
              <p className="text-[11px] text-blue-900 font-semibold leading-snug">
                Reroute all critical vehicles via NH-717A Rongli Bypass immediately.
              </p>
              <p className="text-[10px] text-blue-600 mt-1">Confidence: 94% · 3 models agree</p>
            </div>
            <div className="flex flex-col gap-1.5 mb-3">
              {[
                "Estimated delay: +25 min",
                "Route condition: Good",
                "No active disruptions on alt.",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-100 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[10px] text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Simulate */}
          <div className={`rounded-xl border shadow-sm p-4 ${applied ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-100"}`}>
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2">What-If Simulation</p>
            {applied ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                    <Icon.Check />
                  </div>
                  <p className="text-[11px] text-emerald-700 font-bold">Road closure simulated</p>
                </div>
                <div className="bg-emerald-100 rounded-lg p-2.5 flex flex-col gap-1">
                  <p className="text-[10px] text-emerald-800 font-semibold">Vehicles affected: 3</p>
                  <p className="text-[10px] text-emerald-800 font-semibold">Supplies rerouted: 3 of 4</p>
                  <p className="text-[10px] text-emerald-800 font-semibold">New ETA: 2h 35m (+25 min)</p>
                  <p className="text-[10px] text-emerald-800 font-semibold">Alt. Route: NH-717A active</p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[10px] text-slate-500 mb-3">Simulate a full road closure to see real-time rerouting impact.</p>
                <button
                  onClick={handleSimulate}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg py-2.5 transition-colors"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  Simulate Road Closure
                </button>
              </>
            )}
          </div>

          <RouteCard routeState={applied ? "alternate" : "original"} onApply={onApply} />
        </div>
      </div>
    </div>
  );
}

// ─── Overview Dashboard ───────────────────────────────────────────────────────

function Dashboard({
  routeState,
  onApplyRoute,
  onDisruptionClick,
  onVehiclesClick,
  onRoutesClick,
  onSupplyClick,
}: {
  routeState: RouteState;
  onApplyRoute: () => void;
  onDisruptionClick: () => void;
  onVehiclesClick: () => void;
  onRoutesClick: () => void;
  onSupplyClick: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-5 pt-4 pb-3 flex flex-col gap-3 flex-shrink-0">
        <div className="grid grid-cols-4 gap-3">
          <KpiCard label="Network Status" value="87%" sub="Accessible" accent="text-emerald-600" />
          <KpiCard label="Active Vehicles" value="24" sub="6 affected" accent="text-amber-600" onClick={onVehiclesClick} />
          <KpiCard label="Active Disruptions" value="3" sub="1 critical" accent="text-red-500" onClick={onDisruptionClick} />
          <KpiCard label="Critical Supply Routes" value="5" sub="2 at risk" accent="text-amber-600" onClick={onSupplyClick} />
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">⚠</span>
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900" style={{ fontFamily: "var(--font-jakarta)" }}>
                High-risk disruption detected
              </p>
              <p className="text-[11px] text-amber-700">Heavy rainfall and landslide risk affecting NH-10 corridor</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-[10px] text-amber-500 font-medium">Detected 12 min ago</span>
            <button
              onClick={onDisruptionClick}
              className="bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-semibold rounded-lg px-3 py-1.5 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 px-5 pb-5 overflow-hidden">
        <div className="flex-1 min-w-0">
          <NexRouteMap routeState={routeState} onDisruptionClick={onDisruptionClick} />
        </div>
        <div className="w-72 flex flex-col gap-3 overflow-y-auto flex-shrink-0">
          <AccessibilityPanel />
          <RouteCard routeState={routeState} onApply={onApplyRoute} />
          <VehicleCard routeState={routeState} />
          <ImpactPanel />
          <Timeline routeState={routeState} />
        </div>
      </div>
    </div>
  );
}

// ─── Nav Items ────────────────────────────────────────────────────────────────

const NAV_ITEMS: { label: string; icon: () => React.ReactElement; screen: Screen; badge?: string }[] = [
  { label: "Overview", icon: Icon.Overview, screen: "dashboard" },
  { label: "Network Monitoring", icon: Icon.Network, screen: "dashboard" },
  { label: "Vehicles", icon: Icon.Vehicle, screen: "vehicles" },
  { label: "Disruptions", icon: Icon.Disruption, screen: "disruption", badge: "3" },
  { label: "Routes", icon: Icon.Routes, screen: "routes" },
  { label: "Supply Impact", icon: Icon.Supply, screen: "supply" },
];

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [routeState, setRouteState] = useState<RouteState>("original");

  const applyRoute = () => setRouteState("alternate");

  const nav = (s: Screen) => setScreen(s);

  const activeLabel = () => {
    if (screen === "dashboard") return "Overview";
    if (screen === "vehicles") return "Vehicles";
    if (screen === "disruption") return "Disruptions";
    if (screen === "routes") return "Routes";
    if (screen === "supply") return "Supply Impact";
    if (screen === "controlroom") return "Control Room";
    return "";
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-inter)", background: "#F1F5F9" }}>
      {/* TOP NAV */}
      <header className="flex-shrink-0 h-14 bg-white border-b border-slate-200 flex items-center px-5 gap-4 z-10 shadow-sm">
        <div className="flex items-center gap-2 mr-2 cursor-pointer" onClick={() => nav("dashboard")}>
          <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
            <span className="text-white font-black text-xs" style={{ fontFamily: "var(--font-jakarta)" }}>NX</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-extrabold text-slate-900" style={{ fontFamily: "var(--font-jakarta)" }}>NexRoute</span>
            <span className="text-[9px] text-slate-400 uppercase tracking-widest">Logistics Intelligence</span>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-blue-100 transition-colors">
          <span className="text-blue-700 text-[11px] font-semibold">🗺</span>
          <span className="text-blue-800 text-[12px] font-semibold">North Eastern Region</span>
          <span className="text-blue-400">
            <Icon.ChevronDown />
          </span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 blink" />
          <span className="text-[10px] text-slate-600 font-semibold">SYSTEM LIVE</span>
        </div>

        <button className="relative w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
          <Icon.Bell />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
        </button>

        <button
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 rounded-lg px-3 py-1.5 cursor-pointer transition-colors"
          onClick={() => nav("controlroom")}
        >
          <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center">
            <span className="text-white text-[9px] font-bold">CR</span>
          </div>
          <span className="text-white text-[11px] font-semibold">Control Room</span>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-52 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col py-4 gap-1">
          {NAV_ITEMS.map(({ label, icon: NavIcon, screen: s, badge }) => {
            const isActive = activeLabel() === label;
            return (
              <button
                key={label}
                onClick={() => nav(s)}
                className={`flex items-center gap-2.5 mx-2 px-3 py-2.5 rounded-lg text-left transition-colors text-[12px] font-medium ${
                  isActive ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className={isActive ? "text-white" : "text-slate-400"}>
                  <NavIcon />
                </div>
                {label}
                {badge && (
                  <span className={`ml-auto text-[9px] font-bold rounded px-1.5 py-0.5 ${isActive ? "bg-white/20 text-white" : "bg-red-100 text-red-600"}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="mt-auto px-4 pt-4 border-t border-slate-100 mx-2">
            <div className="flex flex-col gap-0.5">
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Data Source</p>
              <p className="text-[10px] text-slate-600 font-medium">IMD · NRSC · NIC Sikkim</p>
              <p className="text-[9px] text-slate-400 mt-0.5">Last sync: 14:33 IST</p>
            </div>
          </div>
        </aside>

        {/* SCREEN CONTENT */}
        {screen === "dashboard" && (
          <Dashboard
            routeState={routeState}
            onApplyRoute={applyRoute}
            onDisruptionClick={() => nav("disruption")}
            onVehiclesClick={() => nav("vehicles")}
            onRoutesClick={() => nav("routes")}
            onSupplyClick={() => nav("supply")}
          />
        )}
        {screen === "vehicles" && (
          <VehiclesScreen routeState={routeState} onApply={applyRoute} />
        )}
        {screen === "routes" && (
          <RoutesScreen routeState={routeState} onApply={applyRoute} />
        )}
        {screen === "supply" && (
          <SupplyScreen routeState={routeState} onApply={applyRoute} />
        )}
        {screen === "disruption" && (
          <DisruptionScreen
            onBack={() => nav("dashboard")}
            routeState={routeState}
            onApply={applyRoute}
          />
        )}
        {screen === "controlroom" && (
          <ControlRoomScreen
            routeState={routeState}
            onApply={applyRoute}
            onDisruptionClick={() => nav("disruption")}
            onVehiclesClick={() => nav("vehicles")}
            onRoutesClick={() => nav("routes")}
          />
        )}
      </div>
    </div>
  );
}
