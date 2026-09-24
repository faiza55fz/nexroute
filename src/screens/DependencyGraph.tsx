import { useState } from 'react'
import { Info, AlertTriangle, ChevronRight, GitBranch } from 'lucide-react'
import type { Screen } from '../App'

interface Props { setScreen: (s: Screen) => void }

type NodeStatus = 'completed' | 'active' | 'blocked' | 'pending' | 'parallel'

interface Node {
  id: string
  label: string
  dept: string
  status: NodeStatus
  sla: number
  days?: number
}

interface Edge {
  from: string
  to: string
  type: 'sequential' | 'parallel'
}

const nodes: Node[] = [
  { id: 'land', label: 'Land Conversion', dept: 'Revenue Dept', status: 'completed', sla: 60, days: 45 },
  { id: 'ec', label: 'Environmental Clearance', dept: 'MoEFCC / SEIAA', status: 'active', sla: 30, days: 21 },
  { id: 'cte', label: 'Consent to Establish', dept: 'MPCB', status: 'active', sla: 45, days: 14 },
  { id: 'bp', label: 'Building Plan Approval', dept: 'Local Authority', status: 'active', sla: 30, days: 8 },
  { id: 'fire', label: 'Fire NOC', dept: 'Fire Services', status: 'pending', sla: 21 },
  { id: 'elec', label: 'Electricity Connection', dept: 'MSEDCL', status: 'pending', sla: 30 },
  { id: 'factory', label: 'Factory Registration', dept: 'Labour Dept', status: 'blocked', sla: 30 },
  { id: 'chemical', label: 'Chemical License (DISH)', dept: 'DISH', status: 'pending', sla: 45 },
  { id: 'final', label: 'Final Commissioning', dept: 'MIDC', status: 'pending', sla: 15 },
]

const criticalPath = ['land', 'ec', 'factory', 'chemical', 'final']
const parallelGroup1 = ['bp', 'fire', 'elec']

const statusClass: Record<NodeStatus, string> = {
  completed: 'dep-node dep-node-completed',
  active: 'dep-node dep-node-active',
  blocked: 'dep-node dep-node-blocked',
  pending: 'dep-node dep-node-pending',
  parallel: 'dep-node dep-node-parallel',
}

const statusLabel: Record<NodeStatus, string> = {
  completed: 'Completed', active: 'Active', blocked: 'Blocked', pending: 'Pending', parallel: 'Parallel'
}

