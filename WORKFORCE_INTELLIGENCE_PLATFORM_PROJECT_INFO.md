# Workforce Intelligence Platform — Project Information & Learning Guide

> **Purpose of this document:** This file is a private project-information document for understanding, learning, building, explaining, and maintaining the Workforce Intelligence Platform. It is **not intended to be pushed to GitHub as the project's public README**.

---

# 1. Project Identity

**Project Name:** Workforce Intelligence Platform  
**Repository:** `workforce-intelligence-platform`  
**Project Type:** Production-style AI/ML employee attrition intelligence platform

## One-line description

> Workforce Intelligence Platform is an AI-powered employee attrition intelligence system that validates workforce data, predicts employee attrition risk, explains the factors behind each prediction, and provides actionable retention recommendations through a production-style web platform.

---

# 2. Why Are We Building This?

Companies lose employees for many reasons:

- Compensation concerns
- Lack of career growth
- Poor project allocation
- Work environment
- Long tenure without progression
- Work-life concerns
- Other organizational factors

The problem is that HR teams often discover these patterns too late.

A spreadsheet can store employee information, but it does not automatically provide:

- Risk prediction
- Model-based analysis
- Explanation of predictions
- Workforce-level risk dashboards
- Prediction history
- Automated processing
- Model versioning
- Scalable batch prediction

This project is designed to turn that manual process into a software product.

---

# 3. Business Problem

The platform should help company officials answer:

1. Which employees have a higher predicted risk of attrition?
2. How high is the predicted risk?
3. What factors contributed to the prediction?
4. Which departments/locations/workforce groups have higher risk?
5. What retention actions could HR consider?
6. How has workforce risk changed over time?

The platform is a **decision-support system**.

It does not guarantee that an employee will leave.

---

# 4. Target Users

## HR Manager

Main requirements:

- Workforce overview
- High-risk employee list
- Individual risk analysis
- Reasons behind predictions
- Suggested retention actions
- Historical prediction results

## Project / Team Manager

Main requirements:

- Team-level risk
- Individual employee risk
- Early warning signals
- Suggested actions

## Leadership

Main requirements:

- Overall workforce risk
- Department/location trends
- Historical trends
- High-level workforce intelligence

---

# 5. Product Value

A company could use this platform instead of relying only on Excel because the system can:

- Automate repetitive analysis
- Process large employee datasets
- Produce predictions consistently
- Save prediction history
- Explain model outputs
- Provide dashboards
- Reduce manual analysis
- Support future model retraining
- Provide an auditable ML workflow

The value is not simply "using machine learning."

The value is turning the ML model into a usable product.

---

# 6. Core Product Features

## Feature 1 — Employee CSV Upload

HR can upload employee data.

Supported initially:

```text
.csv
```

The system should check:

- File type
- File size
- File readability
- Empty files
- Required columns
- Data types
- Business rules

---

## Feature 2 — Data Validation

Validation should happen before prediction.

The validation engine contains:

```text
File Validator
       |
Column Validator
       |
Data Type Validator
       |
Business Rule Validator
       |
Validation Result
```

The purpose is to prevent bad data from entering the ML pipeline.

---

## Feature 3 — Individual Prediction

A user can provide one employee's information and receive:

```text
Risk Probability
Risk Level
Top Factors
Recommendations
```

Example:

```text
Employee: EMP-1001

Risk Probability: 82%
Risk Level: HIGH
```

---

## Feature 4 — Bulk Prediction

A user can upload a large CSV.

Example:

```text
50,000 employees
       |
       v
Batch Prediction
       |
       v
Results
```

For large jobs, the user should not have to wait on an open browser request.

Instead:

```text
Upload
  ↓
Create Job
  ↓
Background Worker
  ↓
Prediction
  ↓
Save Results
  ↓
Job Complete
```

---

## Feature 5 — Risk Dashboard

Dashboard should display:

- Total employees
- High-risk employees
- Medium-risk employees
- Low-risk employees
- Overall risk percentage
- Risk distribution
- Recent uploads
- Recent prediction jobs
- Location/segment analysis
- Historical trends

---

## Feature 6 — Employee Details

Clicking an employee should show:

- Employee information
- Risk probability
- Risk category
- Top contributing factors
- SHAP explanation
- Recommendations
- Previous prediction history
- Model version
- Prediction timestamp

---

## Feature 7 — Explainability

