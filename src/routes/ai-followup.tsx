import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useSyncExternalStore, useState } from 'react';
import { mockStore } from '@/lib/mock-store';
import { RiskBadge } from '@/components/RiskBadge';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { useActionModals } from '@/components/ActionModals';
import { Phone, CheckCircle, PhoneOff, XCircle, Search, Filter, Send, Bot, AlertTriangle, User } from 'lucide-react';

export const Route = createFileRoute('/ai-followup')({
  component: AIFollowUpPage,
});

const statusIcons = { completed: CheckCircle, no_answer: PhoneOff, failed: XCircle, contacted: Phone };
const statusLabels = { completed: 'สำเร็จ', no_answer: 'ไม่รับสาย', failed: 'ล้มเหลว', contacted: 'ติดต่อแล้ว' };

function AIFollowUpPage() {
  const navigate = useNavigate();
  const { userName } = useAuth();
  const followUps = useSyncExternalStore(mockStore.subscribe, mockStore.getFollowUps, mockStore.getFollowUps);
  const patients = useSyncExternalStore(mockStore.subscribe, mockStore.getPatients, mockStore.getPatients);
  const { open: openModal, Modals } = useActionModals();
  
  const [selected, setSelected] = useState<string | null>(followUps[0]?.id || null);
  const [riskFilter, setRiskFilter] = useState<string>('all');
  
  const filtered = followUps.filter(f => {
    if (riskFilter !== 'all' && f.riskLevel !== riskFilter) return false;
    return true;
  });

  const current = followUps.find(f => f.id === selected);
  const patient = current ? patients.find(p => p.id === current.patientId) : null;

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">
      {/* Left Column - List */}
      <div className="w-[380px] flex flex-col rounded-xl border bg-card overflow-hidden shrink-0 shadow-sm">
        <div className="p-4 border-b bg-muted/30">
          <h2 className="font-bold text-lg mb-4">ผลการติดตาม AI</h2>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="ค้นหาผู้ป่วย..." className="w-full rounded-lg border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <button className="rounded-lg border bg-background p-1.5 text-muted-foreground hover:bg-muted"><Filter className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(f => {
            const p = patients.find(x => x.id === f.patientId);
            return (
              <button
                key={f.id} onClick={() => setSelected(f.id)}
                className={`w-full text-left p-4 border-b border-l-4 transition-colors hover:bg-muted/30 ${selected === f.id ? 'bg-muted/50 border-l-primary' : f.riskLevel === 'red' ? 'border-l-risk-red' : f.riskLevel === 'yellow' ? 'border-l-risk-yellow' : 'border-l-risk-green'}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-semibold">{f.patientName}</span>
                  <span className="text-xs text-muted-foreground">{f.callTime.split(' ')[1]}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <RiskBadge level={f.riskLevel} />
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{p?.carePlanType === 'diabetes' ? 'เบาหวาน' : p?.carePlanType === 'hypertension' ? 'ความดัน' : 'ทั่วไป'}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{f.summary}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column - Detail */}
      <div className="flex-1 flex flex-col rounded-xl border bg-card overflow-hidden shadow-sm">
        {current && patient ? (
          <>
            <div className="p-5 border-b flex items-center justify-between bg-muted/10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {current.patientName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold">{current.patientName}</h2>
                    <RiskBadge level={current.riskLevel} />
                  </div>
                  <p className="text-sm text-muted-foreground">HN: {current.hn} • {patient.carePlan}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: current.patientId } })}
                  className="action-btn bg-background border hover:bg-muted"
                >
                  เปิดเคสผู้ป่วย
                </button>
                <button 
                  onClick={() => { mockStore.sendToNurseQueue(current.id, userName); toast.success('ส่งเข้าคิวพยาบาลแล้ว'); }}
                  className="action-btn action-btn-primary"
                >
                  <Send className="h-4 w-4" /> ส่งเข้าคิวพยาบาล
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex gap-6">
              {/* Transcript */}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-4">บทสนทนา (Transcript)</h3>
                <div className="space-y-4">
                  {current.transcript?.split('\n').map((line, i) => {
                    if (!line.trim()) return null;
                    const isAI = line.startsWith('AI:');
                    const content = line.replace(/^(AI|ผู้ป่วย): /, '');
                    const hasRedFlag = current.symptoms.some(s => content.includes(s));
                    
                    return (
                      <div key={i} className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${isAI ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>
                          {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </div>
                        <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} max-w-[80%]`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-muted-foreground">{isAI ? 'AI Agent' : current.patientName}</span>
                            <span className="text-[10px] text-muted-foreground">10:0{i} AM</span>
                          </div>
                          <div className={`p-3 rounded-2xl text-sm shadow-sm ${isAI ? 'bg-muted/50 rounded-tl-sm' : 'bg-primary text-white rounded-tr-sm'} ${hasRedFlag && !isAI ? 'border-2 border-risk-red bg-risk-red text-white' : ''}`}>
                            {content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Extraction */}
              <div className="w-[320px] shrink-0 space-y-4">
                <div className="rounded-xl border bg-muted/10 p-5">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-primary">
                    <Bot className="h-5 w-5" /> AI สรุปข้อมูล
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">สรุปอาการ</p>
                      <p className="text-sm font-medium">{current.summary}</p>
                    </div>
                    
                    <div className="h-px bg-border" />
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">ข้อมูลที่สกัดได้ (Extraction)</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">อาการ</span>
                          <span className="font-semibold text-risk-red text-right">{current.symptoms.length > 0 ? current.symptoms.join(', ') : '-'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">การใช้ยา</span>
                          <span className="font-semibold text-right">{current.medicationAdherence}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">ระดับความเสี่ยง</span>
                          <span className={`font-semibold text-right ${current.riskLevel === 'red' ? 'text-risk-red' : current.riskLevel === 'yellow' ? 'text-risk-yellow' : 'text-risk-green'}`}>
                            {current.riskLevel.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-px bg-border" />
                    
                    <div className="rounded-lg bg-risk-yellow-bg/50 p-3 flex gap-2">
                      <AlertTriangle className="h-4 w-4 text-risk-yellow shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-risk-yellow mb-1">AI Recommendation</p>
                        <p className="text-xs text-muted-foreground">{current.riskExplanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <Bot className="h-16 w-16 mb-4 opacity-20" />
            <p>กรุณาเลือกรายการทางซ้ายเพื่อดูรายละเอียด</p>
          </div>
        )}
      </div>
      <Modals />
    </div>
  );
}
