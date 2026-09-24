import { useState } from 'react'
import { AlertTriangle, ChevronRight, TrendingUp, Activity, Clock, Users, CheckSquare, Bell } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import type { Screen } from '../App'

interface Props { setScreen: (s: Screen) => void }

const kpis = [
  { label: 'Active Projects', value: '247', delta: '+12', color: '#2563EB', up: true },
  { label: 'Approvals in Progress', value: '1,842', delta: '+84', color: '#0891B2', up: true },
  { label: 'SLA Risks', value: '38', delta: '+5', color: '#EA580C', up: false },
  { label: 'Overdue Approvals', value: '14', delta: '-3', color: '#DC2626', up: true },
  { label: 'Pending Inspections', value: '67', delta: '+8', color: '#D97706', up: false },
  { label: 'Escalations', value: '9', delta: '+2', color: '#7C3AED', up: false },
]

const departments = [
  { name: 'MPCB', applications: 182, avgDays: 22, slaRisk: 12, pending: 34, escalations: 3 },
  { name: 'Labour (Factories)', applications: 234, avgDays: 18, slaRisk: 6, pending: 41, escalations: 1 },
  { name: 'Local Authority', applications: 312, avgDays: 25, slaRisk: 18, pending: 67, escalations: 4 },
  { name: 'Fire Services', applications: 156, avgDays: 14, slaRisk: 4, pending: 22, escalations: 0 },
  { name: 'Revenue (Land)', applications: 98, avgDays: 32, slaRisk: 8, pending: 18, escalations: 1 },
  { name: 'MSEDCL', applications: 145, avgDays: 19, slaRisk: 3, pending: 29, escalations: 0 },
]

const priorityAttention = [
  { project: 'ABC Manufacturing Plant', issue: 'EC approaching SLA breach (9 days remaining)', risk: 'HIGH', screen: 'sla' },
  { project: 'GreenTech Energy Unit', issue: 'Factory Registration blocked — dependency unresolved 15 days', risk: 'HIGH', screen: 'escalation' },
  { project: 'Pune Steel Works', issue: 'Inspection backlog — 3 inspections pending coordination', risk: 'MEDIUM', screen: 'inspection' },
  { project: 'MH Pharma Ltd', issue: 'Grievance unresolved 12 days — applicant follow-up required', risk: 'MEDIUM', screen: 'escalation' },
]

const trendData = [
  { month: 'Jan', onTime: 82, risk: 14, breach: 4 },
  { month: 'Feb', onTime: 78, risk: 17, breach: 5 },
  { month: 'Mar', onTime: 85, risk: 11, breach: 4 },
  { month: 'Apr', onTime: 80, risk: 13, breach: 7 },
  { month: 'May', onTime: 76, risk: 18, breach: 6 },
  { month: 'Jun', onTime: 83, risk: 12, breach: 5 },
]

const districtData = [
  { district: 'Pune', active: 68, risk: 8 },
  { district: 'Nashik', active: 42, risk: 5 },
  { district: 'Aurangabad', active: 38, risk: 6 },
  { district: 'Nagpur', active: 31, risk: 3 },
  { district: 'Thane', active: 29, risk: 4 },
  { district: 'Solapur', active: 18, risk: 2 },
]

const riskColor: Record<string, string> = { HIGH: '#DC2626', MEDIUM: '#D97706', LOW: '#16A34A' }

