"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Bell, Camera, Palette, RotateCcw, SlidersHorizontal, TrafficCone, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Panel, SectionHeading } from "@/components/ui/Panel";
import { useDemoStore } from "@/store/useDemoStore";

const schema = z.object({ name: z.string().trim().min(2, "Enter at least 2 characters"), city: z.string(), alertThreshold: z.coerce.number<number>().int().min(30).max(100), notificationsEnabled: z.boolean(), compactMode: z.boolean(), highContrast: z.boolean() });
type SettingsForm = z.infer<typeof schema>;

export default function SettingsWorkspace() {
  const settings = useDemoStore((state) => state.settings);
  const userName = useDemoStore((state) => state.userName);
  const role = useDemoStore((state) => state.role);
  const signIn = useDemoStore((state) => state.signIn);
  const updateSettings = useDemoStore((state) => state.updateSettings);
  const resetDemo = useDemoStore((state) => state.resetDemo);
  const [confirmReset, setConfirmReset] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingsForm>({ resolver: zodResolver(schema), defaultValues: { name: userName, ...settings } });
  useEffect(() => { reset({ name: userName, ...settings }); }, [userName, settings, reset]);
  const save = (values: SettingsForm) => { signIn(values.name, role); updateSettings({ city: values.city, alertThreshold: values.alertThreshold, notificationsEnabled: values.notificationsEnabled, compactMode: values.compactMode, highContrast: values.highContrast }); toast.success("Demo preferences saved in this browser"); };

  return <div className="settings-workspace"><form onSubmit={handleSubmit(save)}><div className="settings-grid"><Panel><SectionHeading eyebrow="ACCOUNT" title="Profile preferences" /><div className="settings-section-icon"><UserRound size={18} /></div><label className="form-field"><span>DISPLAY NAME</span><input {...register("name")} />{errors.name && <em>{errors.name.message}</em>}</label><div className="settings-inline-note">Current role: <strong>{role}</strong>. <Link href="/login">Switch demo role <ArrowRight size={13} /></Link></div></Panel><Panel><SectionHeading eyebrow="LOCATION" title="City selection" /><div className="settings-section-icon"><SlidersHorizontal size={18} /></div><label className="form-field"><span>DISPLAY CITY</span><select {...register("city")}><option>Coimbatore</option><option>Chennai</option><option>Bengaluru</option></select></label><p className="illustrative-note">The sample roads and locations remain based on Coimbatore. Other city names demonstrate preference persistence only.</p></Panel><Panel><SectionHeading eyebrow="ALERTING" title="Notification preferences" /><div className="settings-section-icon"><Bell size={18} /></div><label className="form-field"><span>CONGESTION ALERT THRESHOLD</span><input type="number" min={30} max={100} {...register("alertThreshold")} />{errors.alertThreshold && <em>Enter a value from 30 to 100.</em>}</label><label className="form-switch"><input type="checkbox" {...register("notificationsEnabled")} /><span>Show demo notifications</span></label></Panel><Panel><SectionHeading eyebrow="APPEARANCE" title="Theme preferences" /><div className="settings-section-icon"><Palette size={18} /></div><label className="form-switch"><input type="checkbox" {...register("highContrast")} /><span>High contrast cloud theme</span></label><label className="form-switch"><input type="checkbox" {...register("compactMode")} /><span>Compact dashboard spacing</span></label><p className="illustrative-note">Both display preferences apply after saving.</p></Panel></div><div className="settings-save"><span>Local demo settings only · no account server</span><button className="primary-button" type="submit">Save preferences</button></div></form><div className="settings-grid settings-grid--bottom"><Panel><SectionHeading eyebrow="DEVICE CONFIGURATION" title="Manage demonstration devices" /><div className="settings-links"><Link href="/dashboard/cameras"><Camera size={17} /> Camera status simulation <ArrowRight size={15} /></Link><Link href="/dashboard/junctions"><TrafficCone size={17} /> Junction timing simulation <ArrowRight size={15} /></Link></div></Panel><Panel><SectionHeading eyebrow="RESET" title="Restore sample dataset" /><p className="modal-copy">Restore the original incidents, cameras, junction timings, notifications and display preferences. This only affects data in this browser.</p><button className="secondary-button" onClick={() => setConfirmReset(true)} disabled={role !== "Admin"}><RotateCcw size={15} /> Reset demo data</button>{role !== "Admin" && <p className="illustrative-note">Switch to the Admin demo role to reset shared data.</p>}</Panel></div><Modal open={confirmReset} onOpenChange={setConfirmReset} title="Reset local demo data?" description="This restores the original illustrative dataset."><p className="modal-copy">Any incident status, camera, junction or setting changes saved in this browser will be replaced.</p><div className="modal-actions"><button className="secondary-button" onClick={() => setConfirmReset(false)}>Cancel</button><button className="primary-button" onClick={() => { resetDemo(); setConfirmReset(false); toast.success("Original demo dataset restored"); }}>Reset demo data</button></div></Modal></div>;
}
