import { Badge, ScreenWrapper, ScreenHeader, StatRow } from "../shared";

type RouteState = "original" | "alternate";

const ROUTE_SEGMENTS = [
  { name: "Siliguri — Sevoke", distance: "18 km", condition: "Clear", score: 92, status: "ok" },
  { name: "Sevoke — Teesta Bazaar", distance: "14 km", condition: "Wet Roads", score: 68, status: "warn" },
  { name: "Teesta Bazaar — Singtam", distance: "22 km", condition: "BLOCKED", score: 32, status: "danger" },
  { name: "Singtam — Ranipool", distance: "10 km", condition: "Moderate Risk", score: 55, status: "warn" },
  { name: "Ranipool — Gangtok", distance: "8 km", condition: "Clear", score: 88, status: "ok" },
];

const ALT_SEGMENTS = [
  { name: "Siliguri — Sevoke", distance: "18 km", condition: "Clear", score: 92, status: "ok" },
  { name: "Sevoke — Kalimpong", distance: "24 km", condition: "Clear", score: 85, status: "ok" },
  { name: "Kalimpong — Rongli", distance: "32 km", condition: "Good", score: 80, status: "ok" },
  { name: "Rongli — Ranipool", distance: "7 km", condition: "Clear", score: 91, status: "ok" },
  { name: "Ranipool — Gangtok", distance: "8 km", condition: "Clear", score: 88, status: "ok" },
];

function scoreColor(s: number) {
  if (s >= 75) return "text-emerald-600";
  if (s >= 50) return "text-amber-600";
  return "text-red-600";
}

function scoreBar(s: number) {
  if (s >= 75) return "bg-emerald-500";
  if (s >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function statusBg(s: string) {
  if (s === "ok") return "bg-emerald-50 border-emerald-100";
  if (s === "warn") return "bg-amber-50 border-amber-100";
  return "bg-red-50 border-red-100";
}

export function RoutesScreen({
  routeState,
  onApply,
}: {
  routeState: RouteState;
  onApply: () => void;
}) {
  const applied = routeState === "alternate";

  return (
    <ScreenWrapper>
      <ScreenHeader
        title="Route Intelligence"
        subtitle="AI-powered route analysis and rerouting · NH-10 Corridor"
        actions={
          applied ? (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 blink" />
              <span className="text-[11px] font-semibold text-emerald-700">Alternate Route Active</span>
            </div>
          ) : undefined
        }
      />

      <StatRow
        items={[
          { label: "Primary Route", value: "72 km", color: applied ? "text-slate-400" : "text-slate-900" },
          { label: "Alternate Route", value: "89 km", color: applied ? "text-emerald-600" : "text-slate-900" },
          { label: "Extra Distance", value: "+17 km", color: "text-amber-600" },
          { label: "Time Difference", value: "+25 min", color: "text-amber-600" },
        ]}
      />

      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Primary route (NH-10) */}
        <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${applied ? "border-slate-200 opacity-80" : "border-red-200"}`}>
          <div className={`px-4 py-3 flex items-center justify-between ${applied ? "bg-slate-50" : "bg-red-50"}`}>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[11px] font-black text-slate-700 uppercase tracking-wider">NH-10 · Primary Route</p>
                <Badge variant={applied ? "default" : "danger"}>{applied ? "BYPASSED" : "DISRUPTED"}</Badge>
              </div>
              <p className="text-[10px] text-slate-500">Siliguri → Teesta Valley → Gangtok</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-slate-800" style={{ fontFamily: "var(--font-jakarta)" }}>72 km</p>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>ETA: 2h 10m</p>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-2">
            {ROUTE_SEGMENTS.map((seg) => (
              <div key={seg.name} className={`rounded-lg border p-3 ${statusBg(seg.status)}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-800">{seg.name}</p>
                    <p className="text-[9px] text-slate-500">{seg.distance}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-bold ${scoreColor(seg.score)}`} style={{ fontFamily: "var(--font-mono)" }}>
                      {seg.score}/100
                    </p>
                    <p className={`text-[9px] font-semibold ${seg.status === "danger" ? "text-red-600" : seg.status === "warn" ? "text-amber-600" : "text-emerald-600"}`}>
                      {seg.condition}
                    </p>
                  </div>
                </div>
                <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${scoreBar(seg.score)}`} style={{ width: `${seg.score}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 pb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-[10px] font-bold text-red-700 mb-1">Why this route is unsafe</p>
              <ul className="flex flex-col gap-1">
                {["Heavy rainfall (82 mm/hr)", "Landslide probability 78%", "Road obstruction at Singtam"].map((r) => (
                  <li key={r} className="text-[10px] text-red-600 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Alternate route */}
        <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${applied ? "border-emerald-300" : "border-slate-200"}`}>
          <div className={`px-4 py-3 flex items-center justify-between ${applied ? "bg-emerald-50" : "bg-blue-50"}`}>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[11px] font-black text-slate-700 uppercase tracking-wider">NH-717A · Alternate Route</p>
                <Badge variant={applied ? "success" : "info"}>{applied ? "ACTIVE" : "AI RECOMMENDED"}</Badge>
              </div>
              <p className="text-[10px] text-slate-500">Siliguri → Kalimpong → Rongli → Gangtok</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-slate-800" style={{ fontFamily: "var(--font-jakarta)" }}>89 km</p>
              <p className="text-[10px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>ETA: 2h 35m</p>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-2">
            {ALT_SEGMENTS.map((seg) => (
              <div key={seg.name} className={`rounded-lg border p-3 ${statusBg(seg.status)}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-800">{seg.name}</p>
                    <p className="text-[9px] text-slate-500">{seg.distance}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-bold ${scoreColor(seg.score)}`} style={{ fontFamily: "var(--font-mono)" }}>
                      {seg.score}/100
                    </p>
                    <p className={`text-[9px] font-semibold text-emerald-600`}>{seg.condition}</p>
                  </div>
                </div>
                <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${scoreBar(seg.score)}`} style={{ width: `${seg.score}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 pb-4">
            {applied ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-700">All affected vehicles rerouted</p>
                  <p className="text-[9px] text-emerald-600">MED-07, AGR-12, FUL-03 now on NH-717A</p>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-[10px] font-bold text-blue-700 mb-1">Why this route is safe</p>
                <ul className="flex flex-col gap-1">
                  {["No active disruptions", "Avg accessibility score: 87/100", "Avoids Teesta Valley corridor"].map((r) => (
                    <li key={r} className="text-[10px] text-blue-600 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-4">
        {applied ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900" style={{ fontFamily: "var(--font-jakarta)" }}>
                  Alternate route is now active
                </p>
                <p className="text-[11px] text-emerald-700">
                  3 vehicles rerouted · Updated ETA +25 min · Avoids all high-risk zones
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-emerald-700" style={{ fontFamily: "var(--font-jakarta)" }}>2h 35m</p>
              <p className="text-[10px] text-emerald-500">Updated ETA</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-blue-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-jakarta)" }}>
                AI recommends switching to NH-717A immediately
              </p>
              <p className="text-[11px] text-slate-500">
                Confidence: 94% · 3 vehicles affected · +25 min delay vs road closure risk
              </p>
            </div>
            <button
              onClick={onApply}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg px-5 py-2.5 transition-colors flex-shrink-0"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Apply Alternate Route →
            </button>
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
}
