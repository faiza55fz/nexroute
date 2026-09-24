import { useState } from 'react'
import { Filter, ChevronRight, Info, Clock, FileText, AlertCircle, CheckCircle, Layers } from 'lucide-react'
import type { Screen } from '../App'

interface Props { setScreen: (s: Screen) => void }

const approvals = [
  {
    id: 1, name: 'Land Conversion / NA Order', dept: 'District Collector / Revenue Dept', category: 'Land',
    applicability: 'Required', status: 'completed', days: 45, sla: 60,
    docs: ['Title Deed', '7/12 Extract', 'City Survey Map', 'NOC from Gram Panchayat'],
    depends: [], renewal: 'None', why: 'Manufacturing project requires non-agricultural land classification.',
    source: 'Maharashtra Land Revenue Code, 1966 – Sec. 44'
  },
  {
    id: 2, name: 'Environmental Clearance (EC)', dept: 'MoEFCC / SEIAA Maharashtra', category: 'Environment',
    applicability: 'Required', status: 'active', days: 21, sla: 30,
    docs: ['Form 1', 'Pre-Feasibility Report', 'EIA Report', 'Public Hearing NOC'],
    depends: ['Land Conversion'], renewal: 'Every 5 years', why: 'Chemical manufacturing with investment >₹5 Cr requires Environmental Clearance under EIA Notification 2006.',
    source: 'EIA Notification, 2006 – Schedule B, Category A'
  },
  {
    id: 3, name: 'Consent to Establish (CTE)', dept: 'Maharashtra Pollution Control Board (MPCB)', category: 'Pollution Control',
    applicability: 'Required', status: 'active', days: 14, sla: 45,
    docs: ['Form II', 'Process Flow Diagram', 'ETP Design', 'EC Certificate'],
    depends: ['Environmental Clearance'], renewal: 'Every 5 years', why: 'Red category industry requires MPCB consent before establishing plant.',
    source: 'Water Act 1974, Air Act 1981 – MPCB Rules'
  },
  {
    id: 4, name: 'Factory Registration', dept: 'Dept of Labour, Maharashtra', category: 'Factory / Labour',
    applicability: 'Required', status: 'blocked', days: null, sla: 30,
    docs: ['Building Plan', 'EC Certificate', 'Electricity Connection', 'Form 2'],
    depends: ['Environmental Clearance', 'Building Plan Approval'], renewal: 'Annual', why: 'Manufacturing facility with >10 workers requires registration under Factories Act.',
    source: 'Factories Act, 1948 – Sec. 6'
  },
  {
    id: 5, name: 'Building Plan Approval', dept: 'Local Planning Authority / MIDC', category: 'Construction',
    applicability: 'Required', status: 'active', days: 8, sla: 30,
    docs: ['Architectural Plans', 'Structural Certificate', 'Fire NOC', 'Land NA Order'],
    depends: ['Land Conversion'], renewal: 'None', why: 'Construction of industrial building requires building plan approval.',
    source: 'Maharashtra Regional & Town Planning Act, 1966'
  },
  {
    id: 6, name: 'Fire NOC', dept: 'Maharashtra Fire Services', category: 'Fire & Safety',
    applicability: 'Required', status: 'pending', days: null, sla: 21,
    docs: ['Site Plan', 'Fire Safety Plan', 'Equipment List', 'NOC Application'],
    depends: ['Building Plan Approval'], renewal: 'Annual', why: 'Chemical plant with hazardous materials requires fire safety clearance.',
    source: 'Maharashtra Fire Prevention & Life Safety Measures Act, 2006'
  },
  {
    id: 7, name: 'Electricity Connection (HT)', dept: 'MSEDCL / MAHADISCOM', category: 'Utilities',
    applicability: 'Required', status: 'pending', days: null, sla: 30,
    docs: ['Load Application', 'Building Approval', 'Electrical Design', 'No Dues Certificate'],
    depends: ['Building Plan Approval'], renewal: 'None', why: 'Industrial power connection requires utility approval for HT connection.',
    source: 'Electricity Act, 2003 – MERC Regulations'
  },
  {
    id: 8, name: 'Chemical License (DISH)', dept: 'Directorate of Industrial Safety & Health', category: 'Industry-specific',
    applicability: 'Conditional', status: 'pending', days: null, sla: 45,
    docs: ['Safety Report', 'Process Hazard Analysis', 'Emergency Plan', 'Insurance Certificate'],
    depends: ['Factory Registration'], renewal: 'Every 3 years', why: 'Applicable because: Chemical manufacturing with hazardous substances exceeding threshold quantities.',
    source: 'Manufacture, Storage & Import of Hazardous Chemical Rules, 1989'
  },
]

const categories = ['All', 'Land', 'Environment', 'Pollution Control', 'Factory / Labour', 'Fire & Safety', 'Construction', 'Utilities', 'Industry-specific']
const statusFilters = ['All', 'Required', 'Conditional', 'Completed', 'Active', 'Blocked', 'Pending']

const statusBadge: Record<string, string> = {
  completed: 'badge-green', active: 'badge-blue', blocked: 'badge-red', pending: 'badge-grey'
}

const applicabilityBadge: Record<string, string> = {
  Required: 'badge-navy', Conditional: 'badge-amber'
}

