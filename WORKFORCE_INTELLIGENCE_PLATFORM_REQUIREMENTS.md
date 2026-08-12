# Workforce Intelligence Platform
## Complete Product Requirements & Technical Build Specification

**Project type:** Production-style AI/ML employee attrition intelligence platform  
**Working name:** Workforce Intelligence Platform  
**Repository:** `workforce-intelligence-platform`

---

## 1. Executive Summary

Workforce Intelligence Platform is an AI-powered workforce analytics product for HR teams, project managers, and organizational leadership.

The core business problem is employee attrition. The platform should help organizations identify employees at higher risk of leaving, understand the factors associated with that risk, and receive actionable retention suggestions.

The system transforms employee data into:

1. Validated employee records.
2. Model-ready features.
3. Attrition predictions.
4. Risk probabilities and categories.
5. Explainable prediction factors.
6. Retention recommendations.
7. Prediction history.
8. Workforce-level analytics.

The product should feel like a real enterprise AI application rather than a notebook-based ML project.

---

## 2. Business Problem

### Problem

HR teams need to understand:

- Which employees may leave.
- How high their risk is.
- Which factors contribute to the risk.
- Which groups or locations have higher risk.
- What actions could potentially improve retention.
- How workforce risk changes over time.

Spreadsheet-based analysis is manual, slow, difficult to reproduce, and difficult to scale.

### Proposed Solution

```text
HR User
   |
   v
React Web Application
   |
   v
FastAPI Backend
   |
   v
File Upload
   |
   v
Validation Engine
   |
   v
Preprocessing + Feature Engineering
   |
   v
ML Inference
   |
   +----> SHAP Explainability
   |
   +----> Recommendation Engine
   |
   v
PostgreSQL
   |
   v
Dashboard / Employee Results
```

---

## 3. Target Users

### HR Manager
Needs:
- Workforce overview.
- Attrition risk.
- High-risk employees.
- Reasons behind risk.
- Suggested actions.
- Historical analysis.

### Project / Team Manager
Needs:
- Team-level risk.
- Individual employee risk.
- Early warning signals.
- Suggested actions.

### Organizational Leadership
Needs:
- Location/segment trends.
- Overall workforce risk.
- Historical analytics.

---

## 4. Product Goals

The platform should:

- Reduce manual HR analysis.
- Provide employee-level risk prediction.
- Provide bulk workforce-level prediction.
- Explain predictions.
- Provide actionable suggestions.
- Maintain prediction history.
- Validate uploaded datasets.
- Handle invalid input safely.
- Support model versioning.
- Be reproducible and testable.
- Be deployable as a production-style application.

---

## 5. Important Product Boundary

This is a decision-support system, not an automated employment decision system.

The platform must not:

- Guarantee that an employee will leave.
- Automatically terminate or promote employees.
- Automatically contact employees.
- Treat model probability as fact.
- Replace human HR judgment.

Predictions are risk estimates and should be reviewed by appropriate people.

---

# 6. Core Features

## 6.1 Authentication

Eventually support:

- Registration.
- Login.
- Logout.
- Secure sessions.
- Organization isolation.

Future roles:

- HR Admin.
- HR Manager.
- Project Manager.
- Viewer.

Authentication can be introduced after the core MVP.

---

## 6.2 CSV Upload

HR users can upload employee CSV files.

The upload system must:

- Accept CSV files.
- Check extension.
- Check size.
- Check readability.
- Read the file safely.
- Validate structure.
- Validate required columns.
- Validate data types.
- Validate business rules.
- Report validation results.
- Record upload metadata.

Upload metadata:

- File name.
- File type.
- File size.
- Upload timestamp.
- User/company.
- Validation status.
- Number of rows.
- Valid row count.
- Invalid row count.
- Warning count.
- Error count.

---

# 7. Validation Engine

Validation is a core engineering component.

Architecture:

