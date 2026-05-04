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
} as const;
