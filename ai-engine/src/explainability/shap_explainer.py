"""
SHAP Explainability Module

Provides model explanations using SHAP (SHapley Additive exPlanations).
Explains individual predictions and global feature importance.

SHAP explains model behavior / feature contribution.
It does NOT prove causation.

Author: Vishal Kumar Kashyap
Project: Workforce Intelligence Platform
"""

from typing import Optional

import numpy as np
import shap


class ShapExplainer:
    """
    Generates SHAP-based explanations for attrition predictions.

    Supports:
    - Individual prediction explanations (per-employee)
    - Global feature importance
    - Top factors increasing / reducing risk
    """

    def __init__(self, model, feature_names: list[str]):
        """
        Parameters
        ----------
        model : estimator
            Fitted classifier (tree-based or linear).
        feature_names : list[str]
            Names of the features used by the model.
        """
        self.model = model
        self.feature_names = feature_names
        self._explainer = None
        self._shap_values = None

    def _create_explainer(self, X_background: Optional[np.ndarray] = None):
        """Create appropriate SHAP explainer based on model type."""

        if self._explainer is not None:
            return

        # Tree-based models use TreeExplainer (fast)
        if hasattr(self.model, "estimators_") or hasattr(self.model, "tree_"):
            self._explainer = shap.TreeExplainer(self.model)
        else:
            # Linear / other models use KernelExplainer
            if X_background is None:
                raise ValueError(
                    "X_background required for non-tree models."
                )
            self._explainer = shap.KernelExplainer(
                self.model.predict_proba,
                X_background,
            )

    def explain_instance(
        self,
        X_instance: np.ndarray,
        X_background: Optional[np.ndarray] = None,
    ) -> dict:
        """
        Explain a single prediction.

        Parameters
        ----------
        X_instance : np.ndarray
            Single preprocessed employee feature vector (1D or 2D).
        X_background : np.ndarray, optional
            Background data for KernelExplainer.

        Returns
        -------
        dict
            Explanation with top increasing/reducing risk factors.
        """

        self._create_explainer(X_background)

        if X_instance.ndim == 1:
            X_instance = X_instance.reshape(1, -1)

        shap_values = self._explainer.shap_values(X_instance)

        # For binary classification, take positive class values
        if isinstance(shap_values, list):
            values = shap_values[1][0]
        elif shap_values.ndim == 3:
            values = shap_values[0, :, 1]
        else:
            values = shap_values[0]

        # Map feature names to SHAP values
        feature_impacts = list(zip(self.feature_names, values))
        feature_impacts.sort(key=lambda x: abs(x[1]), reverse=True)

        increasing_risk = [
            {"feature": name, "impact": float(val)}
            for name, val in feature_impacts
            if val > 0
        ]

        reducing_risk = [
            {"feature": name, "impact": float(val)}
            for name, val in feature_impacts
            if val < 0
        ]

        return {
            "increasing_risk": increasing_risk,
            "reducing_risk": reducing_risk,
            "all_factors": [
                {"feature": name, "impact": float(val)}
                for name, val in feature_impacts
            ],
        }

    def global_importance(
        self,
        X_data: np.ndarray,
        X_background: Optional[np.ndarray] = None,
    ) -> list[dict]:
        """
        Compute global feature importance using mean |SHAP| values.

        Parameters
        ----------
        X_data : np.ndarray
            Dataset to compute global importance over.
        X_background : np.ndarray, optional
            Background data for KernelExplainer.

        Returns
        -------
        list[dict]
            Sorted list of features with their mean absolute SHAP value.
        """

        self._create_explainer(X_background)

        shap_values = self._explainer.shap_values(X_data)

        if isinstance(shap_values, list):
            values = shap_values[1]
        elif shap_values.ndim == 3:
            values = shap_values[:, :, 1]
        else:
            values = shap_values

        mean_abs = np.mean(np.abs(values), axis=0)

        importance = [
            {"feature": name, "importance": float(val)}
            for name, val in zip(self.feature_names, mean_abs)
        ]

        importance.sort(key=lambda x: x["importance"], reverse=True)

        return importance
