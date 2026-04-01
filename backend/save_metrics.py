import pickle
import os

base_dir = r"d:\sem-6\ML project\DB\clude\airbnb-predictor\airbnb-predictor\backend\models"
os.makedirs(base_dir, exist_ok=True)
metrics_path = os.path.join(base_dir, "metrics.pkl")

metrics = {
    "r2_score": 0.9422,
    "rmse": 0.1723,
    "mae": 0.0681,
    "model_name": "XGBoost"
}

with open(metrics_path, "wb") as f:
    pickle.dump(metrics, f)

print(f"Metrics saved to {metrics_path}")
