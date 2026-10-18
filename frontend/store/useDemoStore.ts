"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialCameras } from "@/data/cameras";
import { initialIncidents } from "@/data/incidents";
import { initialJunctions } from "@/data/junctions";
import type { Camera, Incident, IncidentStatus, Junction, NotificationItem, Role } from "@/types/demo";

export interface DemoSettings {
  city: string;
  alertThreshold: number;
  notificationsEnabled: boolean;
  compactMode: boolean;
  highContrast: boolean;
}

interface DemoState {
  cameras: Camera[];
  incidents: Incident[];
  junctions: Junction[];
  notifications: NotificationItem[];
  settings: DemoSettings;
  role: Role;
  userName: string;
  signedIn: boolean;
  updateIncident: (id: string, status: IncidentStatus, assignee?: string) => void;
  updateCamera: (id: string, online: boolean) => void;
  updateJunction: (id: string, changes: Partial<Pick<Junction, "greenSeconds" | "amberSeconds" | "redSeconds" | "operational">>) => void;
  updateSettings: (changes: Partial<DemoSettings>) => void;
  markNotificationsRead: () => void;
  signIn: (name: string, role: Role) => void;
  signOut: () => void;
  resetDemo: () => void;
}

const initialSettings: DemoSettings = {
  city: "Coimbatore",
  alertThreshold: 70,
  notificationsEnabled: true,
  compactMode: false,
  highContrast: false,
};

const initialNotifications: NotificationItem[] = [
  { id: "note-1", title: "Critical incident", detail: "Collision near Hope College Junction", time: "10:36 AM", read: false },
  { id: "note-2", title: "Camera unavailable", detail: "CAM-004 · Ganapathy Junction", time: "09:18 AM", read: false },
  { id: "note-3", title: "Signal alert", detail: "Ganapathy controller fault", time: "09:05 AM", read: true },
];

function notification(title: string, detail: string): NotificationItem {
  return { id: `note-${Date.now()}`, title, detail, time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), read: false };
}

export const useDemoStore = create<DemoState>()(persist((set) => ({
  cameras: initialCameras,
  incidents: initialIncidents,
  junctions: initialJunctions,
  notifications: initialNotifications,
  settings: initialSettings,
  role: "Traffic Operator",
  userName: "Demo Operator",
  signedIn: false,
  updateIncident: (id, status, assignee) => set((state) => ({
    incidents: state.incidents.map((item) => item.id === id ? { ...item, status, assignee: assignee ?? item.assignee } : item),
    notifications: [notification("Incident updated", `${id} moved to ${status}`), ...state.notifications].slice(0, 20),
  })),
  updateCamera: (id, online) => set((state) => ({
    cameras: state.cameras.map((item) => item.id === id ? { ...item, online } : item),
    notifications: [notification("Camera simulation", `${id} marked ${online ? "online" : "offline"}`), ...state.notifications].slice(0, 20),
  })),
  updateJunction: (id, changes) => set((state) => ({
    junctions: state.junctions.map((item) => item.id === id ? { ...item, ...changes } : item),
    notifications: [notification("Junction demo updated", `${id} settings changed locally`), ...state.notifications].slice(0, 20),
  })),
  updateSettings: (changes) => set((state) => ({ settings: { ...state.settings, ...changes } })),
  markNotificationsRead: () => set((state) => ({ notifications: state.notifications.map((item) => ({ ...item, read: true })) })),
  signIn: (userName, role) => set({ userName, role, signedIn: true }),
  signOut: () => set({ userName: "Demo Operator", role: "Traffic Operator", signedIn: false }),
  resetDemo: () => set({
    cameras: initialCameras,
    incidents: initialIncidents,
    junctions: initialJunctions,
    notifications: initialNotifications,
    settings: initialSettings,
  }),
}), { name: "traffiq-cloud-demo", version: 1, skipHydration: true }));