export default function DependencyGraph({ setScreen }: Props) {
  const [selected, setSelected] = useState<string | null>('ec')

  const selectedNode = nodes.find(n => n.id === selected)
  const isCritical = selected ? criticalPath.includes(selected) : false

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'DM Sans', fontSize: 22, fontWeight: 700, color: '#0D1B2E', marginBottom: 6 }}>
          Approval Dependency &amp; Parallel Workflow
        </h1>
        <p style={{ fontSize: 13, color: '#64748B', maxWidth: 560 }}>
          Visualising approval dependencies and opportunities for parallel processing. Critical path analysis helps predict minimum timeline.
        </p>
      </div>

      {/* Alert */}
      <div className="alert-banner alert-warning" style={{ marginBottom: 20 }}>
        <AlertTriangle size={14} />
        <div>
          <strong>Factory Registration is blocked</strong> — waiting for Environmental Clearance (21 of 30 days elapsed).
          This is delaying the critical path by an estimated +12 days.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Graph area */}
        <div className="card" style={{ padding: 24, minHeight: 520 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { cls: 'dep-node-completed', label: 'Completed' },
              { cls: 'dep-node-active', label: 'Active' },
              { cls: 'dep-node-blocked', label: 'Blocked' },
              { cls: 'dep-node-pending', label: 'Pending' },
              { cls: 'dep-node-parallel', label: 'Can Run in Parallel' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className={`dep-node ${l.cls}`} style={{ padding: '2px 8px', minWidth: 'auto', fontSize: 11 }}></div>
                <span style={{ fontSize: 11 }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Dependency visualization */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, position: 'relative' }}>
            {/* Row 1: Land */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <NodeBox node={nodes[0]} selected={selected} setSelected={setSelected} isCritical={criticalPath.includes(nodes[0].id)} />
            </div>

            {/* Arrow */}
            <Arrow />

            {/* Row 2: EC + CTE + BP in parallel */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 4, alignItems: 'flex-start', position: 'relative' }}>
              {/* Parallel bracket */}
              <div style={{
                position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                fontSize: 10, color: '#0891B2', fontWeight: 600, letterSpacing: '0.04em',
                background: '#ECFEFF', border: '1px solid #A5F3FC', borderRadius: 4,
                padding: '1px 8px', whiteSpace: 'nowrap'
              }}>
                Can run in parallel
              </div>
              <NodeBox node={nodes[1]} selected={selected} setSelected={setSelected} isCritical={criticalPath.includes(nodes[1].id)} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
                <NodeBox node={{ ...nodes[3], status: 'parallel' as NodeStatus }} selected={selected} setSelected={setSelected} isCritical={false} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
                <NodeBox node={{ ...nodes[2], status: 'parallel' as NodeStatus }} selected={selected} setSelected={setSelected} isCritical={false} />
              </div>
            </div>

            {/* Arrows from EC and BP */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 4 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Arrow />
                <NodeBox node={nodes[6]} selected={selected} setSelected={setSelected} isCritical={criticalPath.includes(nodes[6].id)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Arrow />
                <NodeBox node={nodes[4]} selected={selected} setSelected={setSelected} isCritical={false} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Arrow />
                <NodeBox node={nodes[5]} selected={selected} setSelected={setSelected} isCritical={false} />
              </div>
            </div>

            {/* Arrow to chemical */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 4 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Arrow />
                <NodeBox node={nodes[7]} selected={selected} setSelected={setSelected} isCritical={criticalPath.includes(nodes[7].id)} />
              </div>
            </div>

            {/* Arrow to final */}
            <Arrow />
            <NodeBox node={nodes[8]} selected={selected} setSelected={setSelected} isCritical={criticalPath.includes(nodes[8].id)} />
          </div>
        </div>

        {/* Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Critical path */}
          <div className="card" style={{ background: '#0D1B2E', borderColor: '#1E3A5F' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F1F5F9', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <GitBranch size={14} color="#60A5FA" />
              Critical Path
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
              {criticalPath.map((id, i) => {
                const node = nodes.find(n => n.id === id)!
                return (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                      background: node.status === 'completed' ? '#16A34A' : node.status === 'active' ? '#2563EB' : node.status === 'blocked' ? '#DC2626' : '#94A3B8'
                    }} />
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{node.label}</span>
                    {i < criticalPath.length - 1 && (
                      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                    )}
                  </div>
                )
              })}
            </div>
            <div style={{ padding: '8px 10px', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: '#FCA5A5', fontWeight: 600, marginBottom: 2 }}>POTENTIAL DELAY</div>
              <div style={{ fontSize: 13, color: '#FCA5A5', fontWeight: 700 }}>+12 days</div>
              <div style={{ fontSize: 11, color: '#7F1D1D', marginTop: 2 }}>Due to blocked Factory Registration</div>
            </div>
            <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(8,145,178,0.12)', border: '1px solid rgba(8,145,178,0.2)', borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: '#67E8F9', fontWeight: 600, marginBottom: 2 }}>PARALLELISATION OPPORTUNITY</div>
              <div style={{ fontSize: 12, color: '#67E8F9' }}>BP + Fire NOC + Electricity can run simultaneously</div>
              <div style={{ fontSize: 11, color: '#164E63', marginTop: 2 }}>Estimated saving: 21 days</div>
            </div>
          </div>

          {/* Selected node detail */}
          {selectedNode && (
            <div className="card">
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>
                Selected Approval
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0D1B2E', marginBottom: 4 }}>{selectedNode.label}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>{selectedNode.dept}</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, marginBottom: 2 }}>STATUS</div>
                  <span className={`badge ${
                    selectedNode.status === 'completed' ? 'badge-green' :
                    selectedNode.status === 'active' || selectedNode.status === 'parallel' ? 'badge-blue' :
                    selectedNode.status === 'blocked' ? 'badge-red' : 'badge-grey'
                  }`}>{statusLabel[selectedNode.status]}</span>
                </div>
                <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, marginBottom: 2 }}>SLA</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0D1B2E', fontFamily: 'JetBrains Mono' }}>{selectedNode.sla}d</div>
                </div>
              </div>

              {selectedNode.id === 'ec' && (
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, padding: '8px 10px', background: '#FFFBEB', borderRadius: 6, border: '1px solid #FDE68A' }}>
                  <strong>Risk:</strong> 21 of 30 days elapsed. Environmental Clearance is on the critical path — any delay blocks Factory Registration and Chemical License.
                </div>
              )}
              {selectedNode.id === 'factory' && (
                <div style={{ fontSize: 12, color: '#B91C1C', lineHeight: 1.6, padding: '8px 10px', background: '#FEF2F2', borderRadius: 6, border: '1px solid #FECACA' }}>
                  <strong>Blocked:</strong> Factory Registration requires Environmental Clearance to be completed first.
                </div>
              )}

              {isCritical && (
                <div style={{ marginTop: 8, padding: '6px 10px', background: '#EFF6FF', borderRadius: 6, border: '1px solid #BFDBFE' }}>
                  <div style={{ fontSize: 11, color: '#1D4ED8', fontWeight: 600 }}>On Critical Path</div>
                  <div style={{ fontSize: 11, color: '#3B82F6' }}>Any delay here affects the project timeline.</div>
                </div>
              )}
            </div>
          )}

          {/* Parallel groups */}
          <div className="card">
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0D1B2E', marginBottom: 10 }}>
              Parallel Workflows
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 10 }}>
              These approvals can be pursued simultaneously to save time:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Building Plan Approval', 'Fire NOC', 'Electricity Connection', 'MPCB Consent to Establish'].map(n => (
                <div key={n} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
                  background: '#ECFEFF', border: '1px solid #A5F3FC', borderRadius: 6
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0891B2', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#0E7490', fontWeight: 500 }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Arrow() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2px 0' }}>
      <div style={{ width: 1, height: 18, background: '#CBD5E1' }} />
      <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #CBD5E1' }} />
    </div>
  )
}

