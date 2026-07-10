"""
Data Splitter Module

Responsible for splitting datasets into training and testing sets.

Author: Vishal Kumar Kashyap
Project: Workforce Intelligence Platform
"""

from sklearn.model_selection import train_test_split
import pandas as pd


class DataSplitter:
    """
    Splits a dataset into train and test sets.
    """

    def __init__(
        self,
        target_column: str,
        test_size: float = 0.2,
        random_state: int = 42,
        stratify: bool = True,
    ):
        self.target_column = target_column
        self.test_size = test_size
        self.random_state = random_state
        self.stratify = stratify

    def split(self, data: pd.DataFrame):
        """
        Split dataset into train and test sets.
        """

        # Check target column exists
        if self.target_column not in data.columns:
            raise ValueError(
                f"Target column '{self.target_column}' not found."
            )

        X = data.drop(columns=[self.target_column])

        y = data[self.target_column]

        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=self.test_size,
            random_state=self.random_state,
            stratify=y if self.stratify else None,
        )

        return X_train, X_test, y_train, y_test