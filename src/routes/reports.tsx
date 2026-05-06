import { createFileRoute } from '@tanstack/react-router';
import { patients } from '@/lib/mock-data';
import { BarChart3, TrendingUp } from 'lucide-react';

export const Route = createFileRoute('/reports')({
  component: ReportsPage,
});

function ReportsPage() {
  const green = patients.filter(p => p.riskLevel === 'green').length;
  const yellow = patients.filter(p => p.riskLevel === 'yellow').length;
  const red = patients.filter(p => p.riskLevel === 'red').length;

  const stats = [
    { label: 'ผู้ป่วยที่ติดตามทั้งหมด', value: patients.length },
    { label: 'สีเขียว', value: green },
    { label: 'สีเหลือง', value: yellow },
    { label: 'สีแดง', value: red },
    { label: 'AI โทรสำเร็จ', value: '75%' },
    { label: 'ไม่รับสาย', value: '25%' },
    { label: 'คิวพยาบาล', value: 3 },
    { label: 'ส่งแพทย์', value: 1 },
    { label: 'ส่งเภสัชกร', value: 0 },
    { label: 'ปัญหายา', value: 3 },
    { label: 'ขาดนัด', value: 1 },
    { label: 'เวลาเฉลี่ยปิดเคส', value: '2.3 วัน' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">รายงานและวิเคราะห์</h1>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card p-8 flex flex-col items-center text-muted-foreground">
        <TrendingUp className="h-12 w-12 mb-3" />
        <p>กราฟแนวโน้มรายสัปดาห์จะเปิดใช้งานในเวอร์ชันถัดไป</p>
      </div>
    </div>
  );
}