Use SHAP to answer:

> "Why did the model give this employee a high-risk score?"

Example:

```text
Risk: 87%

Factors increasing risk:
+ PaymentTier
+ YearsAtCompany

Factors reducing risk:
- Other protective factor
```

Important:

SHAP explains model behavior. It does not prove that a feature caused the employee to leave.

---

## Feature 8 — Recommendation Engine

The recommendation engine converts prediction/explanation information into suggested actions.

Example:

```text
High Risk
+
Low Payment Tier
+
Long Tenure
```

Possible recommendation:

```text
Review compensation and career progression opportunities.
```

Another example:

```text
High Risk
+
Ever Benched
```

Possible recommendation:

```text
Review project allocation and discuss opportunities for active work.
```

Start with a rule-based engine.

LLM-assisted recommendations can be considered later.

---

## Feature 9 — Prediction History

Every prediction job should be recorded.

Store information such as:

- Job ID
- Upload ID
- User
- Timestamp
- Model version
- Number of employees
- High-risk count
- Medium-risk count
- Low-risk count
- Job status

Employee-level records can contain:

- Employee ID
- Risk probability
- Risk level
- Top factors
- Recommendations
- Model version
- Timestamp

---

# 7. Initial Dataset

The initial dataset contains approximately:

```text
4,653 rows
9 columns
```

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

Target:

```text
LeaveOrNot
```

The initial dataset is intended for developing and evaluating the first version of the ML pipeline.

Later, a larger synthetic enterprise-style dataset can be created to demonstrate bulk processing and product scalability.

---

# 8. What Does the Target Mean?

The target column is:

```text
LeaveOrNot
```

It represents the classification target for employee attrition.

Conceptually:

```text
0 → employee did not leave
1 → employee left
```

The exact encoding should always be verified from the actual dataset before training.

---

# 9. Complete System Architecture

High-level architecture:

```text
                         HR / Manager
                              |
                              v
                       React Frontend
                              |
                              v
                       FastAPI Backend
                              |
              +---------------+---------------+
              |               |               |
              v               v               v
        Upload Service   Prediction API   History API
              |
              v
       Validation Engine
              |
              v
       Prediction Job
              |
              v
       AI/ML Prediction Service
              |
       +------+-------+----------------+
       |              |                |
       v              v                v
 Feature Engineering  Model          SHAP
       |              |                |
       +--------------+----------------+
                      |
                      v
              Recommendation Engine
                      |
                      v
                  PostgreSQL
                      |
                      v
              React Dashboard
```

---

# 10. End-to-End Example

Suppose HR uploads:

```text
employees.csv
```

containing 5,000 employees.

The process is:

```text
1. User selects CSV
       ↓
2. React sends file to FastAPI
       ↓
3. FastAPI receives upload
       ↓
4. File is read
       ↓
5. File validation
       ↓
6. Column validation
       ↓
7. Data type validation
       ↓
8. Business rule validation
       ↓
9. Validation result
       ↓
10. Prediction job created
       ↓
11. Feature engineering
       ↓
12. Preprocessing
       ↓
13. ML model prediction
       ↓
14. Risk probability generated
       ↓
15. Risk category generated
       ↓
16. SHAP explanation
       ↓
17. Recommendation generation
       ↓
18. Results stored in PostgreSQL
       ↓
19. Job marked completed
       ↓
20. React displays dashboard/results
```

---

# 11. Data Layer

The data layer is responsible for moving data into the ML system safely.

## DataLoader

Location:

```text
ai-engine/src/data/loader.py
```

Responsibility:

```text
File
 ↓
DataLoader
 ↓
pandas DataFrame
```

It should:

- Check that the file exists
- Check the extension
- Read the CSV
- Return a DataFrame

It should NOT perform model training.

It should NOT contain business validation.

It should NOT contain feature engineering.

---

# 12. DataSplitter

Location:

```text
ai-engine/src/data/splitter.py
```

Purpose:

Separate:

```text
Features (X)
Target (y)
```

Then:

```text
X_train
X_test
y_train
y_test
```

Typical configuration:

```text
test_size = 0.20
random_state = 42
stratify = True
```

## Why stratification?

Suppose the dataset contains:

```text
90% Stay
10% Leave
```

We want the train and test sets to have approximately the same distribution.

This makes evaluation more representative.

---

# 13. Validation Layer

