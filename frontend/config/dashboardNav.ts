import { Activity, Camera, ChartNoAxesCombined, Cloud, FileText, LayoutDashboard, Map, Settings, ShieldAlert, TrafficCone } from "lucide-react";

export const dashboardNav = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Live Traffic Map", href: "/dashboard/map", icon: Map },
  { title: "CCTV Monitoring", href: "/dashboard/cameras", icon: Camera },
  { title: "Traffic Analytics", href: "/dashboard/analytics", icon: ChartNoAxesCombined },
  { title: "Incidents & Alerts", href: "/dashboard/incidents", icon: ShieldAlert },
  { title: "Junction Control", href: "/dashboard/junctions", icon: TrafficCone },
  { title: "Reports", href: "/dashboard/reports", icon: FileText },
  { title: "Cloud Infrastructure", href: "/dashboard/cloud", icon: Cloud },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

export const secondaryNav = [
  { title: "Back to Intro", href: "/", icon: Activity },
] as const;
