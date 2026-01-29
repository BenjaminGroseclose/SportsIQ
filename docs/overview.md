Project: SportsIQ – Strategic Overview

1. Executive Summary
   SportsIQ is a "Data-Light" sports intelligence platform designed for simulation gamers and analysts. We prioritize Derivative Metrics (our own calculated scores) and Predictive Modeling over raw, expensive, real-time data feeds.

2. Technical Stack
   Frontend: Angular (SPA for high-performance dashboards).

Backend: C# / .NET 8 (Robust, scalable API management).

ML Layer: Python Microservices (Running "The Oracle" for predictive modeling).

Data Strategy: Aggressive caching of public historical/contract data; Zero reliance on live play-by-play APIs.

3. Core Product Pillars
   A. The Trade Machine (Flagship Hook)
   Focus: Uses public salary cap and contract data.

The Moat: Unlike basic simulators, we integrate "The Oracle" to provide a Future Value Score, predicting if a trade helps or hurts a franchise 3 years out.

B. The Oracle (Proprietary ML)
Role: Our internal "Black Box."

Output: Generates proprietary scores (e.g., Pressure Index, Clutch Sustainability) based on historical performance patterns rather than live updates.

C. Scout Vision (UGC)
Focus: Community-driven grading.

The Value: Users input "eye-test" data which we aggregate into a global "Community Grade," creating a dataset that official providers don't own.

4. Feature Guarding & The Pivot
   All proposed features must pass the "Live Data Litmus Test":

Does this require live feeds? If yes, Pivot.

How to Pivot? Replace real-time stats with Historical Context or Predictive Outcomes.

Example: Instead of "Live Shot Chart," we provide a "Projected Shot Chart" based on the matchup.

5. Roadmap Status
   Active: Trade Machine UI, Scout Vision Schema, Oracle Baseline.

Cut: Cognitive Dojo (All resources reallocated).

Internal Note: We are building the "Moneyball for the Masses." Keep the engineering lean, the UX snappy, and the insights proprietary.
