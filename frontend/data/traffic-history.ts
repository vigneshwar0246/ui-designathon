// One fixed illustrative weekday. Filters transform these values, so charts remain deterministic.
export const hourlyTraffic = [
  { hour: "05:00", vehicles: 840, speed: 48, congestion: 18 },
  { hour: "06:00", vehicles: 1380, speed: 45, congestion: 24 },
  { hour: "07:00", vehicles: 2650, speed: 37, congestion: 41 },
  { hour: "08:00", vehicles: 4380, speed: 28, congestion: 67 },
  { hour: "09:00", vehicles: 4860, speed: 24, congestion: 76 },
  { hour: "10:00", vehicles: 3920, speed: 31, congestion: 58 },
  { hour: "11:00", vehicles: 3440, speed: 35, congestion: 51 },
  { hour: "12:00", vehicles: 3720, speed: 33, congestion: 55 },
  { hour: "13:00", vehicles: 3960, speed: 31, congestion: 59 },
  { hour: "14:00", vehicles: 3580, speed: 34, congestion: 52 },
  { hour: "15:00", vehicles: 3820, speed: 33, congestion: 57 },
  { hour: "16:00", vehicles: 4460, speed: 29, congestion: 66 },
  { hour: "17:00", vehicles: 5210, speed: 23, congestion: 82 },
  { hour: "18:00", vehicles: 4920, speed: 25, congestion: 78 },
  { hour: "19:00", vehicles: 3740, speed: 34, congestion: 56 },
  { hour: "20:00", vehicles: 2460, speed: 40, congestion: 39 },
  { hour: "21:00", vehicles: 1580, speed: 44, congestion: 27 },
  { hour: "22:00", vehicles: 920, speed: 47, congestion: 19 },
];

export const weeklyTraffic = [
  { day: "Mon", vehicles: 68240 }, { day: "Tue", vehicles: 71480 }, { day: "Wed", vehicles: 73620 },
  { day: "Thu", vehicles: 70190 }, { day: "Fri", vehicles: 77450 }, { day: "Sat", vehicles: 64180 }, { day: "Sun", vehicles: 52960 },
];

export const vehicleClasses = [
  { name: "Cars", value: 48, color: "#C51F35" },
  { name: "Two-wheelers", value: 31, color: "#E58391" },
  { name: "Buses", value: 9, color: "#7892A2" },
  { name: "Trucks", value: 7, color: "#A9BBC5" },
  { name: "Other", value: 5, color: "#D9E2E8" },
];

export const hourlyHeatmap = [
  [14, 18, 26, 48, 62, 44, 37, 55, 76, 69, 40, 22],
  [17, 21, 31, 57, 72, 51, 43, 61, 82, 73, 46, 26],
  [16, 20, 29, 54, 69, 48, 41, 60, 79, 70, 43, 24],
  [18, 23, 33, 59, 74, 53, 46, 64, 83, 75, 48, 28],
  [19, 24, 35, 61, 78, 57, 49, 67, 86, 79, 51, 29],
  [22, 29, 38, 50, 56, 48, 47, 55, 66, 62, 45, 31],
  [20, 25, 32, 42, 48, 41, 40, 47, 57, 52, 38, 27],
];
