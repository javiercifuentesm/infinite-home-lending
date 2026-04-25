export type MarketRecord = {
  id: string;
  name: string;
  price: number;
  type: string;
  badges: string[];
  note: string;
};

/** 2025 median sold prices — MD-DC-VA regional market reports (hardcoded). */
export const MARKETS: readonly MarketRecord[] = [
  {
    id: "waldorf",
    name: "Waldorf / Charles County, MD",
    price: 360000,
    type: "Starter",
    badges: ["Affordable", "Spacious", "New construction"],
    note: "Largest homes per dollar in the metro area",
  },
  {
    id: "pg_county",
    name: "Prince George's County, MD",
    price: 380000,
    type: "Starter",
    badges: ["Metro access", "Diverse", "First-time buyer DPA"],
    note: "Strong DPA programs; best value per sq ft near DC",
  },
  {
    id: "frederick",
    name: "Frederick, MD",
    price: 420000,
    type: "Entry-level",
    badges: ["MARC access", "Family-friendly", "Historic downtown"],
    note: "Fastest-growing affordable market in the region",
  },
  {
    id: "laurel",
    name: "Laurel, MD",
    price: 420000,
    type: "Entry-level",
    badges: ["Between DC & Baltimore", "Metro", "Schools"],
    note: "Strategic location for dual-city commuters",
  },
  {
    id: "manassas",
    name: "Manassas, VA",
    price: 430000,
    type: "Entry-level",
    badges: ["VRE access", "Suburban", "Growing"],
    note: "30 min to DC by train; strong townhome inventory",
  },
  {
    id: "germantown",
    name: "Germantown, MD",
    price: 450000,
    type: "Mid-market",
    badges: ["Montgomery County", "Schools", "Community"],
    note: "Top school districts; townhomes under $450k exist",
  },
  {
    id: "woodbridge",
    name: "Woodbridge, VA",
    price: 480000,
    type: "Mid-market",
    badges: ["Prince William", "VRE", "Growing"],
    note: "Strong appreciation; larger homes than closer suburbs",
  },
  {
    id: "silver_spring",
    name: "Silver Spring, MD",
    price: 530000,
    type: "Mid-market",
    badges: ["Metro", "Walkable", "Urban-suburban"],
    note: "Up 5.2% YoY; urban feel with strong transit access",
  },
  {
    id: "rockville",
    name: "Rockville, MD",
    price: 630000,
    type: "Premium",
    badges: ["Top schools", "Metro", "Montgomery Co."],
    note: "Up 1.6% YoY; strong fundamentals, improving inventory",
  },
  {
    id: "dc",
    name: "Washington DC",
    price: 640000,
    type: "Premium",
    badges: ["Urban core", "Culture", "Metro"],
    note: "Wide variance by ward; some areas accessible under $500k",
  },
  {
    id: "alexandria",
    name: "Alexandria, VA",
    price: 720000,
    type: "Premium",
    badges: ["Metro", "Historic", "Del Ray"],
    note: "Up 4.2% YoY; Old Town premium, Del Ray more accessible",
  },
  {
    id: "arlington",
    name: "Arlington, VA",
    price: 757000,
    type: "Premium",
    badges: ["Metro", "Amazon HQ2", "Walk score"],
    note: "Up 4.4% YoY; high demand, limited supply",
  },
  {
    id: "bethesda",
    name: "Bethesda, MD",
    price: 1200000,
    type: "Luxury",
    badges: ["Top schools", "Luxury", "Metro"],
    note: "Premium market; $1.2M+ median, condos more accessible",
  },
];
