import { useState } from 'react';
import { X, Volume2, Mic, PhoneOff, Phone } from 'lucide-react';
import { RiskBadge } from '@/components/RiskBadge';
import { mockStore } from '@/lib/mock-store';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  hn?: string;
  age?: number;
  riskLevel?: 'green' | 'yellow' | 'red';
  appointment?: string;
}

export function CallPatientModal({ open, onClose, patientId, patientName, hn, age, riskLevel, appointment }: Props) {
  const { userName } = useAuth();
  const [calling, setCalling] = useState(true);
  const [note, setNote] = useState('');

  if (!open) return null;

  const handleEndCall = () => {
    setCalling(false);
  };

  const handleSave = () => {
    mockStore.completeCallback(patientId, note || 'โทรกลับสำเร็จ', userName);
    toast.success('บันทึกการโทรกลับสำเร็จ');
    setCalling(true);
    setNote('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-sm" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        
        <h2 className="text-lg font-bold mb-4">{calling ? 'กำลังโทร...' : 'บันทึกผลการโทร'}</h2>
        
        <div className="flex items-center gap-3 mb-4 pb-4 border-b">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-light text-teal font-bold text-lg">
            {patientName.charAt(0)}
          </div>
          <div>
            <p className="font-bold">{hn || ''}</p>
            <p className="text-sm text-muted-foreground">{patientName}</p>
          </div>
        </div>

        <div className="flex justify-between text-sm mb-4">
          <div><span className="text-muted-foreground">ความเสี่ยง</span><p className="font-medium">{age || '-'}</p></div>
          <div><span className="text-muted-foreground">นัดหมายถัดไป</span><p className="font-medium">{appointment || '-'}</p></div>
        </div>

        {riskLevel && <div className="mb-4"><RiskBadge level={riskLevel} /></div>}

        {calling ? (
          <>
            <div className="flex justify-center gap-4 mb-4">
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"><Volume2 className="h-5 w-5" /></button>
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"><Mic className="h-5 w-5" /></button>
              <button onClick={handleEndCall} className="flex h-12 w-12 items-center justify-center rounded-full bg-risk-red text-white hover:bg-risk-red/90 transition-colors"><PhoneOff className="h-5 w-5" /></button>
            </div>
            <div className="rounded-lg bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground">
              <Phone className="inline h-4 w-4 mr-1" /> กำลังโทร
            </div>
          </>
        ) : (
          <>
            <textarea 
              value={note} onChange={e => setNote(e.target.value)}
              placeholder="บันทึกผลการโทร..."
              className="w-full rounded-lg border p-3 text-sm min-h-[80px] mb-3"
            />
            <button onClick={handleSave} className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              บันทึกผล
            </button>
          </>
        )}
      </div>
    </div>
  );
}
