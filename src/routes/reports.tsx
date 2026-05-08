import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { patients, aiFollowUps } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import { StatCard } from '@/components/StatCard';
import {
  BarChart3, TrendingUp, Users, Phone, AlertTriangle, Pill,
  Activity, Calendar, FileText, Download, Filter
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';

export const Route = createFileRoute('/reports')({
  component: ReportsPage,
});

const COLORS = {
  red: '#ef4444',
  yellow: '#f59e0b',
  green: '#22c55e',
  teal: '#14b8a6',
  blue: '#3b82f6',
  purple: '#8b5cf6',
};

function ReportsPage() {
  const { role } = useAuth();
  const [period, setPeriod] = useState<'week' | 'month' | '3months'>('week');

  const green = patients.filter(p => p.riskLevel === 'green').length;
  const yellow = patients.filter(p => p.riskLevel === 'yellow').length;
  const red = patients.filter(p => p.riskLevel === 'red').length;
  const completed = aiFollowUps.filter(f => f.callStatus === 'completed').length;
  const noAnswer = aiFollowUps.filter(f => f.callStatus === 'no_answer').length;
  const medIssues = patients.filter(p => p.medicationStatus !== 'ทานยาครบ').length;
  const closedCases = patients.filter(p => p.caseStatus === 'closed').length;

  const riskDistribution = [
    { name: 'สีแดง (วิกฤต)', value: red, color: COLORS.red },
    { name: 'สีเหลือง (เฝ้าระวัง)', value: yellow, color: COLORS.yellow },
    { name: 'สีเขียว (ปกติ)', value: green, color: COLORS.green },
  ];

  const diseaseBreakdown = [
    { name: 'ความดันสูง', count: patients.filter(p => p.carePlanType === 'hypertension').length, color: COLORS.red },
    { name: 'เบาหวาน', count: patients.filter(p => p.carePlanType === 'diabetes').length, color: COLORS.blue },
    { name: 'หัวใจล้มเหลว', count: patients.filter(p => p.carePlanType === 'heart_failure').length, color: COLORS.purple },
    { name: 'หลังผ่าตัด', count: patients.filter(p => p.carePlanType === 'post_op').length, color: COLORS.teal },
  ];

  const weeklyTrend = [
    { day: 'จันทร์', aiCalls: 12, nurseCalls: 5, closedCases: 3, newRed: 2 },
    { day: 'อังคาร', aiCalls: 15, nurseCalls: 7, closedCases: 5, newRed: 1 },
    { day: 'พุธ', aiCalls: 10, nurseCalls: 4, closedCases: 4, newRed: 3 },
    { day: 'พฤหัส', aiCalls: 18, nurseCalls: 8, closedCases: 6, newRed: 1 },
    { day: 'ศุกร์', aiCalls: 14, nurseCalls: 6, closedCases: 5, newRed: 2 },
    { day: 'เสาร์', aiCalls: 5, nurseCalls: 2, closedCases: 2, newRed: 0 },
    { day: 'อาทิตย์', aiCalls: 3, nurseCalls: 1, closedCases: 1, newRed: 1 },
  ];

  const callOutcome = [
    { name: 'โทรสำเร็จ', value: completed, color: COLORS.green },
    { name: 'ไม่รับสาย', value: noAnswer, color: COLORS.yellow },
    { name: 'ล้มเหลว', value: aiFollowUps.filter(f => f.callStatus === 'failed').length, color: COLORS.red },
  ];

  const caseStatusData = [
    { name: 'รอติดตาม', count: patients.filter(p => p.caseStatus === 'pending').length },
    { name: 'ติดต่อแล้ว', count: patients.filter(p => p.caseStatus === 'contacted').length },
    { name: 'รอโทรกลับ', count: patients.filter(p => p.caseStatus === 'callback').length },
    { name: 'ส่งแพทย์', count: patients.filter(p => p.caseStatus === 'referred_doctor').length },
    { name: 'ส่งเภสัชกร', count: patients.filter(p => p.caseStatus === 'referred_pharmacist').length },
    { name: 'ปิดเคส', count: closedCases },
  ];

  const performanceMetrics = [
    { label: 'เวลาเฉลี่ยปิดเคส', value: '2.3 วัน', trend: '↓ 0.5 วัน' },
    { label: 'อัตราโทรสำเร็จ', value: `${Math.round(completed / aiFollowUps.length * 100)}%`, trend: '↑ 5%' },
    { label: 'อัตราส่งต่อแพทย์', value: `${Math.round(patients.filter(p => p.caseStatus === 'referred_doctor').length / patients.length * 100)}%`, trend: '→ เท่าเดิม' },
    { label: 'ปัญหายารวม', value: medIssues, trend: '↓ 2 ราย' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">รายงานและวิเคราะห์</h1>
          <p className="text-sm text-muted-foreground">ข้อมูลสรุปการติดตามดูแลผู้ป่วย</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border bg-card overflow-hidden">
            {(['week', 'month', '3months'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${period === p ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                {p === 'week' ? 'สัปดาห์' : p === 'month' ? 'เดือน' : '3 เดือน'}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted">
            <Download className="h-3.5 w-3.5" /> ส่งออก PDF
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-6">
        <StatCard title="ผู้ป่วยทั้งหมด" value={patients.length} icon={Users} variant="teal" />
        <StatCard title="AI โทรสำเร็จ" value={`${Math.round(completed / aiFollowUps.length * 100)}%`} icon={Phone} variant="green" />
        <StatCard title="ผู้ป่วยสีแดง" value={red} icon={AlertTriangle} variant="red" />
        <StatCard title="ปัญหาการใช้ยา" value={medIssues} icon={Pill} variant="yellow" />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-6">
        {performanceMetrics.map((m, i) => (
          <div key={i} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className="text-xl font-bold mt-1">{m.value}</p>
            <p className="text-xs text-teal mt-0.5">{m.trend}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6">
        {/* Risk Distribution Pie */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="section-title flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-primary" /> การกระจายระดับความเสี่ยง
          </h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                  paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Call Outcome Pie */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="section-title flex items-center gap-2 mb-4">
            <Phone className="h-4 w-4 text-primary" /> ผลการโทร AI
          </h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={callOutcome} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                  paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {callOutcome.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6">
        {/* Weekly Trend */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="section-title flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" /> แนวโน้มรายสัปดาห์
          </h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="aiCalls" name="AI โทร" stroke={COLORS.teal} fill={COLORS.teal} fillOpacity={0.15} />
                <Area type="monotone" dataKey="nurseCalls" name="พยาบาลโทร" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.15} />
                <Area type="monotone" dataKey="closedCases" name="ปิดเคส" stroke={COLORS.green} fill={COLORS.green} fillOpacity={0.15} />
                <Area type="monotone" dataKey="newRed" name="เคสแดงใหม่" stroke={COLORS.red} fill={COLORS.red} fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disease Breakdown Bar */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="section-title flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-primary" /> จำนวนผู้ป่วยตามโรค
          </h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" name="จำนวนผู้ป่วย" radius={[0, 6, 6, 0]}>
                  {diseaseBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Case Status Funnel */}
      <div className="rounded-xl border bg-card p-5 mb-6">
        <h2 className="section-title flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-primary" /> สถานะเคสทั้งหมด
        </h2>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={caseStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" name="จำนวนเคส" fill={COLORS.teal} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Summary Table */}
      {role === 'admin' && (
        <div className="rounded-xl border bg-card p-5">
          <h2 className="section-title flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-primary" /> สรุปผลงานทีม
          </h2>
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ผู้ดูแล</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">เคสรับผิดชอบ</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ปิดเคสแล้ว</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">เคสแดง</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">เวลาเฉลี่ย</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'พย.สมศรี', total: 8, closed: 5, red: 1, avg: '1.8 วัน' },
                { name: 'พย.วิภา', total: 6, closed: 3, red: 2, avg: '2.5 วัน' },
                { name: 'พย.นิตยา', total: 5, closed: 4, red: 0, avg: '1.5 วัน' },
              ].map((s, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3">{s.total}</td>
                  <td className="px-4 py-3 text-risk-green font-medium">{s.closed}</td>
                  <td className="px-4 py-3 text-risk-red font-medium">{s.red}</td>
                  <td className="px-4 py-3">{s.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
