"""
Attrition Target Business Rule

Validates that LeaveOrNot (target column) contains only valid values (0 or 1)
when the column is present.
"""

import pandas as pd

from .base_rule import BaseRule
from ..result import ValidationResult


class AttritionRule(BaseRule):
    """
    Validates the target column for attrition prediction.

    This rule only applies when LeaveOrNot is present in the dataset.
    The target column is required for training but not for inference.
    """

    VALID_VALUES = {0, 1}

    def validate(
        self,
        data: pd.DataFrame,
        result: ValidationResult
    ) -> None:

        if "LeaveOrNot" not in data.columns:
            return

        invalid = data[
            ~data["LeaveOrNot"].isin(self.VALID_VALUES)
        ]

        if not invalid.empty:
            result.add_error(
                f"{len(invalid)} rows have invalid LeaveOrNot value. "
                f"Expected 0 or 1."
            )
