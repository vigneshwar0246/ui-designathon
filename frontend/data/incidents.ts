import type { Incident } from "@/types/demo";

export const initialIncidents: Incident[] = [
  { id: "INC-1042", type: "Accident", title: "Two-vehicle collision", roadId: "av", severity: "Critical", status: "New", time: "10:36 AM", description: "Illustrative collision report near Hope College Junction. One lane affected in the demo scenario.", assignee: "Unassigned" },
  { id: "INC-1041", type: "Congestion", title: "Heavy queue forming", roadId: "sathy", severity: "High", status: "In Progress", time: "10:19 AM", description: "Simulated speed drop and queue growth at Ganapathy Junction.", assignee: "K. Raman" },
  { id: "INC-1040", type: "Camera outage", title: "Camera feed unavailable", roadId: "sathy", severity: "Medium", status: "Acknowledged", time: "09:18 AM", description: "Demo camera CAM-004 is offline. No real stream is connected.", assignee: "A. Nair" },
  { id: "INC-1039", type: "Signal failure", title: "Signal controller fault", roadId: "sathy", severity: "High", status: "New", time: "09:05 AM", description: "Simulated controller health alert for Ganapathy Junction.", assignee: "Unassigned" },
  { id: "INC-1038", type: "Road closure", title: "Maintenance lane closure", roadId: "pollachi", severity: "Low", status: "Resolved", time: "08:25 AM", description: "Illustrative scheduled maintenance closure, now resolved in the demo.", assignee: "M. Devi" },
  { id: "INC-1037", type: "Congestion", title: "Morning peak delay", roadId: "trichy", severity: "Medium", status: "Resolved", time: "08:08 AM", description: "Historical demo congestion event near Singanallur Signal.", assignee: "K. Raman" },
];
