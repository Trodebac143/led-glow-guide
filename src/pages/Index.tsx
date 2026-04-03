import React, { useState, useCallback } from 'react';
import { Zap, AlertTriangle, CheckCircle, Info, ChevronDown } from 'lucide-react';
import {
  LED_TYPES,
  type LedType,
  type Config,
  type CalcResult,
  calculate,
  formatPower,
} from '@/lib/ledCalculator';
import ResistorColorCode from '@/components/ResistorColorCode';
import SeriesCircuit from '@/components/SeriesCircuit';
import ParallelCircuit from '@/components/ParallelCircuit';

const Index = () => {
  const [voltage, setVoltage] = useState(5);
  const [ledTypeIndex, setLedTypeIndex] = useState(0);
  const [numLeds, setNumLeds] = useState(3);
  const [config, setConfig] = useState<Config>('serie');
  const [currentMa, setCurrentMa] = useState(20);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const selectedLed = LED_TYPES[ledTypeIndex];

  const handleCalculate = useCallback(() => {
    const res = calculate({
      voltage,
      ledType: selectedLed,
      numLeds,
      config,
      currentMa,
    });
    setResult(res);
    setShowResult(true);
  }, [voltage, selectedLed, numLeds, config, currentMa]);

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-5 py-4">
          <h1 className="text-xl font-bold text-foreground tracking-tight">💡 Calculadora LED</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Calcula la resistencia adecuada para tus LEDs</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 pt-5 space-y-4">
        {/* Input Card */}
        <div className="ios-card p-5 space-y-5">
          {/* Voltage */}
          <div>
            <label className="ios-label">Voltaje de alimentación</label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(parseFloat(e.target.value) || 0)}
                className="ios-input flex-1"
                min="0"
                step="0.1"
              />
              <span className="text-sm font-semibold text-muted-foreground">V</span>
            </div>
          </div>

          {/* LED Type */}
          <div>
            <label className="ios-label">Tipo de LED</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {LED_TYPES.map((led, i) => (
                <button
                  key={led.label}
                  onClick={() => setLedTypeIndex(i)}
                  className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-xs font-medium transition-all duration-200
                    ${i === ledTypeIndex
                      ? 'bg-primary/10 ring-2 ring-primary/40 text-foreground'
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                    }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-border/50"
                    style={{ backgroundColor: led.color, boxShadow: i === ledTypeIndex ? `0 0 8px ${led.color}` : 'none' }}
                  />
                  <span className="leading-tight">{led.label}</span>
                  <span className="text-[10px] text-muted-foreground">{led.voltage}V</span>
                </button>
              ))}
            </div>
          </div>

          {/* Num LEDs */}
          <div>
            <label className="ios-label">Número de LEDs</label>
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => setNumLeds(Math.max(1, numLeds - 1))}
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-lg font-bold text-foreground active:scale-95 transition-transform"
              >−</button>
              <input
                type="number"
                value={numLeds}
                onChange={(e) => setNumLeds(Math.max(1, parseInt(e.target.value) || 1))}
                className="ios-input flex-1 text-center text-lg font-semibold"
                min="1"
              />
              <button
                onClick={() => setNumLeds(numLeds + 1)}
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-lg font-bold text-foreground active:scale-95 transition-transform"
              >+</button>
            </div>
          </div>

          {/* Configuration */}
          <div>
            <label className="ios-label">Configuración</label>
            <div className="mt-2 flex bg-secondary/50 rounded-xl p-1">
              {(['serie', 'paralelo'] as Config[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setConfig(c)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                    ${config === c
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground'
                    }`}
                >
                  {c === 'serie' ? '⛓️ Serie' : '🔀 Paralelo'}
                </button>
              ))}
            </div>
          </div>

          {/* Current */}
          <div>
            <label className="ios-label">Corriente por LED</label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="number"
                value={currentMa}
                onChange={(e) => setCurrentMa(parseFloat(e.target.value) || 0)}
                className="ios-input flex-1"
                min="0"
                step="1"
              />
              <span className="text-sm font-semibold text-muted-foreground">mA</span>
            </div>
            <div className="mt-2 flex gap-2">
              {[10, 20, 30].map((v) => (
                <button
                  key={v}
                  onClick={() => setCurrentMa(v)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all
                    ${currentMa === v ? 'bg-primary/10 text-primary' : 'bg-secondary/50 text-muted-foreground'}`}
                >
                  {v}mA
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button onClick={handleCalculate} className="ios-btn-primary flex items-center justify-center gap-2">
          <Zap className="w-5 h-5" />
          Calcular
        </button>

        {/* Results */}
        {showResult && result && (
          <div className="space-y-4 animate-fade-in-up">
            {/* Error */}
            {!result.valid && (
              <div className="ios-card p-5 border-destructive/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-destructive text-sm">Voltaje insuficiente</p>
                    <p className="text-sm text-muted-foreground mt-1">{result.error}</p>
                  </div>
                </div>
              </div>
            )}

            {result.valid && (
              <>
                {/* Status badge */}
                <div className="flex justify-center">
                  {result.status === 'ok' && (
                    <span className="badge-success"><CheckCircle className="w-3.5 h-3.5" /> Circuito válido</span>
                  )}
                  {result.status === 'warning' && (
                    <span className="badge-warning"><AlertTriangle className="w-3.5 h-3.5" /> Revisar advertencias</span>
                  )}
                </div>

                {/* Summary */}
                {result.summary && (
                  <div className="ios-card p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground leading-relaxed">{result.summary}</p>
                    </div>
                  </div>
                )}

                {/* Main Result */}
                <div className="ios-card p-5">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Resultado principal</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <ResultItem label="R teórica" value={`${result.resistance!.toFixed(2)} Ω`} />
                    <ResultItem label="R comercial" value={`${result.commercialResistance} Ω`} highlight />
                    <ResultItem label="Margen" value={`+${result.resistanceMargin!.toFixed(1)}%`} />
                    <ResultItem label={config === 'serie' ? 'I circuito' : 'I total'} value={`${result.currentTotal!.toFixed(1)} mA`} />
                  </div>
                </div>

                {/* Color Code */}
                <div className="ios-card p-5">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Código de colores</h3>
                  <ResistorColorCode
                    colors={result.colorBands!}
                    labels={result.colorBandLabels!}
                    value={result.commercialResistance!}
                  />
                </div>

                {/* Power & Safety */}
                <div className="ios-card p-5">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Potencia y seguridad</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <ResultItem label="P disipada" value={`${(result.powerResistor! * 1000).toFixed(1)} mW`} />
                    <ResultItem label="P mínima" value={formatPower(result.commercialPower!)} highlight />
                  </div>

                  {config === 'paralelo' && (
                    <div className="mt-4 p-3 rounded-xl bg-warning/10 border border-warning/20">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-foreground leading-relaxed">
                          <strong>Importante:</strong> Usa una resistencia individual por cada LED. Compartir una sola resistencia entre LEDs en paralelo puede causar sobrecalentamiento y distribución desigual de corriente.
                        </p>
                      </div>
                    </div>
                  )}

                  {result.warnings && result.warnings.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {result.warnings.map((w, i) => (
                        <div key={i} className="p-3 rounded-xl bg-warning/10 border border-warning/20">
                          <p className="text-xs text-foreground flex items-start gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" />
                            {w}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Circuit Diagram */}
                <div className="ios-card p-5">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                    Esquema de conexión — {config === 'serie' ? 'Serie' : 'Paralelo'}
                  </h3>
                  <div className="bg-secondary/30 rounded-xl p-4 overflow-x-auto">
                    {config === 'serie' ? (
                      <SeriesCircuit
                        numLeds={numLeds}
                        ledColor={selectedLed.color}
                        voltage={voltage}
                        resistance={result.commercialResistance!}
                      />
                    ) : (
                      <ParallelCircuit
                        numLeds={numLeds}
                        ledColor={selectedLed.color}
                        voltage={voltage}
                        resistance={result.commercialResistance!}
                      />
                    )}
                  </div>
                  {config === 'paralelo' && (
                    <p className="text-[11px] text-muted-foreground mt-3 text-center">
                      Cada rama tiene su propia resistencia de {result.commercialResistance}Ω
                    </p>
                  )}
                </div>

                {/* Practical tip */}
                <div className="ios-card p-5 bg-primary/[0.03]">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">💡 Consejo práctico</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {config === 'serie'
                      ? `Conecta los ${numLeds} LED(s) uno tras otro con una sola resistencia de ${result.commercialResistance}Ω al inicio. Todos los LEDs compartirán la misma corriente.`
                      : `Conecta cada LED con su propia resistencia de ${result.commercialResistance}Ω. Todas las ramas van entre +${voltage}V y GND. Necesitarás ${numLeds} resistencia(s) en total.`}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ResultItem = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div>
    <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
    <p className={`text-base font-bold mt-0.5 ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</p>
  </div>
);

export default Index;
