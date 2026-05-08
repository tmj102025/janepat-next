import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  chatgpt: { label: "CHATGPT TIPS", emoji: "🤖" },
  claude: { label: "CLAUDE GUIDE", emoji: "🧠" },
  marketing: { label: "AI MARKETING", emoji: "📢" },
  automation: { label: "AI AUTOMATION", emoji: "⚙️" },
  tools: { label: "AI TOOLS", emoji: "🛠️" },
  business: { label: "AI BUSINESS", emoji: "💼" },
  creator: { label: "AI CREATOR", emoji: "🎬" },
  basics: { label: "AI BASICS", emoji: "📚" },
};

async function loadFont(file: string): Promise<ArrayBuffer> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://janepat.com";
  const res = await fetch(`${base}/fonts/${file}`);
  if (!res.ok) throw new Error(`font ${file} ${res.status}`);
  return res.arrayBuffer();
}

/** Resolve YouTube cover URL with fallback — maxresdefault often 404s for older/non-HD vids */
async function resolveCoverUrl(url: string): Promise<string> {
  if (!url) return url;
  // Quick HEAD probe to detect 404
  try {
    const probe = await fetch(url, { method: "HEAD" });
    if (probe.ok) return url;
  } catch {}
  // YouTube fallback: maxresdefault.jpg → hqdefault.jpg (always available)
  if (url.includes("/maxresdefault.jpg")) {
    return url.replace("/maxresdefault.jpg", "/hqdefault.jpg");
  }
  return url;
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const title = sp.get("title") ?? "หัวข้อบทความ";
  const subtitle = sp.get("subtitle") ?? "";
  const category = sp.get("category") ?? "tools";
  const creator = sp.get("creator") ?? "";
  const coverRaw = sp.get("cover") ?? "";
  const cover = coverRaw ? await resolveCoverUrl(coverRaw) : "";
  // Hook copy — 1-2 short sentences (max ~120 chars) — replaces bullets for poster feel
  const hook = sp.get("hook") ?? "";
  // Tim's own channel = minimal layout (hook only, no bullets, no creator pill)
  const isOwn = sp.get("own") === "1";
  const cat = CATEGORY_LABELS[category] ?? CATEGORY_LABELS.tools;

  // Highlight first 2-3 words in teal, last word in amber, rest white
  const renderTitle = (text: string) => {
    const words = text.split(" ");
    return words.map((w, i) => {
      const isHighlight = i < 2;
      const isAccent = i === words.length - 1 && words.length > 3;
      const color = isHighlight ? "#5eead4" : isAccent ? "#fcd34d" : "#ffffff";
      return (
        <span key={i} style={{ color, marginRight: 14 }}>
          {w}
        </span>
      );
    });
  };

  const [bd, rg] = await Promise.all([
    loadFont("LINESeedSansTH_Bd.ttf"),
    loadFont("LINESeedSansTH_Rg.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1080px",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0a0e1a 0%, #0f172a 50%, #0a1f1c 100%)",
          padding: "44px 48px",
          position: "relative",
          fontFamily: "LINESeedSansTH",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(94, 234, 212, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(94, 234, 212, 0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            display: "flex",
          }}
        />

        {/* Header row: category badge + brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 22px",
              borderRadius: "8px",
              background: "rgba(94, 234, 212, 0.1)",
              border: "1.5px solid rgba(94, 234, 212, 0.5)",
              transform: "skew(-8deg)",
            }}
          >
            <span style={{ fontSize: "22px" }}>{cat.emoji}</span>
            <span
              style={{
                color: "#5eead4",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "1.5px",
              }}
            >
              {cat.label}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#5eead4",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #5eead4, #fcd34d)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0a0e1a",
                fontSize: "20px",
                fontWeight: 900,
              }}
            >
              A
            </div>
            <span style={{ fontSize: "26px", fontWeight: 700 }}>AiCEO.im</span>
          </div>
        </div>

        {/* Hero card — both versions use true 16:9 (544) so YouTube thumbnail isn't cropped */}
        <div
          style={{
            display: "flex",
            position: "relative",
            marginTop: "20px",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1.5px solid rgba(255, 255, 255, 0.1)",
            height: "544px",
            zIndex: 2,
          }}
        >
          {cover ? (
            <img
              src={cover}
              alt=""
              width="1080"
              height="560"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(135deg, #1e293b 0%, #064e3b 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(94, 234, 212, 0.3)",
                fontSize: "180px",
                fontWeight: 900,
              }}
            >
              AI
            </div>
          )}
          {/* Gradient overlay bottom */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(10, 14, 26, 0.85) 0%, rgba(10, 14, 26, 0) 50%)",
              display: "flex",
            }}
          />
          {/* Creator credit pill (only for curated, not Tim's own) */}
          {creator && !isOwn && (
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 22px 10px 10px",
                background: "rgba(0, 0, 0, 0.7)",
                backdropFilter: "blur(8px)",
                borderRadius: "999px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, #5eead4, #14b8a6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0a0e1a",
                  fontSize: "20px",
                  fontWeight: 900,
                }}
              >
                {creator[0]?.toUpperCase() ?? "?"}
              </div>
              <span
                style={{
                  color: "white",
                  fontSize: "22px",
                  fontWeight: 700,
                }}
              >
                {creator}
              </span>
            </div>
          )}
        </div>

        {/* Title block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "22px",
            zIndex: 2,
            flex: 1,
            justifyContent: isOwn ? "center" : "flex-start",
            alignItems: isOwn ? "center" : "stretch",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: isOwn ? "78px" : "56px",
              lineHeight: 1.15,
              fontWeight: 900,
              letterSpacing: "-0.5px",
              justifyContent: isOwn ? "center" : "flex-start",
              textAlign: isOwn ? "center" : "left",
            }}
          >
            {renderTitle(title)}
          </div>
          {subtitle && !isOwn && (
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                fontSize: "28px",
                color: "#cbd5e1",
                fontWeight: 400,
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </div>
          )}

          {/* Hook copy — eye-catching teaser line, replaces bullets */}
          {!isOwn && hook && (
            <div
              style={{
                display: "flex",
                marginTop: "16px",
                fontSize: "30px",
                color: "#5eead4",
                fontWeight: 700,
                lineHeight: 1.3,
                letterSpacing: "-0.2px",
              }}
            >
              {hook}
            </div>
          )}

          {/* Attribution — only for curated (Tim's own = no attribution) */}
          {creator && !isOwn && (
            <div
              style={{
                display: "flex",
                marginTop: "auto",
                paddingTop: "18px",
                color: "#94a3b8",
                fontSize: "28px",
                justifyContent: "center",
                width: "100%",
              }}
            >
              จาก {creator}
            </div>
          )}
        </div>

        {/* Bottom gradient accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "10px",
            background: "linear-gradient(90deg, #5eead4 0%, #fcd34d 100%)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      fonts: [
        { name: "LINESeedSansTH", data: bd, weight: 700, style: "normal" },
        { name: "LINESeedSansTH", data: rg, weight: 400, style: "normal" },
      ],
    },
  );
}
