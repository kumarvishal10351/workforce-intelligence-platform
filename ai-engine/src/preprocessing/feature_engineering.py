"""
Feature Engineering Module

Responsible for creating new features before preprocessing.

Author: Vishal Kumar Kashyap
"""

from datetime import datetime

import pandas as pd


class FeatureEngineer:
    """
    Creates additional features for model training.
    """

    def transform(
        self,
        data: pd.DataFrame
    ) -> pd.DataFrame:

        df = data.copy()

        current_year = datetime.now().year

        df["YearsAtCompany"] = (
            current_year - df["JoiningYear"]
        )

        df.drop(
            columns=["JoiningYear"],
            inplace=True
        )

        return df