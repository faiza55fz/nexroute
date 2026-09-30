
import { useEffect, useState } from 'react'
import {
  Upload, CheckCircle, AlertCircle, XCircle, Clock,
  RefreshCw, Shield
} from 'lucide-react'
import type { Screen } from '../App'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elementName: string]: any
    }
  }
}

interface Props {
  setScreen: (s: Screen) => void
  projectId: number | null
}

type DocStatus = 'verified' | 'attention' | 'missing' | 'pending'

interface ApiDoc {
  id: number
  title: string
  document_type: string
  file_name: string | null
  status: string
  is_reusable: boolean
  is_verified: boolean
  validation_remarks: string | null
  uploaded_at: string | null
  verified_at: string | null
  reuse_count: number
  linked_approvals: {
    approval_id: number
    code: string
    title: string
    department_name: string
    submission_status: string
  }[]
}

interface ApiSummary {
  project_id: number
  project_code: string
  project_name: string
  total_required_documents: number
  verified_documents: number
  pending_documents: number
  attention_documents: number
  missing_documents: number
  readiness_percentage: number
  reusable_verified_document_count: number
  readiness_level: string
  summary_notes: string
}

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

const statusIcon: Record<DocStatus, React.ReactNode> = {
  verified: <CheckCircle size={14} color="#16A34A" />,
  attention: <AlertCircle size={14} color="#D97706" />,
  missing: <XCircle size={14} color="#DC2626" />,
  pending: <Clock size={14} color="#2563EB" />,
}

const statusLabel: Record<DocStatus, string> = {
  verified: 'Verified',
  attention: 'Needs Attention',
  missing: 'Missing',
  pending: 'Pending Verification'
}

const statusBadge: Record<DocStatus, string> = {
  verified: 'badge-green',
  attention: 'badge-amber',
  missing: 'badge-red',
  pending: 'badge-blue'
}

