import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { uploadCSV, predictBulk } from "../services/api";

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [validation, setValidation] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus("idle");
      setValidation(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
    maxSize: 50 * 1024 * 1024,
  });

  const handleUploadAndPredict = async () => {
    if (!file) return;

    try {
      setStatus("validating");
      setError(null);

      const uploadRes = await uploadCSV(file);
      const uploadData = uploadRes.data;
      setValidation(uploadData.validation);

      if (!uploadData.validation.is_valid) {
        setStatus("error");
        setError("Validation failed.");
        return;
      }

      setStatus("predicting");
      const predRes = await predictBulk(file);
      const predData = predRes.data;

      localStorage.setItem("latestPrediction", JSON.stringify(predData));

      const history = JSON.parse(
        localStorage.getItem("predictionHistory") || "[]"
      );
      history.unshift({
        id: Date.now(),
        filename: file.name,
        timestamp: new Date().toISOString(),
        total: predData.total_employees,
        high: predData.high_risk_count,
        medium: predData.medium_risk_count,
        low: predData.low_risk_count,
      });
      localStorage.setItem("predictionHistory", JSON.stringify(history.slice(0, 50)));

      setStatus("done");
      setTimeout(() => navigate("/results"), 800);
    } catch (err) {
      setStatus("error");
      const msg =
        err.response?.data?.detail?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Ingestion failed.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  return (
    <div className="flex flex-col gap-5 fade-in">
      <div>
        <h1 className="text-xl font-bold text-on-surface">
          Ingestion Workbench
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Validate dataset schema and run batch inference pipeline.
        </p>
      </div>

      {/* Stepper */}
      <div className="bg-surface-container-low border border-outline-variant p-3 rounded-lg">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              status === "validating" ? "bg-primary text-on-primary animate-pulse" : "bg-primary-container text-on-primary-container"
            }`}>1</span>
            <span className="font-semibold text-on-surface">File Check</span>
          </div>
          <span className="h-0.5 w-8 bg-outline-variant"></span>
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              status === "validating" ? "bg-primary text-on-primary animate-pulse" : "bg-primary-container text-on-primary-container"
            }`}>2</span>
            <span className="font-semibold text-on-surface">Schema &amp; Types</span>
          </div>
          <span className="h-0.5 w-8 bg-outline-variant"></span>
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              status === "predicting" ? "bg-primary text-on-primary animate-pulse" : "bg-surface-container-high text-on-surface-variant"
            }`}>3</span>
            <span className="font-semibold text-on-surface-variant">ML Prediction</span>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-5">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-primary bg-surface-container-high"
              : "border-outline-variant hover:border-primary hover:bg-surface-container"
          }`}
        >
          <input {...getInputProps()} />
          <span className="material-symbols-outlined text-3xl text-primary mb-2">
            cloud_upload
          </span>
          <h3 className="text-sm font-semibold text-on-surface mb-0.5">
            {file ? file.name : "Drag & Drop Employee CSV"}
          </h3>
          <p className="text-xs text-on-surface-variant">
            {file
              ? `${(file.size / 1024).toFixed(1)} KB`
              : "Supports .csv employee datasets"}
          </p>
        </div>

        {file && status !== "done" && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleUploadAndPredict}
              disabled={status === "validating" || status === "predicting"}
              className="bg-primary text-on-primary px-4 py-2 rounded text-xs font-bold hover:bg-primary-fixed transition-colors flex items-center gap-1.5"
            >
              {status === "validating" && (
                <>
                  <span className="material-symbols-outlined animate-spin text-xs">sync</span>
                  Validating...
                </>
              )}
              {status === "predicting" && (
                <>
                  <span className="material-symbols-outlined animate-spin text-xs">auto_mode</span>
                  Predicting...
                </>
              )}
              {(status === "idle" || status === "error") && (
                <>
                  <span className="material-symbols-outlined text-xs">play_arrow</span>
                  Start Ingestion
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Validation Result */}
      {validation && (
        <div
          className={`p-3.5 rounded-lg border text-xs ${
            validation.is_valid
              ? "bg-primary-container/20 border-primary/30 text-primary"
              : "bg-error-container/20 border-error/30 text-error"
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <span className="material-symbols-outlined text-sm">
              {validation.is_valid ? "check_circle" : "cancel"}
            </span>
            <span>
              {validation.is_valid
                ? `Validation Passed (${validation.total_rows} rows)`
                : "Validation Failed"}
            </span>
          </div>
          {validation.errors?.length > 0 && (
            <ul className="list-disc list-inside space-y-0.5">
              {validation.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && !validation && (
        <div className="p-3.5 rounded-lg bg-error-container/20 border border-error/30 text-error flex items-center gap-1.5 text-xs">
          <span className="material-symbols-outlined text-sm">error</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