```text
Validation Engine
    |
    +-- File Validator
    +-- Column Validator
    +-- Data Type Validator
    +-- Business Rule Validator
    +-- Validation Result
```

## File Validator

Checks:

- Supported extension.
- Readability.
- Empty file.
- Basic integrity.

Initial supported format:

```text
.csv
```

Future:

```text
.xlsx
.parquet
.json
```

## Column Validator

Initial dataset columns:

```text
Education
JoiningYear
City
PaymentTier
Age
Gender
EverBenched
ExperienceInCurrentDomain
LeaveOrNot
```

Support separate schemas for:

- Training.
- Inference.

The target column is required for training but normally not required for prediction.

## Data Type Validator

Expected logical types:

| Column | Type |
|---|---|
| Education | categorical |
| JoiningYear | integer |
| City | categorical |
| PaymentTier | ordinal/integer |
| Age | numeric/integer |
| Gender | categorical |
| EverBenched | categorical/binary |
| ExperienceInCurrentDomain | numeric/integer |
| LeaveOrNot | binary target |

The validator should report all detected issues rather than stopping at the first one.

## Business Rule Validator

Business rules should be independent, reusable rule objects.

Example:

```text
BusinessRuleValidator
       |
       +-- AgeRule
       +-- ExperienceRule
       +-- PaymentTierRule
       +-- EverBenchedRule
       +-- AttritionRule
```

Examples:

- Age must be within a reasonable employee range.
- Joining year must be valid.
- Experience cannot be negative.
- Payment tier must contain supported values.
- EverBenched must contain supported values.
- LeaveOrNot must contain valid target values when present.

Do not silently convert obviously invalid values into valid ones unless an explicit business rule defines the correction.

## ValidationResult

Standardized result:

```text
is_valid
errors
warnings
row_errors
column_errors
summary
```

Example:

```json
{
  "is_valid": false,
  "errors": ["Required column 'Age' is missing"],
  "warnings": ["3 rows contain unusual values"],
  "summary": {
    "total_rows": 5000,
    "valid_rows": 4988,
    "invalid_rows": 12
  }
}
```

---

# 8. Data Storage

Uploaded files should not automatically become trusted model input.

Flow:

```text
Upload
  |
  v
Read
  |
  v
Validate
  |
  +-- Invalid --> Report
  |
  +-- Valid --> Continue
```

Recommended logical directories:

```text
data/
    raw/
    processed/
    external/
```

- `raw/`: original uploads.
- `processed/`: processed/model-ready data.
- `external/`: external/reference data.

In production, cloud object storage can replace local storage.

---

# 9. File Storage Service

Create a reusable storage service supporting:

```text
save_file()
read_file()
delete_file()
```

Eventually support:

- Local filesystem.
- Cloud object storage.
- Secure filenames.
- Unique file IDs.
- File metadata.

Never trust a user-provided filesystem path.

---

# 10. Initial Dataset

Initial ML dataset:

- Approximately 4,653 rows.
- 9 columns.
- Target: `LeaveOrNot`.

Columns:

```text
Education
JoiningYear
City
PaymentTier
Age
Gender
EverBenched
ExperienceInCurrentDomain
LeaveOrNot
```

This dataset is suitable for the first ML implementation.

A richer synthetic enterprise dataset may later be created for large-scale product demonstrations.

Use the real dataset for model development/evaluation and synthetic data for controlled scalability demonstrations.

---

# 11. DataLoader

Location:

```text
ai-engine/src/data/loader.py
```

Responsibility:

- Check file exists.
- Check supported extension.
- Read CSV.
- Return `pandas.DataFrame`.

It must not:

- Train models.
- Perform business validation.
- Perform feature engineering.

---

# 12. DataSplitter

Location:

```text
ai-engine/src/data/splitter.py
```

Responsibilities:

- Verify target exists.
- Separate `X` and `y`.
- Split train/test.
- Support configurable test size.
- Support random state.
- Support stratification.

Defaults:

