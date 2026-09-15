import pandas as pd
import numpy as np
import os
from sklearn.preprocessing import MinMaxScaler
from sklearn.cluster import KMeans

def get_deployment_priorities():
    base_dir = os.path.dirname(__file__)
    vacancies_path = os.path.join(base_dir, 'data', 'rhs_2020_vacancies_shortfalls.csv')
    density_path = os.path.join(base_dir, 'data', 'rhs_population_density.csv')
    
    # 1. Load Data
    vac_df = pd.read_csv(vacancies_path)
    den_df = pd.read_csv(density_path)
    
    # 2. Clean Vacancies Data
    vac_df = vac_df.replace('*', 0).replace('NA', 0).fillna(0)
    for col in vac_df.columns[1:]:
        vac_df[col] = pd.to_numeric(vac_df[col], errors='coerce').fillna(0).astype(int)
        
    # 3. Clean Density Data
    den_df = den_df.replace('NA', 0).replace('*', 0).fillna(0)
    den_df['State/UT'] = den_df['State/UT'].astype(str).str.replace('*', '', regex=False).str.strip()
    for col in den_df.columns[1:]:
        den_df[col] = pd.to_numeric(den_df[col], errors='coerce').fillna(0)
        
    vac_df['State/UT'] = vac_df['State/UT'].astype(str).str.strip()
    
    # Merge datasets on State/UT
    merged_df = pd.merge(vac_df, den_df, on='State/UT', how='inner')
    
    if merged_df.empty:
        return []
        
    # Features for AI Model
    merged_df['Total_Medical_Shortage'] = (
        merged_df['Doctors_Vacent'] + 
        merged_df['Specialists_Vacent'] + 
        merged_df['NursingStaff_Vacent']
    )
    
    features = merged_df[['Total_Medical_Shortage', 'Rural_Population_Density']]
    
    # Normalize features
    scaler = MinMaxScaler()
    normalized_features = scaler.fit_transform(features)
    
    # Calculate Priority Score (Weighted Sum of Normalized Features)
    priority_scores = (normalized_features[:, 0] * 0.6) + (normalized_features[:, 1] * 0.4)
    
    merged_df['Priority_Score'] = priority_scores * 100 # Scale 0 to 100
    
    # K-Means Clustering to group into priority categories
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(priority_scores.reshape(-1, 1))
    merged_df['Cluster'] = clusters
    
    cluster_centers = kmeans.cluster_centers_.flatten()
    sorted_centers_idx = np.argsort(cluster_centers)[::-1]
    
    category_map = {
        sorted_centers_idx[0]: "Critical Need",
        sorted_centers_idx[1]: "Moderate Need",
        sorted_centers_idx[2]: "Low Need"
    }
    
    results = []
    for _, row in merged_df.sort_values(by='Priority_Score', ascending=False).iterrows():
        cat = category_map[row['Cluster']]
        shortage = int(row['Total_Medical_Shortage'])
        density = int(row['Rural_Population_Density'])
        
        reason = f"High Medical Staff Shortage ({shortage} vacancies)" if shortage > 1000 else f"Staff Shortage ({shortage} vacancies)"
        if density > 400:
            reason += f" in densely populated rural areas ({density} pop/sq.km)"
            
        results.append({
            "state": row['State/UT'],
            "priority_score": round(row['Priority_Score'], 1),
            "category": cat,
            "shortage": shortage,
            "density": density,
            "reason": reason
        })
        
    return results

if __name__ == "__main__":
    res = get_deployment_priorities()
    for r in res[:5]:
        print(r)
