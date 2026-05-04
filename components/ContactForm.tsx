"use client";

import { useState } from "react";

const TYPES = [
  { value: "brand_deal", label: "Brand Partnership" },
  { value: "consulting", label: "AI Consulting" },
  { value: "training", label: "Corporate Training" },
  { value: "general", label: "ทั่วไป / สอบถาม" },
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      type: String(data.get("type") ?? "general"),
      project_brief: String(data.get("brief") ?? ""),
      page_path: window.location.pathname,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "ส่งไม่สำเร็จ");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-teal-400/30 bg-teal-400/5 p-8 text-center">
        <div className="text-[32px]">✓</div>
        <h3 className="mt-3 text-[20px] font-bold text-white">ส่งข้อความเรียบร้อย</h3>
        <p className="mt-2 text-[14px] text-zinc-400">ผมหรือทีมจะตอบกลับภายใน 24 ชั่วโมง ขอบคุณครับ</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center rounded-full border border-white/15 px-5 py-2 text-[13px] text-white hover:border-teal-400/30"
        >
          ส่งอีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="ชื่อ" name="name" required />
      <Field label="อีเมล" name="email" type="email" required />
      <Field label="โทรศัพท์ (ถ้ามี)" name="phone" />

      <div>
        <label className="block text-[13px] font-medium text-zinc-300">ประเภทงาน</label>
        <select
          name="type"
          required
          className="mt-2 w-full rounded-xl border border-white/[0.08] bg-[#0f1011] px-4 py-3 text-[14px] text-white outline-none transition focus:border-teal-400/40"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-zinc-300">รายละเอียดโปรเจกต์</label>
        <textarea
          name="brief"
          rows={5}
          required
          placeholder="เล่าให้ฟังหน่อยว่าอยากทำอะไร ใช้กับธุรกิจประเภทไหน timeline ประมาณไหน budget เท่าไหร่..."
          className="mt-2 w-full rounded-xl border border-white/[0.08] bg-[#0f1011] px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-zinc-600 focus:border-teal-400/40"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center rounded-full bg-teal-400 px-6 py-3 text-[14px] font-semibold text-zinc-900 transition hover:bg-teal-300 disabled:opacity-50"
      >
        {status === "submitting" ? "กำลังส่ง..." : "ส่งข้อความ"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-zinc-300">
        {label}
        {required && <span className="ml-1 text-teal-300">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="mt-2 w-full rounded-xl border border-white/[0.08] bg-[#0f1011] px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-zinc-600 focus:border-teal-400/40"
      />
    </div>
  );
}
