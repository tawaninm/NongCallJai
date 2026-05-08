import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { mockStore } from '@/lib/mock-store';
import { useAuth } from '@/lib/auth-context';
import type { CarePlanType } from '@/lib/mock-data';
import { UserPlus, ChevronRight, ChevronLeft, Check, User, FileText, Heart, Shield } from 'lucide-react';

export const Route = createFileRoute('/register')({
  component: RegistrationWizard,
});

type Step = 1 | 2 | 3 | 4;

const steps = [
  { num: 1, label: 'ข้อมูลผู้ป่วย', icon: User },
  { num: 2, label: 'แผนดูแล', icon: FileText },
  { num: 3, label: 'ผู้ดูแล / ญาติ', icon: Heart },
  { num: 4, label: 'ยินยอม & ยืนยัน', icon: Shield },
];

const carePlanOptions: { type: CarePlanType; label: string; icon: string }[] = [
  { type: 'hypertension', label: 'ความดันโลหิตสูง', icon: '🫀' },
  { type: 'diabetes', label: 'เบาหวานชนิดที่ 2', icon: '🩸' },
  { type: 'heart_failure', label: 'ภาวะหัวใจล้มเหลว', icon: '❤️‍🩹' },
  { type: 'post_op', label: 'หลังผ่าตัด', icon: '🩹' },
  { type: 'medication_adherence', label: 'ติดตามการใช้ยา', icon: '💊' },
];

