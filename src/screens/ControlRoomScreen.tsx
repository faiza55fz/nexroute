import { ACTIVE_DISRUPTIONS, VEHICLES, SUPPLY_ITEMS } from "../data";
import { Badge, priorityVariant, ScreenWrapper, ScreenHeader } from "../shared";

type RouteState = "original" | "alternate";

function severityColor(s: string) {
  if (s === "HIGH") return "text-red-600";
  if (s === "MEDIUM") return "text-amber-600";
  return "text-slate-500";
}

function severityBar(score: number) {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

export function ControlRoomScreen({
  routeState,
  onApply,
  onDisruptionClick,
  onVehiclesClick,
  onRoutesClick,
}: {
  routeState: RouteState;
  onApply: () => void;
  onDisruptionClick: () => void;
  onVehiclesClick: () => void;
  onRoutesClick: () => void;
}) {
  const applied = routeState === "alternate";
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} IST`;

  return (
    <ScreenWrapper>
      <ScreenHeader
        title="Control Room"
        subtitle={`Operational Intelligence Dashboard · ${timeStr} · North Eastern Region`}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 blink" />
              <span className="text-[10px] font-bold text-emerald-700">LIVE MONITORING</span>
            </div>
            <div className="bg-slate-900 text-white text-[10px] font-bold rounded-lg px-2.5 py-1.5" style={{ fontFamily: "var(--font-mono)" }}>
              {timeStr}
            </div>
          </div>
        }
      />

      {/* Top KPI strip */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {[
          { label: "Network Coverage", value: "87%", sub: "Accessible", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "Active Disruptions", value: "3", sub: "1 critical", color: "text-red-600", bg: "bg-red-50 border-red-100" },
          { label: "Vehicles En Route", value: "24", sub: "6 affected", color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
          { label: "Supply Deliveries", value: "4", sub: "3 delayed", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
          { label: "Alerts", value: "7", sub: "2 unresolved", color: "text-slate-700", bg: "bg-slate-50 border-slate-200" },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl border p-3 ${item.bg}`}>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">{item.label}</p>
            <p className={`text-2xl font-black ${item.color}`} style={{ fontFamily: "var(--font-jakarta)" }}>{item.value}</p>
            <p className="text-[10px] text-slate-500">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Active disruptions */}
        <div className="col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Active Disruptions</p>
              <Badge variant="danger">3 ACTIVE</Badge>
            </div>
            <div className="divide-y divide-slate-50">
              {ACTIVE_DISRUPTIONS.map((d) => (
                <div
                  key={d.id}
                  className={`p-4 cursor-pointer hover:bg-blue-50/50 transition-colors ${d.id === "D-001" ? "bg-red-50/40" : ""}`}
                  onClick={d.id === "D-001" ? onDisruptionClick : undefined}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${d.severity === "HIGH" ? "bg-red-500 blink" : d.severity === "MEDIUM" ? "bg-amber-400" : "bg-slate-400"}`} />
                      <p className="text-[12px] font-bold text-slate-900">{d.type}</p>
                    </div>
                    <Badge variant={priorityVariant(d.severity)}>{d.severity}</Badge>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2 ml-4">{d.location}</p>
                  <div className="ml-4 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Accessibility</p>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${severityBar(d.score)}`} style={{ width: `${d.score}%` }} />
                        </div>
                        <span className={`text-[10px] font-bold ${severityColor(d.severity)}`} style={{ fontFamily: "var(--font-mono)" }}>
                          {d.score}/100
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400">Detected {d.detected}</p>
                      <p className="text-[9px] text-blue-500">{d.vehicles} vehicles →</p>
                    </div>
                  </div>
                  {d.id === "D-001" && (
                    <div className="mt-2 ml-4">
                      <button
                        onClick={onDisruptionClick}
                        className="text-[10px] font-semibold text-red-600 hover:text-red-800 transition-colors"
                      >
                        View full disruption details →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current alerts */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
              <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Current Alerts</p>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {[
                { msg: "NH-10 landslide risk elevated to HIGH", time: "14:27", type: "danger" },
                { msg: "MED-07 ETA revised — alternate route recommended", time: "14:31", type: "warning" },
                { msg: "IMD: Rainfall forecast 80+ mm for next 3 hours", time: "14:22", type: "warning" },
                { msg: "Flash flood watch: NH-717A Teesta tributary", time: "13:55", type: "info" },
                { msg: "Sevoke Bridge load capacity advisory issued", time: "13:40", type: "info" },
              ].map((alert, i) => (
                <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-lg ${alert.type === "danger" ? "bg-red-50" : alert.type === "warning" ? "bg-amber-50" : "bg-blue-50"}`}>
                  <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center mt-0.5 ${alert.type === "danger" ? "bg-red-500" : alert.type === "warning" ? "bg-amber-500" : "bg-blue-500"}`}>
                    <span className="text-white text-[8px] font-bold">!</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-700 font-medium leading-snug">{alert.msg}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{alert.time} IST</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Critical vehicles + recommended actions */}
        <div className="col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Affected Vehicles</p>
              <button
                onClick={onVehiclesClick}
                className="text-[10px] text-blue-500 font-semibold hover:text-blue-700 transition-colors"
              >
                View all →
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {VEHICLES.filter((v) => v.routeAffected).map((v) => (
                <div
                  key={v.id}
                  className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={onVehiclesClick}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${v.priority === "CRITICAL" ? "bg-red-500 blink" : "bg-amber-400"}`} />
                    <div>
                      <p className="text-[12px] font-bold text-slate-900" style={{ fontFamily: "var(--font-mono)" }}>{v.id}</p>
                      <p className="text-[9px] text-slate-400">{v.cargo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={priorityVariant(v.priority)}>{v.priority}</Badge>
                    <span className="text-[10px] font-bold text-amber-600" style={{ fontFamily: "var(--font-mono)" }}>
                      {applied ? v.etaUpdated : v.etaOriginal}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supply routes */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Critical Supply Routes</p>
            </div>
            <div className="divide-y divide-slate-50">
              {SUPPLY_ITEMS.slice(0, 3).map((s) => (
                <div key={s.id} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-bold text-slate-800">{s.commodity}</p>
                    <Badge variant={priorityVariant(s.priority)}>{s.priority}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{s.destination}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 line-through" style={{ fontFamily: "var(--font-mono)" }}>{s.etaOriginal}</span>
                      <span className="text-[10px] font-bold text-amber-600" style={{ fontFamily: "var(--font-mono)" }}>{applied ? s.etaUpdated : "—"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended actions */}
        <div className="col-span-3 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[8px] font-black">AI</span>
              </div>
              <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">Recommended Actions</p>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {[
                {
                  id: 1,
                  action: "Reroute MED-07 via NH-717A immediately",
                  reason: "Critical medicine delivery — hospitals at risk",
                  urgency: "URGENT",
                  color: "border-red-200 bg-red-50",
                  badgeVar: "danger" as const,
                },
                {
                  id: 2,
                  action: "Issue travel advisory for NH-10",
                  reason: "Landslide probability at 78%",
                  urgency: "HIGH",
                  color: "border-amber-200 bg-amber-50",
                  badgeVar: "warning" as const,
                },
                {
                  id: 3,
                  action: "Pre-position emergency reserves at Rangpo",
                  reason: "Fuel supply contingency for 48h window",
                  urgency: "MEDIUM",
                  color: "border-blue-200 bg-blue-50",
                  badgeVar: "info" as const,
                },
              ].map((a) => (
                <div key={a.id} className={`rounded-lg border p-3 ${a.color}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] text-slate-400 font-bold">ACTION #{a.id}</span>
                    <Badge variant={a.badgeVar}>{a.urgency}</Badge>
                  </div>
                  <p className="text-[11px] font-bold text-slate-800 leading-snug mb-1">{a.action}</p>
                  <p className="text-[9px] text-slate-500">{a.reason}</p>
                </div>
              ))}

              {!applied ? (
                <button
                  onClick={onApply}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-lg py-2.5 transition-colors"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  Apply Alternate Route (All)
                </button>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-emerald-700 font-semibold">Action #1 completed — vehicles rerouted</p>
                </div>
              )}

              <button
                onClick={onRoutesClick}
                className="w-full border border-blue-200 text-blue-600 hover:bg-blue-50 text-[11px] font-semibold rounded-lg py-2 transition-colors"
              >
                View Route Intelligence →
              </button>
            </div>
          </div>

          {/* System info */}
          <div className="bg-slate-900 rounded-xl p-4 text-white">
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mb-3">Data Sources</p>
            <div className="flex flex-col gap-2">
              {[
                { src: "IMD", label: "Weather · Live", ok: true },
                { src: "NRSC", label: "Satellite · 15 min", ok: true },
                { src: "NIC Sikkim", label: "Road Network · Live", ok: true },
                { src: "NDRF", label: "Field Reports · Manual", ok: false },
              ].map((s) => (
                <div key={s.src} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${s.ok ? "bg-emerald-400" : "bg-amber-400"}`} />
                    <span className="text-[10px] font-bold text-white" style={{ fontFamily: "var(--font-mono)" }}>{s.src}</span>
                  </div>
                  <span className="text-[9px] text-slate-400">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
}
