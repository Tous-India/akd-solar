/**
 * Indicative solar sizing, based on the DHBVN/UHBVN consumer guide:
 *   required kW = monthly units ÷ 120  (1 kW ≈ 120 units a month)
 *   recommended  = required × 1.1 to × 1.2  (room for future load)
 *   roof area    ≈ 80–100 sq ft per kW
 * Tariffs and costs are typical averages, not quotes.
 */
export type ConsumerType = "residential" | "commercial";

export type StateInfo = { id: string; name: string; tariff: number; commercialTariff: number };

export const STATES: StateInfo[] = [
  { id: "haryana", name: "Haryana", tariff: 6.5, commercialTariff: 8 },
  { id: "delhi", name: "Delhi", tariff: 6.5, commercialTariff: 9.5 },
  { id: "uttar-pradesh", name: "Uttar Pradesh (Noida, Ghaziabad)", tariff: 6.5, commercialTariff: 8.5 },
];

export const DEFAULT_STATE = "haryana";

export const UNITS_PER_KW_MONTH = 120;
export const FUTURE_LOAD = { min: 1.1, max: 1.2 };
export const SQFT_PER_KW = { min: 80, max: 100 };

const CO2_T_PER_MWH = 0.71;
const TARIFF_ESCALATION = 0.03;
const PANEL_DEGRADATION = 0.005;
const YEARS = 25;
/** ~10% of a bill is fixed charges and duty that solar can't offset (used only in bill mode) */
const FIXED_CHARGE_SHARE = 0.1;

export const LIMITS = {
  residential: { unitsMin: 50, unitsMax: 2000, unitsStep: 10, billMin: 500, billMax: 20000, billStep: 100 },
  commercial: { unitsMin: 200, unitsMax: 60000, unitsStep: 100, billMin: 2000, billMax: 500000, billStep: 1000 },
} as const;

/** PM Surya Ghar central subsidy: ₹30,000/kW for the first 2 kW, ₹18,000 for the 3rd kW, capped at ₹78,000 */
export function pmSuryaGharSubsidy(kw: number) {
  const firstTwo = Math.min(kw, 2) * 30000;
  const third = Math.max(0, Math.min(kw - 2, 1)) * 18000;
  return Math.min(78000, firstTwo + third);
}

const roundHalf = (n: number) => Math.max(1, Math.ceil(n * 2) / 2);

function costPerKw(kw: number, type: ConsumerType) {
  if (type === "commercial") return kw <= 50 ? 48000 : 42000;
  if (kw <= 3) return 62000;
  if (kw <= 10) return 56000;
  return 50000;
}

export function unitsFromBill(bill: number, stateId: string, type: ConsumerType) {
  const state = STATES.find((s) => s.id === stateId) ?? STATES[0];
  const tariff = type === "residential" ? state.tariff : state.commercialTariff;
  return Math.round((bill * (1 - FIXED_CHARGE_SHARE)) / tariff);
}

export type CalcInput = { units: number; stateId: string; type: ConsumerType };

export function calculate({ units, stateId, type }: CalcInput) {
  const state = STATES.find((s) => s.id === stateId) ?? STATES[0];
  const tariff = type === "residential" ? state.tariff : state.commercialTariff;

  const requiredKw = units / UNITS_PER_KW_MONTH;
  const recommendedMin = roundHalf(requiredKw * FUTURE_LOAD.min);
  const recommendedMax = Math.max(recommendedMin, roundHalf(requiredKw * FUTURE_LOAD.max));
  // Cost, subsidy and savings use the lower recommended size
  const kw = recommendedMin;

  const cost = kw * costPerKw(kw, type);
  const subsidy = type === "residential" ? pmSuryaGharSubsidy(kw) : 0;
  const netCost = cost - subsidy;

  const yearlyUnits = kw * UNITS_PER_KW_MONTH * 12;
  const yearlySavings = Math.min(yearlyUnits, units * 12) * tariff;
  const paybackYears = yearlySavings > 0 ? netCost / yearlySavings : 0;

  let lifetimeGross = 0;
  let lifetimeUnits = 0;
  for (let y = 0; y < YEARS; y++) {
    const output = Math.pow(1 - PANEL_DEGRADATION, y);
    lifetimeGross += yearlySavings * output * Math.pow(1 + TARIFF_ESCALATION, y);
    lifetimeUnits += yearlyUnits * output;
  }

  return {
    state,
    tariff,
    units,
    requiredKw,
    recommendedMin,
    recommendedMax,
    kw,
    roofMin: Math.round(kw * SQFT_PER_KW.min),
    roofMax: Math.round(recommendedMax * SQFT_PER_KW.max),
    cost,
    subsidy,
    netCost,
    yearlyUnits,
    yearlySavings,
    monthlySavings: yearlySavings / 12,
    paybackYears,
    lifetimeSavings: lifetimeGross - netCost,
    co2Lifetime: (lifetimeUnits / 1000) * CO2_T_PER_MWH,
  };
}

export type CalcResult = ReturnType<typeof calculate>;
