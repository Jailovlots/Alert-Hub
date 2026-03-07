export type SeverityLevel = "Low" | "Medium" | "High";

export interface Alert {
  id: string;
  type: "typhoon" | "flood" | "earthquake" | "landslide" | "fire";
  title: string;
  date: string;
  description: string;
  severity: SeverityLevel;
  location: string;
}

export interface DisasterInfo {
  id: string;
  type: string;
  icon: string;
  color: string;
  description: string;
  dangers: string[];
  actions: string[];
}

export interface SafeTip {
  id: string;
  phase: "before" | "during" | "after";
  icon: string;
  tip: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  department: string;
  phone: string;
  icon: string;
  color: string;
}

export const ALERTS: Alert[] = [
  {
    id: "1",
    type: "typhoon",
    title: "Typhoon Warning",
    date: "March 7, 2026",
    description:
      "Typhoon Hana is expected to make landfall in the next 24 hours. Wind speeds up to 180 km/h. Residents in coastal areas should evacuate immediately.",
    severity: "High",
    location: "Eastern Seaboard",
  },
  {
    id: "2",
    type: "flood",
    title: "Flood Warning",
    date: "March 7, 2026",
    description:
      "Heavy rainfall has caused river levels to rise significantly. Low-lying areas along the Marikina River are at risk of flooding. Prepare emergency supplies.",
    severity: "High",
    location: "Marikina Valley",
  },
  {
    id: "3",
    type: "earthquake",
    title: "Earthquake Alert",
    date: "March 6, 2026",
    description:
      "A magnitude 5.2 earthquake was recorded at 3:45 AM. Aftershocks are possible. Check your building for structural damage before re-entering.",
    severity: "Medium",
    location: "Metro Region",
  },
  {
    id: "4",
    type: "landslide",
    title: "Landslide Warning",
    date: "March 6, 2026",
    description:
      "Saturated soil conditions in mountainous areas increase landslide risk. Communities in elevated terrain should be on alert.",
    severity: "Medium",
    location: "Northern Highlands",
  },
  {
    id: "5",
    type: "flood",
    title: "Flash Flood Advisory",
    date: "March 5, 2026",
    description:
      "Moderate rainfall continues in upstream areas. Minor flooding expected in low-lying streets. Monitor local updates.",
    severity: "Low",
    location: "Southern District",
  },
];

export const DISASTER_INFO: DisasterInfo[] = [
  {
    id: "1",
    type: "Typhoon",
    icon: "thunderstorm-outline",
    color: "#3B82F6",
    description:
      "A typhoon is a mature tropical cyclone that develops in the western Pacific Ocean. It brings violent winds, storm surge, and heavy rainfall.",
    dangers: [
      "Destructive winds up to 300+ km/h",
      "Storm surge flooding coastal areas",
      "Heavy rainfall causing floods and landslides",
      "Flying debris and downed power lines",
    ],
    actions: [
      "Evacuate coastal and low-lying areas",
      "Stock up on food, water, and medicine",
      "Secure loose outdoor items",
      "Stay indoors and away from windows",
      "Monitor official weather bulletins",
    ],
  },
  {
    id: "2",
    type: "Flood",
    icon: "water-outline",
    color: "#0EA5E9",
    description:
      "Flooding occurs when water overflows onto normally dry land, often caused by heavy rainfall, storm surge, or dam overflow.",
    dangers: [
      "Rapidly rising water levels",
      "Contaminated floodwater with disease risk",
      "Structural damage to buildings",
      "Drowning risk in fast-moving water",
    ],
    actions: [
      "Move to higher ground immediately",
      "Avoid walking through floodwaters",
      "Turn off electricity at the breaker",
      "Do not drive through flooded roads",
      "Follow evacuation routes",
    ],
  },
  {
    id: "3",
    type: "Earthquake",
    icon: "earth-outline",
    color: "#F59E0B",
    description:
      "An earthquake is a sudden shaking of the ground caused by tectonic plate movement. It can cause widespread destruction in seconds.",
    dangers: [
      "Building collapse and structural damage",
      "Tsunamis after strong coastal earthquakes",
      "Landslides triggered by tremors",
      "Fire from broken gas lines",
    ],
    actions: [
      "Drop, Cover, and Hold On",
      "Stay away from windows and heavy furniture",
      "If outdoors, move away from buildings",
      "After shaking stops, check for injuries",
      "Evacuate if near coastline (tsunami risk)",
    ],
  },
  {
    id: "4",
    type: "Landslide",
    icon: "layers-outline",
    color: "#92400E",
    description:
      "A landslide is the movement of rock, soil, or debris down a slope. Often triggered by heavy rain, earthquakes, or volcanic activity.",
    dangers: [
      "Rapidly moving debris and boulders",
      "Burial under soil and rock",
      "Road blockages cutting off evacuation",
      "Damage to water and power infrastructure",
    ],
    actions: [
      "Evacuate areas near steep slopes",
      "Watch for unusual sounds like cracking",
      "Move out of the path of the landslide",
      "Avoid river valleys after heavy rain",
      "Report new cracks in the ground to authorities",
    ],
  },
  {
    id: "5",
    type: "Fire",
    icon: "flame-outline",
    color: "#EF4444",
    description:
      "Fires can spread rapidly in dry conditions or densely packed areas. House fires, forest fires, and industrial fires all pose serious threats.",
    dangers: [
      "Rapid fire spread in dry conditions",
      "Smoke inhalation and toxic fumes",
      "Structural collapse from heat",
      "Explosions from gas and flammables",
    ],
    actions: [
      "Evacuate immediately, do not delay",
      "Stay low to avoid smoke inhalation",
      "Use stairs, never use elevators",
      "Feel doors before opening them",
      "Meet at designated assembly point",
    ],
  },
];

