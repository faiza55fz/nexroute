import { useState } from 'react'
import { Upload, CheckCircle, AlertCircle, XCircle, Clock, RefreshCw, Shield } from 'lucide-react'
import type { Screen } from '../App'

interface Props { setScreen: (s: Screen) => void }

type DocStatus = 'verified' | 'attention' | 'missing' | 'pending'

interface Doc {
  id: number
  name: string
  category: string
  status: DocStatus
  approval: string
  uploaded?: string
  verified?: string
  issue?: string
  reused?: boolean
}

const docs: Doc[] = [
  { id: 1, name: 'Land Title Deed (7/12 Extract)', category: 'Land', status: 'verified', approval: 'Land Conversion', uploaded: '12 Mar 2024', verified: '14 Mar 2024', reused: true },
  { id: 2, name: 'City Survey Map', category: 'Land', status: 'verified', approval: 'Land Conversion', uploaded: '12 Mar 2024', verified: '14 Mar 2024' },
  { id: 3, name: 'Company Registration Certificate', category: 'Company', status: 'verified', approval: 'Multiple', uploaded: '10 Mar 2024', verified: '11 Mar 2024', reused: true },
  { id: 4, name: 'Environmental Impact Assessment (EIA) Report', category: 'Environment', status: 'attention', approval: 'Environmental Clearance', uploaded: '20 Mar 2024', issue: 'Missing signature on Chapter 4. Section 4.3 requires project-specific data.' },
  { id: 5, name: 'Form 1 – Environmental Clearance', category: 'Environment', status: 'pending', approval: 'Environmental Clearance', uploaded: '22 Mar 2024' },
  { id: 6, name: 'Public Hearing Proceedings NOC', category: 'Environment', status: 'missing', approval: 'Environmental Clearance', issue: 'Document not yet uploaded. Required before EC can proceed.' },
  { id: 7, name: 'Factory Building Plan (Architectural)', category: 'Construction', status: 'verified', approval: 'Building Plan Approval', uploaded: '18 Mar 2024', verified: '20 Mar 2024' },
  { id: 8, name: 'Structural Stability Certificate', category: 'Construction', status: 'attention', approval: 'Building Plan Approval', uploaded: '18 Mar 2024', issue: 'Certificate date is older than 6 months. Please provide a refreshed certificate.' },
  { id: 9, name: 'Fire Safety Plan & Equipment List', category: 'Fire & Safety', status: 'missing', approval: 'Fire NOC', issue: 'Not yet submitted. Required for Fire NOC application.' },
  { id: 10, name: 'ETP (Effluent Treatment Plant) Design', category: 'Environment', status: 'attention', approval: 'MPCB CTE', uploaded: '21 Mar 2024', issue: 'Design specifications do not match declared production capacity. Please reconcile.' },
  { id: 11, name: 'Process Flow Diagram', category: 'Manufacturing', status: 'verified', approval: 'MPCB CTE', uploaded: '15 Mar 2024', verified: '17 Mar 2024' },
  { id: 12, name: 'Director / Partner Identity Documents', category: 'Company', status: 'verified', approval: 'Multiple', uploaded: '10 Mar 2024', verified: '11 Mar 2024', reused: true },
]

const statusIcon: Record<DocStatus, JSX.Element> = {
  verified: <CheckCircle size={14} color="#16A34A" />,
  attention: <AlertCircle size={14} color="#D97706" />,
  missing: <XCircle size={14} color="#DC2626" />,
  pending: <Clock size={14} color="#2563EB" />,
}

const statusLabel: Record<DocStatus, string> = {
  verified: 'Verified', attention: 'Needs Attention', missing: 'Missing', pending: 'Pending Verification'
}

const statusBadge: Record<DocStatus, string> = {
  verified: 'badge-green', attention: 'badge-amber', missing: 'badge-red', pending: 'badge-blue'
}

const categories = ['All', 'Land', 'Company', 'Environment', 'Construction', 'Fire & Safety', 'Manufacturing']

const counts = {
  total: docs.length,
  verified: docs.filter(d => d.status === 'verified').length,
  attention: docs.filter(d => d.status === 'attention').length,
  missing: docs.filter(d => d.status === 'missing').length,
  pending: docs.filter(d => d.status === 'pending').length,
}

const readiness = Math.round((counts.verified / counts.total) * 100)

