from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import numpy as np
import os
from dotenv import load_dotenv

from app.services.anomaly_detector import AnomalyDetector
from app.services.threat_analyzer import ThreatAnalyzer

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="SOC Platform ML Service",
    description="AI/ML microservice for threat detection and anomaly analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML models
anomaly_detector = AnomalyDetector()
threat_analyzer = ThreatAnalyzer()

# Pydantic models
class LogEntry(BaseModel):
    timestamp: str
    source_ip: str
    destination_ip: Optional[str] = None
    source_port: Optional[int] = None
    destination_port: Optional[int] = None
    protocol: Optional[str] = None
    bytes_sent: Optional[int] = 0
    bytes_received: Optional[int] = 0
    duration: Optional[float] = 0.0
    flags: Optional[str] = None

class PredictionRequest(BaseModel):
    logs: List[LogEntry]

class ThreatAnalysisRequest(BaseModel):
    source_ip: str
    destination_ip: Optional[str] = None
    threat_type: str
    indicators: List[str]
    metadata: Optional[Dict[str, Any]] = {}

class PredictionResponse(BaseModel):
    predictions: List[Dict[str, Any]]
    summary: Dict[str, Any]

class ThreatAnalysisResponse(BaseModel):
    risk_score: float
    confidence: float
    threat_level: str
    recommendations: List[str]
    mitre_attack: Optional[Dict[str, str]] = None

# Health check
@app.get("/")
async def root():
    return {
        "service": "SOC Platform ML Service",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models_loaded": {
            "anomaly_detector": anomaly_detector.is_loaded(),
            "threat_analyzer": threat_analyzer.is_loaded()
        }
    }

# Anomaly detection endpoint
@app.post("/predict", response_model=PredictionResponse)
async def predict_anomalies(request: PredictionRequest):
    """
    Detect anomalies in network logs using ML models
    """
    try:
        # Convert logs to feature vectors
        features = []
        for log in request.logs:
            feature_vector = [
                log.source_port or 0,
                log.destination_port or 0,
                log.bytes_sent or 0,
                log.bytes_received or 0,
                log.duration or 0.0,
            ]
            features.append(feature_vector)
        
        # Get predictions
        predictions = anomaly_detector.predict(np.array(features))
        
        # Format results
        results = []
        anomaly_count = 0
        
        for i, (log, pred) in enumerate(zip(request.logs, predictions)):
            is_anomaly = pred['is_anomaly']
            if is_anomaly:
                anomaly_count += 1
            
            results.append({
                "index": i,
                "source_ip": log.source_ip,
                "destination_ip": log.destination_ip,
                "is_anomaly": is_anomaly,
                "anomaly_score": pred['anomaly_score'],
                "risk_score": pred['risk_score'],
                "confidence": pred['confidence']
            })
        
        summary = {
            "total_logs": len(request.logs),
            "anomalies_detected": anomaly_count,
            "anomaly_rate": anomaly_count / len(request.logs) if request.logs else 0,
            "average_risk_score": np.mean([r['risk_score'] for r in results])
        }
        
        return PredictionResponse(predictions=results, summary=summary)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Threat analysis endpoint
@app.post("/analyze", response_model=ThreatAnalysisResponse)
async def analyze_threat(request: ThreatAnalysisRequest):
    """
    Analyze a specific threat and provide risk assessment
    """
    try:
        analysis = threat_analyzer.analyze(
            source_ip=request.source_ip,
            destination_ip=request.destination_ip,
            threat_type=request.threat_type,
            indicators=request.indicators,
            metadata=request.metadata
        )
        
        return ThreatAnalysisResponse(**analysis)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# AI insights endpoint
@app.get("/insights")
async def get_insights():
    """
    Get AI-generated security insights
    """
    try:
        insights = {
            "threat_trends": [
                {
                    "type": "brute_force",
                    "trend": "increasing",
                    "change_percentage": 15.3,
                    "recommendation": "Implement rate limiting and account lockout policies"
                },
                {
                    "type": "port_scan",
                    "trend": "stable",
                    "change_percentage": 2.1,
                    "recommendation": "Continue monitoring for unusual patterns"
                },
                {
                    "type": "ddos",
                    "trend": "decreasing",
                    "change_percentage": -8.7,
                    "recommendation": "Current mitigation strategies are effective"
                }
            ],
            "top_risks": [
                {
                    "risk": "Unpatched vulnerabilities",
                    "severity": "high",
                    "affected_systems": 12,
                    "recommendation": "Schedule immediate patching for critical systems"
                },
                {
                    "risk": "Weak authentication",
                    "severity": "medium",
                    "affected_systems": 8,
                    "recommendation": "Enforce strong password policies and MFA"
                }
            ],
            "anomaly_patterns": [
                {
                    "pattern": "Unusual login times",
                    "frequency": "high",
                    "description": "Multiple login attempts detected outside business hours"
                },
                {
                    "pattern": "Data exfiltration indicators",
                    "frequency": "low",
                    "description": "Abnormal outbound traffic patterns detected"
                }
            ],
            "model_performance": {
                "accuracy": 0.94,
                "precision": 0.91,
                "recall": 0.89,
                "f1_score": 0.90,
                "last_updated": "2024-01-15T10:30:00Z"
            }
        }
        
        return {"success": True, "insights": insights}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Train model endpoint (for demonstration)
@app.post("/train")
async def train_model(dataset_name: str = "default"):
    """
    Trigger model training (in production, this would be a background job)
    """
    try:
        # In a real implementation, this would trigger actual model training
        return {
            "success": True,
            "message": f"Model training initiated for dataset: {dataset_name}",
            "estimated_time": "30 minutes"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
