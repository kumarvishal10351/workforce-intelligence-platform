import { useState, useEffect } from "react";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("predictionHistory");
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("predictionHistory");
    setHistory([]);
  };

  return (
    <div className="flex flex-col gap-component-gap-md fade-in">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            Prediction History
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Audit log of batch ingestion jobs and prediction telemetry.
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="border border-outline-variant text-on-surface-variant hover:text-error hover:bg-surface-container-high px-3 py-1.5 rounded-DEFAULT font-label-caps text-label-caps transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
            Clear Audit Log
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="bg-surface-container-low border border-outline-variant rounded-DEFAULT overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-data-table text-data-table border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant border-b border-outline-variant font-label-caps text-label-caps">
                  <th className="p-3">Job ID</th>
                  <th className="p-3">Dataset File</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Total Rows</th>
                  <th className="p-3">High Risk</th>
                  <th className="p-3">Medium Risk</th>
                  <th className="p-3">Low Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="p-3 font-mono font-bold text-on-surface">
                      JOB-{String(h.id).slice(-6)}
                    </td>
                    <td className="p-3 text-on-surface font-medium">{h.filename}</td>
                    <td className="p-3 text-on-surface-variant text-xs font-mono">
                      {new Date(h.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 font-mono text-on-surface">{h.total}</td>
                    <td className="p-3 font-mono font-bold text-error">{h.high}</td>
                    <td className="p-3 font-mono font-bold text-tertiary">{h.medium}</td>
                    <td className="p-3 font-mono font-bold text-primary">{h.low}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-low border border-outline-variant rounded-DEFAULT p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">
            history
          </span>
          <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
            No History Audit Logs
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Previous batch ingestion telemetry will be recorded here.
          </p>
        </div>
      )}
    </div>
  );
}
