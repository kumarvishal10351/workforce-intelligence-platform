"""
Dataset Schema

Defines the structure of the employee dataset.
"""

TARGET_COLUMN = "LeaveOrNot"

NUMERIC_COLUMNS = [
    "Age",
    "ExperienceInCurrentDomain",
]

CATEGORICAL_COLUMNS = [
    "Education",
    "City",
    "Gender",
    "EverBenched",
]

ORDINAL_COLUMNS = [
    "PaymentTier",
]

FEATURE_ENGINEERING_COLUMNS = [
    "JoiningYear",
]