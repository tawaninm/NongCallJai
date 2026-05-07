import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { aiFollowUps, patients } from '@/lib/mock-data';
import { RiskBadge } from '@/components/RiskBadge';
import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle, PhoneOff, XCircle, Phone, Eye, Send, Stethoscope, Pill, Heart, AlertTriangle, Filter } from 'lucide-react';

export const Route = createFileRoute('/ai-followup')({
  component: AIFollowUpPage,
});

const statusIcons = { completed: CheckCircle, no_answer: PhoneOff, failed: XCircle, contacted: Phone };
const statusLabels = { completed: 'สำเร็จ', no_answer: 'ไม่รับสาย', failed: 'ล้มเหลว', contacted: 'ติดต่อแล้ว' };

function AIFollowUpPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const current = aiFollowUps.find(f => f.id === selected);

  const filtered = aiFollowUps.filter(f => {
    if (riskFilter !== 'all' && f.riskLevel !== riskFilter) return false;
    if (statusFilter !== 'all' && f.callStatus !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">ผลการติดตาม AI</h1>
        <span className="text-sm text-muted-foreground">{filtered.length} รายการ</span>
      </div>

      <div className="filter-bar mb-4">
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm">
          <option value="all">ทุกระดับ</option>
          <option value="red">🔴 แดง</option>
          <option value="yellow">🟡 เหลือง</option>
          <option value="green">🟢 เขียว</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm">
          <option value="all">ทุกสถานะ</option>
          <option value="completed">สำเร็จ</option>
          <option value="no_answer">ไม่รับสาย</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-2">
          {filtered.map(f => {
            const Icon = statusIcons[f.callStatus];
            const patient = patients.find(p => p.id === f.patientId);
            return (
              <button
                key={f.id}
                onClick={() => setSelected(f.id)}
                className={`w-full text-left rounded-xl border-l-4 p-4 transition-all hover:shadow-md ${selected === f.id ? 'border-l-primary bg-teal-light shadow-sm' : f.riskLevel === 'red' ? 'border-l-risk-red bg-card' : f.riskLevel === 'yellow' ? 'border-l-risk-yellow bg-card' : 'border-l-risk-green bg-card'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">{f.patientName}</span>
                  <RiskBadge level={f.riskLevel} showLabel={false} />
                </div>
                <p className="text-xs text-muted-foreground">{f.hn} — {patient?.carePlan} — {f.channel}</p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{statusLabels[f.callStatus]}</span>
                  {f.duration !== '0:00' && <span className="text-muted-foreground">({f.duration})</span>}
                  <span className="text-muted-foreground">{f.callTime.split(' ')[1]}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{f.summary}</p>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          {current ? (
            <div className="rounded-xl border bg-card p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">{current.patientName}</h2>
                  <p className="text-sm text-muted-foreground">{current.hn} — {current.callTime} — {current.channel}</p>
                </div>
                <RiskBadge level={current.riskLevel} />
              </div>

              <div className="rounded-lg bg-teal-light p-4">
                <h3 className="text-sm font-semibold mb-1">สรุป AI</h3>
                <p className="text-sm">{current.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border p-3"><span className="text-muted-foreground text-xs">อาการ</span><p className="font-medium mt-0.5">{current.symptoms.length > 0 ? current.symptoms.join(', ') : 'ไม่มี'}</p></div>
                <div className="rounded-lg border p-3"><span className="text-muted-foreground text-xs">การทานยา</span><p className="font-medium mt-0.5">{current.medicationAdherence}</p></div>
                <div className="rounded-lg border p-3"><span className="text-muted-foreground text-xs">สัญญาณชีพ</span><p className="font-medium mt-0.5">{current.vitalSigns}</p></div>
                <div className="rounded-lg border p-3"><span className="text-muted-foreground text-xs">ช่องทาง</span><p className="font-medium mt-0.5">{current.channel}</p></div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold mb-1">เหตุผลการจำแนกระดับ</h3>
                <p className="text-sm text-muted-foreground">{current.riskExplanation}</p>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">ความมั่นใจ: {current.confidence}%</span>
                  <div className="h-2 flex-1 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${current.confidence}%` }} /></div>
                </div>
              </div>

              <div className="rounded-lg border-l-4 border-l-risk-yellow bg-risk-yellow-bg/30 p-3">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> AI ไม่ได้วินิจฉัย — สรุปข้อมูลเพื่อให้เจ้าหน้าที่ตรวจสอบ</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: current.patientId } })} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Eye className="h-4 w-4" /> เปิดเคสผู้ป่วย</button>
                <button onClick={() => toast.success('ส่งเข้าคิวพยาบาลแล้ว')} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"><Send className="h-3.5 w-3.5" /> ส่งคิวพยาบาล</button>
                <button onClick={() => toast.info('ส่งต่อแพทย์แล้ว')} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"><Stethoscope className="h-3.5 w-3.5" /> ส่งแพทย์</button>
                <button onClick={() => toast.info('ส่งต่อเภสัชกรแล้ว')} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"><Pill className="h-3.5 w-3.5" /> ส่งเภสัชกร</button>
                <button onClick={() => toast.info('แจ้งญาติแล้ว')} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"><Heart className="h-3.5 w-3.5" /> แจ้งญาติ</button>
              </div>

              {current.transcript && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">บทสนทนา</h3>
                  <div className="space-y-2 text-sm max-h-[400px] overflow-y-auto">
                    {current.transcript.split('\n').map((line, i) => {
                      const isAI = line.startsWith('AI:');
                      const content = line.replace(/^(AI|ผู้ป่วย): /, '');
                      const hasFlag = current.symptoms.some(s => content.includes(s));
                      return (
                        <div key={i} className={`rounded-lg p-3 ${isAI ? 'bg-teal-light mr-12' : 'bg-muted ml-12'}`}>
                          <p className="text-xs font-semibold text-muted-foreground mb-0.5">{isAI ? '🤖 AI' : '👤 ผู้ป่วย'}</p>
                          <p className={hasFlag ? 'text-risk-red font-medium' : ''}>{content}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-20 text-muted-foreground">
              <Eye className="h-12 w-12 mb-3" />
              <p>เลือกรายการทางซ้ายเพื่อดูรายละเอียด</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
