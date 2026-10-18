"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import { Crosshair, Minus, Plus } from "lucide-react";
import { roads } from "@/data/roads";
import { useDemoStore } from "@/store/useDemoStore";
import type { Road } from "@/types/demo";

const center: [number, number] = [11.0048, 76.9762];
const roadColors = { Low: "#16A34A", Moderate: "#D97706", High: "#E05B42", Severe: "#C51F35" };

function MapControls({ selected }: { selected: Road | null }) {
  const map = useMap();
  useEffect(() => { if (selected) map.flyTo([selected.lat, selected.lng], 13, { duration: 0.8 }); }, [selected, map]);
  return <div className="map-controls"><button aria-label="Zoom in" onClick={() => map.zoomIn()}><Plus size={16} /></button><button aria-label="Zoom out" onClick={() => map.zoomOut()}><Minus size={16} /></button><button aria-label="Recenter map" onClick={() => map.flyTo(center, 12, { duration: 0.8 })}><Crosshair size={16} /></button></div>;
}

export default function TrafficMap({ height = 390, selectedRoadId, onSelectRoad, showCameras = true, showIncidents = true }: {
  height?: number;
  selectedRoadId?: string | null;
  onSelectRoad?: (id: string) => void;
  showCameras?: boolean;
  showIncidents?: boolean;
}) {
  const [internalId, setInternalId] = useState<string | null>(null);
  const cameras = useDemoStore((state) => state.cameras);
  const incidents = useDemoStore((state) => state.incidents);
  const selected = useMemo(() => roads.find((road) => road.id === (selectedRoadId ?? internalId)) ?? null, [selectedRoadId, internalId]);
  const choose = (id: string) => { setInternalId(id); onSelectRoad?.(id); };

  return (
    <div className="traffic-map" style={{ height }}>
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} zoomControl={false} className="traffic-map__canvas">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {roads.map((road) => {
          const color = roadColors[road.congestion];
          return <Polyline key={`${road.id}-segment`} positions={[[road.lat - 0.004, road.lng - 0.005], [road.lat, road.lng], [road.lat + 0.004, road.lng + 0.006]]} pathOptions={{ color, weight: 7, opacity: 0.85 }} eventHandlers={{ click: () => choose(road.id) }} />;
        })}
        {roads.map((road) => <CircleMarker key={road.id} center={[road.lat, road.lng]} radius={selected?.id === road.id ? 11 : 8} pathOptions={{ color: "#fff", weight: 3, fillColor: roadColors[road.congestion], fillOpacity: 1 }} eventHandlers={{ click: () => choose(road.id) }}><Tooltip direction="top" offset={[0, -10]}>{road.name} · {road.congestion}</Tooltip></CircleMarker>)}
        {showCameras && cameras.map((camera) => <CircleMarker key={camera.id} center={[camera.lat + 0.0022, camera.lng - 0.0025]} radius={5} pathOptions={{ color: "#fff", weight: 2, fillColor: camera.online ? "#567A91" : "#9AA6B2", fillOpacity: 1 }} eventHandlers={{ click: () => choose(camera.roadId) }}><Tooltip>{camera.id} · {camera.online ? "Demo online" : "Demo offline"}</Tooltip></CircleMarker>)}
        {showIncidents && incidents.filter((incident) => incident.status !== "Resolved").map((incident, index) => { const road = roads.find((item) => item.id === incident.roadId); return road ? <CircleMarker key={incident.id} center={[road.lat - 0.002 - index * 0.0004, road.lng + 0.003 + index * 0.0004]} radius={5} pathOptions={{ color: "#fff", weight: 2, fillColor: "#C51F35", fillOpacity: 1 }} eventHandlers={{ click: () => choose(road.id) }}><Tooltip>{incident.title} · {incident.status}</Tooltip></CircleMarker> : null; })}
        <MapControls selected={selected} />
      </MapContainer>
      <div className="map-demo-label">ILLUSTRATIVE ROAD CONDITIONS · OSM BASE MAP</div>
      {selected && <div className="map-selected-card"><button aria-label="Close location details" onClick={() => { setInternalId(null); onSelectRoad?.(""); }}>×</button><small>SELECTED ROAD</small><strong>{selected.name}</strong><div><span>{selected.vehicles.toLocaleString()} vehicles</span><span>{selected.speed} km/h</span></div><b style={{ color: roadColors[selected.congestion] }}>{selected.congestion} congestion</b></div>}
    </div>
  );
}
