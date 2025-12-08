<!-- filepath: d:\Programming\SportsIQ\docs\SPORTS_IQ.md -->

# **Sports IQ: Website Feature Specifications**

## **1\. Core Feature: The Analytics Lab**

The "Analytics Lab" serves as the research engine of the platform, designed to compete with tools like Stathead and PFF Ultimate. It democratizes data science, allowing users to query historical databases without writing code.

### **Key Components**

- **Natural Language Query Builder:** Instead of SQL, users can type or select drop-downs for queries like _"Most 3-pointers by a rookie in the 4th quarter since 2015"_.
- **Interactive Data Visualization:** Integration of libraries like D3.js or Recharts to instantly convert query results into scatter plots, heatmaps (e.g., shot charts), and momentum graphs.
- **Comparison Engine:** A "Head-to-Head" mode that allows users to stack two players or teams against each other with radar charts comparing efficiency, volume, and clutch performance.

### **Monetization Strategy**

| Tier                  | Access Level                                                                                                              |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| **Free**              | Basic season stats, leaderboards, and simple queries (e.g., "Top scorers 2024"). Ad-supported.                            |
| **Premium (Paywall)** | Complex query combinations (e.g., filtering by quarter/down/distance), exporting data to CSV/Excel, and ad-free browsing. |

## ---

**2\. Core Feature: Fantasy Sports Center**

This hub acts as the user's "Assistant General Manager," utilizing AI to remove emotion from roster decisions.

### **Key Components**

- **Draft Simulator:** A high-speed mock draft tool that syncs with standard league settings (Snake, Auction, Dynasty). It uses ADP (Average Draft Position) data to simulate realistic opponent behavior.
- **AI Trade Analyzer:**
  - **The "Why" Engine:** Unlike basic calculators that just give a number, this uses Generative AI to explain _why_ a trade is good or bad (e.g., "Player A has an easy playoff schedule, while Player B faces top-5 defenses").
  - **Mutually Beneficial Finder:** An algorithm that scans the user's league to find trade partners whose needs match the user's surplus.
- **Start/Sit Recommendation:** A probability-based engine that suggests lineups based on matchup difficulty, weather, and injury risk, rather than just projected points.

### **Monetization Strategy**

