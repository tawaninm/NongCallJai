import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { mockStore } from "@/lib/mock-store";
import { useAuth } from "@/lib/auth-context";
import type { CarePlanType } from "@/lib/mock-data";
import {
  UserPlus,
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  FileText,
  Heart,
  Shield,
} from "lucide-react";
import { SuccessModal } from "@/components/prototype/SuccessModal";

export const Route = createFileRoute("/register")({
  component: RegistrationWizard,
});

type Step = 1 | 2 | 3 | 4;

const steps = [
  { num: 1, label: "ข้อมูลผู้ป่วย (Patient Info)", icon: User },
  { num: 2, label: "ผู้ดูแล (Caregiver)", icon: Heart },
  { num: 3, label: "ความยินยอม (Consent)", icon: Shield },
  { num: 4, label: "เลือกแผนการดูแล (Care Plan Selection)", icon: FileText },
];

function RegistrationWizard() {
  const navigate = useNavigate();
  const { userName } = useAuth();
  const [step, setStep] = useState<Step>(1);

  // Form state
  const [hn, setHn] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("อายุรกรรม");
  const [age, setAge] = useState("");
  const [disease, setDisease] = useState("ความดันโลหิตสูง");
  const [gender, setGender] = useState("ชาย");
  const [channel, setChannel] = useState("โทรศัพท์");

  // Caregiver state
  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverPhone, setCaregiverPhone] = useState("");

  // Consent
  const [familyConsent, setFamilyConsent] = useState("เต็มรูปแบบ");

  // Care Plan
  const [carePlanType, setCarePlanType] = useState<CarePlanType>("hypertension");

  const [showSuccess, setShowSuccess] = useState(false);
  const [newPatientId, setNewPatientId] = useState("");

  const canNext = () => {
    if (step === 1) return name.trim() && age.trim() && phone.trim() && hn.trim();
    if (step === 2) return caregiverName.trim();
    if (step === 3) return true;
    if (step === 4) return true;
    return false;
  };

  const handleSubmit = () => {
    const id = mockStore.createPatientFromRegistration({
      hn,
      name,
      age: parseInt(age),
      gender,
      phone,
      department,
      disease,
      carePlanType,
      channel,
      doctor: "นพ.วิชัย",
      nurse: "พว.สมหญิง",
      caregiverName,
      caregiverPhone,
      familyConsent,
    });
    setNewPatientId(id);
    setShowSuccess(true);
  };

  const handleSuccessOk = () => {
    navigate({ to: "/patients/$patientId", params: { patientId: newPatientId } });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          3. Patient Registration / ลงทะเบียนผู้ป่วย
        </h1>
      </div>

      {/* Stepper matching screen 9.png */}
      <div className="flex mb-8 rounded-lg overflow-hidden border bg-muted/20">
        {steps.map((s, i) => {
          const active = step === s.num;
          const done = step > s.num;
          return (
            <div
              key={s.num}
              className={`flex-1 flex flex-col items-center justify-center py-4 relative ${active ? "bg-primary text-white" : "text-muted-foreground"}`}
            >
              <div className="font-bold">
                {s.num}. {s.label.split(" ")[0]}
              </div>
              <div className="text-xs opacity-80">
                {s.label.split(" ").slice(1).join(" ").replace(/[()]/g, "")}
              </div>
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center translate-x-1/2 z-10">
                  <div
                    className={`w-0 h-0 border-t-[36px] border-t-transparent border-b-[36px] border-b-transparent border-l-[24px] ${active ? "border-l-primary" : "border-l-muted/20"}`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border bg-card p-8">
        {step === 1 && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label className="text-sm text-muted-foreground font-medium mb-1.5 block">
                HN (Hospital Number)
              </label>
              <input
                value={hn}
                onChange={(e) => setHn(e.target.value)}
                className="w-full rounded-lg border px-4 py-2.5 bg-muted/20"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground font-medium mb-1.5 block">
                เบอร์โทรศัพท์ (Phone)
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border px-4 py-2.5 bg-muted/20"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground font-medium mb-1.5 block">
                ชื่อ-นามสกุล (Name-Surname)
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border px-4 py-2.5 bg-muted/20"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground font-medium mb-1.5 block">
                แผนก (Department)
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-lg border px-4 py-2.5 bg-muted/20"
              >
                <option>อายุรกรรม</option>
                <option>ศัลยกรรม</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground font-medium mb-1.5 block">
                อายุ (Age)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-lg border px-4 py-2.5 bg-muted/20"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground font-medium mb-1.5 block">
                โรคหลัก (Main Disease)
              </label>
              <select
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                className="w-full rounded-lg border px-4 py-2.5 bg-muted/20"
              >
                <option>ความดันโลหิตสูง</option>
                <option>เบาหวานชนิดที่ 2</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground font-medium mb-1.5 block">
                เพศ (Gender)
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-lg border px-4 py-2.5 bg-muted/20"
              >
                <option>ชาย</option>
                <option>หญิง</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground font-medium mb-1.5 block">
                ช่องทางติดต่อ (Channel)
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full rounded-lg border px-4 py-2.5 bg-muted/20"
              >
                <option>โทรศัพท์</option>
                <option>LINE</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label className="text-sm text-muted-foreground font-medium mb-1.5 block">
                ชื่อผู้ดูแล (Caregiver Name)
              </label>
              <input
                value={caregiverName}
                onChange={(e) => setCaregiverName(e.target.value)}
                className="w-full rounded-lg border px-4 py-2.5 bg-muted/20"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground font-medium mb-1.5 block">
                เบอร์โทรศัพท์ (Phone)
              </label>
              <input
                value={caregiverPhone}
                onChange={(e) => setCaregiverPhone(e.target.value)}
                className="w-full rounded-lg border px-4 py-2.5 bg-muted/20"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold">เงื่อนไขและความยินยอม</h3>
            <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-1" />
              <div className="text-sm">
                <p className="font-medium">ยินยอมให้ AI ติดตามดูแลและบันทึกข้อมูล</p>
                <p className="text-muted-foreground mt-1">
                  ผู้ป่วยยินยอมให้ระบบโทรติดตามอาการ บันทึกเสียงและแปลงเป็นข้อความเพื่อการดูแลรักษา
                </p>
              </div>
            </label>
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setCarePlanType("hypertension")}
              className={`p-6 rounded-xl border-2 text-left ${carePlanType === "hypertension" ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
            >
              <div className="text-3xl mb-2">🫀</div>
              <h3 className="font-bold text-lg">ความดันโลหิตสูง</h3>
              <p className="text-sm text-muted-foreground">
                ติดตามความดัน อาการปวดศีรษะ และการทานยา
              </p>
            </button>
            <button
              onClick={() => setCarePlanType("diabetes")}
              className={`p-6 rounded-xl border-2 text-left ${carePlanType === "diabetes" ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
            >
              <div className="text-3xl mb-2">🩸</div>
              <h3 className="font-bold text-lg">เบาหวานชนิดที่ 2</h3>
              <p className="text-sm text-muted-foreground">
                ติดตามน้ำตาล อาการน้ำตาลต่ำ และแผลที่เท้า
              </p>
            </button>
          </div>
        )}

        {/* Footer buttons matching reference 9.png */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t">
          <button
            onClick={() => (step > 1 ? setStep((step - 1) as Step) : navigate({ to: "/patients" }))}
            className="px-8 py-2.5 rounded-lg border font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            ยกเลิก
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep((step + 1) as Step)}
              disabled={!canNext()}
              className="px-8 py-2.5 rounded-lg bg-primary font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              ต่อไป
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-8 py-2.5 rounded-lg bg-primary font-medium text-white hover:bg-primary/90 transition-colors"
            >
              บันทึก
            </button>
          )}
        </div>
      </div>

      <SuccessModal open={showSuccess} onOk={handleSuccessOk} />
    </div>
  );
}
