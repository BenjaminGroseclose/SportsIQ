# SportsIQ: Strategic Business Plan

**Version:** 2.0 (The "Data-Light" Pivot)
**Date:** December 2025

---

## **1. Executive Summary**

**SportsIQ** is a sports intelligence platform designed for the "highly engaged" fan—fantasy commissioners, armchair GMs, and aspiring scouts. Unlike competitors that commoditize expensive live stats, SportsIQ focuses on **proprietary predictive modeling**, **GM simulation tools**, and **community-sourced scouting**.

**The Core Value Proposition:**
We do not sell the box score; we sell the _interpretation_ of the box score. By leveraging historical data to feed internal "Black Box" algorithms, we generate unique insights (predictions, trade values, scout grades) that are defensible, high-margin, and free from restrictive real-time data licensing costs.

---

## **2. The "Data-Light" Strategy**

_Solving the licensing bottleneck by changing the nature of the data we serve._

### **A. Proprietary "Black Box" Metrics (The Oracle)**

Instead of displaying raw licensed stats (e.g., "300 Passing Yards"), we display proprietary derivative metrics.

- **Method:** We ingest data "behind the scenes" (using accessible historical data and public post-game reports) to train internal Machine Learning models.
- **The Output:**
  - **SIQ Win Probability:** A live-updated confidence score for every matchup.
  - **Player Value Rating (PVR):** A 0-100 score representing a player's trade value, independent of their current fantasy points.
  - **Bust Probability:** The likelihood of a player underperforming their projection.

### **B. Community "Scout Vision" (The Moat)**

We turn the user base into the data source.

- **Concept:** Verified users "grade" players on subjective traits that do not exist in box scores (e.g., "Route Running," "Arm Strength," "Pass Protection").
- **Value:** Over time, SportsIQ builds a unique, crowdsourced dataset of subjective player grades that no competitor possesses.

### **C. "Bring Your Own Data" (The Sandbox)**

- **Concept:** Users upload their own datasets (CSVs from nflverse, Kaggle, etc.) into our visualization engine.
- **Value:** We provide the _tools_ (regression testing, graphing), users provide the _data_. This removes our liability for data licensing while empowering power users.

---

## **3. Core Feature Roadmap**

### **Phase 1: The General Manager Suite (Flagship)**

_Leveraging public contract/salary cap rules which are not tied to expensive live game feeds._

- **Trade Machine 2.0:**
  - **The Hook:** Users simulate multi-team trades.
  - **The AI Judge:** An internal bot accepts/rejects trades based on our proprietary **PVR (Player Value Rating)** and real-time Salary Cap rules.
  - **Differentiation:** Competitors check if the money works; SportsIQ checks if the _value_ works.
- **Cap Manager:** Visual tools to restructure contracts and manage dead cap space.

### **Phase 2: The Prediction Center**

_Showcasing Machine Learning prowess to build trust._

- **Weekly Forecasts:** Display predicted scores and winners for every game based on the SportsIQ internal model.
- **Accuracy Tracker:** A transparent dashboard showing our model's Mean Squared Error (MSE) vs. Vegas lines.
- **"Beat the Bot":** Gamification where users enter predictions to compete against the SportsIQ AI.

### **Phase 3: The Analytics Lab (Restricted)**

- **The Sandbox:** A no-code environment for users to upload CSVs and run correlation analysis (e.g., "Does Height correlate with Red Zone Targets?").
- **Proprietary Dashboards:** Visualizations powered _only_ by SportsIQ metrics (e.g., a graph showing a player's "Trade Value" volatility over a season).

---

## **4. Technology Stack**

| Component     | Tech               | Purpose                                                                                         |
| :------------ | :----------------- | :---------------------------------------------------------------------------------------------- |
| **Frontend**  | **Angular**        | Responsive SPA for complex dashboards and interactive Trade Machine UI.                         |
| **Backend**   | **C# / .NET Core** | Robust calculation engine for salary cap math and trade logic.                                  |
| **ML Engine** | **Python**         | Microservice running Random Forest/Regression models. Ingests raw data -> Outputs JSON ratings. |
| **Database**  | **PostgreSQL**     | Relational data for user profiles, leagues, and historical stats.                               |
| **Hosting**   | **Azure/AWS**      | Scalable cloud infrastructure.                                                                  |

---

## **5. Growth & Monetization**

### **The "Free Wall" Strategy**

- **Approach:** All features are currently **Free**, but require a **Verified Login**.
- **Rationale:** Without high data costs, our overhead is low. We prioritize aggressively building a database of "highly engaged" users (fantasy commissioners, influencers).
- **Asset:** The user list _is_ the value. A database of 50,000 active fantasy commissioners is highly monetizable later.

### **Future Monetization (Post-Scale)**

1.  **API Licensing:** Selling our "Crowdsourced Scout Grades" to other apps.
2.  **Premium Leagues:** Hosting Dynasty Leagues that integrate directly with our Trade Machine.
3.  **Sponsored Content:** Targeted ads for "Mock Draft" tools during the off-season.

---

## **6. Immediate Action Items**

1.  **Algorithm Development (Python):**
    - Draft the logic for the **Player Value Rating (PVR)**. (e.g., `(Past_Performance * 0.6) + (Age_Factor * 0.2) + (Contract_Value * 0.2)`).
2.  **Data Pipeline:**
    - Build scrapers/importers for **Salary Cap Data** (Spotrac/OverTheCap public data).
3.  **MVP Frontend (Angular):**
    - Build the "Trade Machine" interface. This is the first verifiable product to show users.
