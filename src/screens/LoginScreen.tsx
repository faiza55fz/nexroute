import { useState } from 'react'
import { Building2, ArrowRight, Shield, Compass, CheckCircle, Layers } from 'lucide-react'
import type { Role } from '../App'

interface Props {
  onLogin: (role: Role) => void
}

const roles = [
  {
    id: 'applicant' as Role,
    label: 'Entrepreneur / Applicant',
    desc: 'Discover approvals, track workflow, manage compliance',
    icon: Building2,
    color: '#2563EB',
  },
  {
    id: 'officer' as Role,
    label: 'Government Officer',
    desc: 'Monitor applications, manage SLA, coordinate departments',
    icon: Shield,
    color: '#0891B2',
  },
  {
    id: 'admin' as Role,
    label: 'Nodal / Policy Authority',
    desc: 'Command center, analytics, regulatory intelligence',
    icon: Layers,
    color: '#7C3AED',
  },
]

const pillars = [
  { icon: Compass, label: 'DISCOVER', sub: 'Personalised approval roadmap' },
  { icon: CheckCircle, label: 'PREDICT', sub: 'SLA and bottleneck intelligence' },
  { icon: Shield, label: 'COMPLY', sub: 'Continuous compliance readiness' },
]

const ecosystem = ['MAITRI', 'MIDC Single Window', 'NSWS', 'Dept Portals']
const intelligence = ['DISCOVER', 'VALIDATE', 'COORDINATE', 'PREDICT', 'ESCALATE', 'COMPLY']

export default function LoginScreen({ onLogin }: Props) {
  const [selected, setSelected] = useState<Role>('applicant')

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#0D1B2E',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 64px',
        background: 'linear-gradient(160deg, #0D1B2E 0%, #0F2444 60%, #0D1B2E 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'linear-gradient(135deg, #2563EB, #0891B2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Building2 size={24} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 22, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em' }}>
              NexRoute
            </div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Government of Maharashtra
            </div>
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2563EB', marginBottom: 16 }}>
          Industrial Approval &amp; Compliance Intelligence
        </div>

        <h1 style={{
          fontFamily: 'DM Sans', fontSize: 38, fontWeight: 700, color: '#F1F5F9',
          lineHeight: 1.18, letterSpacing: '-0.02em', marginBottom: 20, maxWidth: 480
        }}>
          From Single Window to Intelligent Approval Orchestration
        </h1>

        <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.7, maxWidth: 440, marginBottom: 40 }}>
          Discover applicable approvals, prepare documents, coordinate dependencies, predict delays and stay compliant throughout the project lifecycle.
        </p>

        {/* Three pillars */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 48 }}>
          {pillars.map(p => {
            const Icon = p.icon
            return (
              <div key={p.label} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, padding: '16px 18px', flex: 1
              }}>
                <Icon size={18} color="#2563EB" style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#93C5FD', marginBottom: 4 }}>
                  {p.label}
                </div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
                  {p.sub}
                </div>
              </div>
            )
          })}
        </div>

        {/* Intelligence layer visual */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 10, padding: '16px 20px'
        }}>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Built on existing government ecosystem
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {ecosystem.map(e => (
              <span key={e} style={{
                fontSize: 11, fontWeight: 600, padding: '3px 8px',
                background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)',
                borderRadius: 4, color: '#60A5FA'
              }}>{e}</span>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#2D3748', marginBottom: 10, textAlign: 'center' }}>↓ NexRoute Intelligence Layer ↓</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {intelligence.map(i => (
              <span key={i} style={{
                fontSize: 10, fontWeight: 700, padding: '3px 8px',
                background: 'rgba(8,145,178,0.12)', border: '1px solid rgba(8,145,178,0.2)',
                borderRadius: 4, color: '#22D3EE', letterSpacing: '0.04em'
              }}>{i}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login */}
      <div style={{
        width: 440,
        background: '#F0F4F8',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px',
      }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'DM Sans', fontSize: 22, fontWeight: 700, color: '#0D1B2E', marginBottom: 6 }}>
            Sign In to NexRoute
          </h2>
          <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>
            Select your role to access the appropriate workspace.
          </p>
        </div>

        {/* Role selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {roles.map(r => {
            const Icon = r.icon
            const isSelected = selected === r.id
            return (
              <div
                key={r.id}
                onClick={() => setSelected(r.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 8, cursor: 'pointer',
                  border: `2px solid ${isSelected ? r.color : '#E2E8F0'}`,
                  background: isSelected ? r.color + '08' : 'white',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: isSelected ? r.color : '#F1F5F9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Icon size={18} color={isSelected ? 'white' : '#94A3B8'} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1B2E', marginBottom: 2 }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.4 }}>
                    {r.desc}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Credentials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Username / UAN / Employee ID
            </label>
            <input
              defaultValue={selected === 'applicant' ? 'MH-APP-2024-0341' : selected === 'officer' ? 'MH-OFF-IND-0087' : 'MH-NDA-001'}
              style={{
                width: '100%', padding: '9px 12px', borderRadius: 6,
                border: '1px solid #CBD5E1', fontSize: 13, background: 'white',
                outline: 'none', color: '#0D1B2E'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Password
            </label>
            <input
              type="password"
              defaultValue="••••••••"
              style={{
                width: '100%', padding: '9px 12px', borderRadius: 6,
                border: '1px solid #CBD5E1', fontSize: 13, background: 'white',
                outline: 'none', color: '#0D1B2E'
              }}
            />
          </div>
        </div>

        <button
          onClick={() => onLogin(selected)}
          style={{
            width: '100%', padding: '12px 24px', borderRadius: 8,
            background: 'linear-gradient(135deg, #1B3A6B, #2563EB)',
            color: 'white', fontSize: 14, fontWeight: 600,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Access NexRoute
          <ArrowRight size={16} />
        </button>

        <div style={{ marginTop: 24, padding: 12, background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 6 }}>
          <div style={{ fontSize: 11, color: '#92400E', fontWeight: 600, marginBottom: 2 }}>DEMO PROTOTYPE</div>
          <div style={{ fontSize: 11, color: '#78716C', lineHeight: 1.4 }}>
            This is a prototype for SIH 2024 evaluation. All data is simulated. Not connected to live government systems.
          </div>
        </div>

        <div style={{ marginTop: 20, fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>
          Integrates with MAITRI · MIDC · NSWS · Dept Systems
        </div>
      </div>
    </div>
  )
}
