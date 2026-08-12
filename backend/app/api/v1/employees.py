"""
Employee API Endpoints

Individual employee prediction and detail lookup.
"""

from fastapi import APIRouter, HTTPException

from app.schemas.prediction import (
    EmployeePredictionRequest,
    EmployeePredictionResponse,
)
from app.services.prediction_service import prediction_service

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.post(
    "/predict",
    response_model=EmployeePredictionResponse,
)
async def predict_employee(request: EmployeePredictionRequest):
    """
    Predict attrition risk for a single employee.

    Accepts individual employee features and returns
    risk probability, level, and recommendations.
    """
    try:
        result = prediction_service.predict_single(
            request.model_dump()
        )
        return EmployeePredictionResponse(**result)
    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Model pipeline not available. Please train a model first.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}",
        )
