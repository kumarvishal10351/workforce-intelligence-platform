"""
Model Trainer

Trains multiple classification models for employee attrition prediction.
Saves the best model + preprocessing pipeline as a combined artifact.

Author: Vishal Kumar Kashyap
Project: Workforce Intelligence Platform
"""

import joblib
from pathlib import Path
from typing import Optional

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import (
    RandomForestClassifier,
    GradientBoostingClassifier,
)
from sklearn.pipeline import Pipeline

from config.settings import MODEL_DIR, RANDOM_STATE


# Default candidate models for benchmarking
DEFAULT_MODELS = {
    "logistic_regression": LogisticRegression(
        random_state=RANDOM_STATE,
        max_iter=1000,
        class_weight="balanced",
    ),
    "decision_tree": DecisionTreeClassifier(
        random_state=RANDOM_STATE,
        class_weight="balanced",
    ),
    "random_forest": RandomForestClassifier(
        random_state=RANDOM_STATE,
        n_estimators=100,
        class_weight="balanced",
    ),
    "gradient_boosting": GradientBoostingClassifier(
        random_state=RANDOM_STATE,
        n_estimators=100,
    ),
}


class ModelTrainer:
    """
    Trains and saves ML models for attrition prediction.

    Supports training multiple candidate models for comparison,
    then saving the selected model with its preprocessing pipeline.
    """

    def __init__(
        self,
        models: Optional[dict] = None,
        output_dir: Path = MODEL_DIR,
    ):
        """
        Parameters
        ----------
        models : dict, optional
            Dictionary of {name: sklearn estimator}.
            Defaults to logistic regression, decision tree,
            random forest, and gradient boosting.
        output_dir : Path
            Directory to save model artifacts.
        """
        self.models = models or DEFAULT_MODELS
        self.output_dir = Path(output_dir)
        self.trained_models = {}

    def train_all(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
    ) -> dict:
        """
        Train all candidate models.

        Parameters
        ----------
        X_train : np.ndarray
            Preprocessed training features.
        y_train : np.ndarray
            Training target values.

        Returns
        -------
        dict
            Dictionary of {name: fitted model}.
        """

        self.trained_models = {}

        for name, model in self.models.items():
            model.fit(X_train, y_train)
            self.trained_models[name] = model

        return self.trained_models

    def save_pipeline(
        self,
        preprocessor,
        model,
        filename: str = "employee_attrition_pipeline.pkl",
    ) -> Path:
        """
        Save the preprocessing pipeline + model as a combined artifact.

        Parameters
        ----------
        preprocessor : ColumnTransformer
            Fitted preprocessing transformer.
        model : estimator
            Fitted classification model.
        filename : str
            Output filename for the saved pipeline.

        Returns
        -------
        Path
            Path to the saved artifact.
        """

        pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("classifier", model),
        ])

        self.output_dir.mkdir(parents=True, exist_ok=True)
        artifact_path = self.output_dir / filename

        joblib.dump(pipeline, artifact_path)

        return artifact_path

    def load_pipeline(
        self,
        filename: str = "employee_attrition_pipeline.pkl",
    ) -> Pipeline:
        """
        Load a saved pipeline artifact.

        Parameters
        ----------
        filename : str
            Filename of the saved pipeline.

        Returns
        -------
        Pipeline
            Loaded sklearn Pipeline.
        """

        artifact_path = self.output_dir / filename

        if not artifact_path.exists():
            raise FileNotFoundError(
                f"Model artifact not found: {artifact_path}"
            )

        return joblib.load(artifact_path)