export const SAFETY_TIPS: SafeTip[] = [
  { id: "b1", phase: "before", icon: "bag-outline", tip: "Prepare a go-bag with water, food, medicine, documents, and a flashlight" },
  { id: "b2", phase: "before", icon: "phone-portrait-outline", tip: "Fully charge your phone and keep a power bank ready" },
  { id: "b3", phase: "before", icon: "cloudy-outline", tip: "Monitor official weather and disaster updates regularly" },
  { id: "b4", phase: "before", icon: "people-outline", tip: "Identify your nearest evacuation center and emergency meeting point" },
  { id: "b5", phase: "before", icon: "home-outline", tip: "Secure loose outdoor furniture, electrical lines, and potential hazards" },
  { id: "d1", phase: "during", icon: "heart-outline", tip: "Stay calm and think clearly — panic causes mistakes" },
  { id: "d2", phase: "during", icon: "navigate-outline", tip: "Follow official evacuation instructions and routes" },
  { id: "d3", phase: "during", icon: "shield-checkmark-outline", tip: "Move to pre-identified safe areas and stay there" },
  { id: "d4", phase: "during", icon: "radio-outline", tip: "Keep a battery-powered radio for emergency broadcasts" },
  { id: "d5", phase: "during", icon: "call-outline", tip: "Contact authorities only for genuine emergencies" },
  { id: "a1", phase: "after", icon: "medkit-outline", tip: "Check yourself and others for injuries and provide first aid" },
  { id: "a2", phase: "after", icon: "warning-outline", tip: "Avoid damaged buildings — they may still collapse" },
  { id: "a3", phase: "after", icon: "megaphone-outline", tip: "Follow official government updates before returning home" },
  { id: "a4", phase: "after", icon: "water-outline", tip: "Do not drink tap water until authorities declare it safe" },
  { id: "a5", phase: "after", icon: "camera-outline", tip: "Document damage with photos for insurance and aid claims" },
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: "1",
    name: "Police",
    department: "Philippine National Police",
    phone: "117",
    icon: "shield-outline",
    color: "#3B82F6",
  },
  {
    id: "2",
    name: "Fire Department",
    department: "Bureau of Fire Protection",
    phone: "160",
    icon: "flame-outline",
    color: "#EF4444",
  },
  {
    id: "3",
    name: "Ambulance",
    department: "Emergency Medical Services",
    phone: "911",
    icon: "medkit-outline",
    color: "#10B981",
  },
  {
    id: "4",
    name: "Disaster Response",
    department: "NDRRMC Operations Center",
    phone: "(02) 8911-1406",
    icon: "alert-circle-outline",
    color: "#F59E0B",
  },
  {
    id: "5",
    name: "Red Cross",
    department: "Philippine Red Cross",
    phone: "143",
    icon: "heart-outline",
    color: "#E53E3E",
  },
  {
    id: "6",
    name: "Coast Guard",
    department: "Philippine Coast Guard",
    phone: "(02) 527-3877",
    icon: "boat-outline",
    color: "#0EA5E9",
  },
];
