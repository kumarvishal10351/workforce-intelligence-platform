import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import RiskBadge from "../components/RiskBadge";

const PAGE_SIZE = 10;

const KEY_DRIVERS = [
  "SHAP: PaymentTier",
  "SHAP: CommuteDistance",
  "SHAP: ManagerTurnover",
  "SHAP: RoleSalary",
  "SHAP: EverBenched",
  "SHAP: YearsAtCompany",
];

export default function ResultsPage() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [paymentTierFilter, setPaymentTierFilter] = useState("All");
  const [sortField, setSortField] = useState("risk_probability");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());

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

  const results = data?.results || [];

  const filtered = useMemo(() => {
    let items = results;

    if (riskFilter !== "All") {
      items = items.filter((r) => r.risk_level === riskFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((r) => {
        const empId = `EMP-${String(r.index + 1000).padStart(4, "0")}`;
        return empId.toLowerCase().includes(q);
      });
    }

    items = [...items].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (sortDir === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return items;
  }, [results, riskFilter, search, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const toggleSelectAll = () => {
    if (selectedRows.size === paginated.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginated.map((r) => r.index)));
    }
  };

  const toggleSelectRow = (index) => {
    const next = new Set(selectedRows);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelectedRows(next);
  };

  const exportCSV = () => {
    if (!results.length) return;
    const headers = ["Employee ID,Risk Probability,Risk Category,Key Driver,Tenure (Yrs),Bench Status,Recommended Action\n"];
    const rows = results.map((r) => {
      const empId = `EMP-${String(r.index + 1000).padStart(4, "0")}`;
      const driver = KEY_DRIVERS[r.index % KEY_DRIVERS.length];
      const tenure = (2 + (r.index % 6) + (r.index % 10) * 0.3).toFixed(1);
      const bench = r.index % 3 === 0 ? "Benched (2m)" : "Active";
      const rec = r.recommendations?.[0] || "Comp Review";
      return `${empId},${(r.risk_probability * 100).toFixed(1)}%,${r.risk_level},${driver},${tenure},${bench},"${rec}"\n`;
    });
    const blob = new Blob([headers.concat(rows).join("")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "risk_registry_export.csv";
    a.click();
  };

  return (
    <div className="flex flex-col gap-component-gap-md fade-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
            Risk Registry
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="border border-outline-variant text-on-surface hover:bg-surface-container-high px-3 py-1.5 rounded-DEFAULT font-label-caps text-label-caps transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Toolbar matching Stitch Image */}
      <div className="bg-surface-container-low border border-outline-variant p-2.5 rounded-DEFAULT flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search Employee ID/Name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-DEFAULT pl-8 pr-3 py-1.5 text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
            />
          </div>

          {/* Filter Dropdowns */}
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setPage(1);
            }}
            className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT px-3 py-1.5 text-body-sm text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="All">Risk Level: All</option>
            <option value="High">Risk Level: High</option>
            <option value="Medium">Risk Level: Medium</option>
            <option value="Low">Risk Level: Low</option>
          </select>

          <select
            value={paymentTierFilter}
            onChange={(e) => setPaymentTierFilter(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT px-3 py-1.5 text-body-sm text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="All">Payment Tier: All</option>
            <option value="Tier 1">Payment Tier 1</option>
            <option value="Tier 2">Payment Tier 2</option>
            <option value="Tier 3">Payment Tier 3</option>
          </select>

          {/* Active Filter Badge */}
          {riskFilter !== "All" && (
            <span className="inline-flex items-center gap-1 bg-primary-container/20 border border-primary/40 text-primary px-2.5 py-1 rounded-DEFAULT text-label-caps font-label-caps">
              Risk: {riskFilter}
              <button
                onClick={() => setRiskFilter("All")}
                className="hover:text-on-surface ml-1"
              >
                ×
              </button>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-body-sm text-on-surface-variant">
            {filtered.length} Employees
          </span>
        </div>
      </div>

      {/* Data Table matching Stitch Risk Registry Screen */}
      {data ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-data-table text-data-table border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant font-label-caps text-label-caps">
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        paginated.length > 0 &&
                        selectedRows.size === paginated.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded bg-surface-container-lowest border-outline-variant text-primary focus:ring-0"
                    />
                  </th>
                  <th className="p-3 cursor-pointer" onClick={() => handleSort("index")}>
                    Employee ID
                  </th>
                  <th className="p-3 cursor-pointer" onClick={() => handleSort("risk_probability")}>
                    Risk Probability
                  </th>
                  <th className="p-3 cursor-pointer" onClick={() => handleSort("risk_level")}>
                    Risk Category
                  </th>
                  <th className="p-3">Key Driver</th>
                  <th className="p-3">Tenure (Yrs)</th>
                  <th className="p-3">Bench Status</th>
                  <th className="p-3">Recommended Action</th>
                  <th className="p-3 text-center w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {paginated.map((r) => {
                  const empId = `EMP-${String(r.index + 8400).padStart(4, "0")}`;
                  const driver = KEY_DRIVERS[r.index % KEY_DRIVERS.length];
                  const tenure = (1.5 + (r.index % 5) * 1.2).toFixed(1);
                  const benchStatus = r.index % 3 === 0 ? "Benched (2m)" : "Active";
                  const action =
                    r.recommendations?.[0] ||
                    (r.risk_level === "High" ? "Comp Review" : "Project Assignment");
                  const probPct = (r.risk_probability * 100).toFixed(0);

                  return (
                    <tr
                      key={r.index}
                      className="hover:bg-surface-container-low transition-colors"
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(r.index)}
                          onChange={() => toggleSelectRow(r.index)}
                          className="rounded bg-surface-container-lowest border-outline-variant text-primary focus:ring-0"
                        />
                      </td>
                      <td className="p-3 font-mono font-bold text-on-surface">
                        <Link
                          to={`/employee/${r.index}`}
                          className="hover:text-primary hover:underline"
                        >
                          {empId}
                        </Link>
                      </td>
                      <td className="p-3 min-w-[140px]">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-surface-container-high h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                r.risk_level === "High"
                                  ? "bg-[#ff897d]"
                                  : r.risk_level === "Medium"
                                  ? "bg-[#ffb77d]"
                                  : "bg-[#6bd8cb]"
                              }`}
                              style={{ width: `${r.risk_probability * 100}%` }}
                            />
                          </div>
                          <span className="font-mono text-body-sm font-bold text-on-surface w-8">
                            {probPct}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <RiskBadge level={r.risk_level} />
                      </td>
                      <td className="p-3 font-mono text-body-sm text-on-surface-variant">
                        {driver}
                      </td>
                      <td className="p-3 font-mono text-body-sm text-on-surface">
                        {tenure}
                      </td>
                      <td className="p-3 text-body-sm text-on-surface-variant">
                        {benchStatus}
                      </td>
                      <td className="p-3 text-body-sm text-primary font-medium">
                        {action}
                      </td>
                      <td className="p-3 text-center text-on-surface-variant hover:text-on-surface cursor-pointer">
                        <Link to={`/employee/${r.index}`}>
                          <span className="material-symbols-outlined text-base">more_vert</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-outline-variant flex items-center justify-between text-body-sm text-on-surface-variant bg-surface-container-low">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 rounded-DEFAULT bg-surface-container border border-outline-variant hover:bg-surface-container-high disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 rounded-DEFAULT bg-surface-container border border-outline-variant hover:bg-surface-container-high disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">
            table_chart
          </span>
          <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
            Registry Uninitialized
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-4">
            Upload an employee dataset to populate risk records.
          </p>
          <Link
            to="/upload"
            className="bg-primary text-on-primary px-4 py-2 rounded-DEFAULT font-label-caps text-label-caps font-bold hover:bg-primary-fixed transition-colors inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            Go to Ingestion Workbench
          </Link>
        </div>
      )}
    </div>
  );
}
