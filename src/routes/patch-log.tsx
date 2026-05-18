import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { MascotIcon } from "@/components/MascotIcon";
import { APP_VERSION, latestPatchLog, patchLogs } from "@/lib/patch-log";

export const Route = createFileRoute("/patch-log")({
  component: PatchLogPage,
});

const categoryLabel = {
  Docs: "เอกสาร",
  UI: "หน้าจอ",
  Feature: "ฟีเจอร์",
  Fix: "แก้ไข",
  Architecture: "สถาปัตยกรรม",
  Safety: "ความปลอดภัย",
  Data: "ข้อมูล",
} as const;

function PatchLogPage() {
  return (
    <main className="vm-public-shell px-5 py-8 md:px-10">
      <div className="mx-auto max-w-[1200px] space-y-6">
        <Link to="/" className="vm-secondary-btn w-fit py-2">
          <ArrowLeft className="h-4 w-4" />
          กลับหน้าแรก
        </Link>

        <section className="rounded-[2rem] vm-glass p-6 md:p-8">
          <span className="vm-pill">
            <MascotIcon variant="log" size="1.1rem" />
            VoiceMed Release Notes
          </span>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-4xl font-extrabold">รายการอัปเดตระบบ</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                ประวัติการเปลี่ยนแปลง เวอร์ชัน เอกสาร ไฟล์แอป และสถานะ verification สำหรับ VoiceMed
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950 p-5 text-white">
              <p className="text-xs text-white/60">เวอร์ชันปัจจุบัน</p>
              <p className="mt-1 text-4xl font-extrabold">{APP_VERSION}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <InfoCard label="อัปเดตล่าสุด" value={latestPatchLog.title} />
          <InfoCard label="วันที่" value={latestPatchLog.date} />
          <InfoCard label="สถานะ" value={latestPatchLog.status ?? "Needs Review"} />
        </section>

        <section className="space-y-5">
          {patchLogs.map((entry) => (
            <article key={entry.version} className="rounded-[2rem] vm-glass p-5">
              <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
                <div>
                  <p className="text-3xl font-extrabold vm-gradient-text">{entry.version}</p>
                  <p className="mt-1 text-sm text-muted-foreground">วันที่ {entry.date}</p>
                  <span className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {categoryLabel[entry.category]}
                  </span>
                </div>
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-extrabold">{entry.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{entry.summary}</p>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <FileList title="ไฟล์ Markdown ที่อัปเดต" files={entry.markdownFiles ?? []} />
                    <FileList title="ไฟล์แอปที่อัปเดต" files={entry.appFiles ?? []} />
                  </div>
                  <div className="rounded-2xl bg-white/70 p-4">
                    <div className="flex items-start gap-3">
                      <MascotIcon variant="star" size="1.2rem" className="mt-0.5" />
                      <div className="text-sm leading-6 text-muted-foreground">
                        <p>
                          <span className="font-bold text-foreground">Build/Lint:</span>{" "}
                          {entry.buildResult}
                        </p>
                        {entry.notes?.map((note) => (
                          <p key={note}>• {note}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] vm-glass-soft p-5">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 font-extrabold">{value}</p>
      <MascotIcon variant="check" size="1.5rem" className="mt-4" />
    </div>
  );
}

function FileList({ title, files }: { title: string; files: string[] }) {
  return (
    <div className="rounded-2xl border bg-white/70 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold">
        <MascotIcon variant="file" size="1.2rem" />
        {title}
      </div>
      <ul className="max-h-72 space-y-1 overflow-auto pr-1 text-xs leading-5 text-muted-foreground">
        {files.map((file) => (
          <li key={file} className="rounded-xl bg-white px-2 py-1 font-mono">
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
}
