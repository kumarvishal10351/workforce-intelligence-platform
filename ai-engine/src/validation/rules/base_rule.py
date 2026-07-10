"""
Abstract base class for business validation rules.
"""

from abc import ABC, abstractmethod
import pandas as pd

from ..result import ValidationResult


class BaseRule(ABC):
    """
    Every business rule must implement validate().
    """

    @abstractmethod
    def validate(
        self,
        data: pd.DataFrame,
        result: ValidationResult
    ) -> None:
        """
        Validate the dataset.

        Updates the ValidationResult object.
        """
        pass