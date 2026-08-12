"""
PaymentTier Business Rule

Validates that PaymentTier contains only supported values (1, 2, 3).
"""

import pandas as pd

from .base_rule import BaseRule
from ..result import ValidationResult


class PaymentTierRule(BaseRule):
    """
    Validates employee payment tier values.
    """

    VALID_TIERS = {1, 2, 3}

    def validate(
        self,
        data: pd.DataFrame,
        result: ValidationResult
    ) -> None:

        if "PaymentTier" not in data.columns:
            return

        invalid = data[
            ~data["PaymentTier"].isin(self.VALID_TIERS)
        ]

        if not invalid.empty:
            result.add_error(
                f"{len(invalid)} employees have invalid PaymentTier. "
                f"Supported values: {sorted(self.VALID_TIERS)}."
            )