| Tier                  | Access Level                                                                                                                             |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| **Free**              | Basic Mock Drafts, simple 1-for-1 Trade Calculator (no explanations), general Start/Sit rankings.                                        |
| **Premium (Paywall)** | "League Sync" (imports user's specific league rosters), AI Trade Explanations, Multi-team trade analysis, and Dynasty value projections. |

## ---

**3\. Core Feature: Armchair GM Simulator**

This is the flagship "immersive" feature, allowing users to step into the role of a General Manager and compete against a trained AI in contract negotiations and roster construction.

### **Key Components**

- **The "Capology" Engine:** A rigorously accurate simulation of league salary caps, luxury taxes, and exceptions (e.g., Mid-Level Exception in NBA, Franchise Tags in NFL).
- **AI Negotiation Bot:** Users enter a chat interface to negotiate contracts with AI agents. The AI has "personality traits" (e.g., "Greedy," "Loyal," "Ring Chaser") and will react to low-ball offers by walking away or demanding trade clauses.
- **Trade Machine 2.0:** Validates trades against real financial rules and provides a grade on the long-term impact of the move (e.g., "Win Probability added over 3 years").

### **Monetization Strategy**

| Tier                  | Access Level                                                                                                                     |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| **Free**              | "Sandbox Mode" (Experiment with trades and caps without saving), limited to current season only.                                 |
| **Premium (Paywall)** | Multi-season franchise mode, AI Negotiation Chatbot, saving/exporting scenarios, and "Era" capability (simulating past seasons). |

## ---

**4\. Core Feature: Matchup Preview Center**

A clean, pre-game intelligence hub that gives users everything they need to watch games like an analyst—without the complexity of the Analytics Lab.

### **Key Components**

- **Game Cards:** Visual panels for upcoming games showing:
  - Key stat comparisons (offensive/defensive rankings, pace, recent form)
  - Injury report with impact ratings ("High" for stars, "Low" for bench players)
  - Head-to-head history (last 5 meetings, trends)
  - Weather conditions (for outdoor sports)
- **"X-Factors" Spotlight:** Auto-identifies 2-3 players/matchups that will likely decide the game (e.g., "Elite pass rush vs. backup offensive line" or "Star PG returning from injury").
- **Betting Context (Optional):** Display Vegas lines and over/under with historical cover rates—no predictions, just context.
- **Watch Guide:** Links to where the game is streaming/airing, plus optimal viewing times (e.g., "Game starts at 8pm, but tipoff historically happens 8:12pm").
- **Playoff Machine** User select matches and see our predictions of making the playoffs.

### **Data Scope**

- Pull from public APIs (ESPN, The Odds API for lines).
- Start with **one league** and ~10 core stats.
- Daily cron job generates cards 24 hours before games.

### **Monetization Strategy**

| Tier                  | Access Level                                                                                            |
| :-------------------- | :------------------------------------------------------------------------------------------------------ |
| **Free**              | Today's games only, top 3 X-factors, basic stat comparisons.                                            |
| **Premium (Paywall)** | Full week schedule, deeper historical matchups, customizable card layouts, export to calendar, ad-free. |

**Tagline:** _"Never watch a game unprepared."_

## ---

**5\. Core Feature: Community Player Rankings**

A dynamic, crowdsourced ranking system where the sports community votes on player tiers, allowing real-time consensus to challenge traditional rankings and create engagement through gamification.

### **Key Components**

- **Interactive Tier Lists:** Visual card-based ranking interface organized by position and season. Players are displayed as draggable cards that users can reorder within a customizable tier system (S-Tier, A-Tier, B-Tier, etc.).
- **Voting System:** One-click thumbs up/down voting on individual player rankings. Users can also vote on alternate player placements to challenge the current consensus ranking.
- **Consensus Leaderboard:** A live leaderboard showing the top-voted players overall, by position, by season, and by custom filters (e.g., "Best rookies," "Most overrated," "Biggest risers/fallers").
- **Voting Streaks & Achievements:** Gamification elements including badges for accurate predictions (users who voted on future breakout stars), voting consistency, and "expert" status for users with high voting accuracy.
- **Player Comparison via Voting:** Users can vote on head-to-head matchups (e.g., "Player A vs. Player B for the 2024 MVP") to generate instant consensus metrics displayed as split voting percentages and momentum charts.
- **Historical Ranking Snapshots:** Archive of past voting results to track how perception of players evolves over seasons and allow users to see which communities voted accurately.

### **Data Scope**

- Cover all major sports (NFL, NBA, MLB, NCAA Football/Basketball).
- Track rankings across multiple time periods: current season, historical seasons, and projected future performance.
- Aggregate voting data by position, team, age, and custom user-defined categories.
- Store voting history for each user to calculate prediction accuracy metrics.

### **Monetization Strategy**

| Tier                  | Access Level                                                                                                                                                                                                                                   |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Free**              | View community rankings, vote once per player per season, access consensus leaderboards, basic achievement tracking.                                                                                                                           |
| **Premium (Paywall)** | Unlimited voting with weight multiplier (votes worth more), private custom tier lists, voting predictions premium analytics, export rankings to images/PDF, early access to new sport rankings, and voting notifications for favorite players. |

**Tagline:** _"Your vote shapes the rankings."_

---

## ---

**6\. Technical & Design Requirements**

To ensure these data-heavy features perform well, the website architecture must prioritize speed and clarity.

- **Skeleton Loading:** Because the Analytics Lab processes large datasets, the UI must use "Skeleton Screens" (gray pulsing placeholders) rather than spinners to reduce perceived wait times and improve user retention.
- **Dark Mode UI:** Given the density of data in tables and charts, a high-contrast Dark Mode should be the default to reduce eye strain for power users.
- **Technology Stack:**
  - **Frontend:** Angular for the interactive dashboards.
  - **Visualization:** D3.js or Nivo for the custom charts in the Analytics Lab.
  - **Data Updates:** WebSockets for real-time draft updates in the Fantasy Center, ensuring zero latency.
