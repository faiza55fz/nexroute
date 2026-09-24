import { AlertTriangle, ChevronRight, Info, TrendingUp, Zap } from 'lucide-react'
import type { Screen } from '../App'

interface Props { setScreen: (s: Screen) => void }

const bottlenecks = [
  {
    rank: 1,
    approval: 'Environmental Clearance',
    dept: 'MoEFCC / SEIAA Maharashtra',
    risk: 'HIGH',
    reason: 'EIA report has a missing signature (Chapter 4). Public Hearing NOC not yet uploaded. 21 of 30 SLA days elapsed.',
    impact: 'Blocking Factory Registration and Chemical License. +12 days estimated delay on critical path.',
    affected: ['Factory Registration', 'Chemical License (DISH)'],
    action: 'Resolve pending EIA document validation. Upload Public Hearing NOC. Contact SEIAA for status.',
    riskFactors: [
      { label: 'SLA Consumption', value: '70%', color: '#EA580C' },
      { label: 'Dependent Approvals Blocked', value: '2', color: '#DC2626' },
      { label: 'Docs Pending', value: '2', color: '#D97706' },
    ]
  },
  {
    rank: 2,
    approval: 'Fire Inspection',
    dept: 'Maharashtra Fire Services',
    risk: 'MEDIUM',
    reason: 'Fire Safety Plan not yet submitted. Inspection cannot be scheduled until plan is approved. Historical avg: 18 days after document submission.',
    impact: 'Blocking Fire NOC. May delay Building Commissioning by 3–5 days if not resolved in parallel.',
    affected: ['Fire NOC', 'Final Commissioning'],
    action: 'Submit Fire Safety Plan. Proactively contact Fire Department to pre-schedule inspection slot.',
    riskFactors: [
      { label: 'Docs Missing', value: '1', color: '#D97706' },
      { label: 'Inspection Status', value: 'Not Scheduled', color: '#D97706' },
      { label: 'Est. Timeline Risk', value: '5 days', color: '#D97706' },
    ]
  },
  {
    rank: 3,
    approval: 'Land Verification (MIDC)',
    dept: 'MIDC',
    risk: 'LOW',
    reason: 'MIDC site query raised 7 days ago. Response pending from applicant. Minor delay risk if not responded within 3 days.',
    impact: 'Minimal — not on critical path. However, delayed response may trigger SLA clock reset.',
    affected: ['MIDC Plot Allotment'],
    action: 'Respond to MIDC site query. Attach supporting document (Site Plan Revision 2).',
    riskFactors: [
      { label: 'Query Age', value: '7 days', color: '#16A34A' },
      { label: 'Response Deadline', value: '3 days', color: '#16A34A' },
      { label: 'Critical Path Impact', value: 'None', color: '#16A34A' },
    ]
  },
]

const riskColor: Record<string, string> = {
  HIGH: '#EA580C', MEDIUM: '#D97706', LOW: '#16A34A'
}

const riskBg: Record<string, string> = {
  HIGH: '#FFF7ED', MEDIUM: '#FFFBEB', LOW: '#F0FDF4'
}

const riskBorder: Record<string, string> = {
  HIGH: '#FDBA74', MEDIUM: '#FDE68A', LOW: '#BBF7D0'
}

const riskBadge: Record<string, string> = {
  HIGH: 'badge-red', MEDIUM: 'badge-amber', LOW: 'badge-green'
}

export default function BottleneckIntelligence({ setScreen }: Props) {
  return (
    <div style={{ padding: 24, maxWidth: 1000 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Zap size={20} color="#2563EB" />
          <h1 style={{ fontFamily: 'DM Sans', fontSize: 22, fontWeight: 700, color: '#0D1B2E' }}>
            Where Could This Project Be Delayed?
          </h1>
        </div>
        <p style={{ fontSize: 13, color: '#64748B', maxWidth: 580 }}>
          AI-assisted bottleneck analysis identifies where delays are most likely. All recommendations are explainable — no black-box outputs.
        </p>
      </div>

      {/* Explanation banner */}
      <div style={{
        padding: '12px 16px', borderRadius: 8, marginBottom: 24,
        background: '#EFF6FF', border: '1px solid #BFDBFE',
        display: 'flex', alignItems: 'flex-start', gap: 10
      }}>
        <Info size={15} color="#2563EB" style={{ marginTop: 1, flexShrink: 0 }} />
        <div style={{ fontSize: 12, color: '#1D4ED8', lineHeight: 1.6 }}>
          <strong>How this works:</strong> Bottleneck signals are derived from SLA consumption rate, dependency chain status, document readiness, and historical processing patterns for similar projects in Maharashtra. These are risk indicators — not predictions of definite outcomes.
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'High Risk Bottlenecks', val: 1, color: '#EA580C', bg: '#FFF7ED', border: '#FDBA74' },
          { label: 'Medium Risk', val: 1, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
          { label: 'Low Risk', val: 1, color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '14px 16px', borderRadius: 8,
            background: s.bg, border: `1px solid ${s.border}`
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: s.color, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: 'DM Sans' }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Bottleneck cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {bottlenecks.map(b => (
          <div
            key={b.rank}
            className="card"
            style={{
              borderLeft: `4px solid ${riskColor[b.risk]}`,
              padding: 0, overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: riskBg[b.risk], border: `1px solid ${riskBorder[b.risk]}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: riskColor[b.risk],
                flexShrink: 0, fontFamily: 'DM Sans'
              }}>
                {b.rank}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0D1B2E' }}>{b.approval}</div>
                  <span className={`badge ${riskBadge[b.risk]}`}>Risk: {b.risk}</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{b.dept}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, borderTop: '1px solid #F1F5F9' }}>
              {/* Reason */}
              <div style={{ padding: '14px 18px', borderRight: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Why a Bottleneck?
                </div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{b.reason}</div>

                {/* Risk factor tags */}
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {b.riskFactors.map(f => (
                    <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                      <span style={{ color: '#64748B' }}>{f.label}</span>
                      <span style={{ fontWeight: 700, color: f.color, fontFamily: 'JetBrains Mono' }}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact */}
              <div style={{ padding: '14px 18px', borderRight: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Impact
                </div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, marginBottom: 10 }}>{b.impact}</div>
                {b.affected.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 5 }}>Affected Approvals:</div>
                    {b.affected.map(a => (
                      <div key={a} style={{
                        fontSize: 12, color: '#B91C1C', padding: '4px 8px', background: '#FEF2F2',
                        border: '1px solid #FECACA', borderRadius: 5, marginBottom: 4,
                        display: 'flex', alignItems: 'center', gap: 6
                      }}>
                        <AlertTriangle size={11} color="#B91C1C" />
                        {a}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended action */}
              <div style={{ padding: '14px 18px', background: '#F8FAFC' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Recommended Action
                </div>
                <div style={{ fontSize: 12, color: '#0D1B2E', lineHeight: 1.6, marginBottom: 14 }}>{b.action}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <button style={{
                    padding: '7px 12px', borderRadius: 6, background: '#1B3A6B', color: 'white',
                    border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left'
                  }}>
                    Take Action
                  </button>
                  <button
                    onClick={() => setScreen('sla')}
                    style={{
                      padding: '7px 12px', borderRadius: 6, background: 'none',
                      border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      color: '#2563EB', display: 'flex', alignItems: 'center', gap: 4
                    }}
                  >
                    View SLA Timeline <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
