import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { MascotIcon } from "@/components/MascotIcon";

export const Route = createFileRoute("/terms-of-use")({
  component: TermsOfUsePage,
});

function TermsOfUsePage() {
  return (
    <main className="vm-public-shell px-5 py-8 md:px-10">
      <div className="mx-auto max-w-[900px] space-y-6">
        <Link to="/" className="vm-secondary-btn w-fit py-2">
          <ArrowLeft className="h-4 w-4" />
          กลับหน้าแรก
        </Link>

        <section className="rounded-[2rem] vm-glass p-6 md:p-8">
          <span className="vm-pill">
            <MascotIcon variant="clipboard" size="1.1rem" />
            Terms of Use
          </span>
          <h1 className="mt-5 text-3xl font-extrabold text-[#223a2e] md:text-4xl">
            ข้อกำหนดการใช้บริการ
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            ปรับปรุงล่าสุด: มิถุนายน 2569
          </p>

          <div className="mt-6 space-y-6 text-sm leading-7 text-[#52625a]">
            <section>
              <h2 className="text-xl font-extrabold text-[#223a2e]">1. เกี่ยวกับบริการ</h2>
              <p className="mt-2">
                NongCallJai เป็นบริการ AI Voice Companion สำหรับครอบครัวที่ดูแลผู้สูงอายุจากระยะไกล
                โดยระบบจะโทรถามไถ่ผู้สูงอายุตามช่วงเวลาที่กำหนด รับฟังและสรุปข้อมูลที่ผู้สูงอายุเล่าเอง
                แล้วส่งสรุปให้ครอบครัวผ่าน LINE Official Account
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#223a2e]">2. ขอบเขตของบริการ</h2>
              <p className="mt-2">
                NongCallJai โทรถามคำถามเช็กอินที่ได้รับการอนุมัติ รับฟังและสรุปข้อมูลที่ผู้สูงอายุเล่าเอง
                และแจ้งให้ครอบครัวตรวจสอบต่อเมื่อมีสิ่งที่ควรใส่ใจ
              </p>
              <p className="mt-2 font-bold text-[#223a2e]">บริการนี้ไม่ใช่บริการทางการแพทย์</p>
              <p className="mt-2">
                NongCallJai ไม่วินิจฉัยโรค ไม่สั่งยาหรือปรับขนาดยา และไม่สามารถใช้แทนคำแนะนำจากแพทย์
                พยาบาล หรือผู้ดูแลมืออาชีพได้ในทุกกรณี
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#223a2e]">3. การเชื่อมต่อ LINE</h2>
              <p className="mt-2">
                ผู้ใช้บริการสามารถเชื่อมต่อบัญชี LINE เพื่อรับสรุปข้อมูลและการแจ้งเตือนผ่าน
                LINE Official Account การเชื่อมต่อ LINE ใช้สำหรับผูกบัญชีผู้ใช้กับข้อมูลบริการ
                และส่งข้อความสรุปเท่านั้น
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#223a2e]">4. ความรับผิดชอบของผู้ใช้บริการ</h2>
              <p className="mt-2">
                ผู้ใช้บริการมีหน้าที่ตรวจสอบข้อมูลสรุปที่ได้รับ และปรึกษาแพทย์หรือผู้เชี่ยวชาญ
                ในกรณีที่มีข้อสงสัยเกี่ยวกับสุขภาพของผู้สูงอายุ ก่อนตัดสินใจใด ๆ ที่เกี่ยวข้องกับสุขภาพ
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#223a2e]">5. การเปลี่ยนแปลงบริการ</h2>
              <p className="mt-2">
                NongCallJai อาจปรับปรุงหรือเปลี่ยนแปลงรูปแบบการให้บริการเพื่อพัฒนาคุณภาพ
                โดยจะพยายามแจ้งให้ผู้ใช้บริการทราบล่วงหน้าตามความเหมาะสม
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#223a2e]">6. การติดต่อ</h2>
              <p className="mt-2">
                หากมีคำถามเกี่ยวกับข้อกำหนดการใช้บริการนี้ สามารถติดต่อทีมงาน NongCallJai
                ผ่านช่องทาง LINE Official Account
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
