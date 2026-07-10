"""
Base class for all validators.
"""

from abc import ABC, abstractmethod
import pandas as pd

from .result import ValidationResult


class BaseValidator(ABC):
    """
    Abstract base class for every validator.
    """

    @abstractmethod
    def validate(self, data) -> ValidationResult:
        """
        Validate the given input.

        Every child validator must implement this method.
        """
        pass