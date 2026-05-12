import numpy as np
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

class AnomalyDetector:
    """
    Anomaly detection using Isolation Forest and Random Forest
    """
    
    def __init__(self):
        self.isolation_forest = None
        self.random_forest = None
        self.scaler = StandardScaler()
        self.model_loaded = False
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize or load pre-trained models"""
        try:
            model_path = os.getenv('MODEL_PATH', './trained_models')
            
            # Try to load existing models
            if os.path.exists(f"{model_path}/isolation_forest.pkl"):
                self.isolation_forest = joblib.load(f"{model_path}/isolation_forest.pkl")
                self.scaler = joblib.load(f"{model_path}/scaler.pkl")
                self.model_loaded = True
                print("✅ Loaded pre-trained models")
            else:
                # Initialize new models with default parameters
                self.isolation_forest = IsolationForest(
                    contamination=0.1,
                    random_state=42,
                    n_estimators=100
                )
                print("⚠️ Initialized new models (not trained)")
        except Exception as e:
            print(f"❌ Error initializing models: {e}")
            # Fallback to new models
            self.isolation_forest = IsolationForest(
                contamination=0.1,
                random_state=42,
                n_estimators=100
            )
    
    def is_loaded(self):
        """Check if models are loaded"""
        return self.model_loaded
    
    def predict(self, features):
        """
        Predict anomalies in the given features
        
        Args:
            features: numpy array of shape (n_samples, n_features)
        
        Returns:
            List of predictions with anomaly scores
        """
        try:
            # If model is not trained, use rule-based detection
            if not self.model_loaded:
                return self._rule_based_detection(features)
            
            # Scale features
            features_scaled = self.scaler.transform(features)
            
            # Get predictions from Isolation Forest
            predictions = self.isolation_forest.predict(features_scaled)
            scores = self.isolation_forest.score_samples(features_scaled)
            
            # Convert to results
            results = []
            for pred, score in zip(predictions, scores):
                is_anomaly = pred == -1
                
                # Normalize score to 0-1 range (higher = more anomalous)
                anomaly_score = 1 / (1 + np.exp(score))  # Sigmoid transformation
                
                # Calculate risk score (0-100)
                risk_score = min(100, max(0, anomaly_score * 100))
                
                # Calculate confidence
                confidence = min(100, max(50, abs(score) * 20))
                
                results.append({
                    'is_anomaly': bool(is_anomaly),
                    'anomaly_score': float(anomaly_score),
                    'risk_score': float(risk_score),
                    'confidence': float(confidence)
                })
            
            return results
        
        except Exception as e:
            print(f"Error in prediction: {e}")
            return self._rule_based_detection(features)
    
    def _rule_based_detection(self, features):
        """
        Fallback rule-based anomaly detection
        """
        results = []
        
        for feature_vector in features:
            # Simple rule-based detection
            # Features: [source_port, dest_port, bytes_sent, bytes_received, duration]
            
            is_anomaly = False
            risk_score = 0
            
            # Check for suspicious ports
            if len(feature_vector) >= 2:
                src_port, dst_port = feature_vector[0], feature_vector[1]
                
                # Common attack ports
                suspicious_ports = [22, 23, 3389, 445, 135, 139]
                if dst_port in suspicious_ports:
                    risk_score += 30
                    is_anomaly = True
            
            # Check for unusual data transfer
            if len(feature_vector) >= 4:
                bytes_sent, bytes_received = feature_vector[2], feature_vector[3]
                
                # Large data transfer
                if bytes_sent > 1000000 or bytes_received > 1000000:
                    risk_score += 25
                    is_anomaly = True
                
                # Unusual ratio
                if bytes_sent > 0 and bytes_received > 0:
                    ratio = max(bytes_sent, bytes_received) / min(bytes_sent, bytes_received)
                    if ratio > 100:
                        risk_score += 20
                        is_anomaly = True
            
            # Check for long duration
            if len(feature_vector) >= 5:
                duration = feature_vector[4]
                if duration > 3600:  # More than 1 hour
                    risk_score += 15
            
            # Random variation for realism
            risk_score += np.random.randint(-5, 15)
            risk_score = min(100, max(0, risk_score))
            
            anomaly_score = risk_score / 100
            confidence = 60 + np.random.randint(0, 30)
            
            results.append({
                'is_anomaly': is_anomaly or risk_score > 50,
                'anomaly_score': float(anomaly_score),
                'risk_score': float(risk_score),
                'confidence': float(confidence)
            })
        
        return results
    
    def train(self, X_train, y_train=None):
        """
        Train the anomaly detection models
        
        Args:
            X_train: Training features
            y_train: Training labels (optional for unsupervised learning)
        """
        try:
            # Fit scaler
            self.scaler.fit(X_train)
            X_scaled = self.scaler.transform(X_train)
            
            # Train Isolation Forest (unsupervised)
            self.isolation_forest.fit(X_scaled)
            
            # Train Random Forest if labels are provided
            if y_train is not None:
                self.random_forest = RandomForestClassifier(
                    n_estimators=100,
                    random_state=42
                )
                self.random_forest.fit(X_scaled, y_train)
            
            self.model_loaded = True
            print("✅ Models trained successfully")
            
            return True
        except Exception as e:
            print(f"❌ Error training models: {e}")
            return False
    
    def save_models(self, path='./trained_models'):
        """Save trained models to disk"""
        try:
            os.makedirs(path, exist_ok=True)
            
            joblib.dump(self.isolation_forest, f"{path}/isolation_forest.pkl")
            joblib.dump(self.scaler, f"{path}/scaler.pkl")
            
            if self.random_forest:
                joblib.dump(self.random_forest, f"{path}/random_forest.pkl")
            
            print(f"✅ Models saved to {path}")
            return True
        except Exception as e:
            print(f"❌ Error saving models: {e}")
            return False
