"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Download, FileBarChart, Printer } from "lucide-react";
import { toast } from "sonner";
import { Panel, SectionHeading, StatusBadge } from "@/components/ui/Panel";
import { regions, roads } from "@/data/roads";
import { weeklyTraffic } from "@/data/traffic-history";
import { getRoadName, downloadCsv } from "@/lib/selectors";
import { useDemoStore } from "@/store/useDemoStore";

const reportTypes = ["Traffic summary", "Congestion analysis", "Incident report", "Camera health", "Junction performance"] as const;
type ReportType = (typeof reportTypes)[number];
type Report = { title: string; headers: string[]; rows: (string | number)[][]; summary: string; generatedAt: string };

export default function ReportsWorkspace() {
  const [type, setType] = useState<ReportType>("Traffic summary");
  const [period, setPeriod] = useState("Demo day");
  const [region, setRegion] = useState("All regions");
  const [report, setReport] = useState<Report | null>(null);
  const cameras = useDemoStore((state) => state.cameras);
  const incidents = useDemoStore((state) => state.incidents);
  const junctions = useDemoStore((state) => state.junctions);
  const includedRoads = useMemo(() => roads.filter((road) => region === "All regions" || road.region === region), [region]);
  const includedIds = new Set(includedRoads.map((road) => road.id));

  const generate = () => {
    const stamp = format(new Date(), "dd MMM yyyy, hh:mm a");
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    if (type === "Traffic summary") { headers = ["Road", "Region", "Vehicles", "Average speed (km/h)", "Congestion"]; rows = includedRoads.map((road) => [road.name, road.region, road.vehicles, road.speed, road.congestion]); }
    if (type === "Congestion analysis") { headers = ["Road", "Region", "Congestion", "Index / 100", "Average speed (km/h)"]; rows = [...includedRoads].sort((a, b) => ({ Low: 24, Moderate: 52, High: 74, Severe: 91 })[b.congestion] - ({ Low: 24, Moderate: 52, High: 74, Severe: 91 })[a.congestion]).map((road) => [road.name, road.region, road.congestion, ({ Low: 24, Moderate: 52, High: 74, Severe: 91 })[road.congestion], road.speed]); }
    if (type === "Incident report") { headers = ["ID", "Type", "Title", "Road", "Severity", "Status", "Assignee"]; rows = incidents.filter((item) => includedIds.has(item.roadId)).map((item) => [item.id, item.type, item.title, getRoadName(item.roadId), item.severity, item.status, item.assignee]); }
    if (type === "Camera health") { headers = ["ID", "Camera", "Road", "Demo status", "Last observation"]; rows = cameras.filter((item) => includedIds.has(item.roadId)).map((item) => [item.id, item.name, getRoadName(item.roadId), item.online ? "Online" : "Offline", item.lastObserved]); }
    if (type === "Junction performance") { headers = ["Junction", "Road", "Queue estimate", "Signal status", "Green (s)", "Amber (s)", "Red (s)"]; rows = junctions.filter((item) => includedIds.has(item.roadId)).map((item) => [item.name, getRoadName(item.roadId), item.queue, item.operational ? "Operational" : "Needs attention", item.greenSeconds, item.amberSeconds, item.redSeconds]); }
    const summary = `${rows.length} ${type.toLowerCase()} records · ${region} · ${period}. ${period === "Demo day" ? "Fixed observation day" : `Comparison context based on ${weeklyTraffic.length} illustrative weekdays`}.`;
    setReport({ title: type, headers, rows, summary, generatedAt: stamp });
    toast.success(`${type} generated from local demo data`);
  };
  const exportCsv = () => { if (!report) return; downloadCsv(`traffiq-${report.title.toLowerCase().replaceAll(" ", "-")}.csv`, [report.headers, ...report.rows]); toast.success("CSV downloaded"); };

  return <div className="reports-workspace"><Panel className="workspace-main report-controls"><SectionHeading eyebrow="LOCAL REPORT BUILDER" title="Generate a demonstration report" action={<span className="section-note">No server required</span>} /><div className="report-selector"><label className="form-field"><span>REPORT TYPE</span><select value={type} onChange={(event) => setType(event.target.value as ReportType)}>{reportTypes.map((item) => <option key={item}>{item}</option>)}</select></label><label className="form-field"><span>DATE RANGE</span><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>Demo day</option><option>Demo week</option><option>Demo month</option></select></label><label className="form-field"><span>REGION</span><select value={region} onChange={(event) => setRegion(event.target.value)}>{regions.map((item) => <option key={item}>{item}</option>)}</select></label><button className="primary-button" onClick={generate}><FileBarChart size={16} /> Generate report</button></div><p className="illustrative-note">All reports are generated from the same editable local demo data. Date ranges change the report context; the underlying location records represent a fixed illustrative observation day.</p></Panel>
    {report ? <Panel className="report-preview"><div className="report-preview__top"><div><span>TRAFFIQ CLOUD / DEMO REPORT</span><h2>{report.title}</h2><p>{report.summary}</p><small>Generated {report.generatedAt}</small></div><div className="report-preview__actions"><button className="secondary-button" onClick={exportCsv}><Download size={15} /> Download CSV</button><button className="secondary-button" onClick={() => window.print()}><Printer size={15} /> Print / Save PDF</button></div></div><div className="table-scroll"><table className="dash-table"><thead><tr>{report.headers.map((header) => <th key={header}>{header.toUpperCase()}</th>)}</tr></thead><tbody>{report.rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{typeof cell === "string" && ["Online", "Operational", "Resolved"].includes(cell) ? <StatusBadge tone="success">{cell}</StatusBadge> : cell}</td>)}</tr>)}</tbody></table>{!report.rows.length && <p className="empty-copy">No records match this region.</p>}</div><div className="report-preview__footer">Illustrative dataset · Generated in your browser · No live system connection</div></Panel> : <Panel className="report-empty"><FileBarChart size={31} /><h2>Your report preview will appear here</h2><p>Choose a report and region, then generate it. CSV and print controls will export the actual rows shown.</p></Panel>}
  </div>;
}
