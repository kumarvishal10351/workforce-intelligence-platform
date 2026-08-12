"""
Inference Predictor

Receives validated employee data, applies saved feature engineering
and preprocessing, generates predictions, risk categories,
and triggers explainability + recommendations.

Author: Vishal Kumar Kashyap
Project: Workforce Intelligence Platform
"""

from pathlib import Path
from typing import Optional

import joblib
import numpy as np
import pandas as pd

from config.settings import MODEL_DIR, CURRENT_YEAR
from preprocessing.feature_engineering import FeatureEngineer
from recommendation.engine import RecommendationEngine


# Risk thresholds (product defaults)
RISK_THRESHOLDS = {
    "Low": (0.0, 0.30),
    "Medium": (0.31, 0.60),
    "High": (0.61, 1.00),
}


def classify_risk(probability: float) -> str:
    """
    Convert a probability into a risk category.

    Parameters
    ----------
    probability : float
        Attrition probability from 0.0 to 1.0.

    Returns
    -------
    str
        Risk level: 'Low', 'Medium', or 'High'.
    """
    if probability <= 0.30:
        return "Low"
    elif probability <= 0.60:
        return "Medium"
    else:
        return "High"


class Predictor:
    """
    Production inference service for employee attrition prediction.

    Loads a saved pipeline artifact and applies consistent
    feature engineering + preprocessing + model prediction.
    """

    def __init__(
        self,
        pipeline_path: Optional[Path] = None,
        reference_year: int = CURRENT_YEAR,
    ):
        """
        Parameters
        ----------
        pipeline_path : Path, optional
            Path to the saved pipeline artifact (.pkl).
            Defaults to MODEL_DIR / 'employee_attrition_pipeline.pkl'.
        reference_year : int
            Reference year for feature engineering.
        """

        if pipeline_path is None:
            pipeline_path = MODEL_DIR / "employee_attrition_pipeline.pkl"

        self.pipeline_path = Path(pipeline_path)
        self.reference_year = reference_year
        self.pipeline = None
        self.feature_engineer = FeatureEngineer(
            reference_year=reference_year
        )
        self.recommendation_engine = RecommendationEngine()

    def load(self) -> None:
        """Load the saved pipeline artifact."""

        if not self.pipeline_path.exists():
            raise FileNotFoundError(
                f"Model pipeline not found: {self.pipeline_path}"
            )

        self.pipeline = joblib.load(self.pipeline_path)

    def predict_single(self, employee_data: dict) -> dict:
        """
        Predict attrition risk for a single employee.

        Parameters
        ----------
        employee_data : dict
            Employee features as key-value pairs.

        Returns
        -------
        dict
            Prediction result with risk probability, level,
            and recommendations.
        """

        if self.pipeline is None:
            self.load()

        df = pd.DataFrame([employee_data])
        df = self.feature_engineer.transform(df)

        probability = float(
            self.pipeline.predict_proba(df)[:, 1][0]
        )
        risk_level = classify_risk(probability)

        recommendations = self.recommendation_engine.generate(
            risk_level=risk_level,
            risk_probability=probability,
        )

        return {
            "risk_probability": round(probability, 4),
            "risk_level": risk_level,
            "recommendations": recommendations,
        }

    def predict_batch(self, data: pd.DataFrame) -> list[dict]:
        """
        Predict attrition risk for multiple employees.

        Parameters
        ----------
        data : pd.DataFrame
            DataFrame with employee features.

        Returns
        -------
        list[dict]
            List of prediction results for each employee.
        """

        if self.pipeline is None:
            self.load()

        df = self.feature_engineer.transform(data)

        probabilities = self.pipeline.predict_proba(df)[:, 1]

        results = []
        for i, prob in enumerate(probabilities):
            probability = float(prob)
            risk_level = classify_risk(probability)

            recommendations = self.recommendation_engine.generate(
                risk_level=risk_level,
                risk_probability=probability,
            )

            results.append({
                "index": i,
                "risk_probability": round(probability, 4),
                "risk_level": risk_level,
                "recommendations": recommendations,
            })

        return results
