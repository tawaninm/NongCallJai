import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useSyncExternalStore } from 'react';
import { useAuth } from '@/lib/auth-context';
import { mockStore } from '@/lib/mock-store';
import { StatCard } from '@/components/StatCard';
import { VitalsMonitorCard } from '@/components/prototype/VitalsMonitorCard';
import { CallPatientModal } from '@/components/prototype/CallPatientModal';
import { RiskBadge } from '@/components/RiskBadge';
import {
  Users, ShieldCheck, AlertTriangle, ShieldAlert,
  Activity, ArrowRight, CheckCircle, Bot, MessageSquare,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const { userName } = useAuth();
  const navigate = useNavigate();

  // Use mockStore reactively
  const patients = useSyncExternalStore(mockStore.subscribe, mockStore.getPatients, mockStore.getPatients);
  const alerts = useSyncExternalStore(mockStore.subscribe, mockStore.getAlerts, mockStore.getAlerts);

  // Stats
  const total = patients.length;
  const green = patients.filter(p => p.riskLevel === 'green').length;
  const yellow = patients.filter(p => p.riskLevel === 'yellow').length;
  const red = patients.filter(p => p.riskLevel === 'red').length;

  // Real-time Queue (Red then Yellow)
  const priorityQueue = [...patients.filter(p => p.riskLevel === 'red'), ...patients.filter(p => p.riskLevel === 'yellow')].slice(0, 5);

  // Alerts
  const activeAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">CareGo Platform</h1>
          <p className="text-lg font-semibold border-b-2 border-primary inline-block pb-1 mt-1">ศูนย์ติดตามผู้ป่วยแบบเรียลไทม์</p>
        </div>
        <div className="flex gap-4">
          <select className="rounded-lg border px-4 py-2 text-sm bg-card"><option>All Departments</option></select>
          <select className="rounded-lg border px-4 py-2 text-sm bg-card"><option>All Care Plans</option></select>
          <select className="rounded-lg border px-4 py-2 text-sm bg-card"><option>All Risk Levels</option></select>
          <button className="rounded-lg border bg-muted px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-muted/80">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 4.5H14M4 8.5H12M6.5 12.5H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard title="TOTAL PATIENTS" value={total} trend="+12 from yesterday" icon={Users} variant="teal" onClick={() => navigate({ to: '/patients' })} />
        <StatCard title="STABLE (GREEN)" value={green} trend="Routine monitoring" icon={ShieldCheck} variant="green" onClick={() => navigate({ to: '/patients' })} />
        <StatCard title="WATCH (YELLOW)" value={yellow} trend="Needs attention soon" icon={AlertTriangle} variant="yellow" onClick={() => navigate({ to: '/patients' })} />
        <StatCard title="CRITICAL (RED)" value={red} trend="Immediate action required" icon={ShieldAlert} variant="red" onClick={() => navigate({ to: '/patients' })} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Priority Queue & Agents */}
        <div className="col-span-2 space-y-6">
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-semibold">Real-time Risk Queue</h2>
              <button onClick={() => navigate({ to: '/patients' })} className="text-sm text-primary font-medium hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold">PATIENT</th>
                    <th className="px-5 py-3 text-left font-semibold">RISK LEVEL</th>
                    <th className="px-5 py-3 text-left font-semibold">VITALS</th>
                    <th className="px-5 py-3 text-left font-semibold">AI INSIGHT</th>
                    <th className="px-5 py-3 text-right font-semibold">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {priorityQueue.map(p => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-primary">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.department}, {p.hn}</p>
                      </td>
                      <td className="px-5 py-4"><RiskBadge level={p.riskLevel} /></td>
                      <td className="px-5 py-4">
                        {p.latestBP !== '-' ? <div className="flex items-center gap-1"><Heart className="h-4 w-4 text-risk-red" /> {p.latestBP}</div> : '-'}
                      </td>                      <td className="px-5 py-4 text-xs max-w-[200px] truncate">{p.redFlagReason || p.riskReason}</td>

                      <td className="px-5 py-4 text-xs max-w-[200px] truncate">{p.redFlagReason || p.riskReason}</td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })} className="action-btn action-btn-primary py-1.5 px-4 text-xs">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h2 className="text-lg font-semibold mb-4">AI Agent Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"><Bot className="h-5 w-5" /></div>
                  <div>
                    <p className="font-semibold text-sm">Voice Agents</p>
                    <p className="text-xs text-muted-foreground">42 Active Calls</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">98%</p>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-600 text-white"><MessageSquare className="h-5 w-5" /></div>
                  <div>
                    <p className="font-semibold text-sm">Chatbot Agents</p>
                    <p className="text-xs text-muted-foreground">156 Active Chats</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">99.9%</p>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Alerts & Monitor */}
        <div className="space-y-6">
          <div className="rounded-xl border border-risk-red bg-risk-red-bg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-risk-red flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Red Alerts</h2>
              {activeAlerts.length > 0 && <span className="rounded-full bg-risk-red px-2.5 py-0.5 text-xs font-bold text-white">{activeAlerts.length} New</span>}
            </div>
            <div className="space-y-3">
              {activeAlerts.length === 0 ? (
                <div className="rounded-lg bg-card p-4 text-center text-sm text-muted-foreground">ไม่มีการแจ้งเตือนฉุกเฉิน</div>
              ) : activeAlerts.slice(0, 3).map(a => (
                <div key={a.id} className="rounded-lg bg-card p-4 shadow-sm border border-risk-red/20">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-risk-red text-sm">{a.title}</p>
                    <span className="text-xs text-muted-foreground">{a.timestamp.split(' ')[1]}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{a.description}</p>
                  <button onClick={() => {
                    mockStore.acknowledgeAlert(a.id, userName);
                    toast.success('รับทราบการแจ้งเตือนแล้ว');
                  }} className="w-full action-btn bg-risk-red text-white border-risk-red hover:bg-risk-red/90 py-1.5 justify-center">
                    Acknowledge
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-[#1E293B] p-6 shadow-sm text-white">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold">Focus Monitor</h2>
              <Activity className="h-5 w-5 text-teal" />
            </div>
            <div className="text-center mb-8">
              <p className="text-xs text-white/60 mb-2 uppercase tracking-wider">Heart Rate</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-7xl font-bold text-teal">110</span>
                <span className="text-xl text-white/60">bpm</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-white/10 pt-4">
              <span className="text-white/60">Trend: Rising</span>
              <span className="text-risk-red font-semibold">High Alert</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
