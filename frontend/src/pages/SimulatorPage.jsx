import { useState, useEffect } from "react";
import { predictEmployee } from "../services/api";

const BASELINE = {
  Education: "Bachelors",
  JoiningYear: 2018,
  City: "Bangalore",
  PaymentTier: 3,
  Age: 32,
  Gender: "Male",
  EverBenched: "Yes",
  ExperienceInCurrentDomain: 5,
};

export default function SimulatorPage() {
  const [form, setForm] = useState(BASELINE);
  const [baselineRisk, setBaselineRisk] = useState(null);
  const [simulatedRisk, setSimulatedRisk] = useState(null);

  useEffect(() => {
    runSimulation(BASELINE, true);
  }, []);

  const runSimulation = async (params, isBaseline = false) => {
    try {
      const res = await predictEmployee(params);
      if (isBaseline) {
        setBaselineRisk(res.data);
      }
      setSimulatedRisk(res.data);
    } catch {
      /* ignore */
    }
  };

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    runSimulation(updated, false);
  };

  const resetToBaseline = () => {
    setForm(BASELINE);
    runSimulation(BASELINE, false);
  };

  const riskDelta =
    baselineRisk && simulatedRisk
      ? (simulatedRisk.risk_probability - baselineRisk.risk_probability) * 100
      : 0;

  return (
    <div className="flex flex-col gap-4 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-on-surface">
            Retention Simulator
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Test retention levers to evaluate real-time probability changes.
          </p>
        </div>
        <button
          onClick={resetToBaseline}
          className="border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 font-semibold"
        >
          <span className="material-symbols-outlined text-xs">restart_alt</span>
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Levers Panel */}
        <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-on-surface mb-3 pb-2 border-b border-outline-variant">
            Retention Levers
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-on-surface mb-1 font-medium">
                <span>Compensation Level</span>
                <span className="font-mono font-bold text-primary">Tier {form.PaymentTier}</span>
              </div>
              <select
                value={form.PaymentTier}
                onChange={(e) => handleChange("PaymentTier", parseInt(e.target.value))}
                className="w-full bg-surface-container border border-outline-variant rounded p-1.5 text-on-surface"
              >
                <option value={1}>Tier 1 (Highest)</option>
                <option value={2}>Tier 2 (Mid-Level)</option>
                <option value={3}>Tier 3 (Base)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-on-surface mb-1 font-medium">
                <span>Bench Status</span>
                <span className="font-mono font-bold text-primary">{form.EverBenched}</span>
              </div>
              <select
                value={form.EverBenched}
                onChange={(e) => handleChange("EverBenched", e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded p-1.5 text-on-surface"
              >
                <option value="No">Assigned Active Project (No Bench)</option>
                <option value="Yes">Unassigned / On Bench (Yes)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-on-surface mb-1 font-medium">
                <span>Joining Year ({2026 - form.JoiningYear} yrs tenure)</span>
                <span className="font-mono font-bold text-primary">{form.JoiningYear}</span>
              </div>
              <input
                type="range"
                min={2012}
                max={2024}
                value={form.JoiningYear}
                onChange={(e) => handleChange("JoiningYear", parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between text-on-surface mb-1 font-medium">
                <span>Domain Experience</span>
                <span className="font-mono font-bold text-primary">{form.ExperienceInCurrentDomain} Years</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                value={form.ExperienceInCurrentDomain}
                onChange={(e) => handleChange("ExperienceInCurrentDomain", parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Live Outcome Panel */}
        <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-on-surface mb-3 pb-2 border-b border-outline-variant">
            Simulation Telemetry
          </h3>

          {simulatedRisk && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-surface-container p-3 rounded border border-outline-variant">
                <div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase block">
                    Baseline Risk
                  </span>
                  <span className="font-mono text-xl font-bold text-on-surface-variant">
                    {baselineRisk ? (baselineRisk.risk_probability * 100).toFixed(1) : "---"}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase block">
                    Simulated Risk
                  </span>
                  <span className="font-mono text-2xl font-bold text-red-400">
                    {(simulatedRisk.risk_probability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Delta Badge */}
              <div
                className={`p-2.5 rounded font-mono text-xs font-bold flex items-center gap-1.5 border ${
                  riskDelta < 0
                    ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400"
                    : riskDelta > 0
                    ? "bg-red-950/30 border-red-500/30 text-red-400"
                    : "bg-surface-container text-on-surface-variant border-outline-variant"
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {riskDelta < 0 ? "trending_down" : riskDelta > 0 ? "trending_up" : "flatline"}
                </span>
                <span>
                  {riskDelta < 0
                    ? `Risk Reduced by ${Math.abs(riskDelta).toFixed(1)}%`
                    : riskDelta > 0
                    ? `Risk Increased by +${riskDelta.toFixed(1)}%`
                    : "No Risk Shift"}
                </span>
              </div>

              {/* Playbook List */}
              <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mt-3">
                Simulated Playbook
              </h4>
              <div className="space-y-1.5">
                {simulatedRisk.recommendations?.map((rec, i) => (
                  <div
                    key={i}
                    className="bg-surface-container p-2 rounded text-on-surface flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
