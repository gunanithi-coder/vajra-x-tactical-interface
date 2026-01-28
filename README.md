# 🛡️ VAJRA-X | Integrated Tactical Edge Intelligence

VAJRA-X is an AI-Defined Soldier System (ADSS) designed for elite infantry in contested, GPS-denied, and network-silent environments. Built for Problem Statement 5, it provides real-time situational awareness and drone tracking entirely at the Tactical Edge.

---

## 🚀 Tactical Modules & Prototype Features

## 🛰️ NAV: Neural Navigation (PNT-Assurance)
  
 * VBN Mode: Actively replaces GPS with Vision-Based Navigation using monocular RGB terrain matching when signals are compromised.
 * Signal Jamming Resilience: The UI autonomously shifts to a high-contrast wireframe mode during GNSS loss to ensure mission continuity.
 * Dead Reckoning: Integrated IMU support for pathfinding during total visual or signal blackout.

## 🛸 INTEL:Sentinel Passive Defense
  
 * Neural Drone Detection: Real-time classification of UAV signatures (Fixed-Wing ISR, Mavic-3 Pro, Custom FPV) using acoustic spectral analysis.
 * AI Reasoning Log: Provides transparent, real-time justification for every detected contact to build operator trust in AI decisions.
 * Acoustic Shot-Spotter: 360-degree vectoring for gunshot triangulation using decentralized local mesh nodes.

## 🧠 COG-NET: Decisive UI Agent
  
 * High Stress Detection: The HUD autonomously triggers a "Simplified Mode" when biological sensors detect heart rate or stress spikes exceeding safety thresholds.
 * Cognitive Load Management: Strips away non-essential data during high-stress encounters to focus on navigation and objective survival.
 * Stealth Protocol: A system-wide shift to Deep Red (#8B0000) spectrum to preserve night vision and minimize light signatures.

## 🏥 BIO: Predictive Triage HUD
  
 * rPPG Camera Scan: Non-contact, real-time vital sign monitoring (HR, SpO2) via monocular camera analysis.
 * Medical Failure Prediction: Early warning indicators for High Altitude Pulmonary Edema (HAPE) risk based on biometric trends.
   
---

##  🛠️ Technical Stack & "Loop" Compliance

* **Frontend & 3D Engine:** Built with React.js and Three.js/Fiber for interactive, zero-latency tactical terrain visualization.

* **Edge Intelligence:** Hundred Percentage  on-device processing; no cloud dependency, ensuring operation in "network-silent" zones.

* **Trust & Safety:** Features an integrated Dead-Man's Switch for emergency data wipe and Ghost Mesh for encrypted peer-to-peer communication.

---

## 📥 Deployment Instructions


# Clone the repository
```bash
git clone https://github.com/gunanithi-coder/vajra-tactical-interface.git
```
# Install dependencies
```bash
npm install
```

# Start the tactical development server
```Bash
npm run dev
```

## 👥 Submission Information
Team Name: Vajra-X
