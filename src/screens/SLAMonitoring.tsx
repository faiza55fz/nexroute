import { AlertTriangle, Clock, TrendingUp, Info } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { Screen } from '../App'

interface Props { setScreen: (s: Screen) => void }

const slaData = [
  { name: 'Land Conversion', dept: 'Revenue', sla: 60, elapsed: 45, remaining: 15, risk: 'LOW', status: 'completed' },
  { name: 'Environmental Clearance', dept: 'MoEFCC/SEIAA', sla: 30, elapsed: 21, remaining: 9, risk: 'HIGH', status: 'active' },
  { name: 'MPCB CTE', dept: 'MPCB', sla: 45, elapsed: 14, remaining: 31, risk: 'LOW', status: 'active' },
  { name: 'Building Plan Approval', dept: 'Local Authority', sla: 30, elapsed: 8, remaining: 22, risk: 'LOW', status: 'active' },
  { name: 'Factory Registration', dept: 'Labour Dept', sla: 30, elapsed: 0, remaining: 30, risk: 'MEDIUM', status: 'blocked' },
  { name: 'Fire NOC', dept: 'Fire Services', sla: 21, elapsed: 0, remaining: 21, risk: 'MEDIUM', status: 'pending' },
  { name: 'Electricity Connection', dept: 'MSEDCL', sla: 30, elapsed: 0, remaining: 30, risk: 'LOW', status: 'pending' },
  { name: 'Chemical License', dept: 'DISH', sla: 45, elapsed: 0, remaining: 45, risk: 'LOW', status: 'pending' },
]

const riskColor: Record<string, string> = {
  LOW: '#16A34A', MEDIUM: '#D97706', HIGH: '#EA580C', CRITICAL: '#DC2626'
}

const riskBg: Record<string, string> = {
  LOW: '#F0FDF4', MEDIUM: '#FFFBEB', HIGH: '#FFF7ED', CRITICAL: '#FEF2F2'
}

const riskBorder: Record<string, string> = {
  LOW: '#BBF7D0', MEDIUM: '#FDE68A', HIGH: '#FDBA74', CRITICAL: '#FECACA'
}

const chartData = slaData.filter(d => d.status !== 'pending').map(d => ({
  name: d.name.length > 18 ? d.name.slice(0, 18) + '…' : d.name,
  elapsed: d.elapsed,
  remaining: d.remaining,
  pct: Math.round(d.elapsed / d.sla * 100),
  risk: d.risk,
}))