```text
test_size = 0.20
random_state = 42
stratify = True
```

Stratification should preserve class proportions for binary classification.

---

# 13. Feature Engineering

Feature engineering must be separate from general preprocessing.

Initial transformation:

```text
JoiningYear
        |
        v
YearsAtCompany
```

Concept:

```text
YearsAtCompany = ReferenceYear - JoiningYear
```

The reference year should be configuration-driven and consistent between training and inference.

Future candidates:

- Tenure bands.
- Experience/tenure ratio.
- Age bands.
- Location-level features.
- Interaction features.
- Workforce segments.

All features must be checked for leakage and business validity.

---

# 14. Feature Classification

### Numerical

```text
Age
ExperienceInCurrentDomain
YearsAtCompany
```

### Ordinal

```text
PaymentTier
```

### Categorical

```text
Education
City
Gender
EverBenched
```

### Target

```text
LeaveOrNot
```

---

# 15. Preprocessing Pipeline

Use:

- `ColumnTransformer`
- `Pipeline`

Concept:

```text
Raw Features
     |
     +-- Numerical --> Scaling
     |
     +-- Categorical --> OneHotEncoder
     |
     +-- Ordinal --> Appropriate handling
     |
     v
Model-ready Features
```

Use:

```python
OneHotEncoder(handle_unknown="ignore")
```

so unseen categories do not crash inference.

The same preprocessing fitted during training must be reused during prediction.

Do not manually recreate training transformations in inference code.

---

# 16. Model Training

This is a binary classification problem.

Target:

```text
LeaveOrNot
```

Candidate models:

1. Logistic Regression.
2. Decision Tree.
3. Random Forest.
4. Gradient Boosting.
5. XGBoost/LightGBM if justified.

Start with a simple baseline and benchmark multiple models.

Do not select a model using accuracy alone.

---

# 17. Model Evaluation

Track:

- Accuracy.
- Precision.
- Recall.
- F1-score.
- ROC-AUC.
- Confusion Matrix.
- Precision-Recall curve when appropriate.

Attrition use cases may place higher importance on recall for the positive class because missing a high-risk employee can be costly.

Model selection should consider business costs.

---

# 18. Class Imbalance

Before training:

```text
Analyze target distribution.
```

If imbalanced:

- Use stratified splitting.
- Compare class-weighted models.
- Evaluate precision/recall.
- Consider resampling only when justified.
- Never resample before the train/test split.

---

# 19. Hyperparameter Tuning

After baseline models:

- GridSearchCV.
- RandomizedSearchCV.

Use cross-validation only on training data.

Keep the final test set untouched until final evaluation.

---

# 20. Model Artifact

The model and preprocessing pipeline should be saved together.

Example:

```text
artifacts/
    models/
        employee_attrition_pipeline.pkl
```

Final production model management should use MLflow Model Registry.

---

# 21. MLflow

Track:

### Parameters
- Model type.
- Hyperparameters.
- Test size.
- Random state.
- Feature configuration.
- Preprocessing version.

### Metrics
- Accuracy.
- Precision.
- Recall.
- F1.
- ROC-AUC.

### Artifacts
- Model.
- Evaluation reports.
- Confusion matrix.
- Feature importance.

### Registry

Maintain:

```text
Model v1
Model v2
Model v3
```

---

# 22. Model Versioning and Retraining

New models must not immediately replace production.

Flow:

```text
Production Model v1
        |
        | retraining
        v
Candidate Model v2
        |
        v
Evaluation
        |
        +-- Fail --> Keep v1
        |
        +-- Pass --> Promote v2
```

During retraining, the current model continues serving predictions.

Support controlled transition between schema/model versions when needed.

---

# 23. Inference Service

The inference service should:

1. Receive validated employee data.
2. Apply the saved feature engineering/preprocessing pipeline.
3. Generate probabilities.
4. Generate risk categories.
5. Trigger explainability.
6. Trigger recommendations.
7. Return structured results.

