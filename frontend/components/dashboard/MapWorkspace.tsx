"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Camera, CircleAlert, MapPin, Search, TrafficCone } from "lucide-react";
import { roads, regions } from "@/data/roads";
import { Panel, SectionHeading, StatusBadge } from "@/components/ui/Panel";
import { useDemoStore } from "@/store/useDemoStore";

const TrafficMap = dynamic(() => import("@/components/maps/TrafficMap"), { ssr: false, loading: () => <div className="map-loading map-loading--large">Loading illustrative map…</div> });

export default function MapWorkspace() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All regions");
  const [selectedId, setSelectedId] = useState("");
  const [showCameras, setShowCameras] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const cameras = useDemoStore((state) => state.cameras);
  const incidents = useDemoStore((state) => state.incidents);
  const junctions = useDemoStore((state) => state.junctions);

  useEffect(() => { const road = new URLSearchParams(window.location.search).get("road"); if (road && roads.some((item) => item.id === road)) setSelectedId(road); }, []);
  const filtered = useMemo(() => roads.filter((road) => (region === "All regions" || road.region === region) && road.name.toLowerCase().includes(query.toLowerCase())), [region, query]);
  const selected = roads.find((road) => road.id === selectedId) ?? null;
  const camera = cameras.find((item) => item.roadId === selectedId);
  const junction = junctions.find((item) => item.roadId === selectedId);
  const activeIncidents = incidents.filter((item) => item.roadId === selectedId && item.status !== "Resolved");

  return <div className="workspace-grid map-workspace">
    <Panel className="workspace-main"><SectionHeading eyebrow="COIMBATORE DEMO AREA" title="Road network and monitoring points" action={<span className="section-note">OpenStreetMap base · illustrative overlays</span>} /><div className="map-toolbar"><label className="field-search"><Search size={15} /><input placeholder="Search a road" aria-label="Search roads" value={query} onChange={(event) => setQuery(event.target.value)} /></label><select className="dash-select" aria-label="Filter region" value={region} onChange={(event) => setRegion(event.target.value)}>{regions.map((item) => <option key={item}>{item}</option>)}</select><label className="filter-check"><input type="checkbox" checked={showCameras} onChange={(event) => setShowCameras(event.target.checked)} /> Cameras</label><label className="filter-check"><input type="checkbox" checked={showIncidents} onChange={(event) => setShowIncidents(event.target.checked)} /> Incidents</label></div><TrafficMap height={530} selectedRoadId={selectedId} onSelectRoad={setSelectedId} showCameras={showCameras} showIncidents={showIncidents} /><div className="map-legend"><span><i className="legend-dot legend-dot--low" /> Low</span><span><i className="legend-dot legend-dot--moderate" /> Moderate</span><span><i className="legend-dot legend-dot--high" /> High</span><span><i className="legend-dot legend-dot--severe" /> Severe</span><span><i className="legend-dot legend-dot--camera" /> Camera</span></div></Panel>
    <div className="workspace-side"><Panel className="location-list"><SectionHeading eyebrow="LOCATIONS" title="Monitored roads" /><div className="location-list__items">{filtered.length ? filtered.map((road) => <button key={road.id} className={selectedId === road.id ? "selected" : ""} onClick={() => setSelectedId(road.id)}><span className="location-list__icon"><MapPin size={16} /></span><span><strong>{road.name}</strong><small>{road.region} · {road.vehicles.toLocaleString()} vehicles</small></span><span className={`congestion-dot congestion-dot--${road.congestion.toLowerCase()}`} /></button>) : <p className="empty-copy">No roads match this search.</p>}</div></Panel>
      <Panel className="location-details"><SectionHeading eyebrow="LOCATION DETAILS" title={selected?.name ?? "Select a road"} />{selected ? <><div className="detail-stat-grid"><div><small>TRAFFIC VOLUME</small><strong>{selected.vehicles.toLocaleString()}</strong></div><div><small>AVG. SPEED</small><strong>{selected.speed} km/h</strong></div></div><div className="detail-list"><div><span>Congestion</span><StatusBadge tone={selected.congestion === "Severe" || selected.congestion === "High" ? "danger" : "warning"}>{selected.congestion}</StatusBadge></div><div><span><Camera size={13} /> Camera</span><strong>{camera?.id ?? "None"} · {camera?.online ? "Online" : "Offline"}</strong></div><div><span><TrafficCone size={13} /> Signal</span><strong>{junction?.operational ? "Operational" : "Needs attention"}</strong></div><div><span><CircleAlert size={13} /> Active incidents</span><strong>{activeIncidents.length}</strong></div></div><p className="illustrative-note">Road volumes and conditions are simulated. Marker positions are approximate.</p></> : <p className="empty-copy">Select a marker or road to inspect its demo conditions.</p>}</Panel></div>
  </div>;
}
