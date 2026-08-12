"""
Experience Business Rule

Validates that ExperienceInCurrentDomain is not negative.
"""

import pandas as pd

from .base_rule import BaseRule
from ..result import ValidationResult


class ExperienceRule(BaseRule):
    """
    Validates employee experience values.
    """

    def validate(
        self,
        data: pd.DataFrame,
        result: ValidationResult
    ) -> None:

        if "ExperienceInCurrentDomain" not in data.columns:
            return

        invalid = data[
            data["ExperienceInCurrentDomain"] < 0
        ]

        if not invalid.empty:
            result.add_error(
                f"{len(invalid)} employees have negative experience."
            )
