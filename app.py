import joblib, json, numpy as np
from sklearn.tree import export_text

model = joblib.load('model.pkl')
le    = joblib.load('label_encoder.pkl')

print("TYPE:", type(model).__name__)
print("CLASSES:", list(le.classes_))
print("N_FEATURES:", model.n_features_in_)

if hasattr(model, 'estimators_'):
    print("FOREST: yes,", model.n_estimators, "trees")
    # Export first 3 trees to check depth
    for i, t in enumerate(model.estimators_[:3]):
        print(f"Tree {i} depth:", t.get_depth())
elif hasattr(model, 'tree_'):
    print("SINGLE TREE depth:", model.get_depth())
    print(export_text(model, max_depth=3))
elif hasattr(model, 'coef_'):
    print("LINEAR: coef shape", model.coef_.shape)
else:
    print("OTHER")

# Test prediction to confirm it works
FEATURES = ["acc_max","gyro_max","lin_max","acc_kurtosis",
            "gyro_kurtosis","acc_skewness","gyro_skewness",
            "post_gyro_max","post_lin_max"]
import pandas as pd
sample = pd.DataFrame([{
    "acc_max":26.0,"gyro_max":7.3,"lin_max":11.1,
    "acc_kurtosis":20.4,"gyro_kurtosis":2.8,
    "acc_skewness":3.9,"gyro_skewness":1.6,
    "post_gyro_max":7.1,"post_lin_max":10.8
}])
pred = model.predict(sample)[0]
prob = model.predict_proba(sample)[0]
label = le.inverse_transform([pred])[0]
print("TEST PREDICTION:", label)
print("PROBABILITIES:", dict(zip(le.classes_, np.round(prob,3))))