import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { MascotIcon } from "@/components/MascotIcon";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <main className="vm-public-shell px-5 py-8 md:px-10">
      <div className="mx-auto max-w-[900px] space-y-6">
        <Link to="/" className="vm-secondary-btn w-fit py-2">
          <ArrowLeft className="h-4 w-4" />
          กลับหน้าแรก
        </Link>

        <section className="rounded-[2rem] vm-glass p-6 md:p-8">
          <span className="vm-pill">
            <MascotIcon variant="shield" size="1.1rem" />
            Privacy Policy
          </span>
          <h1 className="mt-5 text-3xl font-extrabold text-[#223a2e] md:text-4xl">
            นโยบายความเป็นส่วนตัว
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            ปรับปรุงล่าสุด: มิถุนายน 2569
          </p>

          <div className="mt-6 space-y-6 text-sm leading-7 text-[#52625a]">
            <section>
              <h2 className="text-xl font-extrabold text-[#223a2e]">1. ข้อมูลที่เราเก็บ</h2>
              <p className="mt-2">
                NongCallJai เก็บข้อมูลที่จำเป็นสำหรับการให้บริการ ได้แก่ ชื่อผู้ใช้บริการ
                เบอร์โทรศัพท์ อีเมล ข้อมูลผู้สูงอายุที่ดูแล (ชื่อ ความสัมพันธ์ เวลาที่สะดวกรับสาย)
                บันทึกการสนทนาและสรุปผลจากการโทรถามไถ่ และข้อมูลบัญชี LINE
                (LINE User ID, ชื่อที่แสดง, รูปโปรไฟล์) เมื่อผู้ใช้เชื่อมต่อบัญชี LINE
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#223a2e]">2. วัตถุประสงค์การใช้ข้อมูล</h2>
              <p className="mt-2">
                ข้อมูลที่เก็บถูกใช้เพื่อให้บริการโทรถามไถ่ผู้สูงอายุ สรุปและส่งข้อมูลไปยังครอบครัวผ่าน
                LINE Official Account แจ้งเตือนเมื่อมีสิ่งที่ควรตรวจสอบ และปรับปรุงคุณภาพการให้บริการ
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#223a2e]">3. การเชื่อมต่อ LINE Login</h2>
              <p className="mt-2">
                เมื่อผู้ใช้เข้าสู่ระบบด้วย LINE เราจะขอเข้าถึงข้อมูลโปรไฟล์พื้นฐาน (ชื่อที่แสดง
                และรูปโปรไฟล์) และ LINE User ID เพื่อใช้ผูกบัญชีผู้ใช้กับข้อมูลบริการของท่าน
                และส่งสรุปผลผ่าน LINE Official Account เท่านั้น เราจะไม่ใช้ข้อมูลนี้เพื่อการโฆษณา
                หรือส่งต่อให้บุคคลที่สามโดยไม่ได้รับความยินยอม
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#223a2e]">4. การจัดเก็บและความปลอดภัย</h2>
              <p className="mt-2">
                ข้อมูลถูกจัดเก็บบนระบบฐานข้อมูลที่มีการควบคุมสิทธิ์การเข้าถึง
                และจะถูกเก็บไว้ตลอดระยะเวลาที่ท่านใช้บริการ หรือจนกว่าจะมีการขอให้ลบข้อมูล
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#223a2e]">5. สิทธิของผู้ใช้บริการ</h2>
              <p className="mt-2">
                ท่านมีสิทธิขอเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของท่านได้
                โดยติดต่อทีมงานผ่านช่องทาง LINE Official Account ของ NongCallJai
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#223a2e]">6. การติดต่อ</h2>
              <p className="mt-2">
                หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ สามารถติดต่อทีมงาน NongCallJai
                ผ่านช่องทาง LINE Official Account
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
