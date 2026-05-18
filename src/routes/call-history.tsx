import { createFileRoute } from "@tanstack/react-router";
import { MascotIcon } from "@/components/MascotIcon";
import { useState, useSyncExternalStore } from "react";
import { getElderName, voiceMedStore } from "@/lib/voicemed-store";

export const Route = createFileRoute("/call-history")({
  component: CallHistoryPage,
});

function CallHistoryPage() {
  const calls = useSyncExternalStore(
    voiceMedStore.subscribe,
    voiceMedStore.getCallLogs,
    voiceMedStore.getCallLogs,
  );
  const [selectedId, setSelectedId] = useState(calls[0]?.id);
  const selected = calls.find((call) => call.id === selectedId) ?? calls[0];

  return (
    <div className="vm-page">
      <section className="rounded-[2rem] vm-glass p-6 md:p-8">
        <span className="vm-pill">
          <MascotIcon variant="chat" size="1.1rem" />
          Call / Chat History
        </span>
        <h1 className="mt-5 text-4xl font-extrabold">ประวัติการโทรและแชท</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          ดู transcript, summary, mood signal และ flag ที่ครอบครัวควรตรวจสอบ
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-3">
          {calls.map((call) => (
            <button
              key={call.id}
              onClick={() => setSelectedId(call.id)}
              className={`w-full rounded-3xl border p-5 text-left transition ${
                selected?.id === call.id
                  ? "bg-primary/10 border-primary"
                  : "bg-white/70 hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-extrabold">{getElderName(call.elderProfileId)}</p>
                  <p className="text-xs text-muted-foreground">
                    {call.startedAt} · {call.channel}
                  </p>
                </div>
                <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-bold text-primary">
                  {call.status}
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                {call.summary}
              </p>
            </button>
          ))}
        </div>

        {selected && (
          <article className="rounded-[2rem] vm-glass p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold">{getElderName(selected.elderProfileId)}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selected.startedAt} · {Math.round(selected.durationSec / 60)} นาที · mood:{" "}
                  {selected.mood ?? "-"}
                </p>
              </div>
              <MascotIcon variant="phone" size="2rem" />
            </div>

            <div className="mt-5 rounded-3xl bg-white/70 p-5">
              <p className="text-sm font-bold">AI Summary</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{selected.summary}</p>
              {selected.familyShouldReview && (
                <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-700">
                  ครอบครัวควรตรวจสอบต่อ
                </p>
              )}
            </div>

            <div className="mt-5 space-y-3">
              <p className="font-extrabold">Transcript</p>
              {selected.transcript.length === 0 && (
                <div className="rounded-2xl bg-white/70 p-5 text-sm text-muted-foreground">
                  ไม่มี transcript เพราะสายนี้ยังไม่สำเร็จ
                </div>
              )}
              {selected.transcript.map((line, index) => (
                <div
                  key={`${line.speaker}-${index}`}
                  className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                    line.speaker === "bot"
                      ? "bg-primary text-white"
                      : "ml-auto bg-white/80 text-foreground"
                  }`}
                >
                  {line.text}
                </div>
              ))}
            </div>
          </article>
        )}
      </section>
    </div>
  );
}
