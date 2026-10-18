"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Activity, ArrowRight, Camera, CarFront, ChartNoAxesCombined, CircleAlert, Gauge, MapPinned, TrafficCone, TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { CongestionChart, SpeedTrendChart, TrafficVolumeChart, VehicleDonutChart } from "@/components/charts/TrafficCharts";
import { Modal } from "@/components/ui/Modal";
import { Panel, SectionHeading, StatusBadge } from "@/components/ui/Panel";
import { getOverviewMetrics, getRoadName } from "@/lib/selectors";
import { useDemoStore } from "@/store/useDemoStore";
import type { Incident } from "@/types/demo";

const TrafficMap = dynamic(() => import("@/components/maps/TrafficMap"), { ssr: false, loading: () => <div className="map-loading">Loading illustrative map…</div> });
const sparkData = [24, 28, 25, 36, 33, 41, 39, 48, 45, 52].map((value) => ({ value }));
const demoDelta = (value: number, initial: number) => `${value >= initial ? "+" : ""}${value - initial}`;

function MetricCard({ label, value, unit, trend, comparison, icon: Icon, tone = "red" }: {
  label: string; value: string; unit?: string; trend: string; comparison: string; icon: typeof CarFront; tone?: "red" | "blue";
}) {
  return <Panel className="metric-card"><div className="metric-card__top"><span className={`metric-icon metric-icon--${tone}`}><Icon size={19} strokeWidth={1.9} /></span><div className="metric-spark" aria-hidden="true"><ResponsiveContainer width="100%" height="100%"><AreaChart data={sparkData}><Area dataKey="value" stroke={tone === "red" ? "#C51F35" : "#66879A"} strokeWidth={2} fill="none" /></AreaChart></ResponsiveContainer></div></div><p>{label}</p><div className="metric-card__value">{value}<small>{unit}</small></div><div className="metric-card__foot"><span className={trend.startsWith("-") ? "metric-trend metric-trend--down" : "metric-trend"}>{trend.startsWith("-") ? <TrendingDown size={13} /> : <TrendingUp size={13} />}{trend}</span><span>{comparison}</span></div></Panel>;
}

