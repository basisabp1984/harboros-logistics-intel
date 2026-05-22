export type VesselStatus = "Underway" | "Anchored" | "Loading" | "Discharging" | "Delayed";
export type VesselType = "Container" | "Bulk" | "Tanker" | "Reefer" | "Ro-Ro";

export type Vessel = {
  id: string;
  name: string;
  imo: string;
  type: VesselType;
  status: VesselStatus;
  flag: string;
  capacityTeu: number;
  speedKn: number;
  fuelPct: number;
  cargo: string;
  originPort: string;
  destinationPort: string;
  etaIso: string;
  delayHours: number;
  carbonIndex: number;
  routeProgress: number;
  speedHistory: number[];
};

export type PortCongestion = "Calm" | "Moderate" | "Heavy" | "Critical";

export type Port = {
  id: string;
  name: string;
  country: string;
  unlocode: string;
  congestion: PortCongestion;
  vesselsAtAnchor: number;
  vesselsBerthed: number;
  avgWaitHours: number;
  weeklyTrend: number;
  cargoMix: string;
  events: string[];
};

export type VoyageStatus = "Planned" | "In transit" | "Completed" | "Diverted";

export type Voyage = {
  id: string;
  routeCode: string;
  from: string;
  to: string;
  vessel: string;
  departureIso: string;
  arrivalIso: string;
  distanceNm: number;
  status: VoyageStatus;
  fuelTons: number;
  onTimeScore: number;
  riskScore: number;
};

export type DisruptionSeverity = "Info" | "Watch" | "Warning" | "Critical";
export type DisruptionType = "Weather" | "Strike" | "Congestion" | "Mechanical" | "Geopolitical";

export type Disruption = {
  id: string;
  severity: DisruptionSeverity;
  type: DisruptionType;
  location: string;
  message: string;
  affectedVessels: number;
  detectedIso: string;
  status: "Open" | "Monitoring" | "Mitigated";
};

export type CockpitKpis = {
  vesselsInTransit: number;
  portsUnderStress: number;
  activeDisruptions: number;
  onTimeScore: number;
  avgPortWaitHours: number;
  carbonIntensity: number;
};
