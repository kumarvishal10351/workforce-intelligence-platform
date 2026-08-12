import { useState } from "react";
import { predictEmployee } from "../services/api";
import RiskBadge from "../components/RiskBadge";

const INITIAL = {
  Education: "Bachelors",
  JoiningYear: 2018,
  City: "Bangalore",
  PaymentTier: 2,
  Age: 30,
  Gender: "Male",
  EverBenched: "No",
  ExperienceInCurrentDomain: 4,
};

export default function PredictPage() {
  const [form, setForm] = useState(INITIAL);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await predictEmployee(form);
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Prediction failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-component-gap-md fade-in">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            Single Employee Risk Inference
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Manual feature entry for real-time model scoring.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-component-gap-md">
        {/* Form */}
        <div className="bg-surface-container-low border border-outline-variant p-5 rounded-DEFAULT">
          <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-4 pb-2 border-b border-outline-variant">
            Employee Telemetry Input
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 font-body-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">
                  Education
                </label>
                <select
                  value={form.Education}
                  onChange={(e) => update("Education", e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT p-2 text-on-surface"
                >
                  <option>Bachelors</option>
                  <option>Masters</option>
                  <option>PHD</option>
                </select>
              </div>

              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">
                  City Location
                </label>
                <select
                  value={form.City}
                  onChange={(e) => update("City", e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT p-2 text-on-surface"
                >
                  <option>Bangalore</option>
                  <option>New Delhi</option>
                  <option>Pune</option>
                </select>
              </div>

              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">
                  Gender
                </label>
                <select
                  value={form.Gender}
                  onChange={(e) => update("Gender", e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT p-2 text-on-surface"
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">
                  Bench Status
                </label>
                <select
                  value={form.EverBenched}
                  onChange={(e) => update("EverBenched", e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT p-2 text-on-surface"
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">
                  Age (18-70)
                </label>
                <input
                  type="number"
                  min={18}
                  max={70}
                  value={form.Age}
                  onChange={(e) => update("Age", parseInt(e.target.value) || 0)}
                  className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT p-2 text-on-surface"
                />
              </div>

              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">
                  Joining Year
                </label>
                <input
                  type="number"
                  min={1970}
                  max={2030}
                  value={form.JoiningYear}
                  onChange={(e) => update("JoiningYear", parseInt(e.target.value) || 0)}
                  className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT p-2 text-on-surface"
                />
              </div>

              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">
                  Payment Tier (1-3)
                </label>
                <select
                  value={form.PaymentTier}
                  onChange={(e) => update("PaymentTier", parseInt(e.target.value))}
                  className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT p-2 text-on-surface"
                >
                  <option value={1}>Tier 1</option>
                  <option value={2}>Tier 2</option>
                  <option value={3}>Tier 3</option>
                </select>
              </div>

              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">
                  Domain Experience (yrs)
                </label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={form.ExperienceInCurrentDomain}
                  onChange={(e) => update("ExperienceInCurrentDomain", parseInt(e.target.value) || 0)}
                  className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT p-2 text-on-surface"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-2.5 rounded-DEFAULT font-label-caps text-label-caps font-bold hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  Evaluating Model...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  Run Model Scoring
                </>
              )}
            </button>
          </form>
        </div>

        {/* Outcome Card */}
        <div className="bg-surface-container-low border border-outline-variant p-5 rounded-DEFAULT flex flex-col justify-between">
          <div>
            <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-4 pb-2 border-b border-outline-variant">
              Inference Telemetry Outcome
            </h3>

            {result ? (
              <div className="space-y-4">
                <div className="bg-surface-container p-6 rounded-DEFAULT border border-outline-variant text-center">
                  <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">
                    Attriton Probability
                  </span>
                  <span className="font-mono text-4xl font-bold text-error block mb-3">
                    {(result.risk_probability * 100).toFixed(1)}%
                  </span>
                  <RiskBadge level={result.risk_level} />
                </div>

                {result.recommendations?.length > 0 && (
                  <div>
                    <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-2">
                      Suggested Retention Playbook
                    </h4>
                    <div className="space-y-2">
                      {result.recommendations.map((rec, i) => (
                        <div
                          key={i}
                          className="bg-surface-container p-2.5 rounded-DEFAULT text-body-sm text-on-surface flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-primary text-sm">verified</span>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : error ? (
              <div className="p-4 rounded-DEFAULT bg-error-container/20 border border-error/30 text-error flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                <span>{error}</span>
              </div>
            ) : (
              <div className="p-12 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant">
                  psychology
                </span>
                <p className="font-body-sm text-body-sm">
                  Fill in the employee parameters and click Run Model Scoring to view real-time probability.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
