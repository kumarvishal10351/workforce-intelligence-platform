"""
JoiningYear Business Rule

Validates that JoiningYear contains reasonable values.
"""

import pandas as pd

from .base_rule import BaseRule
from ..result import ValidationResult


class JoiningYearRule(BaseRule):
    """
    Validates employee joining year values.
    """

    MIN_YEAR = 1970
    MAX_YEAR = 2030

    def validate(
        self,
        data: pd.DataFrame,
        result: ValidationResult
    ) -> None:

        if "JoiningYear" not in data.columns:
            return

        invalid = data[
            (data["JoiningYear"] < self.MIN_YEAR) |
            (data["JoiningYear"] > self.MAX_YEAR)
        ]

        if not invalid.empty:
            result.add_error(
                f"{len(invalid)} employees have invalid JoiningYear. "
                f"Expected range: {self.MIN_YEAR}–{self.MAX_YEAR}."
            )
