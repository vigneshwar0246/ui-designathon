import { roads } from "@/data/roads";
import type { Camera, Incident, Junction } from "@/types/demo";

export function getOverviewMetrics(cameras: Camera[], incidents: Incident[], junctions: Junction[]) {
  const activeIncidents = incidents.filter((incident) => incident.status !== "Resolved").length;
  const vehicles = roads.reduce((sum, road) => sum + road.vehicles, 0);
  const speed = Math.round(roads.reduce((sum, road) => sum + road.speed * road.vehicles, 0) / vehicles);
  const congestionScore = { Low: 24, Moderate: 52, High: 74, Severe: 91 };
  const congestion = Math.round(roads.reduce((sum, road) => sum + congestionScore[road.congestion] * road.vehicles, 0) / vehicles);

  // All figures are illustrative. Vehicle and speed periods are the fixed demo observation day.
  return {
    vehicles,
    activeCameras: cameras.filter((camera) => camera.online).length,
    totalCameras: cameras.length,
    averageSpeed: speed,
    congestionIndex: congestion,
    activeIncidents,
    operationalSignals: junctions.filter((junction) => junction.operational).length,
    totalSignals: junctions.length,
  };
}

export function getRoadName(roadId: string) {
  return roads.find((road) => road.id === roadId)?.name ?? roadId;
}

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
