"""
Validation Pipeline

Orchestrates all validators in sequence:
File → Column → DataType → BusinessRule

Reports all errors at once rather than stopping at the first error.

Author: Vishal Kumar Kashyap
Project: Workforce Intelligence Platform
"""

from pathlib import Path
from typing import Optional

import pandas as pd

from .result import ValidationResult
from .validators.file_validator import FileValidator
from .validators.column_validator import ColumnValidator
from .validators.datatype_validator import DataTypeValidator
from .validators.business_rule_validator import BusinessRuleValidator
from .rules.age_rule import AgeRule
from .rules.experience_rule import ExperienceRule
from .rules.payment_tier_rule import PaymentTierRule
from .rules.ever_benched_rule import EverBenchedRule
from .rules.attrition_rule import AttritionRule
from .rules.joining_year_rule import JoiningYearRule


# Required columns for the employee dataset
REQUIRED_COLUMNS_TRAINING = [
    "Education",
    "JoiningYear",
    "City",
    "PaymentTier",
    "Age",
    "Gender",
    "EverBenched",
    "ExperienceInCurrentDomain",
    "LeaveOrNot",
]

REQUIRED_COLUMNS_INFERENCE = [
    "Education",
    "JoiningYear",
    "City",
    "PaymentTier",
    "Age",
    "Gender",
    "EverBenched",
    "ExperienceInCurrentDomain",
]

# Expected data types for validation
EXPECTED_TYPES = {
    "JoiningYear": "int64",
    "PaymentTier": "int64",
    "Age": "int64",
    "ExperienceInCurrentDomain": "int64",
}


class ValidationPipeline:
    """
    Orchestrates the complete validation process for employee data.

    Runs validators in sequence, collecting all errors and warnings
    into a single aggregated result.
    """

    def __init__(self, mode: str = "training"):
        """
        Parameters
        ----------
        mode : str
            Either 'training' or 'inference'.
            Training requires the target column (LeaveOrNot).
        """
        if mode not in ("training", "inference"):
            raise ValueError(
                f"Invalid mode '{mode}'. Use 'training' or 'inference'."
            )
        self.mode = mode

    def run(
        self,
        file_path: str | Path,
        data: Optional[pd.DataFrame] = None,
    ) -> ValidationResult:
        """
        Execute the full validation pipeline.

        Parameters
        ----------
        file_path : str | Path
            Path to the CSV file.
        data : pd.DataFrame, optional
            Pre-loaded DataFrame. If None, only file validation runs.

        Returns
        -------
        ValidationResult
            Aggregated result from all validators.
        """

        result = ValidationResult()

        # Step 1: File validation
        file_result = FileValidator().validate(file_path)
        self._merge(result, file_result)

        if not file_result.is_valid:
            return result

        # If no data provided, stop after file validation
        if data is None:
            return result

        # Step 2: Column validation
        required = (
            REQUIRED_COLUMNS_TRAINING
            if self.mode == "training"
            else REQUIRED_COLUMNS_INFERENCE
        )
        column_result = ColumnValidator(required).validate(data)
        self._merge(result, column_result)

        if not column_result.is_valid:
            return result

        # Step 3: Data type validation
        expected_types = EXPECTED_TYPES.copy()
        if self.mode == "training":
            expected_types["LeaveOrNot"] = "int64"

        # Only validate columns that exist
        types_to_check = {
            col: dtype
            for col, dtype in expected_types.items()
            if col in data.columns
        }
        dtype_result = DataTypeValidator(types_to_check).validate(data)
        self._merge(result, dtype_result)

        # Step 4: Business rule validation
        rules = [
            AgeRule(),
            ExperienceRule(),
            PaymentTierRule(),
            EverBenchedRule(),
            JoiningYearRule(),
        ]

        if self.mode == "training":
            rules.append(AttritionRule())

        business_result = BusinessRuleValidator(rules).validate(data)
        self._merge(result, business_result)

        return result

    @staticmethod
    def _merge(
        target: ValidationResult,
        source: ValidationResult,
    ) -> None:
        """Merge source result into target result."""
        target.errors.extend(source.errors)
        target.warnings.extend(source.warnings)
        if not source.is_valid:
            target.is_valid = False
