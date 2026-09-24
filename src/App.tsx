import { useState } from 'react'
import LoginScreen from './screens/LoginScreen'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import ProjectDashboard from './screens/ProjectDashboard'
import ApprovalDiscovery from './screens/ApprovalDiscovery'
import DependencyGraph from './screens/DependencyGraph'
import DocumentReadiness from './screens/DocumentReadiness'
import SLAMonitoring from './screens/SLAMonitoring'
import BottleneckIntelligence from './screens/BottleneckIntelligence'
import GovDashboard from './screens/GovDashboard'
import ComplianceDashboard from './screens/ComplianceDashboard'
import IncentivesSchemes from './screens/IncentivesSchemes'
import RegulatoryAssistant from './screens/RegulatoryAssistant'
import InspectionCoordination from './screens/InspectionCoordination'
import EscalationCenter from './screens/EscalationCenter'
import Analytics from './screens/Analytics'
import OnboardingWizard from './screens/OnboardingWizard'

export type Role = 'applicant' | 'officer' | 'admin'
export type Screen =
  | 'login'
  | 'onboarding'
  | 'dashboard'
  | 'approvals'
  | 'dependency'
  | 'documents'
  | 'sla'
  | 'bottleneck'
  | 'inspection'
  | 'compliance'
  | 'incentives'
  | 'assistant'
  | 'gov-dashboard'
  | 'escalation'
  | 'analytics'

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [role, setRole] = useState<Role>('applicant')

  if (screen === 'login') {
    return (
      <LoginScreen
        onLogin={(r) => {
          setRole(r)
          setScreen(r === 'applicant' ? 'dashboard' : 'gov-dashboard')
        }}
      />
    )
  }

  if (screen === 'onboarding') {
    return (
      <div className="main-content">
        <Topbar role={role} screen={screen} setScreen={setScreen} onLogout={() => setScreen('login')} />
        <OnboardingWizard onComplete={() => setScreen('approvals')} />
      </div>
    )
  }

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard': return <ProjectDashboard setScreen={setScreen} />
      case 'approvals': return <ApprovalDiscovery setScreen={setScreen} />
      case 'dependency': return <DependencyGraph setScreen={setScreen} />
      case 'documents': return <DocumentReadiness setScreen={setScreen} />
      case 'sla': return <SLAMonitoring setScreen={setScreen} />
      case 'bottleneck': return <BottleneckIntelligence setScreen={setScreen} />
      case 'inspection': return <InspectionCoordination setScreen={setScreen} />
      case 'compliance': return <ComplianceDashboard setScreen={setScreen} />
      case 'incentives': return <IncentivesSchemes setScreen={setScreen} />
      case 'assistant': return <RegulatoryAssistant setScreen={setScreen} />
      case 'gov-dashboard': return <GovDashboard setScreen={setScreen} />
      case 'escalation': return <EscalationCenter setScreen={setScreen} />
      case 'analytics': return <Analytics setScreen={setScreen} />
      default: return <ProjectDashboard setScreen={setScreen} />
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role={role} screen={screen} setScreen={setScreen} setRole={setRole} />
      <div className="main-content" style={{ flex: 1 }}>
        <Topbar role={role} screen={screen} setScreen={setScreen} onLogout={() => setScreen('login')} />
        {renderScreen()}
      </div>
    </div>
  )
}
