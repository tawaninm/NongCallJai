/**
 * Shared Action Modals for prototype interactions.
 * Every modal: opens → user confirms → updates mock store → shows toast.
 */
import { useState } from "react";
import { toast } from "sonner";
import { mockStore } from "@/lib/mock-store";
import { useAuth } from "@/lib/auth-context";
import { Phone, PhoneOff, UserCheck, Pill, Heart, X, FileText, Send } from "lucide-react";
import { familyMessageTemplates } from "@/lib/mock-data";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

/* ========== CALL MODAL ========== */
export function CallModal({ open, onClose, patientId, patientName }: ModalProps) {
  const { userName } = useAuth();
  const [status, setStatus] = useState<"idle" | "calling" | "done">("idle");
  const [note, setNote] = useState("");

  if (!open) return null;

  const handleCall = () => setStatus("calling");
  const handleEnd = () => {
    mockStore.logCallback(patientId, note || "โทรกลับสำเร็จ", userName);
    toast.success(`โทรกลับ ${patientName} สำเร็จ`);
    setStatus("idle");
    setNote("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">โทรกลับผู้ป่วย</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="rounded-xl bg-muted/50 p-4 mb-4 text-center">
          <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mb-2">
            {patientName.charAt(0)}
          </div>
          <p className="font-semibold">{patientName}</p>
          <p className="text-xs text-muted-foreground">
            {mockStore.getPatient(patientId)?.hn} · {mockStore.getPatient(patientId)?.phone}
          </p>
          {status === "calling" && (
            <p className="mt-2 text-sm text-primary animate-pulse">📞 กำลังโทร...</p>
          )}
        </div>
        {status === "calling" && (
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="บันทึกผลการโทร..."
            className="w-full rounded-lg border p-3 text-sm mb-4"
            rows={3}
          />
        )}
        <div className="flex gap-2">
          {status === "idle" && (
            <button
              onClick={handleCall}
              className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2"
            >
              <Phone className="h-4 w-4" />
              เริ่มโทร
            </button>
          )}
          {status === "calling" && (
            <button
              onClick={handleEnd}
              className="flex-1 rounded-xl bg-risk-red py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2"
            >
              <PhoneOff className="h-4 w-4" />
              วางสาย & บันทึก
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========== REFER DOCTOR MODAL ========== */
export function ReferDoctorModal({ open, onClose, patientId, patientName }: ModalProps) {
  const { userName } = useAuth();
  const [doctor, setDoctor] = useState("นพ.วิชัย");
  if (!open) return null;
  const handleConfirm = () => {
    mockStore.referDoctor(patientId, doctor, userName);
    toast.success(`ส่งต่อ ${patientName} ให้ ${doctor} แล้ว`);
    onClose();
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            ส่งต่อแพทย์
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          ส่ง <span className="font-semibold text-foreground">{patientName}</span> ให้แพทย์ตรวจสอบ
        </p>
        <select
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          className="w-full rounded-lg border p-2.5 text-sm mb-4"
        >
          <option value="นพ.วิชัย">นพ.วิชัย</option>
          <option value="พญ.สุวรรณี">พญ.สุวรรณี</option>
          <option value="นพ.ธีรศักดิ์">นพ.ธีรศักดิ์</option>
        </select>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border py-2.5 text-sm font-medium">
            ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white"
          >
            ยืนยันส่งต่อ
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========== REFER PHARMACIST MODAL ========== */
export function ReferPharmacistModal({ open, onClose, patientId, patientName }: ModalProps) {
  const { userName } = useAuth();
  if (!open) return null;
  const handleConfirm = () => {
    mockStore.referPharmacist(patientId, userName);
    toast.success(`ส่งต่อ ${patientName} ให้เภสัชกร`);
    onClose();
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Pill className="h-5 w-5 text-purple-600" />
            ส่งต่อเภสัชกร
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm mb-4">
          ยืนยันส่ง <span className="font-semibold">{patientName}</span> เข้าคิวเภสัชกรตรวจสอบ?
        </p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border py-2.5 text-sm font-medium">
            ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========== FAMILY NOTIFY MODAL ========== */
export function FamilyNotifyModal({ open, onClose, patientId, patientName }: ModalProps) {
  const { userName } = useAuth();
  const [template, setTemplate] = useState(familyMessageTemplates[0]?.message || "");
  const patient = mockStore.getPatient(patientId);
  if (!open) return null;
  const handleSend = () => {
    mockStore.notifyFamily(patientId, template, "Custom Message", userName);
    toast.success(`แจ้งญาติ ${patient?.primaryCaregiver || "ญาติ"} ของ ${patientName} สำเร็จ`);
    onClose();
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            แจ้งญาติ / Caregiver
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 mb-3">
          <p className="text-xs text-green-700 font-medium mb-1">📱 LINE Preview</p>
          <p className="text-xs font-semibold">{patient?.primaryCaregiver}</p>
          <p className="text-xs text-muted-foreground">{patient?.caregiverPhone}</p>
        </div>
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="w-full rounded-lg border p-2.5 text-sm mb-2"
        >
          {familyMessageTemplates.map((t) => (
            <option key={t.id} value={t.message}>
              {t.name}
            </option>
          ))}
        </select>
        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="w-full rounded-lg border p-3 text-sm mb-4"
          rows={3}
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border py-2.5 text-sm font-medium">
            ยกเลิก
          </button>
          <button
            onClick={handleSend}
            className="flex-1 rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            ส่ง LINE
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========== CLOSE CASE MODAL ========== */
export function CloseCaseModal({ open, onClose, patientId, patientName }: ModalProps) {
  const { userName } = useAuth();
  const [reason, setReason] = useState("");
  if (!open) return null;
  const handleClose = () => {
    if (!reason.trim()) {
      toast.error("กรุณาระบุเหตุผลในการปิดเคส");
      return;
    }
    mockStore.closeCase(patientId, reason, userName);
    toast.success(`ปิดเคส ${patientName} แล้ว`);
    setReason("");
    onClose();
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            ปิดเคส
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          ปิดเคส <span className="font-semibold text-foreground">{patientName}</span>
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="เหตุผลในการปิดเคส (จำเป็น)..."
          className="w-full rounded-lg border p-3 text-sm mb-4"
          rows={3}
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border py-2.5 text-sm font-medium">
            ยกเลิก
          </button>
          <button
            onClick={handleClose}
            className="flex-1 rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background"
          >
            ปิดเคส
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========== HOOK: useActionModals ========== */
export function useActionModals() {
  const [modal, setModal] = useState<{
    type: string;
    patientId: string;
    patientName: string;
  } | null>(null);
  const open = (type: string, patientId: string, patientName: string) =>
    setModal({ type, patientId, patientName });
  const close = () => setModal(null);
  const Modals = () =>
    modal ? (
      <>
        <CallModal
          open={modal.type === "call"}
          onClose={close}
          patientId={modal.patientId}
          patientName={modal.patientName}
        />
        <ReferDoctorModal
          open={modal.type === "referDoctor"}
          onClose={close}
          patientId={modal.patientId}
          patientName={modal.patientName}
        />
        <ReferPharmacistModal
          open={modal.type === "referPharmacist"}
          onClose={close}
          patientId={modal.patientId}
          patientName={modal.patientName}
        />
        <FamilyNotifyModal
          open={modal.type === "family"}
          onClose={close}
          patientId={modal.patientId}
          patientName={modal.patientName}
        />
        <CloseCaseModal
          open={modal.type === "closeCase"}
          onClose={close}
          patientId={modal.patientId}
          patientName={modal.patientName}
        />
      </>
    ) : null;
  return { open, Modals };
}
