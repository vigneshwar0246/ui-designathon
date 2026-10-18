"use client";

import { useMemo, useState } from "react";
import { BarChart3, CalendarDays, FilterX, Gauge, TrendingUp } from "lucide-react";
import { CongestionChart, SpeedTrendChart, TrafficVolumeChart, VehicleDonutChart, WeeklyTrafficChart } from "@/components/charts/TrafficCharts";
import { Panel, SectionHeading, StatusBadge } from "@/components/ui/Panel";
import { roads } from "@/data/roads";
import { hourlyHeatmap, hourlyTraffic, vehicleClasses } from "@/data/traffic-history";

const hours = ["05", "07", "09", "11", "13", "15", "17", "19", "21", "23", "01", "03"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AnalyticsWorkspace() {
  const [period, setPeriod] = useState("Today");
  const [roadId, setRoadId] = useState("All roads");
  const [vehicleClass, setVehicleClass] = useState("All classes");
  const [congestion, setCongestion] = useState("All levels");
  const selectedRoad = roads.find((road) => road.id === roadId);
  const filteredRoads = useMemo(() => roads.filter((road) => (roadId === "All roads" || road.id === roadId) && (congestion === "All levels" || road.congestion === congestion)), [roadId, congestion]);
  const totalVehicles = roads.reduce((sum, road) => sum + road.vehicles, 0);
  const roadMultiplier = selectedRoad ? selectedRoad.vehicles / totalVehicles : 1;
  const classMultiplier = vehicleClass === "All classes" ? 1 : (vehicleClasses.find((item) => item.name === vehicleClass)?.value ?? 0) / 100;
  const multiplier = roadMultiplier * classMultiplier * (period === "Last 7 days" ? 1.08 : period === "Last 30 days" ? 1.13 : 1);
  const speedMultiplier = selectedRoad ? selectedRoad.speed / 33 : 1;
  const estimatedVolume = Math.round(filteredRoads.reduce((sum, road) => sum + road.vehicles, 0) * classMultiplier);
  const peak = [...hourlyTraffic].sort((a, b) => b.vehicles - a.vehicles)[0];
  const reset = () => { setPeriod("Today"); setRoadId("All roads"); setVehicleClass("All classes"); setCongestion("All levels"); };

  return <div className="analytics-workspace"><Panel className="workspace-main"><SectionHeading eyebrow="FILTERED DEMO DATA" title="Explore traffic patterns" action={<span className="section-note">All values are illustrative</span>} /><div className="analytics-filters"><label><span>DATE RANGE</span><div><CalendarDays size={15} /><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>Today</option><option>Last 7 days</option><option>Last 30 days</option></select></div></label><label><span>JUNCTION / ROAD</span><select value={roadId} onChange={(event) => setRoadId(event.target.value)}><option>All roads</option>{roads.map((road) => <option key={road.id} value={road.id}>{road.name}</option>)}</select></label><label><span>VEHICLE CLASS</span><select value={vehicleClass} onChange={(event) => setVehicleClass(event.target.value)}><option>All classes</option>{vehicleClasses.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label><span>CONGESTION</span><select value={congestion} onChange={(event) => setCongestion(event.target.value)}><option>All levels</option><option>Low</option><option>Moderate</option><option>High</option><option>Severe</option></select></label><button className="secondary-button" onClick={reset}><FilterX size={14} /> Reset</button></div></Panel>
    <div className="analytics-summary"><Panel><BarChart3 size={19} /><span>FILTERED VOLUME</span><strong>{estimatedVolume.toLocaleString()}</strong><small>illustrative vehicles</small></Panel><Panel><TrendingUp size={19} /><span>PEAK OBSERVATION</span><strong>{peak.hour}</strong><small>{peak.vehicles.toLocaleString()} vehicles in base dataset</small></Panel><Panel><Gauge size={19} /><span>AVERAGE ROAD SPEED</span><strong>{selectedRoad?.speed ?? 33} km/h</strong><small>selected demo area</small></Panel></div>
    <div className="overview-charts-grid"><Panel><SectionHeading eyebrow="HOURLY" title="Daily traffic volume" /><TrafficVolumeChart multiplier={multiplier} /></Panel><Panel><SectionHeading eyebrow="WEEKLY" title="Weekday comparison" /><WeeklyTrafficChart multiplier={multiplier} /></Panel><Panel><SectionHeading eyebrow="VEHICLE MIX" title="Classification share" /><VehicleDonutChart selectedClass={vehicleClass} /></Panel><Panel><SectionHeading eyebrow="ROAD PRESSURE" title="Congestion ranking" /><CongestionChart roadIds={filteredRoads.map((road) => road.id)} /></Panel><Panel><SectionHeading eyebrow="VELOCITY" title="Speed variation" /><SpeedTrendChart multiplier={speedMultiplier} /></Panel><Panel><SectionHeading eyebrow="JUNCTIONS" title="Junction comparison" /><div className="analytics-road-list">{filteredRoads.length ? filteredRoads.map((road) => <div key={road.id}><span>{road.name}</span><strong>{road.vehicles.toLocaleString()}</strong><StatusBadge tone={road.congestion === "Severe" || road.congestion === "High" ? "danger" : road.congestion === "Moderate" ? "warning" : "success"}>{road.congestion}</StatusBadge></div>) : <p className="empty-copy">No junctions match these filters.</p>}</div></Panel></div>
    <Panel className="heatmap-panel"><SectionHeading eyebrow="CONGESTION RHYTHM" title="Hour-of-day heatmap" action={<span className="section-note">Relative congestion intensity · illustrative week</span>} /><div className="heatmap-wrap"><div className="heatmap-hours"><span />{hours.map((hour) => <span key={hour}>{hour}</span>)}</div>{hourlyHeatmap.map((row, index) => <div className="heatmap-row" key={days[index]}><strong>{days[index]}</strong>{row.map((value, hourIndex) => <div key={hourIndex} title={`${days[index]} ${hours[hourIndex]}:00 · congestion index ${value}`} style={{ background: `rgba(197,31,53,${Math.max(0.1, value / 100)})` }} />)}</div>)}</div><p className="illustrative-note">Hover a cell for its index. Filters above update charts and the junction comparison; this fixed weekly heatmap shows the full reference week.</p></Panel>
  </div>;
}
