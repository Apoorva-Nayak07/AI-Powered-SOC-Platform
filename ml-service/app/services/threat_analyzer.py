import numpy as np
from typing import Dict, List, Any, Optional

class ThreatAnalyzer:
    """
    Threat analysis and risk scoring engine
    """
    
    def __init__(self):
        self.threat_weights = {
            'malware': 0.9,
            'ransomware': 0.95,
            'phishing': 0.7,
            'ddos': 0.8,
            'brute_force': 0.75,
            'sql_injection': 0.85,
            'xss': 0.6,
            'port_scan': 0.5,
            'unauthorized_access': 0.9,
            'data_exfiltration': 0.95,
            'zero_day': 1.0,
            'insider_threat': 0.85,
        }
        
        self.mitre_attack_mapping = {
            'brute_force': {
                'tactic': 'Credential Access',
                'technique': 'Brute Force',
                'id': 'T1110'
            },
            'phishing': {
                'tactic': 'Initial Access',
                'technique': 'Phishing',
                'id': 'T1566'
            },
            'malware': {
                'tactic': 'Execution',
                'technique': 'User Execution',
                'id': 'T1204'
            },
            'sql_injection': {
                'tactic': 'Initial Access',
                'technique': 'Exploit Public-Facing Application',
                'id': 'T1190'
            },
            'data_exfiltration': {
                'tactic': 'Exfiltration',
                'technique': 'Exfiltration Over C2 Channel',
                'id': 'T1041'
            },
            'port_scan': {
                'tactic': 'Discovery',
                'technique': 'Network Service Scanning',
                'id': 'T1046'
            },
        }
    
    def is_loaded(self):
        """Check if analyzer is ready"""
        return True
    
    def analyze(
        self,
        source_ip: str,
        destination_ip: Optional[str],
        threat_type: str,
        indicators: List[str],
        metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Analyze a threat and provide risk assessment
        
        Args:
            source_ip: Source IP address
            destination_ip: Destination IP address
            threat_type: Type of threat
            indicators: List of threat indicators
            metadata: Additional metadata
        
        Returns:
            Dictionary with risk analysis
        """
        try:
            # Calculate base risk score from threat type
            base_risk = self.threat_weights.get(threat_type, 0.5) * 100
            
            # Adjust risk based on indicators
            indicator_score = self._analyze_indicators(indicators)
            
            # Adjust risk based on IP reputation (simulated)
            ip_score = self._analyze_ip_reputation(source_ip)
            
            # Calculate final risk score
            risk_score = (base_risk * 0.5) + (indicator_score * 0.3) + (ip_score * 0.2)
            risk_score = min(100, max(0, risk_score))
            
            # Determine threat level
            if risk_score >= 80:
                threat_level = 'critical'
            elif risk_score >= 60:
                threat_level = 'high'
            elif risk_score >= 40:
                threat_level = 'medium'
            else:
                threat_level = 'low'
            
            # Calculate confidence
            confidence = self._calculate_confidence(indicators, metadata)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(
                threat_type,
                threat_level,
                indicators
            )
            
            # Get MITRE ATT&CK mapping
            mitre_attack = self.mitre_attack_mapping.get(threat_type)
            
            return {
                'risk_score': float(risk_score),
                'confidence': float(confidence),
                'threat_level': threat_level,
                'recommendations': recommendations,
                'mitre_attack': mitre_attack
            }
        
        except Exception as e:
            print(f"Error in threat analysis: {e}")
            return {
                'risk_score': 50.0,
                'confidence': 50.0,
                'threat_level': 'medium',
                'recommendations': ['Monitor the situation closely'],
                'mitre_attack': None
            }
    
    def _analyze_indicators(self, indicators: List[str]) -> float:
        """
        Analyze threat indicators and return a score
        """
        if not indicators:
            return 30.0
        
        # More indicators = higher confidence in threat
        indicator_count_score = min(50, len(indicators) * 10)
        
        # Check for high-risk indicators
        high_risk_keywords = [
            'exploit', 'payload', 'shell', 'backdoor', 'trojan',
            'ransomware', 'keylogger', 'rootkit', 'botnet'
        ]
        
        high_risk_count = sum(
            1 for indicator in indicators
            for keyword in high_risk_keywords
            if keyword.lower() in indicator.lower()
        )
        
        high_risk_score = min(50, high_risk_count * 15)
        
        return indicator_count_score + high_risk_score
    
    def _analyze_ip_reputation(self, ip: str) -> float:
        """
        Analyze IP reputation (simulated)
        In production, this would query threat intelligence feeds
        """
        # Simulate IP reputation check
        # In reality, this would check against threat intelligence databases
        
        # For demonstration, use simple heuristics
        octets = ip.split('.')
        
        # Private IPs are less risky
        if octets[0] in ['10', '172', '192']:
            return 20.0
        
        # Simulate random reputation score
        reputation_score = np.random.uniform(30, 80)
        
        return reputation_score
    
    def _calculate_confidence(
        self,
        indicators: List[str],
        metadata: Dict[str, Any]
    ) -> float:
        """
        Calculate confidence in the threat assessment
        """
        confidence = 50.0
        
        # More indicators = higher confidence
        if len(indicators) > 5:
            confidence += 20
        elif len(indicators) > 2:
            confidence += 10
        
        # Metadata presence increases confidence
        if metadata:
            confidence += len(metadata) * 2
        
        # Add some randomness for realism
        confidence += np.random.uniform(-5, 10)
        
        return min(100, max(50, confidence))
    
    def _generate_recommendations(
        self,
        threat_type: str,
        threat_level: str,
        indicators: List[str]
    ) -> List[str]:
        """
        Generate actionable recommendations based on threat analysis
        """
        recommendations = []
        
        # General recommendations based on threat level
        if threat_level == 'critical':
            recommendations.append('Immediate action required: Isolate affected systems')
            recommendations.append('Activate incident response team')
            recommendations.append('Block source IP at firewall level')
        elif threat_level == 'high':
            recommendations.append('Investigate immediately')
            recommendations.append('Consider blocking source IP')
            recommendations.append('Review security logs for related activity')
        elif threat_level == 'medium':
            recommendations.append('Monitor closely for escalation')
            recommendations.append('Review and update security policies')
        else:
            recommendations.append('Continue monitoring')
            recommendations.append('Document for future reference')
        
        # Threat-specific recommendations
        threat_specific = {
            'brute_force': [
                'Implement account lockout policies',
                'Enable multi-factor authentication',
                'Review failed login attempts'
            ],
            'malware': [
                'Run full antivirus scan',
                'Isolate infected systems',
                'Check for lateral movement'
            ],
            'phishing': [
                'Block sender domain',
                'Educate users about phishing',
                'Review email security policies'
            ],
            'ddos': [
                'Enable DDoS mitigation',
                'Contact ISP for assistance',
                'Scale infrastructure if possible'
            ],
            'sql_injection': [
                'Patch vulnerable application',
                'Implement input validation',
                'Review database access logs'
            ],
            'data_exfiltration': [
                'Block outbound connections',
                'Review data access logs',
                'Implement DLP policies'
            ],
        }
        
        if threat_type in threat_specific:
            recommendations.extend(threat_specific[threat_type][:2])
        
        return recommendations[:5]  # Return top 5 recommendations
