export interface ShowerDataPoint {
  day: string;
  showers: number;
  vibe: number;
  group: string;
  product: string;
}

export interface WeeklyData {
  [key: string]: ShowerDataPoint[];
}

export interface ProductUsage {
  name: string;
  value: number;
  color: string;
}

// Synthetic data - clearly marked as such
export const showerData: WeeklyData = {
  students: [
    { day: "Monday", showers: 0.7, vibe: 3.2, group: "students", product: "both" },
    { day: "Tuesday", showers: 0.8, vibe: 4.1, group: "students", product: "shampoo" },
    { day: "Wednesday", showers: 0.6, vibe: 2.8, group: "students", product: "none" },
    { day: "Thursday", showers: 0.9, vibe: 5.5, group: "students", product: "both" },
    { day: "Friday", showers: 1.0, vibe: 7.2, group: "students", product: "bodyWash" },
    { day: "Saturday", showers: 0.5, vibe: 6.8, group: "students", product: "shampoo" },
    { day: "Sunday", showers: 0.3, vibe: 4.5, group: "students", product: "none" }
  ],
  remoteWorkers: [
    { day: "Monday", showers: 0.9, vibe: 6.1, group: "remoteWorkers", product: "both" },
    { day: "Tuesday", showers: 0.8, vibe: 5.8, group: "remoteWorkers", product: "shampoo" },
    { day: "Wednesday", showers: 0.7, vibe: 5.2, group: "remoteWorkers", product: "bodyWash" },
    { day: "Thursday", showers: 0.9, vibe: 6.5, group: "remoteWorkers", product: "both" },
    { day: "Friday", showers: 1.0, vibe: 8.7, group: "remoteWorkers", product: "both" },
    { day: "Saturday", showers: 0.8, vibe: 7.9, group: "remoteWorkers", product: "shampoo" },
    { day: "Sunday", showers: 0.6, vibe: 6.3, group: "remoteWorkers", product: "bodyWash" }
  ],
  officeWorkers: [
    { day: "Monday", showers: 1.0, vibe: 5.2, group: "officeWorkers", product: "both" },
    { day: "Tuesday", showers: 1.0, vibe: 5.8, group: "officeWorkers", product: "both" },
    { day: "Wednesday", showers: 0.9, vibe: 5.1, group: "officeWorkers", product: "shampoo" },
    { day: "Thursday", showers: 1.0, vibe: 6.2, group: "officeWorkers", product: "both" },
    { day: "Friday", showers: 0.8, vibe: 7.5, group: "officeWorkers", product: "bodyWash" },
    { day: "Saturday", showers: 0.7, vibe: 7.8, group: "officeWorkers", product: "shampoo" },
    { day: "Sunday", showers: 0.5, vibe: 6.9, group: "officeWorkers", product: "none" }
  ]
};

export const productUsageData: ProductUsage[] = [
  { name: "Shampoo", value: 35, color: "#60a5fa" },
  { name: "Body Wash", value: 28, color: "#34d399" },
  { name: "Both", value: 25, color: "#fbbf24" },
  { name: "None", value: 12, color: "#f87171" }
];

export const getVibeDescription = (vibe: number): string => {
  if (vibe >= 8) return "oneWithUniverse";
  if (vibe >= 6) return "smelledDecent";
  if (vibe >= 4) return "crisisMode";
  return "deadInside";
}; 