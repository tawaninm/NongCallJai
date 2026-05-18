import { createFileRoute } from "@tanstack/react-router";
import { MascotIcon } from "@/components/MascotIcon";
import { toast } from "sonner";
import { voiceMedStore } from "@/lib/voicemed-store";

export const Route = createFileRoute("/care-plans")({
  component: CarePlansPage,
});

function CarePlansPage() {
  const templates = voiceMedStore.getCareTemplates();

  return (
    <div className="vm-page">
      <section className="rounded-[2rem] vm-glass p-6 md:p-8">
        <span className="vm-pill">
          <MascotIcon variant="heart" size="1.1rem" />
          Care Conversation Templates
        </span>
        <h1 className="mt-5 text-4xl font-extrabold">แผนการดูแลและชุดคำถาม</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          ชุดสนทนา Voice bot ที่เน้นถามง่าย ฟังง่าย และปลอดภัยสำหรับผู้สูงอายุ
          โดยไม่ลงรายละเอียดทางการแพทย์เกินจำเป็น
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <article key={template.id} className="rounded-[2rem] vm-glass p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold">{template.name}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {template.description}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <MascotIcon variant="mic" size="2.5rem" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Info label="คำถาม" value={`${template.questionCount}`} />
              <Info label="ความถี่" value={template.frequency} />
            </div>

            <div className="mt-5 rounded-3xl bg-white/70 p-4">
              <p className="text-sm font-bold">ตัวอย่างคำถาม</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                {template.questions.slice(0, 4).map((question) => (
                  <li key={question}>• {question}</li>
                ))}
              </ul>
            </div>

            <div className="mt-5 rounded-3xl bg-amber-50 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-amber-800">
                <MascotIcon variant="shield" size="1.2rem" />
                Safety boundary
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-800/80">{template.safeBoundary}</p>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => toast.info("เปิด preview script")}
                className="vm-secondary-btn flex-1 py-2"
              >
                <MascotIcon variant="eye" size="1.2rem" />
                Preview
              </button>
              <button
                onClick={() => toast.success("คัดลอก template ใน mock แล้ว")}
                className="vm-primary-btn flex-1 py-2"
              >
                <MascotIcon variant="copy" size="1.2rem" />
                Duplicate
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white/70 p-4">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 font-extrabold">{value}</p>
    </div>
  );
}
