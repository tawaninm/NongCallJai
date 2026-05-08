# CareGo Hospital Platform Ver 2.1
**Frontend Complete Prototype**

ศูนย์บัญชาการการแพทย์ (Clinical Command Center) ที่ออกแบบมาเพื่อบริหารจัดการคิวผู้ป่วย, เคสการรักษา, การติดตามยา, และระบบ AI ติดตามผล (AI Follow-up) โดยทุกหน้าและทุก Role มีการเชื่อมโยงข้อมูลกันแบบ Real-time ในระดับ Prototype (ใช้ Frontend State + LocalStorage)

---

## 🚀 วิธีการเปิดโปรเจกต์และรัน Localhost

1. **เปิด Terminal** ของเครื่อง (เช่น Command Prompt, PowerShell หรือ Terminal ใน VSCode)
2. นำทาง (cd) เข้ามาที่โฟลเดอร์โปรเจกต์ `caregohospital`
3. รันคำสั่งต่อไปนี้เพื่อเปิดเซิร์ฟเวอร์จำลอง:
   ```bash
   npm run dev
   ```
4. เปิดเว็บเบราว์เซอร์ แล้วเข้าไปที่ลิงก์ที่แสดงในหน้า Terminal (โดยปกติจะเป็น `http://localhost:8080` หรือพอร์ตใกล้เคียง)

> ⚠️ **ข้อควรระวังสำคัญ (แจ้งเตือน):** 
> เมื่อคุณทำงานเสร็จหรือ **เลิกใช้งาน Server แล้ว ให้กดปุ่ม `Ctrl + C` ใน Terminal ทุกครั้ง** และตอบ `Y` (ถ้ามีถาม) เพื่อเป็นการปิดการทำงานของระบบเซิร์ฟเวอร์ ป้องกันไม่ให้พอร์ตค้างหรือเครื่องทำงานหนักตลอดเวลา

---

## 🤖 สำหรับ AI Agent (Prompt เริ่มต้น)

หากคุณต้องการให้ AI (เช่น Gemini, Claude, ChatGPT) เข้ามาช่วยพัฒนาหรือแก้ไขโค้ดในโปรเจกต์นี้ ให้เริ่มต้นการสนทนาด้วย Prompt ด้านล่างนี้เสมอ เพื่อให้ AI เข้าใจบริบททั้งหมด:

```text
Read the project instructions first:
- AGENTS.md
- GEMINI.md
- AI_AGENT_README.md
- .agents/rules/*
- DesignImage UX Ui iwant
- .agents/workflows/*
- DESIGN.md
- docs/architecture/*
- src/routes/index.tsx
- src/routes/__root.tsx
- src/lib/auth-context.tsx
- src/lib/mock-data.ts
- src/components/AppSidebar.tsx
- src/styles.css
```

---

## 🧩 รายละเอียดโปรเจกต์และโครงสร้างการทำงานหลัก (Key Features)

โปรเจกต์นี้พัฒนาด้วย **React + TanStack Router + Tailwind CSS** โดยไม่ต้องพึ่งพา Backend API ในขณะนี้ (Frontend-only Prototype)

1. **Role-based Architecture:** 
   หน้าแดชบอร์ดและเมนู (Sidebar) จะปรับเปลี่ยนตามสิทธิ์ผู้ใช้งานอัตโนมัติ (Admin, พยาบาล, แพทย์, เภสัชกร, ศูนย์ตัวแทน)

2. **Global Reactivity (`mockStore`):** 
   ข้อมูลทุกอย่างเชื่อมถึงกันหมด! ใช้ `useSyncExternalStore` ดึงข้อมูลจากไฟล์ `src/lib/mock-store.ts` เมื่อมีการเปลี่ยนสถานะผู้ป่วย (เช่น ลากการ์ดในบอร์ด Kanban หรือกดปุ่มรับทราบแจ้งเตือน) ทุกส่วนในระบบรวมถึงตัวเลขแจ้งเตือนจะอัปเดตแบบ Real-time ทันที

3. **Cross-Page Routing:** 
   ไม่ว่าผู้ใช้จะอยู่ที่หน้าไหน (คิวผู้ป่วย, จัดการเคส, ติดตามยา, นัดหมาย) ก็สามารถกดเพื่อเจาะลึกเข้าไปดูรายละเอียดของผู้ป่วย (Patient Detail) คนนั้นๆ ได้อย่างราบรื่น

4. **Clinical Design System:** 
   หน้าตาเว็บถูกออกแบบโดยใช้คู่สีที่เป็นมิตรทางการแพทย์ (Soft Blue, Teal) จัดเรียงเป็นลักษณะ Command Center ที่ดูทันสมัย สะอาดตา และเป็นมืออาชีพ

5. **AI Integration Ready:** 
   รองรับระบบ Chatbot (Botnoi) แบบฝังตัวในหน้าจอ และมีหน้าต่างแสดงผลการแปลงเสียง/ข้อความที่ AI วิเคราะห์ความเสี่ยงของผู้ป่วยส่งมาให้พยาบาลรีวิว (AI Follow-up Transcript)