Validation should happen before ML prediction.

## File Validator

Checks:

```text
Is this a supported file?
Can it be read?
Is it empty?
```

## Column Validator

Checks:

```text
Are required columns present?
Are there unexpected columns?
```

## Data Type Validator

Checks:

```text
Does Age contain numeric values?
Does JoiningYear contain valid numeric values?
Are categorical fields valid?
```

## Business Rule Validator

Checks business constraints.

Examples:

```text
Age must be reasonable.
Experience cannot be negative.
PaymentTier must be supported.
JoiningYear must be valid.
```

---

# 14. Validation Philosophy

We do NOT want validation to stop after finding the first error.

Suppose a file has:

```text
15 errors
```

The system should ideally report all relevant errors in one validation result.

That gives the HR user enough information to fix the file instead of repeatedly uploading it and discovering one new error each time.

---

# 15. Handling Invalid Rows

The system should distinguish between:

### Dataset-level fatal errors

Examples:

- File cannot be read.
- Required schema is fundamentally missing.
- Dataset is empty.

These should stop the job.

### Row-level errors

Examples:

- One employee has an invalid age.
- One row contains an invalid category.

Depending on the business policy, valid rows may be retained and invalid rows quarantined/reported.

The system should never silently discard data.

---

# 16. Important Data-Quality Rule

Do not blindly "fix" bad data.

For example:

```text
Salary = -50000
```

Do not automatically do:

```python
abs(-50000)
```

because that hides the underlying data problem.

Instead:

```text
Detect
 ↓
Report
 ↓
Reject / quarantine / correct according to an explicit business rule
```

---

# 17. Feature Engineering

The first planned feature engineering transformation is:

```text
JoiningYear
```

to:

```text
YearsAtCompany
```

Concept:

```text
YearsAtCompany =
ReferenceYear - JoiningYear
```

Why?

The model may find employee tenure more meaningful than the raw calendar year.

Example:

```text
JoiningYear = 2016
ReferenceYear = 2026

YearsAtCompany = 10
```

The reference year must be controlled so training and inference remain consistent.

---

# 18. Preprocessing

Different data types need different transformations.

## Numerical

```text
Age
ExperienceInCurrentDomain
YearsAtCompany
```

Possible transformation:

```text
StandardScaler
```

## Categorical

```text
Education
City
Gender
EverBenched
```

Possible transformation:

```text
OneHotEncoder
```

with:

```python
handle_unknown="ignore"
```

## Ordinal

```text
PaymentTier
```

Should be handled according to its actual meaning and encoding.

---

# 19. Why Use a Pipeline?

Training:

```text
Raw Data
 ↓
Feature Engineering
 ↓
Preprocessing
 ↓
Model
```

Prediction must use the exact same transformations:

```text
New Data
 ↓
Same Feature Engineering
 ↓
Same Fitted Preprocessor
 ↓
Same Model
```

If we manually preprocess training and prediction differently, the model can receive inconsistent features.

Therefore the preprocessing/model workflow should be packaged into reusable artifacts/pipelines.

---

# 20. ML Training

This is a binary classification problem.

Potential baseline models:

```text
Logistic Regression
Decision Tree
Random Forest
Gradient Boosting
```

Potential advanced models:

```text
XGBoost
LightGBM
```

Start with simple models and benchmark them.

The most complex model is not automatically the best model.

---

# 21. Model Evaluation

Required metrics:

```text
Accuracy
Precision
Recall
F1-score
ROC-AUC
Confusion Matrix
```

For attrition, recall can be particularly important because failing to identify a high-risk employee may be more costly than reviewing an additional employee.

Model selection should consider business costs.

---

# 22. Class Imbalance

Before training:

```text
Check target distribution
```

If the dataset is imbalanced:

- Use stratified splitting.
- Compare class-weighted models.
- Analyze precision/recall.
- Consider resampling only where appropriate.

Never use test data for training or preprocessing fitting.

---

# 23. Hyperparameter Tuning

After a baseline is working:

```text
GridSearchCV
```

or:

```text
RandomizedSearchCV
```

can be used.

Important:

```text
Training data
 ↓
Cross-validation
 ↓
Model selection
 ↓
Final untouched test set
```

The final test set should not influence model tuning.

---

# 24. MLflow

MLflow will provide experiment tracking and model management.

Track:

### Parameters

```text
model type
hyperparameters
test size
random state
feature configuration
```

