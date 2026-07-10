"""
Application Settings

This module stores configurable values used throughout the application.
"""

from pathlib import Path

# -------------------------------
# Project Paths
# -------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

DATASET_DIR = PROJECT_ROOT / "datasets"

ARTIFACT_DIR = PROJECT_ROOT / "artifacts"

MODEL_DIR = ARTIFACT_DIR / "models"

LOG_DIR = PROJECT_ROOT / "logs"

# -------------------------------
# Dataset Settings
# -------------------------------

TARGET_COLUMN = "LeaveOrNot"

TEST_SIZE = 0.20

RANDOM_STATE = 42

CURRENT_YEAR = 2026

SUPPORTED_EXTENSIONS = {".csv"}

# -------------------------------
# Model Settings
# -------------------------------

MODEL_NAME = "employee_attrition_model.pkl"

PIPELINE_NAME = "preprocessing_pipeline.pkl"