export default function SLAMonitoring({ setScreen }: Props) {
  const atRisk = slaData.filter(d => d.risk === 'HIGH' || d.risk === 'CRITICAL')
  const medium = slaData.filter(d => d.risk === 'MEDIUM')

  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'DM Sans', fontSize: 22, fontWeight: 700, color: '#0D1B2E', marginBottom: 6 }}>
          SLA &amp; Timeline Intelligence
        </h1>
        <p style={{ fontSize: 13, color: '#64748B' }}>
          Real-time SLA tracking with predictive risk signals. Predictions are indicators, not guaranteed outcomes.
        </p>
      </div>

      {/* Critical alerts */}
      {atRisk.length > 0 && (
        <div className="alert-banner alert-critical" style={{ marginBottom: 16 }}>
          <AlertTriangle size={15} />
          <div>
            <strong>{atRisk.length} approval{atRisk.length > 1 ? 's are' : ' is'} approaching SLA breach</strong> —{' '}
            {atRisk.map(a => a.name).join(', ')}. Immediate attention required.
          </div>
        </div>
      )}
      {medium.length > 0 && (
        <div className="alert-banner alert-warning" style={{ marginBottom: 20 }}>
          <AlertTriangle size={15} />
          <div>
            <strong>{medium.length} approval{medium.length > 1 ? 's have' : ' has'} medium risk</strong> —{' '}
            {medium.map(a => a.name).join(', ')}. Monitor closely.
          </div>
        </div>
      )}

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Active Approvals', value: '6', color: '#2563EB' },
          { label: 'High Risk', value: String(atRisk.length), color: '#EA580C' },
          { label: 'Medium Risk', value: String(medium.length), color: '#D97706' },
          { label: 'On Track', value: String(slaData.filter(d => d.risk === 'LOW' && d.status !== 'pending').length), color: '#16A34A' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: k.color, fontFamily: 'DM Sans' }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Main SLA table */}
        <div>
          {/* Gantt-style bars */}
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2E', marginBottom: 16 }}>SLA Consumption by Approval</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: any, name: string) => [name === 'elapsed' ? `${val}%` : '', name === 'elapsed' ? 'SLA Used' : '']}
                  contentStyle={{ fontSize: 12, border: '1px solid #E2E8F0', borderRadius: 6 }}
                />
                <Bar dataKey="pct" name="SLA Used" radius={3}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={riskColor[d.risk]} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Approval</th>
                  <th>Dept</th>
                  <th>SLA</th>
                  <th>Elapsed</th>
                  <th>Remaining</th>
                  <th>Risk</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {slaData.map(a => (
                  <tr key={a.name}>
                    <td style={{ fontSize: 13, fontWeight: 500, color: '#0D1B2E' }}>{a.name}</td>
                    <td style={{ fontSize: 12, color: '#64748B' }}>{a.dept}</td>
                    <td style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: '#475569' }}>{a.sla}d</td>
                    <td style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: '#475569' }}>{a.elapsed}d</td>
                    <td style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: a.remaining < 10 ? '#DC2626' : '#16A34A', fontWeight: 600 }}>
                      {a.remaining}d
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                        background: riskBg[a.risk], border: `1px solid ${riskBorder[a.risk]}`,
                        color: riskColor[a.risk]
                      }}>
                        {a.risk}
                      </span>
                    </td>
                    <td style={{ minWidth: 80 }}>
                      {a.status !== 'pending' && a.elapsed > 0 ? (
                        <div className="progress-track" style={{ height: 6, width: 80 }}>
                          <div className="progress-fill" style={{
                            width: `${Math.min(a.elapsed / a.sla * 100, 100)}%`,
                            background: riskColor[a.risk]
                          }} />
                        </div>
                      ) : (
                        <span style={{ fontSize: 11, color: '#94A3B8' }}>Not started</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side: risk analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Risk breakdown for high-risk items */}
          {atRisk.map(a => (
            <div key={a.name} className="card" style={{ borderLeft: '3px solid #DC2626' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
                <AlertTriangle size={16} color="#DC2626" style={{ marginTop: 1, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2E' }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>{a.dept}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                {[
                  { label: 'SLA', val: a.sla + 'd' },
                  { label: 'Elapsed', val: a.elapsed + 'd' },
                  { label: 'Left', val: a.remaining + 'd' },
                ].map(k => (
                  <div key={k.label} style={{ textAlign: 'center', padding: '6px', background: '#F8FAFC', borderRadius: 5 }}>
                    <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>{k.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0D1B2E', fontFamily: 'JetBrains Mono' }}>{k.val}</div>
                  </div>
                ))}
              </div>
              <div className="progress-track" style={{ height: 8, marginBottom: 12 }}>
                <div className="progress-fill" style={{ width: `${a.elapsed / a.sla * 100}%`, background: '#DC2626' }} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
                Risk Factors
              </div>
              {['Document validation pending', 'Inspection not yet scheduled', 'Historical avg: 28 days for similar projects'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#DC2626', marginTop: 5, flexShrink: 0 }} />
                  <div style={{ fontSize: 11, color: '#64748B' }}>{f}</div>
                </div>
              ))}
              <div style={{ marginTop: 10, padding: '8px 10px', background: '#EFF6FF', borderRadius: 6, border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#1D4ED8', marginBottom: 2 }}>Recommended Action</div>
                <div style={{ fontSize: 11, color: '#3B82F6' }}>
                  Contact SEIAA to expedite review. Ensure EIA report signatures are in place. Consider proactive escalation.
                </div>
              </div>
            </div>
          ))}

          {/* Info */}
          <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', display: 'flex', gap: 8 }}>
            <Info size={14} color="#94A3B8" style={{ marginTop: 1, flexShrink: 0 }} />
            <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>
              Risk predictions are based on elapsed time, dependency status, document readiness, and historical processing patterns. These are risk signals, not guaranteed outcomes.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