HTTP logic belongs in FastAPI; prediction business logic belongs in the prediction service.

---

# 24. Individual Prediction

Support one employee at a time.

Example:

```json
{
  "employee_id": "EMP-1023",
  "risk_probability": 0.87,
  "risk_level": "High"
}
```

---

# 25. Bulk Prediction

Support large files.

For example:

```text
50,000 employees
        |
        v
Batch prediction
```

Do not require the browser to hold an HTTP request open for several minutes.

Preferred flow:

```text
Upload
  |
  v
Create Job
  |
  v
Background Worker
  |
  v
Prediction
  |
  v
Save Results
  |
  v
Job Complete
```

Job states:

```text
PENDING
VALIDATING
PROCESSING
COMPLETED
FAILED
```

---

# 26. Background Processing

Potential technologies:

- Celery + Redis.
- RQ.
- FastAPI BackgroundTasks for small jobs.

For long-running production workloads, a real task queue is preferred.

---

# 27. Risk Score

Model output is a probability, for example:

```text
0.87
```

Display:

```text
87%
```

Initial UI categories:

```text
0–30%   Low
31–60%  Medium
61–100% High
```

These are product defaults and should eventually be validated against business outcomes.

---

# 28. Dashboard

Main dashboard:

- Total employees analyzed.
- High-risk employees.
- Medium-risk employees.
- Low-risk employees.
- Overall risk percentage.
- Recent uploads.
- Recent prediction jobs.
- Risk distribution.
- Location analysis.
- Historical trends.

UI should be clean, structured, responsive, and easy for non-technical users.

---

# 29. Employee Risk Table

Show:

| Employee | Risk | Probability | Top Factors | Status |
|---|---|---|---|---|
| Employee A | High | 87% | Factor A, Factor B | Review |
| Employee B | Medium | 55% | Factor C | Monitor |
| Employee C | Low | 12% | Stable | Normal |

Support:

- Search.
- Filtering.
- Sorting.
- Risk filtering.
- Pagination.
- Employee detail navigation.

---

# 30. Employee Details

Show:

- Employee information.
- Risk probability.
- Risk level.
- Top factors.
- SHAP explanation.
- Recommendations.
- Previous predictions.
- Model version.
- Prediction timestamp.

---

# 31. SHAP Explainability

Use SHAP to explain individual predictions.

Example:

```text
Risk: 87%

Factors increasing risk:
+ Factor A
+ Factor B

Factors reducing risk:
- Factor C
```

SHAP explains model behavior/feature contribution. It does not prove causation.

Also support global analysis:

- Most important features.
- Workforce-wide risk drivers.
- Segment/location risk drivers.

---

# 32. Recommendation Engine

Convert prediction and explanation signals into suggested actions.

Example:

```text
High Risk
+
Low Payment Tier
+
Long Tenure
```

Potential recommendation:

```text
Review compensation and career progression.
```

Another:

```text
High Risk
+
Ever Benched
```

Potential recommendation:

```text
Review project allocation and discuss opportunities for active work.
```

Recommendations are suggestions, not guarantees.

Start with rule-based recommendations.

LLM-assisted recommendations can be considered later.

---

# 33. Prediction History

Store:

- Job ID.
- Upload ID.
- User/company.
- Model version.
- Timestamp.
- Employee count.
- High/medium/low counts.
- Status.

Employee prediction records:

- Employee ID.
- Risk probability.
- Risk level.
- Top factors.
- Recommendation.
- Model version.
- Timestamp.

---

# 34. PostgreSQL

Use PostgreSQL for relational data.

Logical entities:

```text
users
organizations
uploads
prediction_jobs
employee_predictions
model_versions
validation_results
```

Relationship concept:

```text
Organization
   |
   +-- Users
   |
   +-- Uploads
          |
          +-- Prediction Jobs
                 |
                 +-- Employee Predictions
```

Database models and ML models must remain separate.

---

# 35. FastAPI Backend

