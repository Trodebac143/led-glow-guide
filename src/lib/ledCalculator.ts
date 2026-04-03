// E24 resistor series
const E24_VALUES = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
  3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1,
];

export interface LedType {
  label: string;
  voltage: number;
  color: string;
  hsl: string;
}

export const LED_TYPES: LedType[] = [
  { label: 'Rojo', voltage: 2.0, color: '#ef4444', hsl: '0 84% 60%' },
  { label: 'Naranja', voltage: 2.1, color: '#f97316', hsl: '25 95% 53%' },
  { label: 'Amarillo', voltage: 2.1, color: '#eab308', hsl: '45 93% 47%' },
  { label: 'Verde', voltage: 2.2, color: '#22c55e', hsl: '142 71% 45%' },
  { label: 'Azul', voltage: 3.2, color: '#3b82f6', hsl: '217 91% 60%' },
  { label: 'Blanco', voltage: 3.2, color: '#e2e8f0', hsl: '214 32% 91%' },
  { label: 'UV', voltage: 3.3, color: '#a855f7', hsl: '271 91% 65%' },
  { label: 'Infrarrojo', voltage: 1.5, color: '#991b1b', hsl: '0 67% 35%' },
];

export type Config = 'serie' | 'paralelo';

export interface CalcInput {
  voltage: number;
  ledType: LedType;
  numLeds: number;
  config: Config;
  currentMa: number;
}

export interface CalcResult {
  valid: boolean;
  error?: string;
  resistance?: number;
  commercialResistance?: number;
  resistanceMargin?: number;
  currentTotal?: number;
  powerResistor?: number;
  commercialPower?: number;
  colorBands?: string[];
  colorBandLabels?: string[];
  summary?: string;
  status?: 'ok' | 'warning' | 'error';
  warnings?: string[];
}

export function getCommercialResistance(R: number): number {
  if (R <= 0) return 1;
  const decade = Math.pow(10, Math.floor(Math.log10(R)));
  const normalized = R / decade;
  for (const val of E24_VALUES) {
    if (val >= normalized - 0.001) return parseFloat((val * decade).toPrecision(3));
  }
  return parseFloat((10 * decade).toPrecision(3));
}

export function getCommercialPower(P: number): number {
  const values = [0.125, 0.25, 0.5, 1, 2, 5, 10];
  // Conservative: use 2x safety margin
  const safe = P * 2;
  for (const v of values) {
    if (safe <= v) return v;
  }
  return 10;
}

export function formatPower(w: number): string {
  if (w === 0.125) return '1/8 W';
  if (w === 0.25) return '1/4 W';
  if (w === 0.5) return '1/2 W';
  return `${w} W`;
}

const BAND_COLORS: Record<number, { color: string; label: string }> = {
  0: { color: '#000000', label: 'Negro' },
  1: { color: '#8B4513', label: 'Marrón' },
  2: { color: '#ef4444', label: 'Rojo' },
  3: { color: '#f97316', label: 'Naranja' },
  4: { color: '#eab308', label: 'Amarillo' },
  5: { color: '#22c55e', label: 'Verde' },
  6: { color: '#3b82f6', label: 'Azul' },
  7: { color: '#8b5cf6', label: 'Violeta' },
  8: { color: '#6b7280', label: 'Gris' },
  9: { color: '#f5f5f5', label: 'Blanco' },
};

const MULTIPLIER_COLORS: Record<number, { color: string; label: string }> = {
  0: { color: '#000000', label: 'Negro' },
  1: { color: '#8B4513', label: 'Marrón' },
  2: { color: '#ef4444', label: 'Rojo' },
  3: { color: '#f97316', label: 'Naranja' },
  4: { color: '#eab308', label: 'Amarillo' },
  5: { color: '#22c55e', label: 'Verde' },
  6: { color: '#3b82f6', label: 'Azul' },
  [-1]: { color: '#FFD700', label: 'Dorado' },
  [-2]: { color: '#C0C0C0', label: 'Plateado' },
};

export function getColorBands(value: number): { colors: string[]; labels: string[] } {
  const rounded = Math.round(value);
  if (rounded <= 0) return { colors: ['#000', '#000', '#000', '#FFD700'], labels: ['Negro', 'Negro', 'Negro', 'Dorado'] };

  const str = rounded.toString();
  let d1: number, d2: number, multiplier: number;

  if (str.length === 1) {
    d1 = 0;
    d2 = rounded;
    multiplier = -1; // ×0.1 → gold
  } else {
    d1 = parseInt(str[0]);
    d2 = parseInt(str[1]);
    multiplier = str.length - 2;
  }

  const b1 = BAND_COLORS[d1] || BAND_COLORS[0];
  const b2 = BAND_COLORS[d2] || BAND_COLORS[0];
  const b3 = MULTIPLIER_COLORS[multiplier] || MULTIPLIER_COLORS[0];
  const tolerance = { color: '#FFD700', label: 'Dorado (±5%)' };

  return {
    colors: [b1.color, b2.color, b3.color, tolerance.color],
    labels: [b1.label, b2.label, b3.label, tolerance.label],
  };
}

