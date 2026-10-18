"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Timer, TrafficCone } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Panel, SectionHeading, StatusBadge } from "@/components/ui/Panel";
import { getRoadName } from "@/lib/selectors";
import { useDemoStore } from "@/store/useDemoStore";

const schema = z.object({ greenSeconds: z.coerce.number<number>().int().min(10).max(180), amberSeconds: z.coerce.number<number>().int().min(3).max(10), redSeconds: z.coerce.number<number>().int().min(10).max(180), operational: z.boolean() });
type FormValues = z.infer<typeof schema>;

export default function JunctionWorkspace() {
  const junctions = useDemoStore((state) => state.junctions);
  const updateJunction = useDemoStore((state) => state.updateJunction);
  const role = useDemoStore((state) => state.role);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = junctions.find((junction) => junction.id === selectedId) ?? null;
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { greenSeconds: 45, amberSeconds: 4, redSeconds: 55, operational: true } });
  useEffect(() => { if (selected) reset({ greenSeconds: selected.greenSeconds, amberSeconds: selected.amberSeconds, redSeconds: selected.redSeconds, operational: selected.operational }); }, [selected, reset]);
  const submit = (values: FormValues) => { if (!selected || role === "Viewer") return; updateJunction(selected.id, values); toast.success(`${selected.name} demo timings updated`); setSelectedId(null); };

  return <div className="junction-workspace"><div className="summary-strip"><div><TrafficCone size={18} /><strong>{junctions.length}</strong><span>demo junctions</span></div><div><Timer size={18} /><strong>{junctions.filter((item) => item.operational).length}</strong><span>simulated operational</span></div><p>Signal timing controls modify local demonstration settings only.</p></div><SectionHeading eyebrow="SIGNAL OPERATIONS" title="Junction control" action={<span className="section-note">No road infrastructure is connected</span>} /><div className="junction-grid">{junctions.map((junction) => <Panel key={junction.id} className="junction-card"><div className="junction-card__top"><span className="junction-card__icon"><TrafficCone size={19} /></span><StatusBadge tone={junction.operational ? "success" : "danger"}>{junction.operational ? "Operational" : "Attention"}</StatusBadge></div><h3>{junction.name}</h3><p>{getRoadName(junction.roadId)}</p><div className="signal-visual" aria-label={`Simulated phases: red ${junction.redSeconds}, amber ${junction.amberSeconds}, green ${junction.greenSeconds} seconds`}><span className="signal-light signal-light--red" /><span className="signal-light signal-light--amber" /><span className="signal-light signal-light--green" /><div><strong>SIMULATED PHASES</strong><small>R {junction.redSeconds}s · A {junction.amberSeconds}s · G {junction.greenSeconds}s</small></div></div><div className="junction-card__stats"><div><small>VEHICLE QUEUE</small><strong>{junction.queue} vehicles</strong></div><div><small>HEALTH</small><strong>{junction.operational ? "Good" : "Fault demo"}</strong></div></div><button className="junction-card__open" onClick={() => setSelectedId(junction.id)}>View and edit demo settings <ArrowRight size={16} /></button></Panel>)}</div>
    <Modal open={!!selected} onOpenChange={(open) => { if (!open) setSelectedId(null); }} title={selected?.name ?? "Junction"} description="Simulated signal configuration" wide>{selected && <form onSubmit={handleSubmit(submit)}><div className="junction-modal-overview"><div><small>ROAD</small><strong>{getRoadName(selected.roadId)}</strong></div><div><small>VEHICLE QUEUE</small><strong>{selected.queue} estimated</strong></div><div><small>HEALTH</small><strong>{selected.operational ? "Operational" : "Needs attention"}</strong></div></div><div className="form-grid"><label className="form-field"><span>RED PHASE · SECONDS</span><input type="number" min={10} max={180} {...register("redSeconds")} disabled={role === "Viewer"} />{errors.redSeconds && <em>Enter 10–180 seconds.</em>}</label><label className="form-field"><span>AMBER PHASE · SECONDS</span><input type="number" min={3} max={10} {...register("amberSeconds")} disabled={role === "Viewer"} />{errors.amberSeconds && <em>Enter 3–10 seconds.</em>}</label><label className="form-field"><span>GREEN PHASE · SECONDS</span><input type="number" min={10} max={180} {...register("greenSeconds")} disabled={role === "Viewer"} />{errors.greenSeconds && <em>Enter 10–180 seconds.</em>}</label></div><label className="form-switch"><input type="checkbox" {...register("operational")} disabled={role === "Viewer"} /><span>Mark simulated signal operational</span></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setSelectedId(null)}>Cancel</button><button type="submit" className="primary-button" disabled={role === "Viewer"}>Save demo configuration</button></div><p className="illustrative-note">These controls are local UI settings. They never send commands to real traffic signals.</p></form>}</Modal>
  </div>;
}
