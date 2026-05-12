import { createFileRoute } from "@tanstack/react-router";
import { Activity, CheckCircle2, FileText, GitBranch, Info, ShieldCheck } from "lucide-react";
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
    <div className="mx-auto max-w-[1440px] space-y-6">
      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border bg-secondary px-3 py-1 text-xs font-bold text-primary">
              <GitBranch className="h-3.5 w-3.5" />
              CareGo Release Notes
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                รายการอัปเดตระบบ
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                ประวัติการเปลี่ยนแปลงสำหรับผู้ดูแลระบบ ครอบคลุมเวอร์ชัน เอกสารที่อัปเดต
                ไฟล์แอปที่เปลี่ยน สถานะตรวจสอบ และสิ่งที่ยังต้องติดตาม
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-secondary/70 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">
              เวอร์ชันปัจจุบัน
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{APP_VERSION}</p>
                <p className="text-sm text-muted-foreground">อัปเดตล่าสุด {latestPatchLog.date}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">
            อัปเดตล่าสุด
          </p>
          <p className="mt-2 text-lg font-semibold">{latestPatchLog.title}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{latestPatchLog.summary}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">
            สถานะ
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-risk-green-bg px-3 py-1 text-sm font-semibold text-risk-green">
            <CheckCircle2 className="h-4 w-4" />
            {latestPatchLog.status}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{latestPatchLog.buildResult}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">
            ประเภท
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border bg-secondary px-3 py-1 text-sm font-semibold text-primary">
            <ShieldCheck className="h-4 w-4" />
            {categoryLabel[latestPatchLog.category]}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Docs / UI / Feature / Safety</p>
        </div>
      </section>

      <section className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">ประวัติการอัปเดต</h2>
        </div>
        <div className="divide-y">
          {patchLogs.map((entry) => (
            <article key={entry.version} className="grid gap-5 p-5 lg:grid-cols-[240px_1fr]">
              <div>
                <p className="text-2xl font-bold text-primary">{entry.version}</p>
                <p className="mt-1 text-sm text-muted-foreground">วันที่ {entry.date}</p>
                <span className="mt-3 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
                  {categoryLabel[entry.category]}
                </span>
              </div>
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold">{entry.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.summary}</p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <FileList title="ไฟล์ Markdown ที่อัปเดต" files={entry.markdownFiles ?? []} />
                  <FileList title="ไฟล์แอปที่อัปเดต" files={entry.appFiles ?? []} />
                </div>

                <div className="rounded-lg border bg-secondary/40 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        <span className="font-semibold text-foreground">Build/Lint:</span>{" "}
                        {entry.buildResult}
                      </p>
                      {entry.notes?.map((note) => (
                        <p key={note}>{note}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function FileList({ title, files }: { title: string; files: string[] }) {
  return (
    <div className="rounded-lg border bg-background/70 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <FileText className="h-4 w-4 text-primary" />
        {title}
      </div>
      <ul className="max-h-64 space-y-1 overflow-auto pr-1 text-xs leading-5 text-muted-foreground">
        {files.map((file) => (
          <li key={file} className="rounded bg-card px-2 py-1 font-mono">
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
}
