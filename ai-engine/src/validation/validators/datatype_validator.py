import pandas as pd

from ..base import BaseValidator
from ..result import ValidationResult


class DataTypeValidator(BaseValidator):
    """
    Validates the datatype of each required column.
    """

    def __init__(self, expected_types: dict[str, str]):
        self.expected_types = expected_types

    def validate(self, data: pd.DataFrame) -> ValidationResult:
        """
        Validate datatypes of the uploaded dataset.
        """

        result = ValidationResult()

        for column, expected_type in self.expected_types.items():

            actual_type = str(data[column].dtype)

            if actual_type != expected_type:

                result.add_error(
                    f"Column '{column}' expected "
                    f"{expected_type}, got {actual_type}."
                )

        return result