"use client";

import { useMemo, useState } from "react";
import { Camera, Grid2X2, List, Maximize2, Search, Signal, VideoOff } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Panel, SectionHeading, StatusBadge } from "@/components/ui/Panel";
import { getRoadName } from "@/lib/selectors";
import { useDemoStore } from "@/store/useDemoStore";
import type { Camera as CameraType } from "@/types/demo";

function CameraPreview({ camera, large = false }: { camera: CameraType; large?: boolean }) {
  return <div className={`camera-preview ${large ? "camera-preview--large" : ""} ${camera.online ? "" : "camera-preview--offline"}`}><div className="camera-preview__road"><i /><i /><i /></div><span className="camera-preview__car camera-preview__car--one" /><span className="camera-preview__car camera-preview__car--two" /><span className="camera-preview__car camera-preview__car--three" /><div className="camera-preview__top"><span><span className={camera.online ? "preview-state-dot" : "preview-state-dot preview-state-dot--off"} /> {camera.online ? "DEMO ONLINE" : "DEMO OFFLINE"}</span><span>{camera.id}</span></div><div className="camera-preview__bottom">SIMULATED CAMERA PREVIEW · NO LIVE FEED</div>{!camera.online && <div className="camera-preview__offline-label"><VideoOff size={22} /> No preview available</div>}</div>;
}

export default function CameraWorkspace() {
  const cameras = useDemoStore((state) => state.cameras);
  const updateCamera = useDemoStore((state) => state.updateCamera);
  const role = useDemoStore((state) => state.role);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All cameras");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<CameraType | null>(null);
  const filtered = useMemo(() => cameras.filter((camera) => `${camera.id} ${camera.name} ${getRoadName(camera.roadId)}`.toLowerCase().includes(query.toLowerCase()) && (status === "All cameras" || (status === "Online" ? camera.online : !camera.online))), [cameras, query, status]);
  const current = cameras.find((camera) => camera.id === selected?.id) ?? selected;
  const online = cameras.filter((camera) => camera.online).length;

  const toggle = (camera: CameraType) => { if (role === "Viewer") { toast.error("Viewer role cannot change demo camera status"); return; } updateCamera(camera.id, !camera.online); toast.success(`${camera.id} marked ${camera.online ? "offline" : "online"} in this demo`); };

  return <div className="camera-workspace"><div className="summary-strip"><div><Camera size={18} /><strong>{cameras.length}</strong><span>demo cameras</span></div><div><Signal size={18} /><strong>{online}</strong><span>simulated online</span></div><div><VideoOff size={18} /><strong>{cameras.length - online}</strong><span>simulated offline</span></div><p>No live CCTV connection. Previews are illustrative UI graphics.</p></div><Panel className="workspace-main"><SectionHeading eyebrow="DEVICE DIRECTORY" title="Camera monitoring" action={<span className="section-note">Select a tile for details</span>} /><div className="workspace-toolbar"><label className="field-search"><Search size={15} /><input placeholder="Search camera or location" aria-label="Search cameras" value={query} onChange={(event) => setQuery(event.target.value)} /></label><select className="dash-select" aria-label="Filter camera status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All cameras</option><option>Online</option><option>Offline</option></select><div className="view-toggle"><button className={layout === "grid" ? "selected" : ""} onClick={() => setLayout("grid")} aria-label="Grid view"><Grid2X2 size={16} /></button><button className={layout === "list" ? "selected" : ""} onClick={() => setLayout("list")} aria-label="List view"><List size={17} /></button></div></div><div className={`camera-list camera-list--${layout}`}>{filtered.length ? filtered.map((camera) => <article key={camera.id} className="camera-card"><button className="camera-card__preview" onClick={() => setSelected(camera)} aria-label={`Open ${camera.id} details`}><CameraPreview camera={camera} /><span className="camera-card__expand"><Maximize2 size={16} /></span></button><div className="camera-card__info"><div><small>{camera.id}</small><strong>{camera.name}</strong><span>{getRoadName(camera.roadId)}</span></div><StatusBadge tone={camera.online ? "success" : "neutral"}>{camera.online ? "Online" : "Offline"}</StatusBadge></div><div className="camera-card__foot"><span>Last observation · {camera.lastObserved}</span><button onClick={() => toggle(camera)}>{camera.online ? "Simulate outage" : "Restore demo"}</button></div></article>) : <p className="empty-copy">No cameras match the selected filters.</p>}</div></Panel>
    <Modal open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }} title={current?.name ?? "Camera"} description={`${current?.id ?? ""} · Illustrative camera detail`} wide><div className="camera-modal-preview">{current && <CameraPreview camera={current} large />}</div><div className="detail-list"><div><span>Road</span><strong>{current && getRoadName(current.roadId)}</strong></div><div><span>Status</span><strong>{current?.online ? "Simulated online" : "Simulated offline"}</strong></div><div><span>Last available observation</span><strong>{current?.lastObserved}</strong></div></div><p className="modal-copy">This UI demonstrates how a real feed could be displayed. No camera stream or backend is connected.</p>{current && <button className="secondary-button" onClick={() => toggle(current)}>{current.online ? "Simulate outage" : "Restore demo status"}</button>}</Modal>
  </div>;
}
