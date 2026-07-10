from pathlib import Path

from data.loader import DataLoader
from data.splitter import DataSplitter
from preprocessing.feature_engineering import FeatureEngineer
from preprocessing.pipeline import PreprocessingPipeline


def main():

    project_root = Path(__file__).resolve().parent.parent

    dataset_path = project_root / "datasets" / "employee.csv"

    loader = DataLoader()
    df = loader.load(dataset_path)

    engineer = FeatureEngineer()
    df = engineer.transform(df)

    from config.settings import TARGET_COLUMN

    splitter = DataSplitter(
    target_column=TARGET_COLUMN
)

    X_train, X_test, y_train, y_test = splitter.split(df)

    pipeline = PreprocessingPipeline()

    preprocessor = pipeline.build()

    X_train_processed = preprocessor.fit_transform(X_train)

    X_test_processed = preprocessor.transform(X_test)

    print("Original Shape :", X_train.shape)

    print("Processed Shape :", X_train_processed.shape)
    
if __name__ == "__main__":
    main()