import { NextRequest } from "next/server";
import { createLead } from "@/lib/pocketbase";

const ALLOWED_TYPES = ["brand_deal", "consulting", "training", "general"] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const type = ALLOWED_TYPES.includes(body.type) ? body.type : "general";
    const brief = String(body.project_brief ?? "").trim();

    if (!name || !email) {
      return Response.json({ ok: false, error: "กรุณากรอกชื่อและอีเมล" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ ok: false, error: "รูปแบบอีเมลไม่ถูกต้อง" }, { status: 400 });
    }

    const result = await createLead({
      name,
      email,
      phone: String(body.phone ?? "").trim() || undefined,
      type,
      project_brief: brief,
      source: "janepat.com",
      page_path: String(body.page_path ?? "/contact"),
    });

    if (!result.ok) {
      return Response.json({ ok: false, error: "ส่งไม่สำเร็จ ลองใหม่อีกครั้ง" }, { status: 500 });
    }

    return Response.json({ ok: true, id: result.id });
  } catch {
    return Response.json({ ok: false, error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }
}