FastAPI handles:

- HTTP APIs.
- Authentication.
- Request validation.
- Service calls.
- Database access.
- API responses.

FastAPI should not contain complex:

- Training logic.
- Feature engineering.
- SHAP logic.
- Business rules.

---

# 36. API Endpoints

```text
GET  /health

POST /api/v1/uploads

GET  /api/v1/uploads/{upload_id}/validation

POST /api/v1/predictions

GET  /api/v1/predictions/{job_id}

GET  /api/v1/predictions/{job_id}/results

POST /api/v1/employees/predict

GET  /api/v1/predictions/history

GET  /api/v1/employees/{employee_id}
```

Use versioned APIs so future changes can be introduced safely.

---

# 37. React Frontend

Recommended:

```text
frontend/
    src/
        components/
        pages/
        layouts/
        services/
        hooks/
        types/
        utils/
```

Pages:

```text
Login
Dashboard
Upload
Validation
Prediction Jobs
Results
Employee Details
History
Settings
```

---

# 38. Upload UX

Provide:

```text
Drag & Drop CSV

or

[ Choose File ]
```

Show:

```text
File uploaded
Validating...
```

Then:

```text
Validation completed

Rows: 4,653
Valid: ...
Invalid: ...
Warnings: ...
```

---

# 39. Error Handling

Never expose raw stack traces.

Bad:

```text
KeyError: 'Age'
```

Good:

```text
Required column 'Age' is missing.
Please upload a file containing the required employee fields.
```

Technical details belong in backend logs.

---

# 40. Logging

Log:

- Application startup.
- File upload.
- Validation.
- Prediction jobs.
- Model loading.
- Model version.
- Errors.
- Processing duration.
- API failures.

Never log passwords, API keys, or unnecessary sensitive employee data.

Use:

```text
DEBUG
INFO
WARNING
ERROR
CRITICAL
```

---

# 41. Configuration

Centralize:

```text
TARGET_COLUMN
TEST_SIZE
RANDOM_STATE
REFERENCE_YEAR
MODEL_PATH
DATABASE_URL
LOG_LEVEL
SUPPORTED_FILE_TYPES
```

Secrets must come from environment variables/secret management.

---

# 42. Security

Implement:

- Input validation.
- File size limits.
- Allowed file types.
- Secure filenames.
- Authentication.
- Authorization.
- Parameterized queries/ORM.
- CORS configuration.
- Secret management.
- Rate limiting where appropriate.

Never execute uploaded files.

---

# 43. Docker

Containerize:

```text
frontend
backend
ai-engine
postgres
redis
mlflow
```

Docker Compose can orchestrate development services.

---

# 44. CI/CD

Use GitHub Actions:

```text
Push / Pull Request
       |
       v
Lint
       |
       v
Unit Tests
       |
       v
Integration Tests
       |
       v
Docker Build
       |
       v
Security Checks
       |
       v
Deploy
```

Deployment should happen only after required checks pass.

---

# 45. Testing

## Unit Tests

Test:

- DataLoader.
- DataSplitter.
- Validators.
- FeatureEngineer.
- Recommendation rules.
- Utilities.

## Integration Tests

Test:

```text
Upload -> Validation
Validation -> Prediction
Prediction -> Database
```

## API Tests

Test FastAPI endpoints.

## Model Tests

Check:

- Artifact loads.
- Expected schema.
- Prediction output.
- Probability range.

Test both valid and invalid inputs.

---

# 46. Monitoring

Monitor:

- Prediction volume.
- Prediction latency.
- Error rate.
- Model version.
- Feature drift.
- Prediction distribution.
- Data quality.

Potential tools:

- Evidently.
- Prometheus.
- Grafana.

---

# 47. Data Drift

Compare production input distributions with training distributions.

Example:

```text
Training average age: 32
Production average age: 46
```

Possible response:

```text
Detect drift
   |
   v
Alert
   |
   v
Investigate
   |
   v
Retrain if necessary
```

