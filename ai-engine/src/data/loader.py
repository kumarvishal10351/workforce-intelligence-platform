"""
Data Loader Module

This module provides a reusable class responsible for loading datasets
from disk. It performs basic file validation before reading the dataset.

Author: Vishal Kumar Kashyap
Project: Workforce Intelligence Platform
"""

from pathlib import Path

import pandas as pd


class DataLoader:
    """
    Responsible for loading datasets from disk.

    Responsibilities
    ----------------
    - Check whether the file exists.
    - Verify the file extension.
    - Load CSV datasets.
    """

    SUPPORTED_EXTENSIONS = {".csv"}

    def load(self, file_path: str | Path) -> pd.DataFrame:
        """
        Load a dataset from disk.

        Parameters
        ----------
        file_path : str | Path
            Path to the dataset.

        Returns
        -------
        pd.DataFrame
            Loaded dataset.

        Raises
        ------
        FileNotFoundError
            If the file does not exist.

        ValueError
            If the file extension is not supported.

        pd.errors.EmptyDataError
            If the CSV file is empty.
        """

        path = Path(file_path)

        # Check file exists
        if not path.exists():
            raise FileNotFoundError(
                f"Dataset not found: {path}"
            )

        # Check file extension
        if path.suffix.lower() not in self.SUPPORTED_EXTENSIONS:
            raise ValueError(
                f"Unsupported file format '{path.suffix}'. "
                f"Supported formats: {self.SUPPORTED_EXTENSIONS}"
            )

        # Load CSV
        return pd.read_csv(path)