export default function DocumentReadiness({ setScreen }: Props) {
  const [catFilter, setCatFilter] = useState('All')
  const [selected, setSelected] = useState<Doc | null>(null)

  const filtered = docs.filter(d => catFilter === 'All' || d.category === catFilter)

  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'DM Sans', fontSize: 22, fontWeight: 700, color: '#0D1B2E', marginBottom: 6 }}>
          Document &amp; Compliance Readiness
        </h1>
        <p style={{ fontSize: 13, color: '#64748B' }}>
          Pre-validate documents before submission to avoid rejections. Verified data is automatically reused across applicable workflows.
        </p>
      </div>

      {/* Overall readiness */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16, marginBottom: 24 }}>
        {/* Score */}
        <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>
            Overall Readiness
          </div>
          <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 12px' }}>
            <svg viewBox="0 0 36 36" width={100} height={100}>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E2E8F0" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#16A34A" strokeWidth="3" strokeDasharray={`${readiness}, 100`} strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#16A34A', fontFamily: 'DM Sans' }}>{readiness}%</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { status: 'verified', count: counts.verified, color: '#16A34A' },
              { status: 'pending', count: counts.pending, color: '#2563EB' },
              { status: 'attention', count: counts.attention, color: '#D97706' },
              { status: 'missing', count: counts.missing, color: '#DC2626' },
            ].map(s => (
              <div key={s.status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#64748B' }}>{statusLabel[s.status as DocStatus]}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.color, fontFamily: 'JetBrains Mono' }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Issues and reuse */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Pre-validate header */}
          <div style={{
            background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 12
          }}>
            <Shield size={20} color="#2563EB" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1D4ED8' }}>Pre-Validation Active</div>
              <div style={{ fontSize: 12, color: '#3B82F6' }}>System has automatically identified issues before submission to government portals.</div>
            </div>
            <button style={{
              padding: '6px 14px', borderRadius: 6, background: '#2563EB', color: 'white',
              border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer'
            }}>Run Validation</button>
          </div>

          {/* Issues found */}
          <div className="card" style={{ padding: '12px 16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0D1B2E', marginBottom: 10 }}>Issues Detected</div>
            {docs.filter(d => d.issue).map(d => (
              <div key={d.id} style={{
                display: 'flex', gap: 10, padding: '8px 0',
                borderBottom: '1px solid #F1F5F9'
              }}>
                {statusIcon[d.status]}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#0D1B2E' }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: d.status === 'missing' ? '#B91C1C' : '#92400E', marginTop: 2 }}>{d.issue}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Reuse banner */}
          <div style={{
            background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <RefreshCw size={16} color="#16A34A" />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#15803D' }}>Verified Data Reuse</div>
              <div style={{ fontSize: 11, color: '#16A34A' }}>
                3 documents automatically reused: Company Registration, Title Deed, Director IDs — no re-upload needed across 6 applications.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              background: catFilter === c ? '#1B3A6B' : '#F1F5F9',
              color: catFilter === c ? 'white' : '#64748B',
              border: 'none'
            }}
          >{c}</button>
        ))}
      </div>

      {/* Document table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Category</th>
              <th>Used For</th>
              <th>Status</th>
              <th>Uploaded</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id} onClick={() => setSelected(d === selected ? null : d)} style={{ cursor: 'pointer' }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {statusIcon[d.status]}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0D1B2E' }}>{d.name}</div>
                      {d.reused && (
                        <div style={{ fontSize: 10, color: '#16A34A', fontWeight: 600, marginTop: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <RefreshCw size={9} /> Auto-reused
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 12, color: '#64748B' }}>{d.category}</td>
                <td style={{ fontSize: 12, color: '#64748B' }}>{d.approval}</td>
                <td>
                  <span className={`badge ${statusBadge[d.status]}`}>{statusLabel[d.status]}</span>
                </td>
                <td style={{ fontSize: 12, color: '#64748B', fontFamily: 'JetBrains Mono' }}>
                  {d.uploaded || '—'}
                </td>
                <td>
                  {d.status === 'missing' && (
                    <button style={{
                      display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600,
                      padding: '4px 10px', borderRadius: 5, background: '#DC2626', color: 'white',
                      border: 'none', cursor: 'pointer'
                    }}>
                      <Upload size={11} /> Upload
                    </button>
                  )}
                  {d.status === 'attention' && (
                    <button style={{
                      display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600,
                      padding: '4px 10px', borderRadius: 5, background: '#D97706', color: 'white',
                      border: 'none', cursor: 'pointer'
                    }}>
                      Fix Issue
                    </button>
                  )}
                  {(d.status === 'verified' || d.status === 'pending') && (
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>View</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="card" style={{ marginTop: 16, borderLeft: `3px solid ${selected.status === 'verified' ? '#16A34A' : selected.status === 'missing' ? '#DC2626' : '#D97706'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0D1B2E', marginBottom: 4 }}>{selected.name}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className={`badge ${statusBadge[selected.status]}`}>{statusLabel[selected.status]}</span>
                <span className="badge badge-grey">{selected.category}</span>
                <span style={{ fontSize: 11, color: '#64748B' }}>Required for: {selected.approval}</span>
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#94A3B8' }}>✕</button>
          </div>
          {selected.issue && (
            <div style={{ marginTop: 12, padding: '10px 12px', background: selected.status === 'missing' ? '#FEF2F2' : '#FFFBEB', borderRadius: 6, border: `1px solid ${selected.status === 'missing' ? '#FECACA' : '#FDE68A'}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: selected.status === 'missing' ? '#B91C1C' : '#92400E', marginBottom: 4 }}>ISSUE DETECTED</div>
              <div style={{ fontSize: 12, color: '#475569' }}>{selected.issue}</div>
            </div>
          )}
          {selected.reused && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: '#F0FDF4', borderRadius: 6, border: '1px solid #BBF7D0' }}>
              <div style={{ fontSize: 12, color: '#15803D' }}>
                <strong>Auto-reused:</strong> This verified document is automatically applied to all applicable approval workflows — no duplicate upload required.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