---

# 48. Responsible AI

Because employee data is sensitive:

- Clearly label predictions as risk estimates.
- Provide explanations.
- Log model versions.
- Support human review.
- Avoid automated employment decisions.
- Evaluate model behavior across relevant groups.
- Protect employee data.
- Minimize unnecessary personal information.

Legal, privacy, and compliance requirements must be reviewed before real-world deployment.

---

# 49. Recommended AI Engine Structure

```text
ai-engine/
├── src/
│   ├── config/
│   │   ├── settings.py
│   │   └── schema.py
│   ├── data/
│   │   ├── loader.py
│   │   ├── splitter.py
│   │   └── dataset.py
│   ├── validation/
│   │   ├── base.py
│   │   ├── result.py
│   │   ├── pipeline.py
│   │   ├── validators/
│   │   │   ├── file_validator.py
│   │   │   ├── column_validator.py
│   │   │   ├── datatype_validator.py
│   │   │   └── business_rule_validator.py
│   │   └── rules/
│   │       ├── base_rule.py
│   │       ├── age_rule.py
│   │       ├── experience_rule.py
│   │       └── ...
│   ├── preprocessing/
│   │   ├── feature_engineering.py
│   │   └── pipeline.py
│   ├── training/
│   │   ├── trainer.py
│   │   ├── evaluator.py
│   │   ├── model_selection.py
│   │   └── registry.py
│   ├── inference/
│   │   └── predictor.py
│   ├── explainability/
│   │   └── shap_explainer.py
│   ├── recommendation/
│   │   └── engine.py
│   └── utils/
│       └── logger.py
├── tests/
├── datasets/
├── artifacts/
├── notebooks/
└── requirements.txt
```

---

# 50. Backend Structure

```text
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   └── v1/
│   │       ├── uploads.py
│   │       ├── predictions.py
│   │       ├── employees.py
│   │       └── health.py
│   ├── services/
│   │   ├── upload_service.py
│   │   ├── prediction_service.py
│   │   └── history_service.py
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   ├── core/
│   └── workers/
└── tests/
```

---

