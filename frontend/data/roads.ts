import type { Road } from "@/types/demo";

// Illustrative Coimbatore locations and deterministic demo conditions.
export const roads: Road[] = [
  { id: "av", name: "Avinashi Road", region: "Central", lat: 11.0168, lng: 76.9728, vehicles: 18420, speed: 28, congestion: "High", junctionId: "hope" },
  { id: "trichy", name: "Trichy Road", region: "South", lat: 10.9971, lng: 77.0052, vehicles: 14280, speed: 34, congestion: "Moderate", junctionId: "singanallur" },
  { id: "mett", name: "Mettupalayam Road", region: "North", lat: 11.0438, lng: 76.9572, vehicles: 11960, speed: 41, congestion: "Low", junctionId: "saibaba" },
  { id: "sathy", name: "Sathy Road", region: "East", lat: 11.0391, lng: 77.0151, vehicles: 15740, speed: 22, congestion: "Severe", junctionId: "ganapathy" },
  { id: "pollachi", name: "Pollachi Main Road", region: "South", lat: 10.9555, lng: 76.9782, vehicles: 10350, speed: 38, congestion: "Moderate", junctionId: "sundarapuram" },
  { id: "rs", name: "R.S. Puram Corridor", region: "West", lat: 11.0098, lng: 76.9501, vehicles: 8610, speed: 45, congestion: "Low", junctionId: "rs-puram" },
];

export const regions = ["All regions", "Central", "North", "South", "East", "West"] as const;
