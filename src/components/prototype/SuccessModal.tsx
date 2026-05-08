import { CheckCircle } from 'lucide-react';

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  onOk: () => void;
}

export function SuccessModal({ open, title = 'เพิ่มผู้ป่วยสำเร็จ', description, onOk }: Props) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-sm text-center" onClick={e => e.stopPropagation()}>
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-risk-green-bg">
            <CheckCircle className="h-10 w-10 text-risk-green" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {description || 'ข้อมูลผู้ป่วยถูกบันทึกและส่งไปยังระบบแล้ว\nกำลังเปลี่ยนเส้นทางไปยังหน้าโปรไฟล์ผู้ป่วย...'}
        </p>
        <button onClick={onOk} className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          ตกลง
        </button>
      </div>
    </div>
  );
}
