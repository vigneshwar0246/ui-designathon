export type Severity = "Critical" | "High" | "Medium" | "Low";
export type IncidentStatus = "New" | "Acknowledged" | "In Progress" | "Resolved";
export type Congestion = "Low" | "Moderate" | "High" | "Severe";
export type Role = "Admin" | "Traffic Operator" | "Viewer";

export interface Road {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  vehicles: number;
  speed: number;
  congestion: Congestion;
  junctionId: string;
}

export interface Camera {
  id: string;
  name: string;
  roadId: string;
  lat: number;
  lng: number;
  online: boolean;
  lastObserved: string;
}

export interface Junction {
  id: string;
  name: string;
  roadId: string;
  lat: number;
  lng: number;
  greenSeconds: number;
  amberSeconds: number;
  redSeconds: number;
  operational: boolean;
  queue: number;
}

export interface Incident {
  id: string;
  type: string;
  title: string;
  roadId: string;
  severity: Severity;
  status: IncidentStatus;
  time: string;
  description: string;
  assignee: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  read: boolean;
}
