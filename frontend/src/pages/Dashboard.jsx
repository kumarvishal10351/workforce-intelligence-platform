import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import RiskBadge from "../components/RiskBadge";

const STITCH_COLORS = {
  High: "#f87171",
  Medium: "#fbbf24",
  Low: "#34d399",
};

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("latestPrediction");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const pieData = data
    ? [
        { name: "High", value: data.high_risk_count },
        { name: "Medium", value: data.medium_risk_count },
        { name: "Low", value: data.low_risk_count },
      ]
    : [];

  const barData = data
    ? [
        {
          name: "Risk Distribution",
          High: data.high_risk_count,
          Medium: data.medium_risk_count,
          Low: data.low_risk_count,
        },
      ]
    : [];

  const topRisk =
    data?.results
      ?.filter((r) => r.risk_level === "High")
      .sort((a, b) => b.risk_probability - a.risk_probability)
      .slice(0, 5) || [];

  return (
    <div className="flex flex-col gap-5 fade-in">
      {/* Page Header (single Upload CSV button in top navbar) */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-on-surface">
            Executive Overview
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {data
              ? `${data.total_employees} employees analyzed`
              : "Upload dataset to view workforce risk overview"}
          </p>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Total Tracked
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-base">
              groups
            </span>
          </div>
          <div className="font-mono text-2xl font-bold text-on-surface">
            {data?.total_employees ?? 0}
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-error uppercase tracking-wider">
              High Risk
            </span>
            <span className="material-symbols-outlined text-error text-base">
              warning
            </span>
          </div>
          <div className="font-mono text-2xl font-bold text-error">
            {data?.high_risk_count ?? 0}
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-tertiary uppercase tracking-wider">
              Medium Risk
            </span>
            <span className="material-symbols-outlined text-tertiary text-base">
              notification_important
            </span>
          </div>
          <div className="font-mono text-2xl font-bold text-tertiary">
            {data?.medium_risk_count ?? 0}
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Low Risk
            </span>
            <span className="material-symbols-outlined text-primary text-base">
              verified
            </span>
          </div>
          <div className="font-mono text-2xl font-bold text-primary">
            {data?.low_risk_count ?? 0}
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      {data ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4">
              <h3 className="text-sm font-semibold text-on-surface mb-3">
                Risk Distribution
              </h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="#10141a"
                      strokeWidth={2}
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={STITCH_COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#1c2026",
                        border: "1px solid #3d4947",
                        borderRadius: "0.25rem",
                        color: "#dfe2eb",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4">
              <h3 className="text-sm font-semibold text-on-surface mb-3">
                Risk Breakdown
              </h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3d4947" />
                    <XAxis dataKey="name" stroke="#879391" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#879391" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#1c2026",
                        border: "1px solid #3d4947",
                        borderRadius: "0.25rem",
                        color: "#dfe2eb",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="High" fill="#f87171" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Medium" fill="#fbbf24" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Low" fill="#34d399" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* High Priority Action List */}
          <div className="bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden">
            <div className="p-3.5 border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-base">priority_high</span>
                Highest Risk Employees
              </h3>
              <Link
                to="/results"
                className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
              >
                View Registry →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant border-b border-outline-variant uppercase text-[11px] font-bold tracking-wider">
                    <th className="p-3">Employee ID</th>
                    <th className="p-3">Risk Level</th>
                    <th className="p-3">Probability</th>
                    <th className="p-3">Recommendation</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {topRisk.map((emp) => (
                    <tr key={emp.index} className="hover:bg-surface-container-high transition-colors">
                      <td className="p-3 font-mono font-bold text-on-surface">
                        EMP-{String(emp.index + 8400).padStart(4, "0")}
                      </td>
                      <td className="p-3">
                        <RiskBadge level={emp.risk_level} />
                      </td>
                      <td className="p-3 font-mono font-bold text-red-400">
                        {(emp.risk_probability * 100).toFixed(1)}%
                      </td>
                      <td className="p-3 text-on-surface-variant max-w-xs truncate">
                        {emp.recommendations?.[0] || "Schedule check-in"}
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          to={`/employee/${emp.index}`}
                          className="bg-surface-container-high hover:bg-surface-variant text-on-surface px-2.5 py-1 rounded text-xs transition-colors inline-flex items-center gap-1 font-medium border border-outline-variant"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-surface-container-low border border-outline-variant rounded-lg p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">
            cloud_upload
          </span>
          <h3 className="text-sm font-semibold text-on-surface mb-1">
            No Data Analyzed Yet
          </h3>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto mb-4">
            Upload an employee CSV to run predictions.
          </p>
          <Link
            to="/upload"
            className="bg-primary text-on-primary px-3.5 py-1.5 rounded text-xs font-bold inline-flex items-center gap-1.5 hover:bg-primary-fixed transition-colors"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            Go to Workbench
          </Link>
        </div>
      )}
    </div>
  );
}
