"""
Feature Engineering Module

Responsible for creating new features before preprocessing.

Author: Vishal Kumar Kashyap
"""

import pandas as pd

from config.settings import CURRENT_YEAR


class FeatureEngineer:
    """
    Creates additional features for model training.

    Parameters
    ----------
    reference_year : int, optional
        The year used to compute YearsAtCompany.
        Defaults to CURRENT_YEAR from application settings.
        Must remain consistent between training and inference.
    """

    def __init__(self, reference_year: int = CURRENT_YEAR):
        self.reference_year = reference_year

    def transform(
        self,
        data: pd.DataFrame
    ) -> pd.DataFrame:
        """
        Create engineered features from raw data.

        Transformations
        ---------------
        JoiningYear → YearsAtCompany (reference_year - JoiningYear)

        Parameters
        ----------
        data : pd.DataFrame
            Raw dataset containing a 'JoiningYear' column.

        Returns
        -------
        pd.DataFrame
            Dataset with 'JearsAtCompany' added and 'JoiningYear' removed.
        """

        df = data.copy()

        df["YearsAtCompany"] = (
            self.reference_year - df["JoiningYear"]
        )

        df.drop(
            columns=["JoiningYear"],
            inplace=True
        )

        return df