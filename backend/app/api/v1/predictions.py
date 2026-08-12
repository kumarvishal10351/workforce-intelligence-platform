"""
Prediction API Endpoints

Handles individual and bulk employee attrition predictions.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.schemas.prediction import (
    EmployeePredictionRequest,
    EmployeePredictionResponse,
    BulkPredictionResponse,
    BulkPredictionResult,
    UploadResponse,
    ValidationResultResponse,
)
from app.services.prediction_service import prediction_service
from app.services.upload_service import upload_service

router = APIRouter(prefix="/predictions", tags=["Predictions"])


@router.post(
    "/single",
    response_model=EmployeePredictionResponse,
)
async def predict_single(request: EmployeePredictionRequest):
    """
    Predict attrition risk for a single employee.
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


@router.post(
    "/bulk",
    response_model=BulkPredictionResponse,
)
async def predict_bulk(file: UploadFile = File(...)):
    """
    Upload a CSV and predict attrition risk for all employees.
    """

    # Read uploaded file
    try:
        content = await file.read()
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Failed to read uploaded file.",
        )

    # Save and validate
    try:
        file_path = upload_service.save_upload(
            file.filename or "upload.csv",
            content,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    validation, df = upload_service.validate_and_load(
        file_path, mode="inference"
    )

    if not validation["is_valid"]:
        raise HTTPException(
            status_code=422,
            detail={
                "message": "Validation failed.",
                "errors": validation["errors"],
            },
        )

    # Run prediction
    try:
        result = prediction_service.predict_batch(df)
        return BulkPredictionResponse(
            total_employees=result["total_employees"],
            high_risk_count=result["high_risk_count"],
            medium_risk_count=result["medium_risk_count"],
            low_risk_count=result["low_risk_count"],
            results=[
                BulkPredictionResult(**r) for r in result["results"]
            ],
        )
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
