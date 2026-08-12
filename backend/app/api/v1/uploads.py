"""
Upload API Endpoints

Handles CSV file upload and validation.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.schemas.prediction import (
    UploadResponse,
    ValidationResultResponse,
)
from app.services.upload_service import upload_service

router = APIRouter(prefix="/uploads", tags=["Uploads"])


@router.post(
    "",
    response_model=UploadResponse,
)
async def upload_csv(file: UploadFile = File(...)):
    """
    Upload an employee CSV file and run validation.
    """

    # Read file content
    try:
        content = await file.read()
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Failed to read uploaded file.",
        )

    # Save file
    try:
        file_path = upload_service.save_upload(
            file.filename or "upload.csv",
            content,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Validate and load
    validation, df = upload_service.validate_and_load(
        file_path, mode="inference"
    )

    return UploadResponse(
        filename=file.filename or "upload.csv",
        total_rows=validation.get("total_rows", 0),
        validation=ValidationResultResponse(**validation),
    )
