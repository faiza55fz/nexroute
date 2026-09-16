// ─── Shared demo data for NexRoute prototype ─────────────────────────────────

export type VehicleStatus = "En Route" | "At Risk" | "Rerouted" | "Delayed" | "On Schedule";
export type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface Vehicle {
  id: string;
  cargo: string;
  cargoType: string;
  origin: string;
  destination: string;
  status: VehicleStatus;
  priority: Priority;
  etaOriginal: string;
  etaUpdated: string;
  driver: string;
  contact: string;
  routeAffected: boolean;
  lat: number;
  progress: number; // 0-100
}

export const VEHICLES: Vehicle[] = [
  {
    id: "MED-07",
    cargo: "Essential Medicines",
    cargoType: "Refrigerated Pharmaceuticals",
    origin: "Siliguri Medical Depot",
    destination: "Gangtok Medical Supply Hub",
    status: "Rerouted",
    priority: "CRITICAL",
    etaOriginal: "2h 10m",
    etaUpdated: "2h 35m",
    driver: "Rajesh Sharma",
    contact: "+91-98320-44210",
    routeAffected: true,
    lat: 27.33,
    progress: 38,
  },
  {
    id: "AGR-12",
    cargo: "Food Supplies",
    cargoType: "Essential Grains & Rations",
    origin: "Jalpaiguri Godown",
    destination: "Mangan Food Depot, North Sikkim",
    status: "At Risk",
    priority: "HIGH",
    etaOriginal: "3h 05m",
    etaUpdated: "3h 40m",
    driver: "Dilip Tamang",
    contact: "+91-97334-18820",
    routeAffected: true,
    lat: 27.51,
    progress: 22,
  },
  {
    id: "FUL-03",
    cargo: "Fuel",
    cargoType: "HSD / Diesel Tanker",
    origin: "Siliguri Fuel Depot",
    destination: "Rangpo Supply Point",
    status: "At Risk",
    priority: "HIGH",
    etaOriginal: "2h 50m",
    etaUpdated: "3h 15m",
    driver: "Binod Rai",
    contact: "+91-98010-77340",
    routeAffected: true,
    lat: 27.18,
    progress: 45,
  },
  {
    id: "MED-14",
    cargo: "Medical Equipment",
    cargoType: "Surgical Supplies",
    origin: "Bagdogra Medical Hub",
    destination: "North Sikkim District Hospital",
    status: "On Schedule",
    priority: "MEDIUM",
    etaOriginal: "4h 15m",
    etaUpdated: "4h 15m",
    driver: "Suresh Limbu",
    contact: "+91-97010-33220",
    routeAffected: false,
    lat: 27.72,
    progress: 15,
  },
  {
    id: "LOG-08",
    cargo: "General Logistics",
    cargoType: "Relief Materials",
    origin: "NJP Logistics Center",
    destination: "Gangtok Central Warehouse",
    status: "On Schedule",
    priority: "LOW",
    etaOriginal: "3h 45m",
    etaUpdated: "3h 45m",
    driver: "Kamal Gurung",
    contact: "+91-96010-55610",
    routeAffected: false,
    lat: 27.62,
    progress: 29,
  },
  {
    id: "AGR-05",
    cargo: "Perishables",
    cargoType: "Fruits, Vegetables & Dairy",
    origin: "Cooch Behar Cold Store",
    destination: "Gyalshing Market, West Sikkim",
    status: "Delayed",
    priority: "MEDIUM",
    etaOriginal: "4h 50m",
    etaUpdated: "5h 30m",
    driver: "Prakash Chettri",
    contact: "+91-97334-90120",
    routeAffected: true,
    lat: 27.28,
    progress: 10,
  },
];

export interface SupplyItem {
  id: string;
  commodity: string;
  category: string;
  vehicleId: string;
  origin: string;
  destination: string;
  districts: string[];
  priority: Priority;
  etaOriginal: string;
  etaUpdated: string;
  delay: string;
  beneficiaries: string;
  impact: string;
  alternateAvailable: boolean;
}

export const SUPPLY_ITEMS: SupplyItem[] = [
  {
    id: "S-001",
    commodity: "Essential Medicines",
    category: "Healthcare",
    vehicleId: "MED-07",
    origin: "Siliguri Medical Depot",
    destination: "Gangtok Medical Supply Hub",
    districts: ["East Sikkim", "South Sikkim"],
    priority: "CRITICAL",
    etaOriginal: "2h 10m",
    etaUpdated: "2h 35m",
    delay: "+25 min",
    beneficiaries: "~12,000 patients",
    impact: "2 hospitals, ICU stock running low",
    alternateAvailable: true,
  },
  {
    id: "S-002",
    commodity: "Essential Food Grains",
    category: "Food Security",
    vehicleId: "AGR-12",
    origin: "Jalpaiguri Godown",
    destination: "Mangan Food Depot",
    districts: ["North Sikkim"],
    priority: "HIGH",
    etaOriginal: "3h 05m",
    etaUpdated: "3h 40m",
    delay: "+35 min",
    beneficiaries: "~8,400 households",
    impact: "PDS distribution delayed in 3 blocks",
    alternateAvailable: true,
  },
  {
    id: "S-003",
    commodity: "Petroleum / HSD",
    category: "Energy",
    vehicleId: "FUL-03",
    origin: "Siliguri Fuel Depot",
    destination: "Rangpo Supply Point",
    districts: ["East Sikkim", "Gangtok"],
    priority: "HIGH",
    etaOriginal: "2h 50m",
    etaUpdated: "3h 15m",
    delay: "+25 min",
    beneficiaries: "6 petrol stations",
    impact: "Emergency generator risk after 48h",
    alternateAvailable: false,
  },
  {
    id: "S-004",
    commodity: "Perishables & Dairy",
    category: "Food Security",
    vehicleId: "AGR-05",
    origin: "Cooch Behar Cold Store",
    destination: "Gyalshing Market",
    districts: ["West Sikkim"],
    priority: "MEDIUM",
    etaOriginal: "4h 50m",
    etaUpdated: "5h 30m",
    delay: "+40 min",
    beneficiaries: "~3,200 households",
    impact: "Perishability risk if delay exceeds 6h",
    alternateAvailable: true,
  },
];

export const ACTIVE_DISRUPTIONS = [
  {
    id: "D-001",
    type: "Landslide Risk",
    location: "NH-10 · Teesta Valley",
    severity: "HIGH" as Priority,
    score: 32,
    detected: "14:20",
    vehicles: 3,
  },
  {
    id: "D-002",
    type: "Flash Flood Warning",
    location: "NH-717A · Rongli Section",
    severity: "MEDIUM" as Priority,
    score: 61,
    detected: "13:55",
    vehicles: 1,
  },
  {
    id: "D-003",
    type: "Fog / Low Visibility",
    location: "Sevoke Road · Bypass",
    severity: "LOW" as Priority,
    score: 74,
    detected: "12:40",
    vehicles: 2,
  },
];
