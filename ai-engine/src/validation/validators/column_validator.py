"""
Validator for checking required columns.
"""

import pandas as pd

from ..base import BaseValidator
from ..result import ValidationResult


class ColumnValidator(BaseValidator):
    """
    Validates whether all required columns
    are present in the uploaded dataset.
    """

    def __init__(self, required_columns: list[str]):
        self.required_columns = required_columns

    def validate(self, data: pd.DataFrame) -> ValidationResult:
        """
        Check whether required columns exist.
        """

        result = ValidationResult()

        for column in self.required_columns:

            if column not in data.columns:
                result.add_error(
                    f"Missing required column: {column}"
                )

        return result