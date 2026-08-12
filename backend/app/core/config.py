"""
Backend Configuration

Centralized settings for the FastAPI application.
"""

import os
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Project paths
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
PROJECT_ROOT = BACKEND_DIR.parent

# AI Engine path — add to sys.path for imports
AI_ENGINE_SRC = PROJECT_ROOT / "ai-engine" / "src"
if str(AI_ENGINE_SRC) not in sys.path:
    sys.path.insert(0, str(AI_ENGINE_SRC))

# Model artifact
MODEL_PIPELINE_PATH = (
    PROJECT_ROOT / "ai-engine" / "artifacts" / "models"
    / "employee_attrition_pipeline.pkl"
)

# Dataset for validation reference
DATASET_DIR = PROJECT_ROOT / "ai-engine" / "datasets"

# Upload settings
UPLOAD_DIR = PROJECT_ROOT / "data" / "raw"
MAX_UPLOAD_SIZE_MB = 50
SUPPORTED_EXTENSIONS = {".csv"}

# CORS
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173"
).split(",")

# API
API_V1_PREFIX = "/api/v1"
