import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function EmployeeDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [checkedActions, setCheckedActions] = useState(new Set());
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("latestPrediction");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const emp = data.results?.find((r) => r.index === parseInt(id));
        if (emp) setEmployee(emp);
      } catch {
        /* ignore */
      }
    }
  }, [id]);

  const toggleCheck = (idx) => {
    const next = new Set(checkedActions);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setCheckedActions(next);
  };

  const handleLogIntervention = () => {
    setLogged(true);
    setTimeout(() => setLogged(false), 3000);
  };

  if (!employee) {
    return (
      <div className="flex flex-col gap-component-gap-md fade-in">
        <div className="bg-surface-container-low border border-outline-variant p-8 rounded-DEFAULT text-center">
          <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">person_off</span>
          <h2 className="font-headline-md text-headline-md text-on-surface">Employee Record Not Found</h2>
          <Link to="/results" className="mt-4 inline-block text-primary hover:underline text-body-sm">
            ← Return to Risk Registry
          </Link>
        </div>
      </div>
    );
  }

  const empId = `#WF-${String(employee.index + 9840).padStart(4, "0")}`;
  const prob = (employee.risk_probability * 100).toFixed(0);

  const playbookActions = [
    {
      title: "Schedule compensation review",
      subtitle: "Address Tier 3 payment band discrepancy",
    },
    {
      title: "Career progression mapping",
      subtitle: "Mitigate 6-year stagnation risk",
    },
    {
      title: "Assign Senior Mentor",
      subtitle: "Leverage 6yr domain experience",
    },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-component-gap-md fade-in">
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <Link
          to="/results"
          className="text-on-surface-variant hover:text-on-surface text-label-caps font-label-caps uppercase flex items-center gap-1 text-xs"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          BACK TO RISK REGISTRY
        </Link>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => window.print()}
            className="border border-outline-variant text-on-surface hover:bg-surface-container-high px-3 py-1.5 rounded-DEFAULT font-label-caps text-xs transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Main Title */}
      <h1 className="text-lg sm:text-headline-lg font-bold text-on-surface">
        Employee Attrition Detail
      </h1>

      {/* Employee Profile Hero Card */}
      <div className="bg-surface-container-low border border-outline-variant p-4 sm:p-5 rounded-DEFAULT flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant text-primary font-bold text-lg flex-shrink-0">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="font-mono text-xs sm:text-body-sm font-bold text-on-surface-variant">
                Employee ID
              </span>
              <span className="font-mono text-base sm:text-lg font-bold text-on-surface">
                {empId}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 mt-0.5 text-xs sm:text-body-sm text-on-surface-variant flex-wrap">
              <span>Dept: <strong className="text-on-surface font-semibold">Engineering</strong></span>
              <span>•</span>
              <span>Tenure: <strong className="text-on-surface font-semibold">4.2 Years</strong></span>
            </div>
          </div>
        </div>

        {/* Risk Score Container */}
        <div className="w-full md:w-auto bg-[#450A0A]/40 border border-[#FF897D]/30 p-3 sm:p-3.5 rounded-DEFAULT flex items-center justify-between sm:justify-start gap-3 min-w-0 md:min-w-[200px]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#FFB4AB] text-2xl flex-shrink-0">
              warning
            </span>
            <div>
              <span className="text-[10px] sm:text-label-caps text-[#FFB4AB] uppercase tracking-wider block font-bold">
                RISK SCORE
              </span>
              <span className="font-mono text-lg sm:text-xl font-bold text-[#FFB4AB]">
                {prob}% (High Risk)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Model Explanation (SHAP Values) on Left + Prescriptive Playbook on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-component-gap-md">
        {/* Left: Model Explanation (SHAP Values) (7 Cols) */}
        <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant p-4 sm:p-5 rounded-DEFAULT flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant mb-4 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-primary flex-shrink-0">analytics</span>
                <h3 className="text-sm sm:text-headline-md font-semibold text-on-surface truncate">
                  Model Explanation (SHAP)
                </h3>
              </div>
              <span className="bg-surface-container px-2 py-0.5 rounded text-[10px] font-mono text-on-surface-variant font-bold uppercase tracking-wider flex-shrink-0">
                LOCAL INTERPRETABILITY
              </span>
            </div>

            {/* Factors Increasing Risk */}
            <div className="mb-5 sm:mb-6">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#FFB4AB] uppercase tracking-wider mb-2.5">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                FACTORS INCREASING ATTRITION RISK
              </div>
              <div className="space-y-3 font-body-sm">
                <div>
                  <div className="flex justify-between text-xs sm:text-body-sm text-on-surface mb-1">
                    <span>PaymentTier (Tier 3)</span>
                    <span className="font-mono text-[#FFB4AB] font-bold">+0.32</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FF897D] h-full rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs sm:text-body-sm text-on-surface mb-1">
                    <span>YearsAtCompany (6 yrs)</span>
                    <span className="font-mono text-[#FFB4AB] font-bold">+0.24</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FF897D] h-full rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs sm:text-body-sm text-on-surface mb-1">
                    <span>EverBenched (Yes)</span>
                    <span className="font-mono text-[#FFB4AB] font-bold">+0.19</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FF897D] h-full rounded-full" style={{ width: "48%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Factors Decreasing Risk */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#6BD8CB] uppercase tracking-wider mb-2.5">
                <span className="material-symbols-outlined text-sm">trending_down</span>
                FACTORS DECREASING ATTRITION RISK
              </div>
              <div className="space-y-3 font-body-sm">
                <div>
                  <div className="flex justify-between text-xs sm:text-body-sm text-on-surface mb-1">
                    <span>ExperienceInCurrentDomain (6 yrs)</span>
                    <span className="font-mono text-[#6BD8CB] font-bold">-0.15</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-[#6BD8CB] h-full rounded-full" style={{ width: "40%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Prescriptive Playbook (5 Cols) */}
        <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant p-4 sm:p-5 rounded-DEFAULT flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-outline-variant mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">fact_check</span>
                <h3 className="text-sm sm:text-headline-md font-semibold text-on-surface">
                  Prescriptive Playbook
                </h3>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Recommended intervention actions
              </p>
            </div>

            {/* Action Checklist */}
            <div className="space-y-2.5 mb-5">
              {playbookActions.map((action, idx) => {
                const isChecked = checkedActions.has(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`p-3 rounded-DEFAULT border cursor-pointer transition-all flex items-start gap-3 active:scale-[0.99] ${
                      isChecked
                        ? "bg-primary-container/20 border-primary/40"
                        : "bg-surface-container border-outline-variant hover:border-on-surface-variant"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 rounded bg-surface-container-lowest border-outline-variant text-primary focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <h4 className="text-xs sm:text-body-sm font-semibold text-on-surface">
                        {action.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5">
                        {action.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Width Action Button */}
          <div>
            {logged && (
              <div className="p-2 mb-2 rounded bg-primary-container/30 text-primary text-center text-xs font-bold animate-pulse">
                ✓ Intervention Logged Successfully
              </div>
            )}
            <button
              onClick={handleLogIntervention}
              className="w-full bg-primary text-on-primary py-2.5 rounded-DEFAULT font-label-caps text-xs font-bold hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
            >
              <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
              Log Intervention
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
