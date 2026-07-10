import pandas as pd

from .base_rule import BaseRule
from ..result import ValidationResult


class AgeRule(BaseRule):
    """
    Validates employee age.
    """

    def validate(
        self,
        data: pd.DataFrame,
        result: ValidationResult
    ) -> None:

        invalid = data[
            (data["Age"] < 18) |
            (data["Age"] > 70)
        ]

        if not invalid.empty:

            result.add_error(
                f"{len(invalid)} employees have invalid age."
            )