export default function ApprovalDiscovery({ setScreen }: Props) {
  const [catFilter, setCatFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [expanded, setExpanded] = useState<number | null>(2)

  const filtered = approvals.filter(a => {
    const catOk = catFilter === 'All' || a.category === catFilter
    const stOk = statusFilter === 'All' || a.applicability === statusFilter ||
      a.status.toLowerCase() === statusFilter.toLowerCase()
    return catOk && stOk
  })

  const counts = { total: approvals.length, required: 6, conditional: 2, completed: 1, active: 3, blocked: 1 }

  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
          ABC Manufacturing Plant
        </div>
        <h1 style={{ fontFamily: 'DM Sans', fontSize: 22, fontWeight: 700, color: '#0D1B2E', marginBottom: 6 }}>
          Your Approval Roadmap
        </h1>
        <p style={{ fontSize: 13, color: '#64748B', maxWidth: 560 }}>
          Based on your project profile, we identified <strong>{counts.total} potentially applicable approvals</strong> across 8 regulatory categories.
        </p>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Identified', val: counts.total, cls: 'badge-navy' },
          { label: 'Required', val: counts.required, cls: 'badge-navy' },
          { label: 'Conditional', val: counts.conditional, cls: 'badge-amber' },
          { label: 'Completed', val: counts.completed, cls: 'badge-green' },
          { label: 'Active', val: counts.active, cls: 'badge-blue' },
          { label: 'Blocked', val: 1, cls: 'badge-red' },
        ].map(c => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 6 }}>
            <span className={`badge ${c.cls}`}>{c.val}</span>
            <span style={{ fontSize: 12, color: '#64748B' }}>{c.label}</span>
          </div>
        ))}
        <button
          onClick={() => setScreen('dependency')}
          style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 6, border: '1px solid #2563EB',
            background: 'none', color: '#2563EB', fontSize: 12, fontWeight: 600, cursor: 'pointer'
          }}
        >
          View Dependency Graph <ChevronRight size={13} />
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
          <Filter size={13} color="#94A3B8" />
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              style={{
                padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                background: catFilter === c ? '#1B3A6B' : '#F1F5F9',
                color: catFilter === c ? 'white' : '#64748B',
                border: 'none'
              }}
            >{c}</button>
          ))}
        </div>
      </div>

      {/* Approval cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(a => {
          const isExpanded = expanded === a.id
          return (
            <div
              key={a.id}
              className="card"
              style={{
                padding: 0, overflow: 'hidden',
                borderLeft: `3px solid ${a.status === 'completed' ? '#16A34A' : a.status === 'active' ? '#2563EB' : a.status === 'blocked' ? '#DC2626' : '#CBD5E1'}`
              }}
            >
              {/* Card header */}
              <div
                style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12 }}
                onClick={() => setExpanded(isExpanded ? null : a.id)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                    <span className={`badge ${applicabilityBadge[a.applicability]}`}>{a.applicability}</span>
                    <span className={`badge ${statusBadge[a.status]}`}>{a.status.charAt(0).toUpperCase() + a.status.slice(1)}</span>
                    <span className="badge badge-grey">{a.category}</span>
                    {a.renewal !== 'None' && <span className="badge badge-cyan">Renewal: {a.renewal}</span>}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0D1B2E', marginBottom: 3 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{a.dept}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>SLA</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1B2E', fontFamily: 'JetBrains Mono' }}>{a.sla} days</div>
                  {a.days && (
                    <div style={{ fontSize: 11, color: a.days / a.sla > 0.75 ? '#DC2626' : '#D97706', marginTop: 2 }}>
                      {a.days}d elapsed
                    </div>
                  )}
                </div>
                <ChevronRight size={16} color="#94A3B8" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: '0.2s', marginTop: 2 }} />
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid #F1F5F9', padding: '14px 18px', background: '#FAFBFC' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    {/* Why required */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
                        Why is this required?
                      </div>
                      <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{a.why}</div>
                      <div style={{ marginTop: 8, padding: '6px 10px', background: '#EFF6FF', borderRadius: 6, border: '1px solid #DBEAFE' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#1D4ED8', marginBottom: 2, letterSpacing: '0.05em' }}>SOURCE</div>
                        <div style={{ fontSize: 11, color: '#1D4ED8' }}>{a.source}</div>
                      </div>
                    </div>

                    {/* Documents required */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
                        Documents Required
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {a.docs.map(d => (
                          <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569' }}>
                            <FileText size={12} color="#94A3B8" />
                            {d}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dependencies */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
                        Dependencies
                      </div>
                      {a.depends.length === 0 ? (
                        <div style={{ fontSize: 12, color: '#94A3B8' }}>No dependencies — can start immediately</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {a.depends.map(d => (
                            <div key={d} style={{
                              display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569',
                              padding: '5px 8px', background: '#FEF9C3', borderRadius: 5, border: '1px solid #FDE68A'
                            }}>
                              <AlertCircle size={12} color="#D97706" />
                              Requires: {d}
                            </div>
                          ))}
                        </div>
                      )}

                      {a.status === 'blocked' && (
                        <div style={{ marginTop: 10, padding: '8px 10px', background: '#FEF2F2', borderRadius: 6, border: '1px solid #FECACA' }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: '#B91C1C', marginBottom: 3 }}>BLOCKED</div>
                          <div style={{ fontSize: 11, color: '#B91C1C' }}>
                            Waiting for: {a.depends.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SLA progress if active */}
                  {a.status === 'active' && a.days && (
                    <div style={{ marginTop: 14, padding: '10px 12px', background: 'white', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, color: '#475569' }}>SLA Progress</span>
                        <span style={{ color: a.days / a.sla > 0.8 ? '#DC2626' : '#D97706', fontWeight: 600 }}>
                          {a.days} of {a.sla} days elapsed ({Math.round(a.days / a.sla * 100)}%)
                        </span>
                      </div>
                      <div className="progress-track" style={{ height: 8 }}>
                        <div className="progress-fill" style={{
                          width: `${Math.min(a.days / a.sla * 100, 100)}%`,
                          background: a.days / a.sla > 0.8 ? '#DC2626' : a.days / a.sla > 0.6 ? '#D97706' : '#16A34A'
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
