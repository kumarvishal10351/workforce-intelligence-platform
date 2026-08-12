"""
Upload Service

Handles CSV file upload, storage, and validation orchestration.

Author: Vishal Kumar Kashyap
Project: Workforce Intelligence Platform
"""

import sys
import uuid
from pathlib import Path
from datetime import datetime

import pandas as pd

from app.core.config import (
    UPLOAD_DIR,
    SUPPORTED_EXTENSIONS,
    MAX_UPLOAD_SIZE_MB,
    AI_ENGINE_SRC,
)

# Ensure ai-engine is importable
if str(AI_ENGINE_SRC) not in sys.path:
    sys.path.insert(0, str(AI_ENGINE_SRC))

from validation.pipeline import ValidationPipeline


class UploadService:
    """
    Manages file uploads and triggers validation.
    """

    def __init__(self):
        self.upload_dir = UPLOAD_DIR
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    def save_upload(
        self,
        filename: str,
        content: bytes,
    ) -> Path:
        """
        Save uploaded file with a secure unique name.

        Parameters
        ----------
        filename : str
            Original filename from the user.
        content : bytes
            Raw file content.

        Returns
        -------
        Path
            Path to the saved file.
        """

        # Generate secure filename
        ext = Path(filename).suffix.lower()
        if ext not in SUPPORTED_EXTENSIONS:
            raise ValueError(
                f"Unsupported file format '{ext}'. "
                f"Supported: {sorted(SUPPORTED_EXTENSIONS)}."
            )

        # Check size
        size_mb = len(content) / (1024 * 1024)
        if size_mb > MAX_UPLOAD_SIZE_MB:
            raise ValueError(
                f"File too large ({size_mb:.1f} MB). "
                f"Maximum: {MAX_UPLOAD_SIZE_MB} MB."
            )

        safe_name = f"{uuid.uuid4().hex}{ext}"
        file_path = self.upload_dir / safe_name
        file_path.write_bytes(content)

        return file_path

    def validate_and_load(
        self,
        file_path: Path,
        mode: str = "inference",
    ) -> tuple[dict, pd.DataFrame | None]:
        """
        Validate an uploaded file and load it if valid.

        Parameters
        ----------
        file_path : Path
            Path to the saved upload.
        mode : str
            'training' or 'inference'.

        Returns
        -------
        tuple
            (validation_dict, DataFrame or None)
        """

        # Load the CSV
        try:
            df = pd.read_csv(file_path)
        except Exception as e:
            return {
                "is_valid": False,
                "errors": [f"Cannot read file: {str(e)}"],
                "warnings": [],
                "total_rows": 0,
            }, None

        # Run validation pipeline
        pipeline = ValidationPipeline(mode=mode)
        result = pipeline.run(file_path, df)

        validation_dict = {
            "is_valid": result.is_valid,
            "errors": result.errors,
            "warnings": result.warnings,
            "total_rows": len(df),
        }

        return validation_dict, df if result.is_valid else None


# Singleton instance
upload_service = UploadService()