export default function OverviewDashboard() {
  const cameras = useDemoStore((state) => state.cameras);
  const incidents = useDemoStore((state) => state.incidents);
  const junctions = useDemoStore((state) => state.junctions);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const metrics = getOverviewMetrics(cameras, incidents, junctions);
  const activeIncidents = incidents.filter((incident) => incident.status !== "Resolved");

  return <div className="dashboard-overview">
    <div className="overview-banner"><div><span className="overview-banner__eyebrow"><span /> TRAFFIC OPERATIONS / ILLUSTRATIVE DATA</span><h2>City movement, clearly in view.</h2><p>A focused view of traffic flow, roadway conditions and network health across the Coimbatore demo area.</p></div><Link href="/dashboard/map">Explore live map <ArrowRight size={17} /></Link><div className="overview-banner__road" aria-hidden="true" /></div>

    <SectionHeading eyebrow="NETWORK AT A GLANCE" title="Operational overview" action={<span className="section-note">Fixed demo observation day · updated locally</span>} />
    <div className="metric-grid">
      <MetricCard label="Total vehicles monitored" value={metrics.vehicles.toLocaleString()} trend="+8.2%" comparison="vs. prior demo day" icon={CarFront} />
      <MetricCard label="Active CCTV cameras" value={`${metrics.activeCameras}/${metrics.totalCameras}`} trend={demoDelta(metrics.activeCameras, 5)} comparison="vs. initial demo" icon={Camera} tone="blue" />
      <MetricCard label="Average traffic speed" value={String(metrics.averageSpeed)} unit="km/h" trend="-3.1%" comparison="vs. prior demo day" icon={Gauge} tone="blue" />
      <MetricCard label="Traffic congestion index" value={String(metrics.congestionIndex)} unit="/100" trend="+5.4%" comparison="vs. prior demo day" icon={Activity} />
      <MetricCard label="Active incidents" value={String(metrics.activeIncidents)} trend={demoDelta(metrics.activeIncidents, 4)} comparison="vs. initial demo" icon={CircleAlert} />
      <MetricCard label="Operational traffic signals" value={`${metrics.operationalSignals}/${metrics.totalSignals}`} trend={demoDelta(metrics.operationalSignals, 5)} comparison="vs. initial demo" icon={TrafficCone} tone="blue" />
    </div>

    <div className="overview-main-grid">
      <Panel className="map-panel"><SectionHeading eyebrow="CITY OPERATIONS" title="Traffic network map" action={<Link className="text-link" href="/dashboard/map">Open full map <ArrowRight size={15} /></Link>} /><TrafficMap height={392} /><div className="map-legend"><span><i className="legend-dot legend-dot--low" /> Low</span><span><i className="legend-dot legend-dot--moderate" /> Moderate</span><span><i className="legend-dot legend-dot--high" /> High</span><span><i className="legend-dot legend-dot--severe" /> Severe</span><span><i className="legend-dot legend-dot--camera" /> Camera</span></div></Panel>
      <Panel className="incident-panel"><SectionHeading eyebrow="PRIORITY QUEUE" title="Incident feed" action={<Link className="text-link" href="/dashboard/incidents">View all <ArrowRight size={15} /></Link>} /><div className="incident-feed">{activeIncidents.map((incident) => <button key={incident.id} className="incident-feed__item" onClick={() => setSelectedIncident(incident)}><span className={`incident-feed__mark incident-feed__mark--${incident.severity.toLowerCase()}`} /><span><strong>{incident.title}</strong><small>{getRoadName(incident.roadId)}</small><em>{incident.type} · {incident.time}</em></span><StatusBadge tone={incident.severity === "Critical" || incident.severity === "High" ? "danger" : "warning"}>{incident.severity}</StatusBadge></button>)}</div><div className="incident-panel__foot"><CircleAlert size={16} /> All events shown are simulated for this UI demo.</div></Panel>
    </div>

    <div className="overview-charts-grid">
      <Panel><SectionHeading eyebrow="MOVEMENT" title="Traffic volume over time" action={<span className="chart-period">TODAY / DEMO</span>} /><TrafficVolumeChart /></Panel>
      <Panel><SectionHeading eyebrow="COMPOSITION" title="Vehicle classification" /><VehicleDonutChart /></Panel>
      <Panel><SectionHeading eyebrow="HOTSPOTS" title="Congestion by road" /><CongestionChart /></Panel>
      <Panel><SectionHeading eyebrow="FLOW" title="Average speed trend" /><SpeedTrendChart /></Panel>
    </div>

    <div className="overview-bottom-link"><div><MapPinned size={20} /><span><strong>Explore the complete operations workspace</strong><small>Maps, cameras, junctions, reports and cloud architecture.</small></span></div><Link href="/dashboard/analytics">Open analytics <ChartNoAxesCombined size={16} /></Link></div>

    <Modal open={!!selectedIncident} onOpenChange={(open) => { if (!open) setSelectedIncident(null); }} title={selectedIncident?.title ?? "Incident"} description={`${selectedIncident?.id ?? ""} · Illustrative incident`}><div className="detail-list"><div><span>Location</span><strong>{selectedIncident && getRoadName(selectedIncident.roadId)}</strong></div><div><span>Severity</span><strong>{selectedIncident?.severity}</strong></div><div><span>Status</span><strong>{selectedIncident?.status}</strong></div><div><span>Assigned to</span><strong>{selectedIncident?.assignee}</strong></div></div><p className="modal-copy">{selectedIncident?.description}</p><Link href="/dashboard/incidents" className="primary-button" onClick={() => setSelectedIncident(null)}>Manage incident <ArrowRight size={16} /></Link></Modal>
  </div>;
}
