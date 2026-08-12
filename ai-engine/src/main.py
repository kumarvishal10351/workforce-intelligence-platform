"""
Workforce Intelligence Platform — AI Engine Main

Complete ML training pipeline:
1. Load dataset
2. Validate data
3. Feature engineering
4. Train/test split
5. Preprocessing
6. Train candidate models
7. Evaluate all models
8. Select best model
9. Save combined pipeline artifact

Author: Vishal Kumar Kashyap
Project: Workforce Intelligence Platform
"""

from pathlib import Path

from data.loader import DataLoader
from data.splitter import DataSplitter
from preprocessing.feature_engineering import FeatureEngineer
from preprocessing.pipeline import PreprocessingPipeline
from training.trainer import ModelTrainer
from training.evaluator import ModelEvaluator
from training.model_selection import ModelSelector
from validation.pipeline import ValidationPipeline
from utils.logger import get_logger
from config.settings import TARGET_COLUMN, CURRENT_YEAR

logger = get_logger("main")


def main():
    """Run the complete ML training pipeline."""

    logger.info("=" * 60)
    logger.info("Workforce Intelligence Platform — Training Pipeline")
    logger.info("=" * 60)

    project_root = Path(__file__).resolve().parent.parent
    dataset_path = project_root / "datasets" / "employee.csv"

    # --------------------------------------------------
    # Step 1: Load dataset
    # --------------------------------------------------
    logger.info("Step 1: Loading dataset...")
    loader = DataLoader()
    df = loader.load(dataset_path)
    logger.info(f"  Loaded {len(df)} rows, {len(df.columns)} columns")

    # --------------------------------------------------
    # Step 2: Validate data
    # --------------------------------------------------
    logger.info("Step 2: Validating data...")
    validator = ValidationPipeline(mode="training")
    validation_result = validator.run(dataset_path, df)

    if not validation_result.is_valid:
        logger.error("  Validation FAILED:")
        for error in validation_result.errors:
            logger.error(f"    - {error}")
        raise ValueError("Dataset validation failed. Fix errors before training.")

    if validation_result.warnings:
        for warning in validation_result.warnings:
            logger.warning(f"    - {warning}")

    logger.info("  Validation passed.")

    # --------------------------------------------------
    # Step 3: Feature engineering
    # --------------------------------------------------
    logger.info("Step 3: Feature engineering...")
    engineer = FeatureEngineer(reference_year=CURRENT_YEAR)
    df = engineer.transform(df)
    logger.info(f"  JoiningYear -> YearsAtCompany (reference year: {CURRENT_YEAR})")

    # --------------------------------------------------
    # Step 4: Train/test split
    # --------------------------------------------------
    logger.info("Step 4: Splitting into train/test sets...")
    splitter = DataSplitter(target_column=TARGET_COLUMN)
    X_train, X_test, y_train, y_test = splitter.split(df)
    logger.info(f"  Train: {X_train.shape[0]} rows | Test: {X_test.shape[0]} rows")

    # Check class distribution
    train_positive = y_train.sum()
    train_negative = len(y_train) - train_positive
    logger.info(
        f"  Train distribution — Stay: {train_negative} "
        f"({train_negative/len(y_train)*100:.1f}%) | "
        f"Leave: {train_positive} "
        f"({train_positive/len(y_train)*100:.1f}%)"
    )

    # --------------------------------------------------
    # Step 5: Preprocessing
    # --------------------------------------------------
    logger.info("Step 5: Building preprocessing pipeline...")
    pipeline = PreprocessingPipeline()
    preprocessor = pipeline.build()

    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)

    logger.info(f"  Original features: {X_train.shape[1]}")
    logger.info(f"  Processed features: {X_train_processed.shape[1]}")

    # --------------------------------------------------
    # Step 6: Train candidate models
    # --------------------------------------------------
    logger.info("Step 6: Training candidate models...")
    trainer = ModelTrainer()
    trained_models = trainer.train_all(X_train_processed, y_train)

    for name in trained_models:
        logger.info(f"  Trained: {name}")

    # --------------------------------------------------
    # Step 7: Evaluate all models
    # --------------------------------------------------
    logger.info("Step 7: Evaluating models...")
    evaluator = ModelEvaluator()
    results = evaluator.evaluate_all(
        trained_models, X_test_processed, y_test
    )

    # Print formatted results table
    evaluator.print_results(results)

    # --------------------------------------------------
    # Step 8: Select best model
    # --------------------------------------------------
    logger.info("Step 8: Selecting best model...")
    selector = ModelSelector()
    best = selector.select_best(results, metric="f1_score")
    best_name = best["model_name"]

    logger.info(f"  Best model: {best_name}")
    logger.info(f"  F1-score:   {best['f1_score']:.4f}")
    logger.info(f"  Recall:     {best['recall']:.4f}")
    logger.info(f"  Precision:  {best['precision']:.4f}")
    logger.info(f"  ROC-AUC:    {best.get('roc_auc', 'N/A')}")

    # --------------------------------------------------
    # Step 9: Save pipeline artifact
    # --------------------------------------------------
    logger.info("Step 9: Saving model pipeline artifact...")
    best_model = trained_models[best_name]

    artifact_path = trainer.save_pipeline(
        preprocessor=preprocessor,
        model=best_model,
        filename="employee_attrition_pipeline.pkl",
    )

    logger.info(f"  Saved to: {artifact_path}")

    # --------------------------------------------------
    # Summary
    # --------------------------------------------------
    logger.info("=" * 60)
    logger.info("Training pipeline complete!")
    logger.info(f"  Dataset:     {dataset_path.name}")
    logger.info(f"  Rows:        {len(df)}")
    logger.info(f"  Best model:  {best_name}")
    logger.info(f"  F1-score:    {best['f1_score']:.4f}")
    logger.info(f"  Artifact:    {artifact_path}")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()