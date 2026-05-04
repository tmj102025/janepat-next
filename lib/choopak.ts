export const CHOOPAK = {
  name: "Choopak Janeprakon",
  nameTitle: "Mr.",
  role: "Digital Content Creator & Designer",
  tagline: "Video editor & designer ที่เล่าเรื่องแบรนด์ผ่านภาพมาแล้วกว่า 10 ปี",
  summary:
    "Communications professional with expertise in digital content creation, video editing, and graphic design. Proficient in Adobe Creative Suite — Premiere Pro, After Effects, Photoshop, Illustrator, Lightroom — and skilled in creating engaging video content + designing visually appealing graphics for social media and websites.",
  dob: "11 September 1990",
  address: "449/173 Suwintawong Road, Sansab, Minburi, Bangkok 10510",
  phone: "087-685-1237",
  email: "choopak@janepat.com",

  showreel: {
    id: "hw_Jg1J94uk",
    title: "MY SHOWREEL",
  },

  skills: [
    { name: "Premiere Pro", level: 95, group: "Video" },
    { name: "After Effects", level: 90, group: "Video" },
    { name: "Photoshop", level: 92, group: "Graphic" },
    { name: "Illustrator", level: 85, group: "Graphic" },
    { name: "Lightroom", level: 88, group: "Photo" },
    { name: "Dreamweaver", level: 70, group: "Web" },
    { name: "Video Shooting", level: 90, group: "Production" },
    { name: "Content Creation", level: 95, group: "Production" },
  ],

  experience: [
    {
      company: "HAOYUE",
      role: "Video Content Creator & Infographic Designer",
      period: "Feb 2025 – Present",
      summary: "ผลิต video content และ infographic สำหรับช่อง TikTok ของ HAOYUE",
      tags: ["TikTok", "Video", "Infographic"],
    },
    {
      company: "CARRO",
      role: "Videographer & Video Editor",
      period: "Jun 2024 – Dec 2024",
      summary: "ถ่ายทำและตัดต่อ promotional video สำหรับแคมเปญการตลาดของ CARRO",
      tags: ["Promotional", "Editing", "Shooting"],
    },
    {
      company: "CARS24",
      role: "Digital Content Creator",
      period: "Jan 2024 – Apr 2024",
      summary: "สร้าง digital content ทุกช่องทางของแบรนด์ — social media, web, internal channels",
      tags: ["Digital Content", "Multi-platform"],
    },
    {
      company: "CARSOME Academy",
      role: "Digital Content Editor",
      period: "2021 – 2023",
      summary: "ตัดต่อและปรับเนื้อหา digital สำหรับระบบ LMS, เว็บไซต์ และโซเชียลมีเดีย",
      tags: ["LMS", "Web", "Social"],
    },
    {
      company: "HIS TOURS",
      role: "Video Content Creator",
      period: "2015 – 2021",
      summary: "ผลิต video content สำหรับช่อง YouTube และ Facebook ของบริษัท",
      tags: ["YouTube", "Facebook", "Tourism"],
    },
  ],

  education: [
    {
      school: "Mahanakorn University of Technology",
      degree: "Bachelor of Business Administration in Business Communication Arts",
      period: "2010 – 2013",
    },
    {
      school: "The Demonstration School of Ramkhamhaeng University",
      degree: "High School",
      period: "2005 – 2010",
    },
  ],

  // Selected portfolio — เพิ่ม video ID เมื่อมีให้ใส่
  portfolio: [] as Array<{ id: string; title: string; client?: string }>,

  works: [
    {
      image: "/portfolio/01-carsome-event.png",
      title: "CARSOME Academy Event Photo & Video Shooting",
      client: "CARSOME Academy",
      type: "Event · Photo · Video",
      summary:
        "ถ่ายภาพและตัดต่อวิดีโออีเวนต์ของ CARSOME Academy — งานเปิดตัว, training, conference, การถ่ายทำในสตูดิโอ green screen",
    },
    {
      image: "/portfolio/02-banner-line-official.png",
      title: "Banner Design & LINE Official Account",
      client: "HIS Tours / Hanori Cafe / Sukjai / etc.",
      type: "Banner · LINE OA",
      summary:
        "ออกแบบ banner โปรโมชันและเนื้อหาสำหรับช่อง LINE Official — แคมเปญ HIS Tours, Hanori Cafe Kyoto, Sukjai, Damnoen Saduak Floating Market, ทัวร์ออสเตรเลีย, อิตาลี, อเมริกา และ flash sale",
    },
    {
      image: "/portfolio/03-banner-facebook-his.png",
      title: "Banner Design — Facebook : HIS Thailand",
      client: "HIS Thailand",
      type: "Banner · Facebook",
      summary:
        "ออกแบบภาพประกอบโพสต์ Facebook ของ HIS Thailand — โปรโมชันร้านอาหาร เครื่องครัว และ deals พิเศษ",
    },
    {
      image: "/portfolio/04-print-rollup-pop.png",
      title: "Print Advertising · Roll Up & Shop · POP & Other · Airport Rail Link",
      client: "HIS Thailand",
      type: "Print · POP · Out-of-home",
      summary:
        "ออกแบบงานสื่อสิ่งพิมพ์ — ป้าย Roll-Up หน้าร้าน, สื่อ POP จัดวางในร้าน, แบนเนอร์ขนาดใหญ่บน Airport Rail Link",
    },
    {
      image: "/portfolio/05-website-content.png",
      title: "Update Website & Create Content",
      client: "Carousell / HIS",
      type: "Web · Content",
      summary:
        "อัปเดตหน้าเว็บไซต์ Carousell — Ready to Sell campaign, รวมทั้งสร้าง content thumbnail สำหรับบทความท่องเที่ยวหลายประเทศ",
    },
    {
      image: "/portfolio/06-led-outdoor.png",
      title: "LED Phromphong & LED Outdoor",
      client: "HIS / KYOTO Special / Sukjai / Mango Festival / Nicoron / Gakken",
      type: "LED · Outdoor",
      summary:
        "ผลิตภาพเคลื่อนไหวสำหรับจอ LED Phromphong และจอ LED outdoor — งานโปรโมชัน HIS, KYOTO Special Sweets Shopping, เครื่องดื่ม Sukjai, Damnoen Saduak Mango Festival, Nicoron Sale 80%, Gakken วิทยาศาสตร์",
    },
  ],
} as const;