### Metrics

```text
accuracy
precision
recall
f1
roc_auc
```

### Artifacts

```text
model
evaluation report
confusion matrix
feature importance
```

### Model versions

```text
v1
v2
v3
```

---

# 25. Model Retraining

The current production model should continue serving predictions while a new model is being trained.

Correct architecture:

```text
Production Model v1
        |
        | retraining
        v
Candidate Model v2
        |
        v
Validation
        |
   +----+----+
   |         |
 Fail       Pass
   |         |
   v         v
Keep v1   Promote v2
```

This prevents downtime during retraining.

---

# 26. Inference Service

The inference service is responsible for prediction.

It receives validated data and performs:

```text
Feature Engineering
        ↓
Preprocessing
        ↓
Model Prediction
        ↓
Risk Probability
        ↓
Risk Category
        ↓
SHAP
        ↓
Recommendations
```

FastAPI should call this service rather than containing all ML logic itself.

---

# 27. Risk Categories

Initial product thresholds:

```text
0–30%   Low
31–60%  Medium
61–100% High
```

Example:

```text
Model probability = 0.82

Display:
82%

Category:
High Risk
```

These thresholds are product defaults and should eventually be validated against real outcomes.

---

# 28. SHAP

SHAP is used to answer:

> "Which features influenced this prediction?"

Example:

```text
Employee risk = 82%

Increasing risk:
- PaymentTier
- YearsAtCompany

Reducing risk:
- Protective feature
```

Again, these are model contributions, not proof of causation.

---

# 29. Recommendation Engine

The recommendation engine uses prediction/explanation information.

Initial implementation should be rule-based.

Example rules:

```text
IF risk = HIGH
AND PaymentTier is low
THEN suggest compensation/career review
```

```text
IF risk = HIGH
AND EverBenched indicates bench history
THEN suggest project allocation review
```

Later versions can support:

- Organization-specific policies.
- HR knowledge retrieval.
- LLM-assisted explanations/recommendations.

---

# 30. Background Jobs

Large CSVs may take significant time to process.

Instead of:

```text
Browser
  |
  | wait 5 minutes
  v
Response
```

Use:

```text
Browser
  |
  v
Create Job
  |
  v
Immediate Response
  |
  v
Background Worker
  |
  v
Prediction
  |
  v
Database
```

The frontend can poll job status or use a real-time mechanism later.

---

# 31. PostgreSQL

PostgreSQL stores product data.

Main entities:

```text
users
organizations
uploads
prediction_jobs
employee_predictions
model_versions
validation_results
```

Example relationship:

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

Database models and ML model classes should remain separate.

---

# 32. FastAPI

FastAPI is the backend API layer.

Responsibilities:

- Receive requests.
- Validate API payloads.
- Authenticate users.
- Call services.
- Access database/repositories.
- Return responses.

It should NOT contain large blocks of:

```text
feature engineering
model training
SHAP logic
business rules
```

Those belong in dedicated modules.

---

# 33. API Plan

## Health

```text
GET /health
```

## Upload

```text
POST /api/v1/uploads
```

## Validation

```text
GET /api/v1/uploads/{upload_id}/validation
```

## Prediction job

```text
POST /api/v1/predictions
```

## Job status

```text
GET /api/v1/predictions/{job_id}
```

## Results

```text
GET /api/v1/predictions/{job_id}/results
```

## Single employee

```text
POST /api/v1/employees/predict
```

## History

```text
GET /api/v1/predictions/history
```

## Employee details

```text
GET /api/v1/employees/{employee_id}
```

---

# 34. React Frontend

Recommended structure:

