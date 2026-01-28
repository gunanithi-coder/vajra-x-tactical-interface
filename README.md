🛡️ VAJRA-X | Integrated AI-Defined Soldier System (ISSAS)
VAJRA-X is a military-grade Tactical Edge Intelligence layer designed for elite infantry in contested, GPS-denied, and network-silent environments. Developed for Problem Statement 5, it provides real-time drone tracking and autonomous situational awareness without cloud reliance.

🚀 Core Intelligence Modules
<details> <summary><b>🛰️ NAV: Neural Navigation (PNT-Assurance)</b></summary>


Solves <b>Problem Track 1 (Build for Failure)</b> by maintaining positioning when GNSS signals are jammed. <ul> <li><b>VBN Mode:</b> Vision-Based Navigation using monocular RGB feeds to match terrain wireframes against offline data.</li> <li><b>Dead Reckoning:</b> Integrated IMU fusion for inertial pathfinding in total signal blackout.</li> </ul> </details>

<details> <summary><b>🛸 INTEL: Sentinel Passive Defense</b></summary>


Addresses <b>Problem Statement 5 (Intelligent Drone Perception)</b>. <ul> <li><b>Acoustic Fingerprinting:</b> CNN-based identification of UAV motor signatures (Mavic, FPV) via spectral analysis.</li> <li><b>Shot-Spotter:</b> 360-degree vectoring for gunshot triangulation using local mesh-net nodes.</li> <li><b>AI Reasoning Log:</b> Provides transparent justification for every detected threat to ensure long-term trust.</li> </ul> </details>

<details> <summary><b>🧠 COG-NET: Decisive UI Agent</b></summary>


Aligned with <b>Problem Track 2 (Human + Machine Decision Systems)</b>. <ul> <li><b>Stress-Responsive HUD:</b> Monitored via rPPG biometrics; autonomously simplifies the UI during high-stress spikes (>140bpm) to prevent "Panic Blindness".</li> <li><b>Ghost Mesh:</b> Decentralized peer-to-peer tactical mesh ensuring secure data integrity.</li> </ul> </details>

<details> <summary><b>🏥 BIO: Predictive Medical Triage</b></summary>


A proactive approach to soldier health in extreme environments. <ul> <li><b>rPPG Scanning:</b> Non-contact vital sign monitoring (HR, SpO2) via real-time camera analysis.</li> <li><b>HAPE Risk Prediction:</b> Predictive analytics that convert raw sensor signals into actionable health alerts for high-altitude operations.</li> </ul> </details>

🛠️ Technical Implementation
<details> <summary><b>View Stack & Deployment</b></summary>


<ul> <li><b>Frontend:</b> React, Tailwind CSS, Framer Motion (Zero-latency tactical transitions).</li> <li><b>Engine:</b> Three.js for interactive 3D terrain visualization.</li> <li><b>Edge Logic:</b> 100% on-device processing via Edge-optimized Vercel deployment.</li> <li>
