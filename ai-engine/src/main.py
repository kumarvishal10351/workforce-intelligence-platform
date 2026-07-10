from pathlib import Path

from data.loader import DataLoader
from data.splitter import DataSplitter


def main():

    project_root = Path(__file__).resolve().parent.parent

    dataset_path = project_root / "datasets" / "employee.csv"

    loader = DataLoader()

    df = loader.load(dataset_path)

    splitter = DataSplitter(
        target_column="LeaveOrNot"
    )

    X_train, X_test, y_train, y_test = splitter.split(df)

    print("Training Features :", X_train.shape)
    print("Testing Features  :", X_test.shape)

    print("Training Labels   :", y_train.shape)
    print("Testing Labels    :", y_test.shape)


if __name__ == "__main__":
    main()