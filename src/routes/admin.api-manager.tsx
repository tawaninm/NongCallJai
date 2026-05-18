import { createFileRoute } from "@tanstack/react-router";
import { Copy, RefreshCw, Server, Workflow } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { MascotIcon } from "@/components/MascotIcon";
import { type ApiEndpointDoc, type AutomationJob, mvpApi } from "@/lib/mvp-api";

export const Route = createFileRoute("/admin/api-manager")({
  component: ApiManagerPage,
});

function ApiManagerPage() {
  const [endpoints, setEndpoints] = useState<ApiEndpointDoc[]>([]);
  const [jobs, setJobs] = useState<AutomationJob[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [endpointRows, jobRows] = await Promise.all([
        mvpApi.getApiEndpoints(),
        mvpApi.getAutomationJobs(),
      ]);
      setEndpoints(endpointRows);
      setJobs(jobRows);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const groupedEndpoints = useMemo(() => {
    return endpoints.reduce<Record<string, ApiEndpointDoc[]>>((groups, endpoint) => {
      groups[endpoint.group] ??= [];
      groups[endpoint.group].push(endpoint);
      return groups;
    }, {});
  }, [endpoints]);

  return (
    <div className="vm-page">
      <section className="rounded-[2rem] vm-glass p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="vm-pill">
              <MascotIcon variant="settings" size="1.1rem" />
              API Manager
            </span>
            <h1 className="mt-5 text-4xl font-extrabold">Automation API control room</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              รวม endpoint สำหรับทีม Web/API, LINE Chatbot และ Voicebot/Botnoi พร้อมตัวอย่าง request
              ที่ copy ไปทดสอบได้ทันที
            </p>
          </div>
          <button onClick={load} disabled={loading} className="vm-secondary-btn">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {Object.entries(groupedEndpoints).map(([group, rows]) => (
            <div key={group} className="rounded-[2rem] vm-glass p-5">
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-extrabold">{group}</h2>
              </div>
              <div className="mt-4 space-y-3">
                {rows.map((endpoint) => (
                  <EndpointRow key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-[2rem] vm-glass p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Workflow className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-extrabold">Automation queue</h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {jobs.length} jobs
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {jobs.length === 0 && (
              <div className="rounded-2xl border bg-white/75 p-4 text-sm text-muted-foreground">
                ยังไม่มี job ใน dev store ให้ลองทำ onboarding, สร้าง QR หรือยิง Botnoi callback ก่อน
              </div>
            )}
            {jobs.slice(0, 12).map((job) => (
              <div key={job.id} className="rounded-2xl border bg-white/75 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">{job.type}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {job.id} · attempts {job.attemptCount}/{job.maxAttempts}
                    </p>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
                    {job.status}
                  </span>
                </div>
                {job.lastError && (
                  <p className="mt-2 rounded-xl bg-amber-50 p-2 text-xs text-amber-800">
                    {job.lastError}
                  </p>
                )}
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

function EndpointRow({ endpoint }: { endpoint: ApiEndpointDoc }) {
  const headersText = endpoint.sampleHeaders ? JSON.stringify(endpoint.sampleHeaders, null, 2) : "";
  const bodyText = endpoint.sampleBody ? JSON.stringify(endpoint.sampleBody, null, 2) : "";
  const headerLines = [
    endpoint.sampleBody ? `  -H "Content-Type: application/json"` : "",
    ...Object.entries(endpoint.sampleHeaders ?? {}).map(
      ([key, value]) => `  -H "${key}: ${value}"`,
    ),
  ].filter(Boolean);
  const curlLines = [`curl -X ${endpoint.method} "$BASE_URL${endpoint.path}"`, ...headerLines];
  if (endpoint.sampleBody) {
    curlLines.push(`  -d '${JSON.stringify(endpoint.sampleBody)}'`);
  }
  const curl = curlLines.join(" \\\n");

  const copy = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  };

  return (
    <article className="rounded-2xl border bg-white/75 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">
              {endpoint.method}
            </span>
            <code className="break-all rounded-xl bg-secondary px-3 py-1 text-xs">
              {endpoint.path}
            </code>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{endpoint.description}</p>
          <p className="mt-2 text-xs font-bold text-foreground">Auth: {endpoint.auth}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => copy(endpoint.path, "Path")}
            className="vm-secondary-btn px-3 py-2"
          >
            <Copy className="h-4 w-4" />
            Path
          </button>
          {bodyText && (
            <button
              onClick={() => copy(bodyText, "POST body")}
              className="vm-secondary-btn px-3 py-2"
            >
              <Copy className="h-4 w-4" />
              Body
            </button>
          )}
          {headersText && (
            <button
              onClick={() => copy(headersText, "Headers")}
              className="vm-secondary-btn px-3 py-2"
            >
              <Copy className="h-4 w-4" />
              Headers
            </button>
          )}
          <button onClick={() => copy(curl, "cURL")} className="vm-secondary-btn px-3 py-2">
            <Copy className="h-4 w-4" />
            cURL
          </button>
        </div>
      </div>
      {bodyText && (
        <pre className="mt-3 overflow-x-auto rounded-2xl bg-[#17221c] p-4 text-xs text-white">
          {bodyText}
        </pre>
      )}
    </article>
  );
}
