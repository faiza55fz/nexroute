import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import type { Screen } from '../App'

interface Props { setScreen: (s: Screen) => void; onComplete?: () => void }

export default function OnboardingWizard({ setScreen, onComplete }: Props) {
  const [step, setStep] = useState(1)
  const steps = ['Project Profile', 'Sector & Location', 'Project Size', 'Project Stage']
  const [project, setProject] = useState({ name: '', sector: '', location: '', investment: '', stage: '' })

  const next = () => {
    if (step < 4) setStep(step + 1)
    else if (onComplete) onComplete()
    else setScreen('approvals')
  }

  return <div style={{ padding: 24, maxWidth: 900 }}>
    <div style={{ marginBottom: 24 }}><div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Project Onboarding</div><h1 style={{ fontFamily: 'DM Sans', fontSize: 24, color: '#0D1B2E', margin: '4px 0' }}>Create Project Profile</h1><div style={{ fontSize: 12, color: '#64748B' }}>Tell us about the project so the approval roadmap can be personalised.</div></div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>{steps.map((s, i) => <div key={s} style={{ padding: '10px 8px', borderRadius: 6, background: i + 1 <= step ? '#EFF6FF' : '#F8FAFC', border: `1px solid ${i + 1 <= step ? '#BFDBFE' : '#E2E8F0'}`, color: i + 1 <= step ? '#1D4ED8' : '#94A3B8', fontSize: 11, fontWeight: 600, textAlign: 'center' }}>{i + 1}. {s}</div>)}</div>
    <div className="card">
      {step === 1 && <Field label="Project name" value={project.name} onChange={v => setProject({ ...project, name: v })} placeholder="e.g. ABC Manufacturing Plant" />}
      {step === 2 && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}><Field label="Industry / sector" value={project.sector} onChange={v => setProject({ ...project, sector: v })} placeholder="e.g. Chemical Manufacturing" /><Field label="Location" value={project.location} onChange={v => setProject({ ...project, location: v })} placeholder="District, Maharashtra" /></div>}
      {step === 3 && <Field label="Estimated investment" value={project.investment} onChange={v => setProject({ ...project, investment: v })} placeholder="e.g. ₹45 Cr" />}
      {step === 4 && <Field label="Project stage" value={project.stage} onChange={v => setProject({ ...project, stage: v })} placeholder="e.g. Pre-establishment / Construction" />}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}><button className="card-sm" style={{ cursor: 'pointer', border: 0, visibility: step === 1 ? 'hidden' : 'visible' }} onClick={() => setStep(step - 1)}><ArrowLeft size={14} /> Back</button><button style={{ display: 'flex', alignItems: 'center', gap: 7, border: 0, borderRadius: 6, padding: '9px 16px', background: '#1B3A6B', color: '#fff', cursor: 'pointer', fontWeight: 600 }} onClick={next}>{step === 4 ? <><CheckCircle2 size={14} /> Create roadmap</> : <>Continue <ArrowRight size={14} /></>}</button></div>
    </div>
    <button className="card-sm" style={{ marginTop: 12, cursor: 'pointer', border: 0 }} onClick={() => setScreen('dashboard')}>Cancel and return to dashboard</button>
  </div>
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return <label style={{ display: 'block' }}><div style={{ fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 7 }}>{label}</div><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: '100%', boxSizing: 'border-box', padding: '11px 12px', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: 13 }} /></label>
}