function formatDate(value: string | null) {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function getCategory(type: string) {
  const t = type.toUpperCase()
  if (t.includes('LAND') || t.includes('7_12') || t.includes('ALLOTMENT')) return 'Land'
  if (t.includes('COMPANY') || t.includes('PAN') || t.includes('GST')) return 'Company'
  if (t.includes('FIRE')) return 'Fire & Safety'
  if (t.includes('BUILDING') || t.includes('SITE_LAYOUT') || t.includes('STRUCTURAL')) return 'Construction'
  if (t.includes('EIA') || t.includes('MPCB') || t.includes('ENVIRONMENT') || t.includes('EFFLUENT')) return 'Environment'
  if (t.includes('MSEDCL') || t.includes('ELECTRICAL')) return 'Utilities'
  return 'Other'
}

function mapDocument(d: ApiDoc): Doc {
  const rawStatus = d.status.toLowerCase()
  const status: DocStatus =
    rawStatus === 'verified' ? 'verified' :
    rawStatus === 'attention' ? 'attention' :
    rawStatus === 'missing' ? 'missing' : 'pending'

  const approvals = d.linked_approvals
    .map(a => a.title)
    .filter(Boolean)

  return {
    id: d.id,
    name: d.title,
    category: getCategory(d.document_type),
    status,
    approval: approvals.length
      ? [...new Set(approvals)].join(', ')
      : 'Not linked',
    uploaded: formatDate(d.uploaded_at),
    verified: formatDate(d.verified_at),
    issue: status === 'attention' ? (d.validation_remarks || 'Needs review.') : undefined,
    reused: d.is_reusable && d.reuse_count > 0
  }
}

export default function DocumentReadiness({ setScreen, projectId }: Props) {
  const [catFilter, setCatFilter] = useState('All')
  const [selected, setSelected] = useState<Doc | null>(null)
  const [docs, setDocs] = useState<Doc[]>([])
  const [summary, setSummary] = useState<ApiSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Temporary demo fallback: project 1 is the seeded project.
  const activeProjectId = projectId ?? 1

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const base = `http://127.0.0.1:8000/api/v1/projects/${activeProjectId}/documents`

      const [docsResponse, summaryResponse] = await Promise.all([
        fetch(base),
        fetch(`${base}/readiness-summary`)
      ])

      if (!docsResponse.ok) {
        throw new Error(`Documents API error: ${docsResponse.status}`)
      }
      if (!summaryResponse.ok) {
        throw new Error(`Readiness API error: ${summaryResponse.status}`)
      }

      const docsData: ApiDoc[] = await docsResponse.json()
      const summaryData: ApiSummary = await summaryResponse.json()

      setDocs(docsData.map(mapDocument))
      setSummary(summaryData)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not load documents.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [activeProjectId])

  const counts = {
    total: summary?.total_required_documents ?? 0,
    verified: summary?.verified_documents ?? 0,
    attention: summary?.attention_documents ?? 0,
    missing: summary?.missing_documents ?? 0,
    pending: summary?.pending_documents ?? 0,
  }

  const readiness = summary?.readiness_percentage ?? 0
  const categories = [
    'All',
    ...Array.from(new Set(docs.map(d => d.category))).sort()
  ]

  const filtered = docs.filter(
    d => catFilter === 'All' || d.category === catFilter
  )

  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{
          fontFamily: 'DM Sans', fontSize: 22, fontWeight: 700,
          color: '#0D1B2E', marginBottom: 6
      }}>
          Document &amp; Compliance Readiness
        </h1>
        <p style={{ fontSize: 13, color: '#64748B' }}>
          Pre-validate documents before submission to avoid rejections.
          Verified data is automatically reused across applicable workflows.
        </p>
        {summary && (
          <p style={{ fontSize: 12, color: '#64748B', marginTop: 8 }}>
            {summary.project_name} · {summary.project_code}
          </p>
        )}
      </div>

      {loading && <p style={{ color: '#64748B' }}>Loading documents...</p>}

      {error && (
        <div style={{
          padding: 12, marginBottom: 16, borderRadius: 8,
          background: '#FEF2F2', color: '#B91C1C',
          border: '1px solid #FECACA', fontSize: 13
        }}>
          {error}
          <button onClick={loadData} style={{ marginLeft: 12 }}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Overall readiness */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '240px 1fr',
            gap: 16, marginBottom: 24
          }}>
            <div className="card" style={{
              textAlign: 'center', padding: '20px 16px'
            }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: '#64748B',
                letterSpacing: '0.05em', textTransform: 'uppercase',
                marginBottom: 12
              }}>
                Overall Readiness
              </div>

              <div style={{
                position: 'relative', width: 100, height: 100,
                margin: '0 auto 12px'
              }}>
                <svg viewBox="0 0 36 36" width={100} height={100}>
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#E2E8F0" strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#16A34A" strokeWidth="3"
                    strokeDasharray={`${readiness}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    fontSize: 22, fontWeight: 700,
                    color: '#16A34A', fontFamily: 'DM Sans'
                  }}>
                    {readiness}%
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { status: 'verified', count: counts.verified, color: '#16A34A' },
                  { status: 'pending', count: counts.pending, color: '#2563EB' },
                  { status: 'attention', count: counts.attention, color: '#D97706' },
                  { status: 'missing', count: counts.missing, color: '#DC2626' },
                ].map(s => (
                  <div key={s.status} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: 11, color: '#64748B' }}>
                      {statusLabel[s.status as DocStatus]}
                    </span>
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: s.color, fontFamily: 'JetBrains Mono'
                    }}>
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 10 }}>
                {counts.verified} of {counts.total} requirements verified
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                background: '#EFF6FF', border: '1px solid #BFDBFE',
                borderRadius: 8, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 12
              }}>
                <Shield size={20} color="#2563EB" />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: '#1D4ED8'
                  }}>
                    Pre-Validation Active
                  </div>
                  <div style={{ fontSize: 12, color: '#3B82F6' }}>
                    Review document validation status before submission.
                  </div>
                </div>
                <button onClick={loadData} style={{
                  padding: '6px 14px', borderRadius: 6,
                  background: '#2563EB', color: 'white',
                  border: 'none', fontSize: 12,
                  fontWeight: 600, cursor: 'pointer'
                }}>
                  <RefreshCw size={12} style={{
                    display: 'inline', marginRight: 5
                  }} />
                  Refresh
                </button>
              </div>

              <div className="card" style={{ padding: '12px 16px' }}>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: '#0D1B2E',
                  marginBottom: 10
                }}>
                  Issues Detected
                </div>
                {docs.filter(d => d.issue).length === 0 ? (
                  <div style={{ fontSize: 12, color: '#16A34A' }}>
                    No documents currently flagged for attention.
                  </div>
                ) : docs.filter(d => d.issue).map(d => (
                  <div key={d.id} style={{
                    display: 'flex', gap: 10, padding: '8px 0',
                    borderBottom: '1px solid #F1F5F9'
                  }}>
                    {statusIcon[d.status]}
                    <div>
                      <div style={{
                        fontSize: 12, fontWeight: 600, color: '#0D1B2E'
                      }}>{d.name}</div>
                      <div style={{
                        fontSize: 11,
                        color: d.status === 'missing' ? '#B91C1C' : '#92400E',
                        marginTop: 2
                      }}>{d.issue}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                background: '#F0FDF4', border: '1px solid #BBF7D0',
                borderRadius: 8, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 10
              }}>
                <RefreshCw size={16} color="#16A34A" />
                <div>
                  <div style={{
                    fontSize: 12, fontWeight: 700, color: '#15803D'
                  }}>
                    Verified Data Reuse
                  </div>
                  <div style={{ fontSize: 11, color: '#16A34A' }}>
                    {summary?.reusable_verified_document_count ?? 0}
                    {' '}verified reusable documents available.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category filters */}
          <div style={{
            display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap'
          }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)} style={{
                padding: '4px 12px', borderRadius: 20,
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                background: catFilter === c ? '#1B3A6B' : '#F1F5F9',
                color: catFilter === c ? 'white' : '#64748B',
                border: 'none'
              }}>{c}</button>
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
                  <tr key={d.id}
                    onClick={() => setSelected(d === selected ? null : d)}
                    style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8
                      }}>
                        {statusIcon[d.status]}
                        <div>
                          <div style={{
                            fontSize: 13, fontWeight: 500, color: '#0D1B2E'
                          }}>{d.name}</div>
                          {d.reused && (
                            <div style={{
                              fontSize: 10, color: '#16A34A',
                              fontWeight: 600, marginTop: 1,
                              display: 'flex', alignItems: 'center', gap: 3
                            }}>
                              <RefreshCw size={9} /> Auto-reused
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: '#64748B' }}>
                      {d.category}
                    </td>
                    <td style={{ fontSize: 12, color: '#64748B' }}>
                      {d.approval}
                    </td>
                    <td>
                      <span className={`badge ${statusBadge[d.status]}`}>
                        {statusLabel[d.status]}
                      </span>
                    </td>
                    <td style={{
                      fontSize: 12, color: '#64748B',
                      fontFamily: 'JetBrains Mono'
                    }}>
                      {d.uploaded || '—'}
                    </td>
                    <td>
                      {d.status === 'missing' && (
                        <button onClick={e => e.stopPropagation()} style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          fontSize: 11, fontWeight: 600,
                          padding: '4px 10px', borderRadius: 5,
                          background: '#DC2626', color: 'white',
                          border: 'none', cursor: 'pointer'
                        }}>
                          <Upload size={11} /> Upload
                        </button>
                      )}
                      {d.status === 'attention' && (
                        <button onClick={e => e.stopPropagation()} style={{
                          fontSize: 11, fontWeight: 600,
                          padding: '4px 10px', borderRadius: 5,
                          background: '#D97706', color: 'white',
                          border: 'none', cursor: 'pointer'
                        }}>
                          Fix Issue
                        </button>
                      )}
                      {(d.status === 'verified' || d.status === 'pending') && (
                        <span style={{ fontSize: 11, color: '#94A3B8' }}>
                          View
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding: 20, fontSize: 13, color: '#64748B' }}>
                No documents in this category.
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="card" style={{
              marginTop: 16,
              borderLeft: `3px solid ${
                selected.status === 'verified' ? '#16A34A' :
                selected.status === 'missing' ? '#DC2626' : '#D97706'
              }`
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <div style={{
                    fontSize: 14, fontWeight: 700,
                    color: '#0D1B2E', marginBottom: 4
                  }}>{selected.name}</div>
                  <div style={{
                    display: 'flex', gap: 8, flexWrap: 'wrap'
                  }}>
                    <span className={`badge ${statusBadge[selected.status]}`}>
                      {statusLabel[selected.status]}
                    </span>
                    <span className="badge badge-grey">
                      {selected.category}
                    </span>
                    <span style={{ fontSize: 11, color: '#64748B' }}>
                      Required for: {selected.approval}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{
                  background: 'none', border: 'none',
                  cursor: 'pointer', fontSize: 16, color: '#94A3B8'
                }}>✕</button>
              </div>

              {selected.issue && (
                <div style={{
                  marginTop: 12, padding: '10px 12px',
                  background: selected.status === 'missing' ? '#FEF2F2' : '#FFFBEB',
                  borderRadius: 6,
                  border: `1px solid ${
                    selected.status === 'missing' ? '#FECACA' : '#FDE68A'
                  }`
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700,
                    color: selected.status === 'missing' ? '#B91C1C' : '#92400E',
                    marginBottom: 4
                  }}>ISSUE DETECTED</div>
                  <div style={{ fontSize: 12, color: '#475569' }}>
                    {selected.issue}
                  </div>
                </div>
              )}

              {selected.reused && (
                <div style={{
                  marginTop: 12, padding: '8px 12px',
                  background: '#F0FDF4', borderRadius: 6,
                  border: '1px solid #BBF7D0'
                }}>
                  <div style={{ fontSize: 12, color: '#15803D' }}>
                    <strong>Reusable:</strong> This verified document is
                    marked as reusable for applicable approval workflows.
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}