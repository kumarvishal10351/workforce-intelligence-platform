"""
EverBenched Business Rule

Validates that EverBenched contains only supported values.
"""

import pandas as pd

from .base_rule import BaseRule
from ..result import ValidationResult


class EverBenchedRule(BaseRule):
    """
    Validates employee bench status values.
    """

    VALID_VALUES = {"Yes", "No"}

    def validate(
        self,
        data: pd.DataFrame,
        result: ValidationResult
    ) -> None:

        if "EverBenched" not in data.columns:
            return

        invalid = data[
            ~data["EverBenched"].isin(self.VALID_VALUES)
        ]

        if not invalid.empty:
            result.add_error(
                f"{len(invalid)} employees have invalid EverBenched value. "
                f"Supported values: {sorted(self.VALID_VALUES)}."
            )
