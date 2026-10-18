import type { ReactNode } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import "leaflet/dist/leaflet.css";
import "./dashboard.css";
import "./dashboard-pages.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
