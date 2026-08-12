"""
Health Check Endpoint
"""

from fastapi import APIRouter

from app.schemas.prediction import HealthResponse
from app.services.prediction_service import prediction_service

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    tags=["Health"],
)
async def health_check():
    """Check application health and model status."""
    return HealthResponse(
        status="healthy",
        model_loaded=prediction_service.is_loaded,
    )
