"""
Prediction Service

Orchestrates ML prediction by calling the AI engine's inference predictor.
Keeps ML logic out of FastAPI route handlers.

Author: Vishal Kumar Kashyap
Project: Workforce Intelligence Platform
"""

import sys
from pathlib import Path
from typing import Optional

import pandas as pd

from app.core.config import MODEL_PIPELINE_PATH, AI_ENGINE_SRC

# Ensure ai-engine is importable
if str(AI_ENGINE_SRC) not in sys.path:
    sys.path.insert(0, str(AI_ENGINE_SRC))

from inference.predictor import Predictor


class PredictionService:
    """
    Service layer for attrition prediction.

    Wraps the AI engine's Predictor and provides
    methods for single and bulk prediction.
    """

    def __init__(self):
        self._predictor = None

    def _get_predictor(self) -> Predictor:
        """Lazy-load the prediction pipeline."""
        if self._predictor is None:
            self._predictor = Predictor(
                pipeline_path=MODEL_PIPELINE_PATH
            )
            self._predictor.load()
        return self._predictor

    @property
    def is_loaded(self) -> bool:
        """Check if the model pipeline is loaded."""
        return self._predictor is not None

    def predict_single(self, employee_data: dict) -> dict:
        """
        Predict attrition risk for one employee.

        Parameters
        ----------
        employee_data : dict
            Employee features.

        Returns
        -------
        dict
            Prediction result.
        """
        predictor = self._get_predictor()
        return predictor.predict_single(employee_data)

    def predict_batch(self, data: pd.DataFrame) -> dict:
        """
        Predict attrition risk for multiple employees.

        Parameters
        ----------
        data : pd.DataFrame
            Employee features DataFrame.

        Returns
        -------
        dict
            Bulk prediction results with summary counts.
        """
        predictor = self._get_predictor()
        results = predictor.predict_batch(data)

        high = sum(1 for r in results if r["risk_level"] == "High")
        medium = sum(1 for r in results if r["risk_level"] == "Medium")
        low = sum(1 for r in results if r["risk_level"] == "Low")

        return {
            "total_employees": len(results),
            "high_risk_count": high,
            "medium_risk_count": medium,
            "low_risk_count": low,
            "results": results,
        }


# Singleton instance
prediction_service = PredictionService()