export function calculate(input: CalcInput): CalcResult {
  const { voltage, ledType, numLeds, config, currentMa } = input;
  const warnings: string[] = [];

  // Validations
  if (voltage <= 0) return { valid: false, error: 'El voltaje debe ser mayor que 0.', status: 'error' };
  if (numLeds <= 0) return { valid: false, error: 'Debe haber al menos 1 LED.', status: 'error' };
  if (currentMa <= 0) return { valid: false, error: 'La corriente debe ser mayor que 0.', status: 'error' };
  if (currentMa > 100) warnings.push('La corriente es muy alta para un LED estándar. Verifica que tu LED lo soporte.');

  const I = currentMa / 1000;
  const Vled = ledType.voltage;

  if (config === 'serie') {
    const Vtotal = numLeds * Vled;
    if (voltage <= Vtotal) {
      return {
        valid: false,
        error: `Voltaje insuficiente para ${numLeds} LED(s) en serie. Necesitas más de ${Vtotal.toFixed(1)}V (tienes ${voltage}V).`,
        status: 'error',
      };
    }

    const R = (voltage - Vtotal) / I;
    const Rcom = getCommercialResistance(R);
    const margin = ((Rcom - R) / R) * 100;
    const P = I * I * Rcom;
    const Pcom = getCommercialPower(P);
    const bands = getColorBands(Rcom);

    if (margin > 20) warnings.push(`La resistencia comercial es un ${margin.toFixed(0)}% mayor que la teórica. La corriente real será algo menor.`);
    if (P > 0.5) warnings.push('La potencia disipada es alta. Asegúrate de usar una resistencia con la potencia adecuada.');

    const realCurrent = (voltage - Vtotal) / Rcom;

    return {
      valid: true,
      resistance: R,
      commercialResistance: Rcom,
      resistanceMargin: margin,
      currentTotal: I * 1000,
      powerResistor: P,
      commercialPower: Pcom,
      colorBands: bands.colors,
      colorBandLabels: bands.labels,
      status: warnings.length > 0 ? 'warning' : 'ok',
      warnings,
      summary: `Para ${numLeds} LED(s) ${ledType.label.toLowerCase()} en serie a ${voltage}V, usa 1 resistencia de ${Rcom}Ω (${formatPower(Pcom)}). Corriente real: ${(realCurrent * 1000).toFixed(1)}mA.`,
    };
  }

  // Parallel
  if (voltage <= Vled) {
    return {
      valid: false,
      error: `Voltaje insuficiente. Necesitas más de ${Vled}V para un LED ${ledType.label.toLowerCase()} (tienes ${voltage}V).`,
      status: 'error',
    };
  }

  const R = (voltage - Vled) / I;
  const Rcom = getCommercialResistance(R);
  const margin = ((Rcom - R) / R) * 100;
  const Itotal = numLeds * I;
  const P = I * I * Rcom;
  const Pcom = getCommercialPower(P);
  const bands = getColorBands(Rcom);

  if (margin > 20) warnings.push(`La resistencia comercial es un ${margin.toFixed(0)}% mayor que la teórica.`);
  if (Itotal * 1000 > 500) warnings.push('La corriente total del circuito es alta. Verifica que tu fuente lo soporte.');

  const realCurrent = (voltage - Vled) / Rcom;

  return {
    valid: true,
    resistance: R,
    commercialResistance: Rcom,
    resistanceMargin: margin,
    currentTotal: Itotal * 1000,
    powerResistor: P,
    commercialPower: Pcom,
    colorBands: bands.colors,
    colorBandLabels: bands.labels,
    status: warnings.length > 0 ? 'warning' : 'ok',
    warnings,
    summary: `Para ${numLeds} LED(s) ${ledType.label.toLowerCase()} en paralelo a ${voltage}V, usa ${numLeds} resistencia(s) de ${Rcom}Ω (${formatPower(Pcom)} cada una). Corriente total: ${(Itotal * 1000).toFixed(1)}mA, corriente real por LED: ${(realCurrent * 1000).toFixed(1)}mA.`,
  };
}