export default function GovDashboard({ setScreen }: Props) {
  const [districtFilter, setDistrictFilter] = useState('All')

  return (
    <div style={{ padding: 24, maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
            Government of Maharashtra — DPIIT
          </div>
          <h1 style={{ fontFamily: 'DM Sans', fontSize: 22, fontWeight: 700, color: '#0D1B2E', marginBottom: 4 }}>
            Industrial Approval Operations
          </h1>
          <div style={{ fontSize: 12, color: '#64748B' }}>
            Data as of 24 Sep 2024 · <span style={{ color: '#16A34A', fontWeight: 600 }}>DEMO</span> — Simulated data
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['All Districts', 'Pune', 'Nashik', 'Aurangabad'].map(d => (
            <button
              key={d}
              onClick={() => setDistrictFilter(d)}
              style={{
                padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: districtFilter === d ? '#1B3A6B' : 'white',
                color: districtFilter === d ? 'white' : '#64748B',
                border: '1px solid ' + (districtFilter === d ? '#1B3A6B' : '#E2E8F0'),
              }}
            >{d}</button>
          ))}
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        {kpis.map(k => (
          <div key={k.label} className="kpi-card" style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: k.color, fontFamily: 'DM Sans', marginBottom: 3 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: k.up ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
              {k.delta} this week
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, marginBottom: 20 }}>
        {/* District performance */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2E', marginBottom: 4 }}>
            District-wise Active Projects &amp; SLA Risk
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 16 }}>
            Approval Bottleneck Distribution — Maharashtra
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={districtData} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="district" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #E2E8F0', borderRadius: 6 }} />
              <Bar dataKey="active" name="Active Projects" fill="#2563EB" fillOpacity={0.8} radius={3} />
              <Bar dataKey="risk" name="SLA Risk Count" fill="#EA580C" fillOpacity={0.8} radius={3} />
            </BarChart>
          </ResponsiveContainer>

          {/* Map placeholder */}
          <div style={{
            marginTop: 16, padding: 16, background: '#F0F4F8', borderRadius: 8,
            border: '1px solid #E2E8F0', textAlign: 'center',
            color: '#94A3B8', fontSize: 12
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 4 }}>
              Maharashtra District Map
            </div>
            <div style={{ fontSize: 11 }}>Interactive choropleth map — district colour coded by SLA risk density</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 10 }}>
              {[
                { label: 'Low Risk', color: '#16A34A' },
                { label: 'Medium', color: '#D97706' },
                { label: 'High Risk', color: '#DC2626' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: l.color }} />
                  <span style={{ fontSize: 11, color: '#64748B' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority attention panel */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', background: '#0D1B2E', borderColor: '#1E3A5F' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={15} color="#FCA5A5" />
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>Priority Attention</div>
            </div>
            <div style={{ fontSize: 11, color: '#4A5568', marginTop: 2 }}>Cases requiring immediate officer action</div>
          </div>
          <div style={{ padding: '8px' }}>
            {priorityAttention.map((p, i) => (
              <div
                key={i}
                onClick={() => setScreen(p.screen as Screen)}
                style={{
                  padding: '10px 8px', borderRadius: 6, cursor: 'pointer',
                  marginBottom: 4, background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: riskColor[p.risk] + '22', color: riskColor[p.risk], border: `1px solid ${riskColor[p.risk]}44`, flexShrink: 0 }}>
                    {p.risk}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#E2E8F0', marginBottom: 2 }}>{p.project}</div>
                    <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.4 }}>{p.issue}</div>
                  </div>
                  <ChevronRight size={12} color="#334155" style={{ marginTop: 2, flexShrink: 0 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SLA trend + Department performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* SLA trend chart */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2E', marginBottom: 16 }}>SLA Performance Trend</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={trendData} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #E2E8F0', borderRadius: 6 }} />
              <Line type="monotone" dataKey="onTime" name="On Time %" stroke="#16A34A" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="risk" name="At Risk" stroke="#D97706" strokeWidth={2} dot={false} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="breach" name="Breach" stroke="#DC2626" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department performance table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2E' }}>Department Performance</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Apps</th>
                <th>Avg Days</th>
                <th>SLA Risk</th>
                <th>Escalations</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(d => (
                <tr key={d.name} onClick={() => setScreen('analytics')} style={{ cursor: 'pointer' }}>
                  <td style={{ fontSize: 12, fontWeight: 600, color: '#0D1B2E' }}>{d.name}</td>
                  <td style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: '#475569' }}>{d.applications}</td>
                  <td style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: d.avgDays > 25 ? '#D97706' : '#16A34A' }}>{d.avgDays}d</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 50, height: 5, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%', borderRadius: 3,
                          width: `${Math.min(d.slaRisk / 20 * 100, 100)}%`,
                          background: d.slaRisk > 10 ? '#DC2626' : d.slaRisk > 5 ? '#D97706' : '#16A34A'
                        }} />
                      </div>
                      <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#64748B' }}>{d.slaRisk}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: d.escalations > 2 ? '#DC2626' : '#64748B',
                      fontFamily: 'JetBrains Mono'
                    }}>{d.escalations}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
