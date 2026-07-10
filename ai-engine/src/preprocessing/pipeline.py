"""
Preprocessing Pipeline

Responsible for transforming raw features into model-ready data.
"""

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import (
    OneHotEncoder,
    StandardScaler,
)


class PreprocessingPipeline:

    def build(self):

        numeric_features = [
            "Age",
            "ExperienceInCurrentDomain",
            "YearsAtCompany",
        ]

        categorical_features = [
            "Education",
            "City",
            "Gender",
            "EverBenched",
        ]

        preprocessor = ColumnTransformer(

            transformers=[

                (
                    "num",
                    StandardScaler(),
                    numeric_features,
                ),

                (
                    "cat",
                    OneHotEncoder(
                        handle_unknown="ignore"
                    ),
                    categorical_features,
                ),

            ],

            remainder="passthrough",
        )

        return preprocessor