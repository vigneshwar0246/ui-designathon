import type { Junction } from "@/types/demo";

export const initialJunctions: Junction[] = [
  { id: "hope", name: "Hope College Junction", roadId: "av", lat: 11.0168, lng: 76.9728, greenSeconds: 54, amberSeconds: 4, redSeconds: 62, operational: true, queue: 38 },
  { id: "singanallur", name: "Singanallur Signal", roadId: "trichy", lat: 10.9971, lng: 77.0052, greenSeconds: 48, amberSeconds: 4, redSeconds: 58, operational: true, queue: 24 },
  { id: "saibaba", name: "Saibaba Colony", roadId: "mett", lat: 11.0438, lng: 76.9572, greenSeconds: 42, amberSeconds: 4, redSeconds: 54, operational: true, queue: 16 },
  { id: "ganapathy", name: "Ganapathy Junction", roadId: "sathy", lat: 11.0391, lng: 77.0151, greenSeconds: 62, amberSeconds: 5, redSeconds: 68, operational: false, queue: 51 },
  { id: "sundarapuram", name: "Sundarapuram", roadId: "pollachi", lat: 10.9555, lng: 76.9782, greenSeconds: 45, amberSeconds: 4, redSeconds: 56, operational: true, queue: 21 },
  { id: "rs-puram", name: "R.S. Puram Cross", roadId: "rs", lat: 11.0098, lng: 76.9501, greenSeconds: 40, amberSeconds: 3, redSeconds: 49, operational: true, queue: 13 },
];
