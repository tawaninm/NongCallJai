import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MascotIcon } from "@/components/MascotIcon";
import { useState } from "react";
import { toast } from "sonner";
import { mvpApi } from "@/lib/mvp-api";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const customer = mvpApi.getStoredCustomer();
  const [name, setName] = useState("นางละออง ศรีวิชัย");
  const [nickname, setNickname] = useState("ละออง");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("081-234-5678");
  const [relationship, setRelationship] = useState("ตา");
  const [note, setNote] = useState(
    "ชอบให้โทรช่วงเช้า ใช้น้ำเสียงอ่อนโยน และส่งสรุปให้ครอบครัวผ่าน LINE",
  );
  const [consentGranted, setConsentGranted] = useState(true);
  const [loading, setLoading] = useState(false);

  const finish = async () => {
    if (!customer) {
      toast.error("กรุณาสมัครแพ็กเกจก่อนกรอกข้อมูลผู้สูงอายุ");
      navigate({ to: "/checkout" });
      return;
    }
    if (!name.trim() || !phone.trim() || !relationship.trim() || !age.trim()) {
      toast.error("กรุณากรอกชื่อ อายุ เบอร์โทร และความสัมพันธ์");
      return;
    }
    setLoading(true);
    try {
      await mvpApi.submitServiceRequest({
        customerId: customer.id,
        name,
        nickname,
        phone,
        relationship,
        age: parseInt(age, 10),
        note,
        consentGranted,
      });
      toast.success("บันทึกข้อมูลสำหรับตั้งค่าบริการแล้ว");
      navigate({ to: "/line-connect" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="vm-public-shell px-5 py-8 md:px-10">
      <div className="mx-auto max-w-[1180px]">
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] vm-glass p-6 md:p-8">
            <span className="vm-pill">
              <MascotIcon variant="heart" size="1.1rem" />
              Service onboarding
            </span>
            <h1 className="mt-5 text-4xl font-extrabold">ส่งข้อมูลให้ทีมตั้งค่า Botnoi Voicebot</h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              เว็บเก็บเฉพาะข้อมูลที่จำเป็นสำหรับสมัครบริการและ mapping การตั้งค่า ส่วน schedule
              โทรและ script จะจัดการใน Botnoi dashboard โดยทีมที่รับผิดชอบ
            </p>
            <div className="mt-8 grid gap-4">
              {[
                "ผู้สูงอายุไม่จำเป็นต้องใช้ LINE",
                "ครอบครัวรับ feedback ผ่าน LINE OA",
                "ไม่แสดง transcript หรือ audio บนเว็บครอบครัว",
                "ไม่วินิจฉัย ไม่สั่งยา และไม่ปรับยา",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/70 p-3">
                  <MascotIcon variant="check" size="1.5rem" />
                  <span className="text-sm font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] vm-glass p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="ชื่อ-นามสกุลผู้สูงอายุ" value={name} onChange={setName} />
              <Field label="ชื่อเล่น/คำเรียก" value={nickname} onChange={setNickname} />
              <Field label="อายุ (ปี)" value={age} onChange={setAge} type="number" />
              <Field label="เบอร์โทรผู้สูงอายุ" value={phone} onChange={setPhone} />
              <Field
                label="ความสัมพันธ์"
                value={relationship}
                onChange={setRelationship}
                options={["ตา", "ยาย", "ปู่", "ย่า"]}
              />
            </div>

            <div className="mt-6 block">
              <span className="flex items-center gap-2 text-sm font-bold">
                <MascotIcon variant="user" size="1.2rem" />
                Note สำหรับทีมตั้งค่า
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setNote(
                      "ชอบให้โทรช่วงเช้า (08:00-10:00 น.), ชอบคุยเรื่องต้นไม้และข่าวสาร, ไม่ชอบเสียงดัง, มีอาการเข่าปวดเวลาเดินนาน, ส่งสรุปผลให้ครอบครัวผ่าน LINE",
                    )
                  }
                  className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  + แบบผู้สูงอายุทั่วไป
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNote(
                      "สะดวกติดต่อช่วงเย็น (16:00-18:00 น.), ต้องเตือนทานยาหลังอาหาร, มีโรคประจำตัว (เบาหวาน), ส่งสรุปผลให้ครอบครัว",
                    )
                  }
                  className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  + เน้นการดูแล / ทานยา
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNote("เวลาที่สะดวกติดต่อ: \nสิ่งที่ชอบ/ไม่ชอบ: \nข้อควรระวัง: ")
                  }
                  className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  + โครงสร้างแบบสั้น
                </button>
              </div>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="ตัวอย่าง: ชอบให้โทรช่วงเช้า (08:00-10:00 น.), ชอบคุยเรื่องต้นไม้และข่าวสาร, ไม่ชอบเสียงดัง, มีอาการเข่าปวดเวลาเดินนาน, ส่งสรุปผลให้ครอบครัวผ่าน LINE"
                rows={5}
                className="mt-3 w-full rounded-2xl border bg-white/80 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <label className="mt-5 flex items-start gap-3 rounded-2xl border bg-white/70 p-4">
              <input
                type="checkbox"
                checked={consentGranted}
                onChange={(event) => setConsentGranted(event.target.checked)}
                className="mt-1"
              />
              <span className="text-sm leading-6 text-muted-foreground">
                ครอบครัวยืนยันว่าได้รับความยินยอมในการใช้บริการโทรถามไถ่และส่งสรุปให้ครอบครัวผ่าน
                LINE OA
              </span>
            </label>

            <button onClick={finish} disabled={loading} className="vm-primary-btn mt-8 w-full">
              {loading ? "กำลังบันทึก..." : "บันทึกและไปเชื่อม LINE OA"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  options,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  type?: string;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-bold">
        <MascotIcon variant="user" size="1.2rem" />
        {label}
      </span>
      {options ? (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-2 w-full rounded-2xl border bg-white/80 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-2 w-full rounded-2xl border bg-white/80 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      )}
    </label>
  );
}
