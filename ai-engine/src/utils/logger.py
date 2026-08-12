"""
Centralized Logging Utility

Provides a configured logger for the Workforce Intelligence Platform.
All modules should use get_logger() to obtain a logger instance.

Never log passwords, API keys, or unnecessary sensitive employee data.

Author: Vishal Kumar Kashyap
Project: Workforce Intelligence Platform
"""

import logging
import sys
from pathlib import Path

from config.settings import LOG_DIR


def get_logger(
    name: str,
    level: int = logging.INFO,
    log_to_file: bool = False,
) -> logging.Logger:
    """
    Create and return a configured logger.

    Parameters
    ----------
    name : str
        Name of the logger (typically __name__).
    level : int, optional
        Logging level. Defaults to INFO.
    log_to_file : bool, optional
        If True, also writes logs to a file in LOG_DIR.

    Returns
    -------
    logging.Logger
        Configured logger instance.
    """

    logger = logging.getLogger(name)

    if logger.handlers:
        return logger

    logger.setLevel(level)

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # File handler (optional)
    if log_to_file:
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        file_handler = logging.FileHandler(
            LOG_DIR / f"{name}.log",
            encoding="utf-8",
        )
        file_handler.setLevel(level)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    logger.propagate = False

    return logger
