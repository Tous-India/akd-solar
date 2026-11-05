/**
 * Indicative solar savings model. Tariffs and yields are typical averages, not quotes.
 */
export type ConsumerType = "residential" | "commercial";

export type StateInfo = {
  id: string;
  name: string;
  /** average ₹/unit for residential (upper slabs) and commercial consumers */
  tariff: number;
  commercialTariff: number;
  /** typical generation, kWh per kW per day */
  yield: number;
};

export const STATES: StateInfo[] = [
  { id: "andhra-pradesh", name: "Andhra Pradesh", tariff: 7, commercialTariff: 9, yield: 4.3 },
  { id: "bihar", name: "Bihar", tariff: 7.5, commercialTariff: 9, yield: 3.9 },
  { id: "delhi", name: "Delhi", tariff: 6.5, commercialTariff: 9.5, yield: 4.1 },
  { id: "gujarat", name: "Gujarat", tariff: 6, commercialTariff: 8, yield: 4.5 },
  { id: "haryana", name: "Haryana", tariff: 6.5, commercialTariff: 8, yield: 4.1 },
  { id: "karnataka", name: "Karnataka", tariff: 7, commercialTariff: 9.5, yield: 4.3 },
  { id: "kerala", name: "Kerala", tariff: 6.5, commercialTariff: 8.5, yield: 3.9 },
  { id: "madhya-pradesh", name: "Madhya Pradesh", tariff: 7, commercialTariff: 9, yield: 4.4 },
  { id: "maharashtra", name: "Maharashtra", tariff: 9.5, commercialTariff: 12, yield: 4.2 },
  { id: "odisha", name: "Odisha", tariff: 6, commercialTariff: 7.5, yield: 4 },
  { id: "punjab", name: "Punjab", tariff: 7, commercialTariff: 8, yield: 4.1 },
  { id: "rajasthan", name: "Rajasthan", tariff: 7.5, commercialTariff: 9.5, yield: 4.6 },
  { id: "tamil-nadu", name: "Tamil Nadu", tariff: 6.5, commercialTariff: 9, yield: 4.3 },
  { id: "telangana", name: "Telangana", tariff: 7.5, commercialTariff: 9.5, yield: 4.3 },
  { id: "uttar-pradesh", name: "Uttar Pradesh", tariff: 6.5, commercialTariff: 8.5, yield: 4 },
  { id: "uttarakhand", name: "Uttarakhand", tariff: 6, commercialTariff: 7.5, yield: 3.9 },
  { id: "west-bengal", name: "West Bengal", tariff: 8, commercialTariff: 9, yield: 3.8 },
];

export const DEFAULT_STATE = "haryana";

/** Shadow-free roof area needed per kW */
export const SQFT_PER_KW = 100;
/** Grid emission factor, tonnes CO2 per MWh (CEA, approx.) */
const CO2_T_PER_MWH = 0.71;
const TARIFF_ESCALATION = 0.03;
const PANEL_DEGRADATION = 0.005;
const YEARS = 25;
const FIXED_CHARGE_SHARE = 0.1;

export const LIMITS = {
  residential: { billMin: 500, billMax: 30000, billStep: 100, roofMin: 100, roofMax: 5000, roofStep: 50 },
  commercial: { billMin: 5000, billMax: 500000, billStep: 1000, roofMin: 500, roofMax: 50000, roofStep: 100 },
} as const;

/** PM Surya Ghar: ₹30,000/kW up to 2 kW, ₹18,000 for the 3rd kW, capped at ₹78,000 (residential only) */
export function pmSuryaGharSubsidy(kw: number) {
  const firstTwo = Math.min(kw, 2) * 30000;
  const third = Math.max(0, Math.min(kw - 2, 1)) * 18000;
  return Math.min(78000, firstTwo + third);
}

function costPerKw(kw: number, type: ConsumerType) {
  if (type === "commercial") return kw <= 50 ? 48000 : 42000;
  if (kw <= 3) return 62000;
  if (kw <= 10) return 56000;
  return 50000;
}

export type CalcInput = { bill: number; stateId: string; roofArea: number; type: ConsumerType };

export function calculate({ bill, stateId, roofArea, type }: CalcInput) {
  const state = STATES.find((s) => s.id === stateId) ?? STATES.find((s) => s.id === DEFAULT_STATE)!;
  const tariff = type === "residential" ? state.tariff : state.commercialTariff;
  // ~10% of a bill is fixed charges and duty that solar can't offset
  const monthlyUnits = (bill * (1 - FIXED_CHARGE_SHARE)) / tariff;
  const unitsPerKwMonth = state.yield * 30;

  const idealKw = monthlyUnits / unitsPerKwMonth;
  const roofMaxKw = roofArea / SQFT_PER_KW;
  const roofLimited = idealKw > roofMaxKw;
  const kw = Math.max(1, Math.round(Math.min(idealKw, roofMaxKw) * 2) / 2);

  const cost = kw * costPerKw(kw, type);
  const subsidy = type === "residential" ? pmSuryaGharSubsidy(kw) : 0;
  const netCost = cost - subsidy;

  const yearlyUnits = kw * unitsPerKwMonth * 12;
  const yearlySavings = Math.min(yearlyUnits, monthlyUnits * 12) * tariff;
  const paybackYears = yearlySavings > 0 ? netCost / yearlySavings : 0;

  let lifetimeGross = 0;
  let lifetimeUnits = 0;
  for (let y = 0; y < YEARS; y++) {
    const output = Math.pow(1 - PANEL_DEGRADATION, y);
    lifetimeGross += yearlySavings * output * Math.pow(1 + TARIFF_ESCALATION, y);
    lifetimeUnits += yearlyUnits * output;
  }

  const co2Lifetime = (lifetimeUnits / 1000) * CO2_T_PER_MWH;

  return {
    state,
    tariff,
    monthlyUnits,
    kw,
    roofLimited,
    roofNeeded: kw * SQFT_PER_KW,
    cost,
    subsidy,
    netCost,
    yearlyUnits,
    yearlySavings,
    monthlySavings: yearlySavings / 12,
    paybackYears,
    lifetimeSavings: lifetimeGross - netCost,
    co2Yearly: (yearlyUnits / 1000) * CO2_T_PER_MWH,
    co2Lifetime,
    /** a mature tree absorbs roughly 20 kg CO2 a year */
    treesEquivalent: Math.round((co2Lifetime * 1000) / (20 * YEARS)),
  };
}

export type CalcResult = ReturnType<typeof calculate>;
