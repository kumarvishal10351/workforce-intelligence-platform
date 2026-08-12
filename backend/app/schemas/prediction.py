"""
Pydantic Schemas for Employee Prediction API

Request/response validation schemas for the prediction endpoints.
"""

from pydantic import BaseModel, Field
from typing import Optional


class EmployeePredictionRequest(BaseModel):
    """Request schema for single employee prediction."""

    Education: str = Field(..., examples=["Bachelors"])
    JoiningYear: int = Field(..., ge=1970, le=2030, examples=[2016])
    City: str = Field(..., examples=["Bangalore"])
    PaymentTier: int = Field(..., ge=1, le=3, examples=[2])
    Age: int = Field(..., ge=18, le=70, examples=[35])
    Gender: str = Field(..., examples=["Male"])
    EverBenched: str = Field(..., examples=["Yes"])
    ExperienceInCurrentDomain: int = Field(
        ..., ge=0, examples=[5]
    )


class PredictionFactor(BaseModel):
    """A single factor contributing to prediction."""

    feature: str
    impact: str  # "increases_risk" or "reduces_risk"


class EmployeePredictionResponse(BaseModel):
    """Response schema for single employee prediction."""

    risk_probability: float = Field(
        ..., ge=0.0, le=1.0, examples=[0.82]
    )
    risk_level: str = Field(..., examples=["High"])
    recommendations: list[str] = []
    top_factors: Optional[list[PredictionFactor]] = None


class BulkPredictionResult(BaseModel):
    """Result for a single employee in bulk prediction."""

    index: int
    risk_probability: float
    risk_level: str
    recommendations: list[str] = []


class BulkPredictionResponse(BaseModel):
    """Response schema for bulk prediction."""

    total_employees: int
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    results: list[BulkPredictionResult]


class ValidationResultResponse(BaseModel):
    """Response schema for validation results."""

    is_valid: bool
    errors: list[str] = []
    warnings: list[str] = []
    total_rows: Optional[int] = None


class UploadResponse(BaseModel):
    """Response schema for file upload."""

    filename: str
    total_rows: int
    validation: ValidationResultResponse


class HealthResponse(BaseModel):
    """Response schema for health check."""

    status: str = "healthy"
    model_loaded: bool = False