function NodeBox({
  node, selected, setSelected, isCritical
}: {
  node: Node, selected: string | null, setSelected: (id: string) => void, isCritical: boolean
}) {
  const isSelected = selected === node.id
  return (
    <div
      className={`dep-node ${node.status === 'completed' ? 'dep-node-completed' :
        node.status === 'active' ? 'dep-node-active' :
        node.status === 'blocked' ? 'dep-node-blocked' :
        node.status === 'parallel' ? 'dep-node-parallel' :
        'dep-node-pending'}`}
      style={{
        boxShadow: isSelected ? '0 0 0 2px #2563EB' : isCritical ? '0 0 0 1px #D97706' : undefined,
        position: 'relative'
      }}
      onClick={() => setSelected(node.id)}
    >
      {isCritical && (
        <div style={{
          position: 'absolute', top: -8, right: -4,
          fontSize: 9, fontWeight: 700, color: '#92400E',
          background: '#FEF3C7', border: '1px solid #FDE68A',
          borderRadius: 3, padding: '1px 4px', letterSpacing: '0.04em'
        }}>CRITICAL</div>
      )}
      <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 2 }}>{node.label}</div>
      <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 400 }}>{node.dept}</div>
      {node.days && (
        <div style={{ fontSize: 10, marginTop: 3, fontFamily: 'JetBrains Mono' }}>
          {node.days}/{node.sla}d
        </div>
      )}
    </div>
  )
}
