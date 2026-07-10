"""
Stores the result of a validation process.
"""

from dataclasses import dataclass, field
from typing import List


@dataclass
class ValidationResult:
    """
    Represents the outcome of a validation process.
    """

    is_valid: bool = True

    errors: List[str] = field(default_factory=list)

    warnings: List[str] = field(default_factory=list)

    def add_error(self, message: str) -> None:
        """
        Add an error and mark validation as failed.
        """
        self.errors.append(message)
        self.is_valid = False

    def add_warning(self, message: str) -> None:
        """
        Add a warning without failing validation.
        """
        self.warnings.append(message)