```text
frontend/
└── src/
    ├── components/
    ├── pages/
    ├── layouts/
    ├── services/
    ├── hooks/
    ├── types/
    └── utils/
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

# 35. Dashboard Design

The dashboard should be:

- Clean.
- Structured.
- Professional.
- Responsive.
- Easy for non-technical HR users.

Main components:

```text
KPI Cards
Risk Distribution
High-Risk Employees
Recent Uploads
Recent Prediction Jobs
Risk Trends
Location/Segment Analysis
```

Avoid unnecessary visual complexity.

---

# 36. Error Handling

Technical errors should be hidden from normal users.

Bad:

```text
KeyError: 'Age'
```

Good:

```text
Required column 'Age' is missing.
Please upload a file containing the required employee fields.
```

Backend logs can contain technical debugging details.

Frontend receives safe messages.

---

# 37. Logging

The application should log:

```text
Application startup
File upload
Validation
Prediction job
Model loading
Model version
Processing time
Errors
API failures
```

Never log:

```text
Passwords
API keys
Unnecessary sensitive employee information
```

Use standard log levels:

```text
DEBUG
INFO
WARNING
ERROR
CRITICAL
```

---

# 38. Configuration

Centralize values such as:

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

Reason:

If a value changes, we should not have to search through many files.

Example:

Instead of repeating:

```python
"LeaveOrNot"
```

everywhere, define:

```python
TARGET_COLUMN = "LeaveOrNot"
```

and import it where needed.

---

# 39. Security

The production-style version should implement:

- File size limits.
- File type restrictions.
- Secure filenames.
- Authentication.
- Authorization.
- Safe database queries.
- CORS configuration.
- Secret management.
- Rate limiting.
- Input validation.

Uploaded files must never be executed.

---

# 40. Docker

The eventual system can be containerized into services such as:

```text
frontend
backend
ai-engine
postgres
redis
mlflow
```

Docker Compose can be used for local multi-service development.

---

# 41. CI/CD

GitHub Actions should eventually run:

```text
Push / Pull Request
        ↓
Lint
        ↓
Unit Tests
        ↓
Integration Tests
        ↓
Docker Build
        ↓
Security Checks
        ↓
Deploy
```

A deployment should only happen after required checks pass.

---

# 42. Testing Strategy

## Unit Tests

Test:

```text
DataLoader
DataSplitter
Validators
FeatureEngineer
Recommendation Rules
Utilities
```

## Integration Tests

Test:

```text
Upload
 ↓
Validation
 ↓
Prediction
 ↓
Database
```

## API Tests

Test FastAPI endpoints.

## Model Tests

Check:

```text
Artifact loads
Expected schema
Prediction output
Probability range
```

Also test failure cases.

---

# 43. Monitoring

Production monitoring should eventually track:

- Prediction volume.
- Prediction latency.
- API errors.
- Job failures.
- Model version.
- Input data quality.
- Prediction distribution.
- Feature drift.

Potential tools:

```text
Prometheus
Grafana
Evidently
```

---

# 44. Data Drift

The production data distribution can change over time.

Example:

```text
Training average age = 32
Production average age = 46
```

That may indicate drift.

Process:

```text
Detect drift
    ↓
Alert
    ↓
Investigate
    ↓
Retrain if justified
```

---

# 45. Project Folder Structure

## AI Engine

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
└── notebooks/
```

## Backend

```text
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   └── v1/
│   ├── services/
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   ├── core/
│   └── workers/
└── tests/
```

## Frontend

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

# 46. Responsibility of Major Folders

| Folder | Responsibility |
|---|---|
| `config` | Configuration and data schema |
| `data` | Loading/splitting data |
| `validation` | Checking input correctness |
| `preprocessing` | Feature engineering and transformation |
| `training` | Training/evaluation/model selection |
| `inference` | Making predictions |
| `explainability` | SHAP/model explanations |
| `recommendation` | Retention suggestions |
| `utils` | Shared utilities |
| `tests` | Automated tests |
| `artifacts` | Model/generated ML artifacts |
| `datasets` | Development datasets |

The key principle is **separation of responsibilities**.

---

# 47. Why Separate Frontend, Backend, and ML?

Because they solve different problems.

```text
React
    = User Interface

FastAPI
    = API / Application Layer

AI Engine
    = Machine Learning Logic

PostgreSQL
    = Data Storage
```

If we later replace FastAPI with another API framework, the core ML business logic should not need to be rewritten.

If we replace Random Forest with XGBoost, database code should not need to change.

This separation makes the project maintainable.

---

# 48. Why Not Put Everything in One Python File?

A single file might work initially:

```text
main.py
```

but eventually it would contain:

```text
data loading
validation
feature engineering
training
prediction
SHAP
recommendations
database
API
logging
```

That becomes difficult to:

- Test
- Understand
- Modify
- Reuse
- Debug

Therefore each module should have a clear responsibility.

---

# 49. Current Learning Progress

Already implemented/started during development:

