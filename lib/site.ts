export const SITE = {
  name: "Tim Janepat",
  brand: "Janepat.com",
  url: "https://janepat.com",
  locale: "th_TH",
  language: "th",
  description:
    "Tim Janepat — ผู้เชี่ยวชาญ AI ภาษาไทย แชร์ความรู้ AI, ChatGPT, Claude, AI Marketing, AI Automation สำหรับคนไทยและเจ้าของธุรกิจ",
  defaultOgImage: "/og-default.png",
  author: {
    name: "Tim Janepat",
    fullName: "Timothy Janepat",
    role: "AI Expert & Digital Marketing Strategist",
    bio: "ผู้เชี่ยวชาญด้าน AI และการตลาดดิจิทัลของไทย — สอน AI ภาษาไทยให้คนไทยใช้ AI สร้างรายได้จริง",
    avatar: "/images/tim-janepat.jpg",
    email: "hello@janepat.com",
  },
  social: {
    youtube: "https://www.youtube.com/@TimJanepat",
    facebook: "https://www.facebook.com/timjanepat",
    instagram: "https://www.instagram.com/timjanepat",
    line: "https://line.me/ti/p/~timjanepat",
    x: "https://x.com/timjanepat",
    linkedin: "https://www.linkedin.com/in/timjanepat",
    tiktok: "https://www.tiktok.com/@timjanepat",
  },
  // Latest showreel/featured video on YouTube — สลับ id ได้เมื่อมีเนื้อหาใหม่
  featuredVideoId: "hw_Jg1J94uk",
  // Tim's YouTube channel
  youtubeChannelId: "UCRKlO0XkDH9VI6ziF2agdSg",
  youtubeUploadsPlaylist: "UURKlO0XkDH9VI6ziF2agdSg",
  youtubeHandle: "@TimJanepat",
  brandsWorkedWith: [
    "Hostinger",
    "Zoer.ai",
    "Google Gemini",
    "AhaCreator",
    "OpenAI",
    "Anthropic",
    "Make.com",
    "n8n",
  ],
  testimonials: [
    {
      author: "Senior Marketing Manager",
      company: "บริษัทไทยขนาดกลาง",
      quote: "เรียนกับ Tim ทำให้ทีมเริ่มใช้ AI ลดเวลาทำคอนเทนต์ลง 60% ภายใน 2 สัปดาห์",
    },
    {
      author: "Founder",
      company: "E-commerce Brand",
      quote: "Tim สอนเข้าใจง่าย ไม่ใช่แค่ทฤษฎี — workshop วันเดียวเปลี่ยนวิธีทำงานของทีมได้จริง",
    },
    {
      author: "Content Creator",
      company: "1.2M followers",
      quote: "คอร์สของ Tim ช่วยให้ผม 10x จำนวนคอนเทนต์ในเวลาเท่าเดิม",
    },
  ],
  geo: {
    region: "TH",
    placename: "Bangkok, Thailand",
    position: "13.7563;100.5018",
    icbm: "13.7563, 100.5018",
  },
  pocketbase: {
    url: process.env.POCKETBASE_URL || "https://db.aiceo.im",
  },
} as const;

export const NAV = [
  { href: "/", label: "หน้าแรก" },
  { href: "/blog", label: "บทความ AI" },
  { href: "/videos", label: "วีดีโอความรู้ AI" },
  { href: "/services", label: "บริการ" },
  { href: "/about", label: "เกี่ยวกับ Tim" },
  { href: "/contact", label: "ติดต่อ" },
] as const;

export const AI_CATEGORIES = [
  {
    slug: "chatgpt",
    name: "ChatGPT",
    description: "ใช้ ChatGPT ภาษาไทยให้เก่งระดับมืออาชีพ — prompt engineering, GPTs, automation",
    color: "from-emerald-300 to-teal-400",
  },
  {
    slug: "claude",
    name: "Claude AI",
    description: "Claude คือ AI ที่ฉลาดที่สุดสำหรับงานเขียน วิเคราะห์ และโค้ด — เรียนใช้แบบเจาะลึก",
    color: "from-amber-300 to-orange-400",
  },
  {
    slug: "marketing",
    name: "AI Marketing",
    description: "เครื่องมือ AI สำหรับการตลาด — content, ads, SEO, social media automation",
    color: "from-rose-300 to-pink-400",
  },
  {
    slug: "automation",
    name: "AI Automation",
    description: "n8n, Make, Zapier — เชื่อม AI กับงานในชีวิตจริง ลดเวลา เพิ่มผลผลิต",
    color: "from-sky-300 to-blue-400",
  },
  {
    slug: "tools",
    name: "AI Tools",
    description: "รวม AI tools ที่ใช้จริงในธุรกิจ พร้อมรีวิว เปรียบเทียบ และ tutorial ภาษาไทย",
    color: "from-purple-300 to-indigo-400",
  },
  {
    slug: "business",
    name: "AI for Business",
    description: "เจ้าของธุรกิจใช้ AI ยังไงให้ได้ผลจริง — case studies และกลยุทธ์",
    color: "from-teal-300 to-cyan-400",
  },
  {
    slug: "creator",
    name: "AI for Creator",
    description: "Content creator ใช้ AI สร้าง video, image, music, script ยังไงให้คุณภาพสูง",
    color: "from-fuchsia-300 to-rose-400",
  },
  {
    slug: "basics",
    name: "AI Basics",
    description: "พื้นฐาน AI ที่คนไทยทุกคนต้องรู้ — เริ่มจากศูนย์ก็เข้าใจได้",
    color: "from-yellow-300 to-amber-400",
  },
] as const;

export type AICategory = (typeof AI_CATEGORIES)[number];
