import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import pickle
import os

print("--- Telemedicine Deployment Optimization Model ---")

# Step 1: Check if the real dataset exists
data_path = 'data/telehealth_data.csv'
if not os.path.exists(data_path):
    print(f"ERROR: Dataset not found at {data_path}.")
    print("Please download a real telehealth dataset from Kaggle and save it as 'data/telehealth_data.csv'.")
    print("Expected columns (or similar): 'hour', 'village_id', 'bandwidth_mbps', 'demand', 'drop_rate'")
    exit(1)

print("Loading dataset...")
df = pd.read_csv(data_path)

# Ensure columns exist (basic preprocessing mapping)
# Note: This is a generic preprocessor. If your Kaggle dataset has different column names, rename them below.
required_cols = ['hour', 'bandwidth_mbps', 'demand']
missing = [c for c in required_cols if c not in df.columns]

if missing:
    print(f"WARNING: Missing expected columns: {missing}.")
    print("Attempting to auto-map columns or please rename them in your CSV to match 'hour', 'bandwidth_mbps', 'demand'.")
    # In a real scenario, we would map columns here. For now, assuming they match or user renames them.
    exit(1)

# Features and Target
X = df[['hour', 'bandwidth_mbps']]
y = df['demand'] # Target: predict peak demand/doctor requirement

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training Random Forest Regressor for Demand Optimization...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluation
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Model Training Complete!")
print(f"Mean Squared Error: {mse:.4f}")
print(f"R-squared Score: {r2:.4f}")

# Save the model
with open('optimization_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Model saved as 'optimization_model.pkl'.")
print("You can now update app.py to load this model and serve real predictions in /api/optimize/analytics.")