```text
Repository
    ↓
Project structure
    ↓
Validation architecture
    ↓
BaseValidator
    ↓
ValidationResult
    ↓
ColumnValidator
    ↓
DataTypeValidator
    ↓
Business rule architecture
    ↓
DataLoader
    ↓
DataSplitter
    ↓
FeatureEngineer
    ↓
PreprocessingPipeline
```

The next major stage is to strengthen the foundation and then build the model training engine.

---

# 50. Development Roadmap

## Phase 1 — Foundation

Learn/build:

- Repository structure.
- Python environment.
- Configuration.
- Logging.
- Exceptions.
- Testing.

## Phase 2 — Data

Learn/build:

- Dataset.
- Data dictionary.
- DataLoader.
- DataSplitter.
- Validation.

## Phase 3 — ML

Learn/build:

- Feature engineering.
- Preprocessing.
- Baseline models.
- Evaluation.
- Model selection.
- Model artifacts.

## Phase 4 — MLOps

Learn/build:

- MLflow.
- Model registry.
- Model versioning.
- Retraining.
- DVC where useful.

## Phase 5 — Explainable AI

Learn/build:

- SHAP.
- Recommendation engine.

## Phase 6 — Backend

Learn/build:

- FastAPI.
- PostgreSQL.
- API design.
- Background jobs.

## Phase 7 — Frontend

Learn/build:

- React.
- Dashboard.
- Upload.
- Results.
- Employee details.
- History.

## Phase 8 — Production

Learn/build:

- Docker.
- CI/CD.
- Deployment.
- Monitoring.
- Data drift.

---

# 51. MVP

The first complete vertical slice should be:

```text
CSV Upload
   ↓
Validation
   ↓
Preprocessing
   ↓
ML Prediction
   ↓
Risk Score
   ↓
Database
   ↓
Dashboard
```

MVP is complete when HR can:

1. Upload a valid employee CSV.
2. See validation results.
3. Start a prediction job.
4. Receive employee risk predictions.
5. View risk distribution.
6. Open employee details.
7. See prediction history.

Advanced MLOps and enterprise features come after this works reliably.

---

# 52. Definition of Done

A feature is not finished simply because the code runs.

A feature should have:

- Implementation.
- Clear responsibility.
- Type hints.
- Error handling.
- Tests.
- Logging where appropriate.
- Documentation.
- Clean naming.
- No hardcoded secrets.
- Manual verification.
- Git commit.

---

# 53. Git Commit Style

Examples:

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

Each commit should explain what changed.

---

# 54. Important Product Decisions

## Frontend

**React**

Why:

- Better dashboard control.
- Better routing.
- Reusable components.
- More production-style UI.

## Backend

**FastAPI**

Why:

- Python-native.
- Good fit for ML services.
- Automatic API documentation.
- Strong request validation through Pydantic.

## Database

**PostgreSQL**

Why:

- Relational structure.
- Reliable persistence.
- Good fit for users, uploads, jobs, predictions, and model metadata.

## Input

**CSV + individual employee**

Why:

- CSV supports bulk analysis.
- Individual entry supports focused investigation.

## Prediction

**Individual + batch**

Why:

Both use cases matter.

## Long-running jobs

**Background processing**

Why:

Users should not have to wait with an open browser request.

## Model retraining

**Separate candidate model**

Why:

The current production model should continue serving during training.

---

# 55. Corrections to Avoid Bad Engineering

## Do not automatically convert invalid data

Example:

```text
Negative salary
```

Do not blindly use:

```python
abs(value)
```

unless there is an explicit business rule.

## Do not automatically fill every missing value

Missing-value handling should depend on:

- Feature meaning.
- Training statistics.
- Business rules.
- Model requirements.

## Do not continue inference with missing mandatory features

If the model requires a feature and it is missing, prediction should normally fail safely.

## Do not confuse probability with certainty

```text
Risk = 87%
```

means:

> The model estimates a high probability under its learned assumptions.

It does not mean:

> This employee will definitely leave.

---

# 56. Example Final Prediction

Input:

```text
Employee:
Age = 35
Education = Bachelors
City = Bangalore
PaymentTier = 2
Gender = Male
EverBenched = Yes
ExperienceInCurrentDomain = 5
JoiningYear = 2016
```

Processing:

```text
Raw Employee
     ↓
Validation
     ↓
Feature Engineering
     ↓
YearsAtCompany
     ↓
Preprocessing
     ↓
ML Model
```

Output:

```text
Risk Probability: 82%
Risk Level: High
```

