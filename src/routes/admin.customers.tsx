import { createFileRoute } from "@tanstack/react-router";
import { MascotIcon } from "@/components/MascotIcon";
import { useEffect, useState } from "react";
import { type AdminCustomer, mvpApi } from "@/lib/mvp-api";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomersPage,
});

function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);

  const load = () => {
    mvpApi.getAdminCustomers().then(setCustomers);
  };

  useEffect(load, []);

  return (
    <div className="vm-page">
      <section className="rounded-[2rem] vm-glass p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="vm-pill">
              <MascotIcon variant="people" size="1.1rem" />
              Internal admin
            </span>
            <h1 className="mt-5 text-4xl font-extrabold">Customer setup queue</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              ใช้สำหรับทีมภายในดูสถานะลูกค้า LINE connection และ Botnoi mapping
              ไม่ใช่หน้าสำหรับครอบครัวดู feedback หลังการโทร
            </p>
          </div>
          <button onClick={load} className="vm-secondary-btn">
            <MascotIcon variant="calendar" size="1.2rem" />
            Refresh
          </button>
        </div>
      </section>

      <section className="space-y-4">
        {customers.length === 0 && (
          <div className="rounded-[2rem] vm-glass p-8 text-center text-muted-foreground">
            ยังไม่มี customer ใน MVP store
          </div>
        )}
        {customers.map((customer) => (
          <article key={customer.id} className="rounded-[2rem] vm-glass p-5">
            <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr_0.8fr]">
              <div>
                <p className="text-2xl font-extrabold">{customer.payerName}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {customer.phone} · {customer.email ?? "no email"} · plan {customer.planId}
                </p>
                <span className="mt-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {customer.setupStatus}
                </span>
              </div>
              <div className="rounded-2xl bg-white/70 p-4">
                <p className="text-sm font-bold">LINE</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {customer.lineConnections[0]?.status ?? "not started"}
                </p>
                <p className="mt-2 break-all text-xs text-muted-foreground">
                  {customer.lineConnections[0]?.token ?? "no token"}
                </p>
              </div>
              <div className="rounded-2xl bg-white/70 p-4">
                <p className="flex items-center gap-2 text-sm font-bold">
                  <MascotIcon variant="settings" size="1.2rem" />
                  Botnoi mapping
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {customer.botnoiMappings.length > 0
                    ? customer.botnoiMappings.map((item) => item.botnoiContactId).join(", ")
                    : "รอทีมกรอก bot/contact id ผ่าน API"}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
