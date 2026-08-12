"""
Workforce Intelligence Platform — FastAPI Application

Main application entry point for the backend API.

Author: Vishal Kumar Kashyap
Project: Workforce Intelligence Platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import ALLOWED_ORIGINS, API_V1_PREFIX
from app.api.v1.health import router as health_router
from app.api.v1.predictions import router as predictions_router
from app.api.v1.uploads import router as uploads_router
from app.api.v1.employees import router as employees_router


app = FastAPI(
    title="Workforce Intelligence Platform",
    description=(
        "AI-powered employee attrition intelligence API. "
        "Validates workforce data, predicts attrition risk, "
        "and provides actionable retention recommendations."
    ),
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health_router)
app.include_router(predictions_router, prefix=API_V1_PREFIX)
app.include_router(uploads_router, prefix=API_V1_PREFIX)
app.include_router(employees_router, prefix=API_V1_PREFIX)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint."""
    return {
        "name": "Workforce Intelligence Platform",
        "version": "1.0.0",
        "docs": "/docs",
    }