function RegistrationWizard() {
  const navigate = useNavigate();
  const { userName } = useAuth();
  const [step, setStep] = useState<Step>(1);

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('ชาย');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('อายุรกรรม');
  const [doctor, setDoctor] = useState('นพ.วิชัย');
  const [nurse, setNurse] = useState('พว.สมหญิง');

  const [carePlanType, setCarePlanType] = useState<CarePlanType>('hypertension');
  const [contactChannel, setContactChannel] = useState('โทรศัพท์');

  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverPhone, setCaregiverPhone] = useState('');
  const [familyConsent, setFamilyConsent] = useState('เต็มรูปแบบ');

  const [consent, setConsent] = useState(false);

  const carePlanLabel = carePlanOptions.find(c => c.type === carePlanType)?.label || '';

  const canNext = () => {
    if (step === 1) return name.trim() && age.trim() && phone.trim();
    if (step === 2) return true;
    if (step === 3) return caregiverName.trim();
    if (step === 4) return consent;
    return false;
  };

  const handleSubmit = () => {
    const id = mockStore.addPatient({
      name, age: parseInt(age), gender, phone, department,
      carePlanType, carePlan: carePlanLabel,
      assignedDoctor: doctor, assignedNurse: nurse,
      primaryCaregiver: caregiverName, caregiverPhone,
      familyConsentLevel: familyConsent,
      consentStatus: 'ยินยอม',
    });
    toast.success(`ลงทะเบียน ${name} สำเร็จ`);
    navigate({ to: '/patients/$patientId', params: { patientId: id } });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-2"><UserPlus className="h-7 w-7 text-primary" /> ลงทะเบียนผู้ป่วยใหม่</h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const active = step === s.num;
          const done = step > s.num;
          return (
            <div key={s.num} className="flex items-center">
              <div className={`flex items-center gap-2 ${active ? 'text-primary' : done ? 'text-risk-green' : 'text-muted-foreground'}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${active ? 'bg-primary text-white' : done ? 'bg-risk-green text-white' : 'bg-muted'}`}>
                  {done ? <Check className="h-4 w-4" /> : s.num}
                </div>
                <span className="text-xs font-medium hidden sm:block">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`mx-3 h-px w-8 md:w-16 ${done ? 'bg-risk-green' : 'bg-muted'}`} />}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border bg-card p-6">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold mb-3">ข้อมูลผู้ป่วย</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-muted-foreground">ชื่อ-นามสกุล *</label><input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm mt-1" placeholder="กรอกชื่อ-นามสกุล" /></div>
              <div><label className="text-xs text-muted-foreground">อายุ *</label><input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm mt-1" placeholder="ปี" /></div>
              <div><label className="text-xs text-muted-foreground">เพศ</label><select value={gender} onChange={e => setGender(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm mt-1"><option>ชาย</option><option>หญิง</option></select></div>
              <div><label className="text-xs text-muted-foreground">เบอร์โทร *</label><input value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm mt-1" placeholder="08x-xxx-xxxx" /></div>
              <div><label className="text-xs text-muted-foreground">แผนก</label><select value={department} onChange={e => setDepartment(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm mt-1"><option>อายุรกรรม</option><option>หทัยวิทยา</option><option>ศัลยกรรม</option><option>ต่อมไร้ท่อ</option></select></div>
              <div><label className="text-xs text-muted-foreground">แพทย์เจ้าของไข้</label><select value={doctor} onChange={e => setDoctor(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm mt-1"><option>นพ.วิชัย</option><option>พญ.สุวรรณี</option><option>นพ.ธีรศักดิ์</option></select></div>
              <div><label className="text-xs text-muted-foreground">พยาบาลดูแล</label><select value={nurse} onChange={e => setNurse(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm mt-1"><option>พว.สมหญิง</option><option>พว.วิภา</option></select></div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold mb-3">เลือกแผนการดูแล</h2>
            <div className="grid grid-cols-1 gap-2">
              {carePlanOptions.map(cp => (
                <button key={cp.type} onClick={() => setCarePlanType(cp.type)}
                  className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${carePlanType === cp.type ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted/50'}`}>
                  <span className="text-2xl">{cp.icon}</span>
                  <span className="text-sm font-medium">{cp.label}</span>
                  {carePlanType === cp.type && <Check className="h-4 w-4 text-primary ml-auto" />}
                </button>
              ))}
            </div>
            <div><label className="text-xs text-muted-foreground">ช่องทางติดต่อ</label>
              <select value={contactChannel} onChange={e => setContactChannel(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm mt-1"><option>โทรศัพท์</option><option>LINE</option><option>SMS</option></select>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold mb-3">ข้อมูลผู้ดูแล / ญาติ</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-muted-foreground">ชื่อผู้ดูแล *</label><input value={caregiverName} onChange={e => setCaregiverName(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm mt-1" placeholder="ชื่อ-นามสกุล" /></div>
              <div><label className="text-xs text-muted-foreground">เบอร์โทรผู้ดูแล</label><input value={caregiverPhone} onChange={e => setCaregiverPhone(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm mt-1" placeholder="08x-xxx-xxxx" /></div>
              <div><label className="text-xs text-muted-foreground">ระดับยินยอมญาติ</label>
                <select value={familyConsent} onChange={e => setFamilyConsent(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm mt-1"><option>เต็มรูปแบบ</option><option>เฉพาะเรื่องนัด</option><option>ไม่ยินยอม</option></select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold mb-3">ตรวจสอบ & ยินยอม</h2>
            <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">ผู้ป่วย</span><span className="font-medium">{name} ({gender}, {age} ปี)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">เบอร์โทร</span><span className="font-medium">{phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">แผนก</span><span className="font-medium">{department}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">แผนดูแล</span><span className="font-medium">{carePlanLabel}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">แพทย์</span><span className="font-medium">{doctor}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">พยาบาล</span><span className="font-medium">{nurse}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">ผู้ดูแล</span><span className="font-medium">{caregiverName} ({caregiverPhone})</span></div>
            </div>
            <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">ยินยอมให้ AI ติดตามดูแล</p>
                <p className="text-xs text-muted-foreground mt-0.5">ผู้ป่วยยินยอมให้ระบบ AI โทรติดตามอาการ สัญญาณชีพ และการทานยาหลังจำหน่าย ข้อมูลจะถูกเก็บรักษาตามนโยบาย PDPA</p>
              </div>
            </label>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <button onClick={() => step > 1 ? setStep((step - 1) as Step) : navigate({ to: '/patients' })}
            className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">
            <ChevronLeft className="h-4 w-4" /> {step > 1 ? 'ก่อนหน้า' : 'ยกเลิก'}
          </button>
          {step < 4 ? (
            <button onClick={() => setStep((step + 1) as Step)} disabled={!canNext()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none">
              ถัดไป <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!consent}
              className="inline-flex items-center gap-1.5 rounded-lg bg-risk-green px-5 py-2 text-sm font-bold text-white hover:bg-risk-green/90 disabled:opacity-50 disabled:pointer-events-none">
              <Check className="h-4 w-4" /> ลงทะเบียน
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
