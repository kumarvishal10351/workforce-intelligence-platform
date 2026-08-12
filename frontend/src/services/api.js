/**
 * API Service
 *
 * Centralized Axios client for communicating with the FastAPI backend.
 */

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ─── Health ─── */

export const checkHealth = () => api.get("/health");

/* ─── Uploads ─── */

export const uploadCSV = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/api/v1/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ─── Predictions ─── */

export const predictSingle = (employeeData) =>
  api.post("/api/v1/predictions/single", employeeData);

export const predictBulk = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/api/v1/predictions/bulk", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ─── Employees ─── */

export const predictEmployee = (employeeData) =>
  api.post("/api/v1/employees/predict", employeeData);

export default api;
