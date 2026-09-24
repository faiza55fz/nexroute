import { BookOpen, Search, FileText, ArrowRight } from 'lucide-react'
import type { Screen } from '../App'

interface Props { setScreen: (s: Screen) => void }

const questions = ['Which approvals may apply to my project?', 'What documents are needed for an environmental approval?', 'Which approvals are blocking the current workflow?']

export default function RegulatoryAssistant({ setScreen }: Props) {
  return <div style={{ padding: 24, maxWidth: 1000 }}>
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Regulatory Knowledge Engine</div>
      <h1 style={{ fontFamily: 'DM Sans', fontSize: 24, color: '#0D1B2E', margin: '4px 0' }}>Regulatory Assistant</h1>
      <div style={{ fontSize: 12, color: '#64748B' }}>Ask questions about approvals, documents and compliance requirements.</div>
    </div>
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}><input placeholder="Ask a regulatory question..." style={{ flex: 1, padding: '11px 12px', border: '1px solid #CBD5E1', borderRadius: 6, fontSize: 13 }} /><button style={{ border: 0, borderRadius: 6, padding: '0 16px', background: '#1B3A6B', color: '#fff', cursor: 'pointer' }}><Search size={15} /></button></div>
      <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 10 }}>Prototype assistant · responses should be verified against current official regulations.</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
      <div className="card"><div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}><BookOpen size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />Suggested questions</div>
        {questions.map(q => <button key={q} className="card-sm" style={{ display: 'flex', width: '100%', marginBottom: 8, cursor: 'pointer', border: 0, textAlign: 'left' }}>{q}<ArrowRight size={13} /></button>)}
      </div>
      <div className="card"><div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Demo answer</div>
        <div style={{ fontSize: 12, lineHeight: 1.7, color: '#475569' }}>Based on the current project profile, multiple approvals may be applicable. The approval roadmap should be verified against relevant official rules and department requirements before submission.</div>
        <div style={{ borderTop: '1px solid #F1F5F9', marginTop: 14, paddingTop: 12, fontSize: 11, color: '#64748B' }}><FileText size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} />Source: DEMO regulatory knowledge</div>
      </div>
    </div>
    <button className="card-sm" style={{ cursor: 'pointer', border: 0 }} onClick={() => setScreen('approvals')}>View approval roadmap <ArrowRight size={13} /></button>
    <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 14 }}>Informational prototype only; not legal advice.</div>
  </div>
}
