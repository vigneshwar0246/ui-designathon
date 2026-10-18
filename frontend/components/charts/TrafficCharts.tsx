"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { hourlyTraffic, vehicleClasses, weeklyTraffic } from "@/data/traffic-history";
import { roads } from "@/data/roads";

const axis = { tickLine: false, axisLine: false, tick: { fill: "#8B98A8", fontSize: 11 } } as const;
const tooltipStyle = { borderRadius: 12, border: "1px solid #E5EAF0", boxShadow: "0 12px 32px rgba(25,38,56,.1)", fontSize: 12 };

export function TrafficVolumeChart({ multiplier = 1 }: { multiplier?: number }) {
  const data = hourlyTraffic.map((item) => ({ ...item, vehicles: Math.round(item.vehicles * multiplier) }));
  return <div className="chart-box"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top: 12, right: 6, left: -22, bottom: 0 }}><defs><linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C51F35" stopOpacity={0.25} /><stop offset="100%" stopColor="#C51F35" stopOpacity={0.005} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#EDF1F5" strokeDasharray="3 4" /><XAxis dataKey="hour" {...axis} interval={2} /><YAxis {...axis} tickFormatter={(value: number) => `${value / 1000}k`} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${Number(value).toLocaleString()} vehicles`, "Volume"]} /><Area type="monotone" dataKey="vehicles" stroke="#C51F35" strokeWidth={2.5} fill="url(#trafficFill)" activeDot={{ r: 5, strokeWidth: 3, stroke: "white" }} /></AreaChart></ResponsiveContainer></div>;
}

export function VehicleDonutChart({ selectedClass = "All classes" }: { selectedClass?: string }) {
  const data = selectedClass === "All classes" ? vehicleClasses : vehicleClasses.filter((item) => item.name === selectedClass);
  return <div className="donut-layout"><div className="donut-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius="67%" outerRadius="90%" paddingAngle={2} stroke="none">{data.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, "Share"]} /></PieChart></ResponsiveContainer><div className="donut-center"><strong>{selectedClass === "All classes" ? "100%" : `${data[0]?.value ?? 0}%`}</strong><span>{selectedClass === "All classes" ? "CLASSIFIED" : "OF VEHICLES"}</span></div></div><div className="donut-legend">{data.map((item) => <div key={item.name}><span style={{ background: item.color }} />{item.name}<strong>{item.value}%</strong></div>)}</div></div>;
}

export function CongestionChart({ roadIds }: { roadIds?: string[] }) {
  const data = roads.filter((road) => !roadIds || roadIds.includes(road.id)).map((road) => ({ name: road.name, index: ({ Low: 24, Moderate: 52, High: 74, Severe: 91 })[road.congestion] })).sort((a, b) => b.index - a.index);
  if (!data.length) return <p className="empty-copy">No roads match the selected filters.</p>;
  return <div className="chart-box chart-box--bars"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 48, bottom: 0 }}><CartesianGrid horizontal={false} stroke="#EDF1F5" strokeDasharray="3 4" /><XAxis type="number" domain={[0, 100]} {...axis} /><YAxis type="category" dataKey="name" width={112} {...axis} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}/100`, "Congestion index"]} /><Bar dataKey="index" radius={[0, 5, 5, 0]} barSize={13}>{data.map((item) => <Cell key={item.name} fill={item.index > 80 ? "#C51F35" : item.index > 60 ? "#E67B8B" : "#A8BBC5"} />)}</Bar></BarChart></ResponsiveContainer></div>;
}

export function SpeedTrendChart({ multiplier = 1 }: { multiplier?: number }) {
  const data = hourlyTraffic.map((item) => ({ ...item, speed: Math.round(item.speed * multiplier) }));
  return <div className="chart-box"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 14, right: 9, left: -22, bottom: 0 }}><CartesianGrid vertical={false} stroke="#EDF1F5" strokeDasharray="3 4" /><XAxis dataKey="hour" {...axis} interval={2} /><YAxis {...axis} unit="" domain={[0, 60]} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} km/h`, "Average speed"]} /><Line type="monotone" dataKey="speed" stroke="#567A91" strokeWidth={2.5} dot={false} activeDot={{ r: 5, stroke: "white", strokeWidth: 3 }} /></LineChart></ResponsiveContainer></div>;
}

export function WeeklyTrafficChart({ multiplier = 1 }: { multiplier?: number }) {
  const data = weeklyTraffic.map((item) => ({ ...item, vehicles: Math.round(item.vehicles * multiplier) }));
  return <div className="chart-box"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 12, right: 6, left: -12, bottom: 0 }}><CartesianGrid vertical={false} stroke="#EDF1F5" strokeDasharray="3 4" /><XAxis dataKey="day" {...axis} /><YAxis {...axis} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${Number(value).toLocaleString()} vehicles`, "Volume"]} /><Bar dataKey="vehicles" fill="#C51F35" radius={[5, 5, 0, 0]} maxBarSize={34} /></BarChart></ResponsiveContainer></div>;
}
