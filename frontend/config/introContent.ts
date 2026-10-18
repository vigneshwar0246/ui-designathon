// Edit presentation copy and routes here during the event. Animation code reads this object.
export const introContent = {
  brand: "TRAFFIQ CLOUD",
  brandDescription: "INTELLIGENT ROADS. CONNECTED CITIES.",
  navigation: { label: "ENTER DASHBOARD", href: "/dashboard" },
  scrollLabel: "SCROLL TO EXPLORE",
  scenes: [
    {
      id: "first-impression",
      index: "01 / 05",
      eyebrow: "A CLEARER VIEW OF CITY MOVEMENT",
      title: ["EVERY ROAD.", "EVERY SECOND.", "EVERY INSIGHT."],
      description:
        "Understand traffic flow, roadway conditions, and incidents through one connected monitoring experience.",
      labels: [] as string[],
    },
    {
      id: "traffic",
      index: "02 / 05",
      eyebrow: "TRAFFIC ANALYTICS",
      title: ["KNOW YOUR", "TRAFFIC."],
      description:
        "Track vehicle volumes, identify trends, and understand how your city moves.",
      labels: ["VISITOR TRENDS", "DAILY ANALYTICS", "CLOUD VISIBILITY"],
    },
    {
      id: "performance",
      index: "03 / 05",
      eyebrow: "PERFORMANCE MONITORING",
      title: ["SPEED IS AN", "EXPERIENCE."],
      description:
        "See road speeds clearly. Detect slowdowns before they become wider delays.",
      labels: ["ROAD SPEED", "FASTER DECISIONS"],
    },
    {
      id: "reliability",
      index: "04 / 05",
      eyebrow: "INCIDENTS AND RELIABILITY",
      title: ["SPOT ISSUES.", "STAY AHEAD."],
      description:
        "Recognize incidents and signal issues before they become bigger problems.",
      labels: ["INCIDENT TRACKING", "TRAFFIC SIGNALS", "RELIABILITY INSIGHTS"],
    },
    {
      id: "entry",
      index: "05 / 05",
      eyebrow: "THE FULL PICTURE",
      title: ["YOUR CITY.", "FULLY IN VIEW."],
      description: "One command center for traffic, incidents, and connected roads.",
      labels: [],
    },
  ],
  finalAction: {
    label: "ENTER DASHBOARD",
    href: "/dashboard",
    caption: "TRAFFIQ CLOUD | Smart Traffic Monitoring",
  },
} as const;

// Change this one value to make the pinned story shorter or longer.
export const introScrollDistance = 370;
