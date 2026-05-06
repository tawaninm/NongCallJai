import { createFileRoute } from '@tanstack/react-router';
import { aiFollowUps } from '@/lib/mock-data';
import { RiskBadge } from '@/components/RiskBadge';
import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle, PhoneOff, XCircle, Phone, Eye, Send } from 'lucide-react';

export const Route = createFileRoute('/ai-followup')({
  component: AIFollowUpPage,
});

const statusIcons = { completed: CheckCircle, no_answer: PhoneOff, failed: XCircle, contacted: Phone };
const statusLabels = { completed: 'สำเร็จ', no_answer: 'ไม่รับสาย', failed: 'ล้มเหลว', contacted: 'ติดต่อแล้ว' };

function AIFollowUpPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const current = aiFollowUps.find(f => f.id === selected);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">ผลการติดตาม AI</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-3">
          {aiFollowUps.map(f => {
            const Icon = statusIcons[f.callStatus];
            return (
              <button
                key={f.id}
                onClick={() => setSelected(f.id)}
                className={`w-full text-left rounded-xl border p-4 transition-colors ${selected === f.id ? 'border-primary bg-teal-light' : 'bg-card hover:bg-muted/50'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{f.patientName}</span>
                  <RiskBadge level={f.riskLevel} />
                </div>
                <p className="text-xs text-muted-foreground">{f.hn} — {f.callTime}</p>
                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{statusLabels[f.callStatus]}</span>
                  {f.duration !== '0:00' && <span className="text-muted-foreground">({f.duration})</span>}
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
                  <p className="text-sm text-muted-foreground">{current.hn} — {current.callTime}</p>
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
                <div className="rounded-lg border p-3"><span className="text-muted-foreground text-xs">ความเข้าใจนัดพบ</span><p className="font-medium mt-0.5">{current.appointmentUnderstanding}</p></div>
                <div className="rounded-lg border p-3"><span className="text-muted-foreground text-xs">เสี่ยงล้ม</span><p className="font-medium mt-0.5">{current.fallRisk}</p></div>
                <div className="rounded-lg border p-3"><span className="text-muted-foreground text-xs">ผู้ดูแล</span><p className="font-medium mt-0.5">{current.caregiverAvailability}</p></div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold mb-1">เหตุผลการจำแนกระดับ</h3>
                <p className="text-sm text-muted-foreground">{current.riskExplanation}</p>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">ความมั่นใจ: {current.confidence}%</span>
                  <div className="h-2 flex-1 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${current.confidence}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked={current.humanReviewRequired} className="rounded border" />
                  ต้องให้มนุษย์ตรวจสอบ
                </label>
                <button onClick={() => toast.success('ส่งเข้าคิวพยาบาลแล้ว')} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  <Send className="h-4 w-4" /> ส่งเข้าคิวพยาบาล
                </button>
              </div>

              {current.transcript && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">บทสนทนา</h3>
                  <div className="space-y-2 text-sm max-h-[300px] overflow-y-auto">
                    {current.transcript.split('\n').map((line, i) => {
                      const isAI = line.startsWith('AI:');
                      return (
                        <div key={i} className={`rounded-lg p-3 ${isAI ? 'bg-teal-light mr-12' : 'bg-muted ml-12'}`}>
                          <p className="text-xs font-semibold text-muted-foreground mb-0.5">{isAI ? '🤖 AI' : '👤 ผู้ป่วย'}</p>
                          <p>{line.replace(/^(AI|ผู้ป่วย): /, '')}</p>
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
