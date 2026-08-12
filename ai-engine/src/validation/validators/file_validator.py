"""
File Validator

Validates the uploaded file before reading its contents.
Checks file type, readability, and emptiness.
"""

from pathlib import Path

from ..base import BaseValidator
from ..result import ValidationResult

from config.settings import SUPPORTED_EXTENSIONS


class FileValidator(BaseValidator):
    """
    Validates a file path before the dataset is loaded.
    """

    def validate(self, file_path: str | Path) -> ValidationResult:
        """
        Validate file existence, extension, and basic integrity.

        Parameters
        ----------
        file_path : str | Path
            Path to the uploaded file.

        Returns
        -------
        ValidationResult
            Result containing any file-level errors.
        """

        result = ValidationResult()
        path = Path(file_path)

        # Check file exists
        if not path.exists():
            result.add_error(
                f"File not found: {path.name}"
            )
            return result

        # Check file is a file (not directory)
        if not path.is_file():
            result.add_error(
                f"Path is not a file: {path.name}"
            )
            return result

        # Check supported extension
        if path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            result.add_error(
                f"Unsupported file format '{path.suffix}'. "
                f"Supported: {sorted(SUPPORTED_EXTENSIONS)}."
            )
            return result

        # Check file is not empty
        if path.stat().st_size == 0:
            result.add_error(
                f"File is empty: {path.name}"
            )
            return result

        # Check file is readable
        try:
            with open(path, "r", encoding="utf-8") as f:
                f.readline()
        except Exception:
            result.add_error(
                f"File cannot be read: {path.name}"
            )

        return result