# 51. Frontend Structure

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   └── utils/
└── tests/
```

---

# 52. End-to-End Prediction Workflow

```text
1. HR logs in.
2. HR opens Upload.
3. HR selects CSV.
4. React sends multipart request to FastAPI.
5. FastAPI authenticates user.
6. Upload service stores metadata.
7. File is read.
8. File validator checks file.
9. Column validator checks schema.
10. DataTypeValidator checks types.
11. BusinessRuleValidator checks business rules.
12. ValidationResult is returned.
13. Invalid input is reported safely.
14. Valid input creates a prediction job.
15. Background worker starts for large jobs.
16. Feature engineering runs.
17. Saved preprocessing transforms data.
18. Production model predicts probability.
19. Risk category is assigned.
20. SHAP computes contributions.
21. Recommendation engine creates suggestions.
22. Results are stored in PostgreSQL.
23. Job becomes COMPLETED.
24. React retrieves results.
25. Dashboard displays workforce risk.
26. HR can open employee details.
27. Prediction history remains available.
```

---

# 53. Example Prediction Response

```json
{
  "employee_id": "EMP-1001",
  "risk_probability": 0.82,
  "risk_level": "High",
  "model_version": "1.0.0",
  "top_factors": [
    {
      "feature": "PaymentTier",
      "impact": "increases_risk"
    },
    {
      "feature": "YearsAtCompany",
      "impact": "increases_risk"
    }
  ],
  "recommendations": [
    "Review career progression opportunities",
    "Discuss compensation and role expectations"
  ]
}
```

---

# 54. Documentation

Repository should contain:

```text
README.md
ARCHITECTURE.md
DATA_DICTIONARY.md
API.md
MODEL_CARD.md
CONTRIBUTING.md
.env.example
```

README should explain:

- Problem.
- Solution.
- Features.
- Architecture.
- Technology stack.
- Local setup.
- Running the application.
- API.
- ML pipeline.
- Testing.
- Deployment.
- Limitations.

---

# 55. Git Strategy

Suggested branches:

```text
main
develop
feature/*
fix/*
```

Example commits:

```text
feat(data): implement reusable DataLoader
feat(data): add configurable train test splitter
feat(validation): implement column validation
feat(preprocessing): add feature engineering pipeline
feat(training): add baseline classifier
feat(explainability): add SHAP explanations
feat(api): add prediction endpoint
feat(frontend): add workforce dashboard
test(validation): add validation test suite
refactor(config): centralize application settings
docs: add architecture documentation
```

---

# 56. Development Phases

## Phase 1 — Foundation

- Repository.
- Python environment.
- Folder structure.
- Configuration.
- Logging.
- Exceptions.
- Testing.

## Phase 2 — Data

- Dataset.
- Data dictionary.
- DataLoader.
- DataSplitter.
- Validation engine.

## Phase 3 — ML

- Feature engineering.
- Preprocessing.
- Baseline models.
- Evaluation.
- Model selection.
- Model artifact.

## Phase 4 — MLOps

- MLflow.
- Model registry.
- Versioning.
- DVC where useful.
- Retraining workflow.

## Phase 5 — Explainability

- SHAP.
- Recommendation engine.

## Phase 6 — Backend

- FastAPI.
- PostgreSQL.
- Upload API.
- Prediction API.
- History API.
- Background jobs.

## Phase 7 — Frontend

- Dashboard.
- Upload.
- Validation.
- Results.
- Employee details.
- History.

## Phase 8 — Infrastructure

- Docker.
- Docker Compose.
- CI/CD.
- Deployment.
- Monitoring.

---

# 57. MVP Definition

MVP is complete when:

- HR can upload a valid CSV.
- System validates it.
- Prediction job is created.
- Model predicts employee risk.
- Risk probability is shown.
- Results are stored.
- Dashboard shows workforce-level results.
- Employee details show prediction.
- Errors are handled cleanly.

Advanced MLOps and enterprise features can follow after this vertical slice works.

---

# 58. Definition of Done

A feature is complete when it has:

- Implementation.
- Type hints.
- Error handling.
- Unit tests.
- Logging where appropriate.
- Documentation.
- Clean naming.
- No hardcoded secrets.
- Manual verification.
- Git commit.

---

# 59. Technology Stack

### Frontend
- React.
- Modern component library.
- Responsive dashboard.

### Backend
- Python.
- FastAPI.
- Pydantic.

### ML
- pandas.
- NumPy.
- scikit-learn.
- SHAP.
- Optional XGBoost/LightGBM.

### Database
- PostgreSQL.

### MLOps
- MLflow.
- DVC where useful.
- Docker.
- GitHub Actions.

### Background Jobs
- Redis.
- Celery/RQ when required.

### Monitoring
- Application logging.
- Metrics.
- Optional Prometheus/Grafana.
- Optional Evidently.

---

# 60. Important Design Decisions

### Frontend: React
Chosen instead of Streamlit because the product requires more control over dashboard design, routing, reusable components, and production-style frontend architecture.

### Backend: FastAPI
Chosen because it is Python-native and well suited to ML APIs.

### Database: PostgreSQL
Chosen for reliable relational storage of users, uploads, jobs, predictions, and model metadata.

### Input: CSV + Individual Employee
Bulk CSV supports workforce-level analysis while manual input supports individual investigation.

### Prediction: Individual + Batch
Both are required.

### Long-running prediction: Background job
Users should not have to keep a browser request open for several minutes.

### Model serving
Model lives behind the backend prediction service.

### Retraining
A new model is trained separately while the current production model continues serving.

### Validation
Use multiple validators with standardized results.

---

# 61. Corrections to Early Design Ideas

Some early ideas should not be implemented blindly.

### Do not automatically convert invalid salary to positive

Do not use `abs()` to turn negative salary into a positive number. That hides data-quality problems.

Prefer:

```text
invalid -> report / reject / quarantine
```

unless an explicit business rule defines correction.

### Do not fill every missing value with an aggregate

Imputation strategy must be feature-specific and should generally be learned from training data.

### Do not continue inference with missing mandatory model features

Warnings may be acceptable for non-critical fields. Missing mandatory features should normally block prediction.

### Do not treat model probability as truth

An 87% model estimate does not prove an employee will leave.

---

# 62. Final Product Vision

```text
                   WORKFORCE INTELLIGENCE PLATFORM

                              HR User
                                 |
                                 v
                          React Dashboard
                                 |
                                 v
                              FastAPI
                                 |
             +-------------------+-------------------+
             |                   |                   |
             v                   v                   v
        Upload Service     Prediction Service    History
             |                   |
             v                   v
       Validation Engine    AI Prediction Pipeline
             |                   |
             |          +--------+--------+
             |          |        |        |
             |          v        v        v
             |      Preprocess  SHAP  Recommendation
             |          |        |        |
             |          +--------+--------+
             |                   |
             +-------------------+
                                 |
                                 v
                            PostgreSQL
                                 |
                                 v
                         Workforce Dashboard
```

---

# 63. One-Sentence Project Explanation

> Workforce Intelligence Platform is an AI-powered employee attrition intelligence system that validates workforce data, predicts employee attrition risk, explains the factors behind each prediction, and provides actionable retention recommendations through a production-style web platform.

---

# 64. Interview Explanation

If asked, "How does your system work?":

> The user uploads employee data through a React frontend. FastAPI receives the file and passes it through a validation engine that checks the file, schema, data types, and business rules. Once validated, the data enters the same feature engineering and preprocessing pipeline used during model training. The trained model generates an attrition probability, which is converted into a risk category. SHAP is then used to explain the major factors contributing to the prediction, and a recommendation engine generates suggested retention actions. The prediction and metadata are stored in PostgreSQL, while MLflow manages experiment and model versions. For large uploads, the prediction runs as a background job so the user does not need to wait on an open request.

---

# 65. Current Implementation Status

Already started:

- Repository created.
- AI-engine structure created.
- Validation architecture started.
- `ValidationResult` created.
- `BaseValidator` created.
- `ColumnValidator` created.
- `DataTypeValidator` created.
- Business rule architecture started.
- DataLoader implemented.
- DataSplitter implemented.
- FeatureEngineer implemented.
- PreprocessingPipeline started.
- Dataset selected and audited.

Next:

1. Complete configuration gradually and make it understandable.
2. Add logging.
3. Add tests.
4. Complete validation pipeline.
5. Complete preprocessing.
6. Build baseline models.
7. Evaluate models.
8. Integrate MLflow.
9. Build inference service.
10. Build SHAP.
11. Build recommendations.
12. Build FastAPI.
13. Build PostgreSQL layer.
14. Build React dashboard.
15. Add Docker, CI/CD, and monitoring.

---

# 66. Guiding Principle

The project should be understandable by another developer.

A new developer should be able to:

```text
Read README
    ↓
Understand architecture
    ↓
Understand data contract
    ↓
Run project
    ↓
Run tests
    ↓
Understand ML pipeline
    ↓
Understand API
    ↓
Understand deployment
```

The goal is not to build the most complicated model.

The goal is to build a well-engineered AI product around a useful business problem.

---

# 67. Recommended Development Workflow

For every task:

```text
1. Understand the problem.
2. Explain why it is needed.
3. Decide where the code belongs.
4. Define the responsibility.
5. Implement the smallest useful version.
6. Test it.
7. Debug it.
8. Refactor it.
9. Add automated tests.
10. Document it.
11. Commit it.
```

This requirements document is the source of truth for the intended product scope. Features may be implemented incrementally, but major architectural changes should be recorded here.
