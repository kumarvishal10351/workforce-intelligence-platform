"""
Model Selection

Selects the best model from evaluation results and supports
hyperparameter tuning via GridSearchCV or RandomizedSearchCV.

Author: Vishal Kumar Kashyap
Project: Workforce Intelligence Platform
"""

from typing import Optional

import numpy as np
from sklearn.model_selection import (
    GridSearchCV,
    RandomizedSearchCV,
)

from config.settings import RANDOM_STATE


class ModelSelector:
    """
    Selects the best model based on evaluation metrics
    and supports hyperparameter tuning.
    """

    @staticmethod
    def select_best(
        evaluation_results: list[dict],
        metric: str = "f1_score",
    ) -> dict:
        """
        Select the best model from evaluation results.

        Parameters
        ----------
        evaluation_results : list[dict]
            Results from ModelEvaluator.evaluate_all().
        metric : str
            Metric to use for selection. Default: f1_score.

        Returns
        -------
        dict
            Evaluation result of the best model.
        """

        if not evaluation_results:
            raise ValueError("No evaluation results to select from.")

        best = max(
            evaluation_results,
            key=lambda x: x.get(metric, 0) or 0,
        )

        return best

    @staticmethod
    def tune_hyperparameters(
        model,
        param_grid: dict,
        X_train: np.ndarray,
        y_train: np.ndarray,
        method: str = "grid",
        cv: int = 5,
        scoring: str = "f1",
        n_iter: int = 20,
    ):
        """
        Tune hyperparameters using cross-validation on training data.

        Parameters
        ----------
        model : estimator
            Sklearn classifier to tune.
        param_grid : dict
            Parameter search space.
        X_train : np.ndarray
            Training features.
        y_train : np.ndarray
            Training labels.
        method : str
            'grid' for GridSearchCV, 'random' for RandomizedSearchCV.
        cv : int
            Number of cross-validation folds.
        scoring : str
            Scoring metric for cross-validation.
        n_iter : int
            Number of iterations for RandomizedSearchCV.

        Returns
        -------
        tuple
            (best_estimator, best_params, best_score)
        """

        if method == "grid":
            search = GridSearchCV(
                estimator=model,
                param_grid=param_grid,
                cv=cv,
                scoring=scoring,
                n_jobs=-1,
            )
        elif method == "random":
            search = RandomizedSearchCV(
                estimator=model,
                param_distributions=param_grid,
                n_iter=n_iter,
                cv=cv,
                scoring=scoring,
                n_jobs=-1,
                random_state=RANDOM_STATE,
            )
        else:
            raise ValueError(
                f"Unknown tuning method '{method}'. Use 'grid' or 'random'."
            )

        search.fit(X_train, y_train)

        return (
            search.best_estimator_,
            search.best_params_,
            search.best_score_,
        )
