"""
Model Evaluator

Computes classification metrics for trained models.
Supports comparison across multiple models to aid selection.

Author: Vishal Kumar Kashyap
Project: Workforce Intelligence Platform
"""

from typing import Optional

import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
)


class ModelEvaluator:
    """
    Evaluates classification models using standard metrics.

    Metrics tracked:
    - Accuracy
    - Precision (positive class)
    - Recall (positive class)
    - F1-score (positive class)
    - ROC-AUC
    - Confusion matrix
    """

    def evaluate(
        self,
        model,
        X_test: np.ndarray,
        y_test: np.ndarray,
        model_name: str = "model",
    ) -> dict:
        """
        Evaluate a single model on test data.

        Parameters
        ----------
        model : estimator
            Fitted classifier with predict and predict_proba methods.
        X_test : np.ndarray
            Preprocessed test features.
        y_test : np.ndarray
            True test labels.
        model_name : str
            Name identifier for the model.

        Returns
        -------
        dict
            Dictionary containing all computed metrics.
        """

        y_pred = model.predict(X_test)

        # Get probabilities for ROC-AUC
        y_proba = None
        if hasattr(model, "predict_proba"):
            y_proba = model.predict_proba(X_test)[:, 1]

        metrics = {
            "model_name": model_name,
            "accuracy": accuracy_score(y_test, y_pred),
            "precision": precision_score(
                y_test, y_pred, zero_division=0
            ),
            "recall": recall_score(
                y_test, y_pred, zero_division=0
            ),
            "f1_score": f1_score(
                y_test, y_pred, zero_division=0
            ),
            "confusion_matrix": confusion_matrix(
                y_test, y_pred
            ).tolist(),
        }

        if y_proba is not None:
            metrics["roc_auc"] = roc_auc_score(y_test, y_proba)
        else:
            metrics["roc_auc"] = None

        return metrics

    def evaluate_all(
        self,
        trained_models: dict,
        X_test: np.ndarray,
        y_test: np.ndarray,
    ) -> list[dict]:
        """
        Evaluate all candidate models and return sorted results.

        Parameters
        ----------
        trained_models : dict
            Dictionary of {name: fitted model}.
        X_test : np.ndarray
            Preprocessed test features.
        y_test : np.ndarray
            True test labels.

        Returns
        -------
        list[dict]
            List of evaluation results sorted by F1-score descending.
        """

        results = []

        for name, model in trained_models.items():
            metrics = self.evaluate(model, X_test, y_test, name)
            results.append(metrics)

        # Sort by F1-score (balances precision and recall for attrition)
        results.sort(key=lambda x: x["f1_score"], reverse=True)

        return results

    @staticmethod
    def print_results(results: list[dict]) -> None:
        """Print formatted evaluation results."""

        print(f"\n{'Model':<25} {'Accuracy':>10} {'Precision':>10} "
              f"{'Recall':>10} {'F1':>10} {'ROC-AUC':>10}")
        print("-" * 77)

        for r in results:
            roc = f"{r['roc_auc']:.4f}" if r["roc_auc"] else "N/A"
            print(
                f"{r['model_name']:<25} "
                f"{r['accuracy']:>10.4f} "
                f"{r['precision']:>10.4f} "
                f"{r['recall']:>10.4f} "
                f"{r['f1_score']:>10.4f} "
                f"{roc:>10}"
            )

        print()