Then:

```text
SHAP
 ↓
Top contributing features
 ↓
Recommendation Engine
 ↓
Suggested HR actions
```

Finally:

```text
PostgreSQL
```

stores the result.

---

# 57. How to Explain the Project to an Interviewer

A concise explanation:

> "I am building an employee attrition intelligence platform that helps HR teams identify employees who may be at higher risk of leaving. The user uploads employee data through a React frontend. FastAPI receives the file and sends it through a validation engine that checks the file, schema, data types, and business rules. Valid data goes through feature engineering and a reusable preprocessing pipeline before reaching the classification model. The model produces an attrition probability and risk category. I then use SHAP to explain which features influenced the prediction and a recommendation engine to suggest possible retention actions. Results and prediction history are stored in PostgreSQL. For large files, prediction runs as a background job. MLflow is used for experiment and model versioning, and the system is designed to be containerized and deployed through CI/CD."

---

# 58. How to Explain the Architecture

The simplest explanation is:

```text
React
  ↓
FastAPI
  ↓
Services
  ↓
AI Engine
  ↓
PostgreSQL
```

More specifically:

```text
React
  ↓
FastAPI
  ↓
Upload Service
  ↓
Validation
  ↓
Prediction Service
  ↓
Feature Engineering
  ↓
Preprocessing
  ↓
ML Model
  ↓
SHAP
  ↓
Recommendation Engine
  ↓
PostgreSQL
  ↓
React Dashboard
```

---

# 59. How to Explain Retraining

> "The production model should never be replaced while a new model is being trained. I train the new model separately, evaluate it against the required metrics, register it as a candidate version, and promote it only if it passes the validation criteria. Until then, the current production model continues serving predictions. If the new model later causes issues, the previous model can be restored."

---

# 60. How to Explain Validation

> "I designed validation as multiple independent validators rather than one large validation function. The file validator checks the file itself, the column validator checks schema, the data type validator checks expected types, and business rule validators check domain constraints. Each validator contributes to a standardized validation result so the user can see multiple problems in one upload instead of discovering them one by one."

---

# 61. How to Explain Why This Is More Than a College ML Project

The model itself is only one part.

The complete system includes:

```text
Data ingestion
+
Validation
+
Feature engineering
+
ML training
+
Evaluation
+
Model versioning
+
Inference
+
Explainability
+
Recommendations
+
API
+
Database
+
Frontend
+
Background jobs
+
Testing
+
Docker
+
CI/CD
+
Monitoring
```

That makes the project an end-to-end AI product.

---

# 62. Learning Rule for This Project

For every new module, do not simply copy code.

Before implementing it, understand:

```text
What problem does it solve?
        ↓
Why do we need it?
        ↓
Why does it belong in this folder?
        ↓
What input does it receive?
        ↓
What output does it produce?
        ↓
What can go wrong?
        ↓
How will we test it?
```

The goal is that you can eventually rebuild the project from scratch without relying on this document.

---

# 63. Final Mental Model

Think of the entire product as six major layers:

```text
1. USER LAYER
   React
       ↓

2. APPLICATION LAYER
   FastAPI
       ↓

3. DATA QUALITY LAYER
   Validation
       ↓

4. AI LAYER
   Feature Engineering
   Preprocessing
   Model
   SHAP
   Recommendations
       ↓

5. STORAGE LAYER
   PostgreSQL
       ↓

6. OPERATIONS LAYER
   MLflow
   Docker
   CI/CD
   Logging
   Monitoring
```

If you understand these six layers, you understand the overall project.

---

# 64. Final Project Goal

The goal is not:

> "Build an employee attrition model."

The goal is:

> "Build a reliable, explainable, maintainable AI product that uses employee data to provide attrition-risk intelligence to HR teams."

The ML model is one component inside that larger system.

---

# 65. Current Next Step

The immediate development path should remain:

```text
Foundation cleanup
        ↓
Validation completion
        ↓
Preprocessing completion
        ↓
Baseline model
        ↓
Evaluation
        ↓
Model selection
        ↓
MLflow
        ↓
Inference
        ↓
SHAP
        ↓
Recommendations
        ↓
FastAPI
        ↓
PostgreSQL
        ↓
React
        ↓
Docker
        ↓
CI/CD
        ↓
Monitoring
```

We should implement this gradually and explain every new file before creating it.
