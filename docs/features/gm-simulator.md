# PRD: NFL GM Simulator - Off-Season Mode

## 1. Product overview

### 1.1 Document title and version

- **PRD**: NFL GM Simulator - Off-Season Mode
- **Version**: 1.0
- **Date**: January 28, 2026

### 1.2 Product summary

The NFL GM Simulator is an interactive feature within SportsIQ that allows users to step into the role of an NFL General Manager and manage all aspects of their chosen team's off-season. Users will negotiate trades, manage the roster, participate in the draft, handle free agency, and navigate salary cap constraints—all while competing against AI-powered opponent GMs that exhibit realistic decision-making behavior.

This feature transforms SportsIQ from a passive analytics platform into an engaging simulation experience, leveraging the platform's existing player ratings, contract data, and proprietary "Oracle" predictive engine to create a sophisticated yet accessible GM experience. Upon completion of the off-season simulation, users receive a comprehensive summary showing all transactions, roster changes, and projected team performance.

The project targets hardcore NFL fans who want deep strategic gameplay while remaining simple enough for casual fans to understand and enjoy. It leverages existing data integration points (real rosters, contracts, player ratings) and requires minimal infrastructure investment as a side project.

## 2. Goals

### 2.1 Business goals

- Transform SportsIQ from a read-only analytics platform into an interactive engagement tool that increases user session time.
- Create a unique differentiator in the sports analytics space by combining real data with AI-powered simulation gameplay.
- Establish a foundation for future sport expansions (NBA, MLB) using the same GM simulator framework.
- Build organic user-generated content and discussion around simulation results and strategies.
- Demonstrate the value of the proprietary "Oracle" engine in a consumer-facing feature rather than just backend analytics.

### 2.2 User goals

- Experience the strategic challenge and excitement of being an NFL General Manager without the constraints of traditional fantasy football formats.
- Experiment with "what-if" scenarios using real NFL rosters and data (e.g., "What if my team traded for this superstar?").
- Learn about NFL roster management, salary cap mechanics, and team-building strategies in an interactive way.
- Compete against realistic AI opponents that make believable decisions rather than exploitable rule-based systems.
- Receive immediate feedback on roster construction decisions through predictive analytics powered by the Oracle engine.

### 2.3 Non-goals

- **In-season game simulation**: This feature focuses exclusively on off-season management. Play-by-play game simulation is explicitly out of scope.
- **Multiplayer/competitive leaderboards**: Initial version will not include multiplayer functionality or competitive rankings between users.
- **Real-time sync with live NFL data**: The simulator uses snapshot data and does not require live updates during actual NFL events.
- **Mobile-native experience**: While the feature should be responsive, a dedicated mobile app is not in scope.
- **Contract negotiation with individual players**: AI handles player-side contract negotiations automatically based on market value.
- **Comprehensive scouting reports**: Deep scouting features beyond existing player ratings are deferred to future iterations.

## 3. User personas

### 3.1 Key user types

- **Strategic Enthusiasts**: Hardcore NFL fans who understand salary cap mechanics, positional value, and roster construction principles.
- **Curious Casuals**: Casual fans who follow their favorite team but want to explore team-building without complex simulation game mechanics.
- **Data-Driven Analysts**: Users who enjoy analytics and want to test theories about team construction using real data.
- **What-If Explorers**: Fans who constantly wonder "what if" about trades and roster moves their real team didn't make.

### 3.2 Basic persona details

- **Mike, the Armchair GM** (Strategic Enthusiast): 32-year-old software developer, plays fantasy football, listens to NFL podcasts, wants to test his team-building theories against realistic constraints. Expects sophisticated AI opponents and accurate salary cap modeling.

- **Sarah, the Casual Fan** (Curious Casual): 27-year-old marketing professional, watches her home team every Sunday, curious about how teams are built but intimidated by complex simulation games. Needs clear guidance and forgiving mechanics.

- **Jason, the Analytics Junkie** (Data-Driven Analyst): 29-year-old data scientist, already uses SportsIQ for player analysis, wants to apply Oracle ratings to roster construction scenarios. Values data accuracy and predictive insights.

- **Kelly, the Trade Theorist** (What-If Explorer): 35-year-old teacher, active on NFL Reddit and Twitter, constantly debates theoretical trades. Wants to validate her trade ideas against AI GMs and see projected outcomes.

### 3.3 Role-based access

- **Guest Users**: Can explore a demo simulation with limited functionality (one team, simplified mechanics).
- **Registered Users**: Full access to all 32 NFL teams, complete off-season simulation features, ability to save and resume simulations.
- **Premium Users** (future): Access to advanced features like simulation history, draft analytics tools, and multi-season simulations.

## 4. Functional requirements

### 4.1 Team selection and initialization

**Priority: Critical**

- Users must select one of the 32 NFL teams to manage.
- The system loads the current roster, contracts, draft picks, salary cap situation, and team needs from the existing SportsIQ database.
- Display team overview showing: current roster (by position), available cap space, draft pick inventory, and key team stats/needs.
- Allow users to view competing teams' rosters and cap situations (read-only).

### 4.2 AI General Manager system

**Priority: Critical**

- Implement 31 AI-controlled GMs, one for each non-user team.
- Each AI GM must have configurable attributes: risk tolerance (conservative to aggressive), team strategy (win-now vs. rebuild), positional priorities, and trade responsiveness.
- AI GMs should evaluate trade offers based on: positional need, player value (via Oracle ratings), contract implications, and team-building strategy.
- AI GMs autonomously make decisions: free agent signings, draft picks, and trade proposals when appropriate.

### 4.3 Trade negotiation system

**Priority: Critical**

- Users can propose trades to any AI GM involving: players, draft picks, and conditional picks (future picks).
- Trade evaluation engine that validates: salary cap compliance, roster limits, and fair value using Oracle predictive ratings.
- AI GMs respond to trade offers with: accept, reject, or counter-offer based on their team context and strategy.
- Display trade impact analysis showing: cap implications, Oracle-powered future value scores (3-year projection), and positional depth changes.
- Trade machine interface similar to existing SportsIQ Trade Machine but with AI negotiation layer.

### 4.4 Free agency system

**Priority: High**

- Display list of available free agents with: player ratings, contract demands, and positional fit.
- Users can make contract offers to free agents within salary cap constraints.
- AI GMs compete for free agents creating realistic market dynamics.
- Free agents accept offers based on: contract value, team competitiveness (Oracle predictions), positional depth chart, and randomized player preferences.
- Track signed free agents across all teams in real-time during the simulation.

### 4.5 NFL Draft simulation

**Priority: High**

- Full 7-round NFL Draft simulation with realistic draft order based on previous season standings.
- Display available draft prospects with: position, Oracle ratings, draft projections, and team need alignment.
- Users make draft selections for their team when their pick comes up.
- AI GMs make draft selections based on: team needs, best available player, positional value, and draft strategy.
- Support trade-up and trade-down scenarios during the draft (user initiates, AI evaluates).
- Simulate draft in real-time with AI picks happening automatically unless user trades occur.

### 4.6 Roster management

**Priority: High**

- Users can cut players to free up salary cap space (with dead cap implications displayed).
- Roster must comply with NFL roster limits (53-man active roster).
- Display roster by position group with: starter designations, contract details, Oracle ratings, and age/experience.
- Highlight roster weaknesses and positional depth concerns.
- Track roster changes throughout the simulation with transaction log.

### 4.7 Salary cap management

**Priority: Critical**

- Real-time salary cap tracker showing: total cap, used cap, available cap, and future year implications.
- Display detailed cap breakdown by player with: base salary, bonuses, cap hits, and dead cap if cut.
- Enforce cap compliance on all transactions (trades, signings, roster moves).
- Show multi-year cap projections (3-year window) based on current contracts and decisions.
- Visual indicators when approaching cap limits or making cap-risky decisions.

### 4.8 Simulation summary and results

**Priority: High**

- At completion, generate comprehensive off-season summary report including:
  - All trades executed (user and AI) with players/picks involved
  - Free agent signings across the league
  - Complete draft results by team
  - User's roster changes (before/after comparison)
  - Oracle-powered team performance predictions for upcoming season
  - Cap space summary and future cap health
- Visual timeline of user's transaction history.
- Shareable summary cards for social media (future enhancement).
- Ability to export or save simulation results.

### 4.9 Oracle integration

**Priority: High**

- Integrate existing Oracle predictive engine to provide:
  - Player future value projections (1-year, 3-year outlook)
  - Trade impact analysis (helps/hurts franchise projection)
  - Team performance predictions based on roster composition
  - Draft prospect success probability
- Display Oracle insights contextually during decision-making (trades, draft, free agency).
- Use Oracle scores to inform AI GM decision-making logic.

### 4.10 Tutorial and onboarding

**Priority: Medium**

- First-time user tutorial explaining: team selection, basic navigation, how to propose trades, and how to interpret Oracle metrics.
- Contextual help tooltips throughout the interface for casual users.
- Sample simulation walkthrough demonstrating a complete off-season flow.
- Glossary of NFL terms (salary cap, dead cap, compensatory picks, etc.).

## 5. User experience

### 5.1 Entry points & first-time user flow

- Primary entry point: Dedicated "GM Simulator" navigation item in main SportsIQ menu.
- Landing page presents: feature overview, team selection grid (32 NFL team logos), and "Start Simulation" call-to-action.
- First-time users see optional tutorial overlay highlighting key features and navigation.
- Team selection loads current roster state and presents dashboard overview with clear next actions.

### 5.2 Core experience

**Team Dashboard (Home Base)**

- Central hub showing: roster overview, available cap space, upcoming draft position, active trade offers, and available free agents.
- Navigation tabs for: Roster, Trades, Free Agency, Draft, and Cap Management.
- Persistent header shows: selected team logo/name, current simulation phase, and quick stats (cap space, roster count, next draft pick).

**Trade Negotiation Flow**

- User clicks "Propose Trade" from dashboard or team view.
- Trade builder interface with drag-and-drop player/pick selection.
- Real-time validation shows cap implications and roster legality.
- AI GM response appears within seconds with accept/reject/counter feedback.
- If accepted, transaction immediately updates roster and cap sheets.
- Oracle impact analysis displayed prominently ("This trade improves your 3-year outlook by +4.2 points").

**Draft Experience**

- Immersive draft room interface mimicking NFL draft aesthetic.
- Draft board showing available prospects ordered by Oracle rating and draft position.
- When user's pick arrives, timer counts down (can be skipped/auto-picked).
- AI picks announced in real-time with brief rationale ("Team X selects QB [Name] to address positional need").
- Post-draft summary grades user's draft performance.

**Free Agency Flow**

- Marketplace-style interface listing available free agents.
- Filter by position, contract demand range, and Oracle rating.
- User makes offer (years, annual value within cap constraints).
- System simulates competitive bidding with AI GMs.
- Notification when free agent signs (with your team or elsewhere).

**Simulation Completion**

- Celebration screen congratulating user on completing off-season.
- Multi-page summary report with visual data visualizations.
- Side-by-side roster comparison (start vs. end of off-season).
- Oracle prediction for upcoming season performance.
- "Start New Simulation" and "Share Results" options.

### 5.3 Advanced features & edge cases

- **Multi-team trades**: Support 3-team trades for advanced users (complex UI/UX challenge).
- **Compensatory picks**: System automatically awards compensatory draft picks based on free agency losses.
- **Injury scenarios**: Random injury events during simulation affecting roster decisions.
- **Contract restructuring**: Allow users to restructure contracts to create cap space (with future year implications).
- **Draft pick value chart**: Display trade value charts to help users evaluate pick swaps.
- **Save/Load simulations**: Allow users to save simulation state and resume later.

### 5.4 UI/UX highlights

- **Dark theme**: Match SportsIQ's existing dark aesthetic for consistency.
- **Responsive design**: Optimized for desktop (primary) with tablet support (mobile deferred).
- **Drag-and-drop interactions**: Intuitive trade building and roster management.
- **Real-time updates**: AI transactions appear as notifications/activity feed.
- **Data visualization**: Charts for cap space, roster composition, Oracle projections.
- **Loading states**: Engaging animations while AI evaluates trades or makes draft picks.
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support.

## 6. Narrative

Welcome to the GM Simulator. You're now the general manager of your favorite NFL team, and the off-season is yours to navigate. As you sit in your virtual front office, you face the same challenges real GMs face: a limited salary cap, uncertain draft prospects, aggressive AI opponents, and the weight of fan expectations.

You start by reviewing your inherited roster—some superstars locked into expensive contracts, promising rookies on cheap deals, and aging veterans whose best days may be behind them. The Oracle engine whispers predictions about each player's future value, helping you identify who to build around and who to trade away.

An AI GM from a rival team sends an unsolicited trade offer. Do you accept? Counter-offer? Or reject outright and propose your own blockbuster deal? Every decision ripples through your cap sheet and roster depth. The trade you make today affects your draft strategy tomorrow and your team's competitiveness three years from now.

Free agency opens, and the feeding frenzy begins. You're competing against 31 other GMs for top talent. That star wide receiver you covet gets offers from five teams. Do you overpay to secure him, or stick to your budget and pivot to a cheaper option? The Oracle suggests this signing would boost your team's projected wins, but it means sacrificing flexibility next year.

Draft day arrives. Your scouts have identified a generational quarterback prospect, but he'll be gone before your pick. Do you trade multiple picks to move up, mortgage your future for a franchise savior? Or do you stay put, trust your board, and build through patience? The clock ticks down, and AI GMs are already calling about trading up from your spot.

When the dust settles, you review your work. Your roster is transformed—new faces, new contracts, new hope. The Oracle projects your team's performance for the upcoming season. Did you build a contender, or did you mortgage the future for short-term gains? Either way, you've experienced the thrill, stress, and strategic depth of being an NFL General Manager. And you can't wait to try again with a different team, a different strategy, and a different outcome.

## 7. Success metrics

### 7.1 User-centric metrics

- **Simulation completion rate**: Percentage of users who complete an entire off-season simulation (target: >60%).
- **Average session duration**: Time spent in simulator per session (target: >25 minutes).
- **Return user rate**: Percentage of users who start a second simulation (target: >40%).
- **Feature engagement**: Percentage of users who engage with each feature (trades, free agency, draft) (target: >80% per feature).
- **Tutorial completion**: Percentage of first-time users who complete the tutorial (target: >50%).

### 7.2 Business metrics

- **User activation**: Increase in registered SportsIQ users attributed to GM Simulator feature (target: +15% quarter-over-quarter).
- **Session frequency**: Increase in average user sessions per week (target: +25%).
- **Social sharing**: Number of simulation results shared on social media (aspirational: >1,000 shares/month).
- **Premium conversion**: Percentage of GM Simulator users who convert to premium tier (future metric).
- **Organic discovery**: Traffic from Reddit/Twitter/sports forums mentioning the feature (target: >500 referrals/month).

### 7.3 Technical metrics

- **AI response time**: AI GM trade evaluation response time (target: <2 seconds).
- **Simulation performance**: Full off-season simulation completion time (target: <500ms for processing all AI decisions).
- **Data accuracy**: Player rating, contract data, and cap calculations accuracy (target: >99%).
- **System uptime**: Feature availability (target: >99.5%).
- **Error rate**: Transaction validation failures or system errors (target: <0.5% of user actions).

## 8. Technical considerations

### 8.1 Integration points

- **Existing SportsIQ database**: Leverage `Player.Players`, `Player.Contracts`, `Player.ContractYears`, `Core.Teams` tables for roster and cap data.
- **Oracle engine**: Python microservice integration for player ratings, future value projections, and team performance predictions.
- **NFL data APIs**: Use existing `nflreadpy` integration for roster snapshots, contract data, and player statistics.
- **Angular frontend**: Build simulator as new module within existing Angular SPA architecture.
- **.NET backend**: Create new API endpoints in `SportsIQ.API` for simulation state management, AI logic, and transaction processing.

### 8.2 Data storage & privacy

- **Simulation state**: Store active simulation sessions in database with user-specific isolation (new `Simulation.Simulations` schema).
- **Transaction history**: Log all simulation transactions (trades, signings, draft picks) for summary generation and analytics (new `Simulation.Transactions` table).
- **AI GM configuration**: Store AI personality profiles and decision-making parameters as seed data (new `Simulation.AIProfiles` table).
- **User preferences**: Store team favorites, tutorial completion status, and UI preferences in user profile.
- **Data retention**: Completed simulations retained for 90 days, after which archived for analytics (GDPR-compliant with user data deletion options).
- **No sensitive data**: Feature does not collect or process sensitive personal information beyond standard user account data.

### 8.3 Scalability & performance

- **Stateful simulations**: Each active simulation requires server-side state management—design for efficient state serialization (JSON snapshots).
- **AI computation**: AI GM decision-making must be asynchronous and fast—consider caching common evaluation scenarios.
- **Database indexing**: Ensure indexes on `PlayerID`, `TeamID`, `ContractID`, and `ExternalPlayerID` for fast queries.
- **Oracle caching**: Cache Oracle predictions for player ratings to avoid recomputation on every trade evaluation (TTL: 24 hours).
- **Concurrent users**: Design for 100 concurrent simulation sessions initially (modest side project scale).
- **API rate limiting**: Protect simulation endpoints from abuse with per-user rate limits (10 actions per second).

### 8.4 Potential challenges

- **AI decision quality**: Balancing realistic AI behavior with fun gameplay—too smart = frustrating, too simple = exploitable.
- **Rule complexity**: NFL roster rules, salary cap mechanics, and draft regulations are intricate—requires careful validation logic.
- **Data freshness**: Keeping rosters, contracts, and draft data up-to-date without manual intervention.
- **Edge cases**: Multi-team trades, conditional picks, contract options, and restructures add significant complexity.
- **Performance**: Running 31 AI GMs' decisions simultaneously during draft/free agency could cause bottlenecks.
- **User education**: Salary cap mechanics are confusing for casual users—need excellent UI/UX to make accessible.
- **Oracle dependency**: Feature relies on Oracle engine availability and accuracy—requires fallback for degraded Oracle service.

## 9. Milestones & sequencing

### 9.1 Project estimate

- **Size**: Medium-Large (3-6 months for MVP)
- **Scope**: Core off-season features (roster, trades, free agency, draft, cap management)

### 9.2 Team size & composition

- **Team size**: 2-3 developers (part-time/side project)
- **Roles**:
  - 1 Full-stack developer (Angular + .NET)
  - 1 Backend/AI specialist (.NET + Python for AI logic)
  - 1 Designer/UX (part-time for UI polish and flows)

### 9.3 Suggested phases

**Phase 1: Foundation (4-6 weeks)**

- Database schema design for simulation state, transactions, and AI profiles.
- Backend API scaffolding: simulation initialization, team selection, roster queries.
- Basic frontend shell: team selection, dashboard layout, navigation structure.
- Oracle integration: API endpoints for player ratings and future value projections.
- **Key deliverables**: Team selection working, roster display functional, Oracle data flowing.

**Phase 2: Core transactions (6-8 weeks)**

- Trade system: Build trade builder UI, validation logic, and AI evaluation engine.
- AI GM framework: Implement 31 AI profiles with configurable attributes and decision logic.
- Salary cap engine: Real-time cap tracking, validation, and multi-year projections.
- Free agency system: Marketplace UI, bidding logic, AI competition for free agents.
- **Key deliverables**: Trades functional, AI responding realistically, cap management working.

**Phase 3: Draft & completion (4-6 weeks)**

- Draft simulation: Draft board UI, pick selection, AI draft logic, trade-up/down.
- Roster management: Cut players, depth chart adjustments, roster validation.
- Transaction log: Real-time activity feed showing all league transactions.
- Simulation summary: Multi-page results report with visual data and Oracle predictions.
- **Key deliverables**: Full off-season playable end-to-end, summary generation working.

**Phase 4: Polish & launch (3-4 weeks)**

- Tutorial and onboarding: First-time user flow, contextual help, glossary.
- UI/UX refinement: Animations, loading states, responsive design, accessibility.
- Testing and bug fixes: Cross-browser testing, edge case validation, performance optimization.
- Documentation: User guides, API documentation, admin tools for data updates.
- **Key deliverables**: Production-ready feature, public launch.

**Phase 5: Post-launch iteration (ongoing)**

- User feedback incorporation: Address usability issues, balance AI difficulty.
- Advanced features: Multi-team trades, contract restructuring, save/load, injury scenarios.
- Analytics and monitoring: Track success metrics, identify drop-off points.
- Future sports expansion: Adapt framework for NBA, MLB simulators.
- **Key deliverables**: Continuous improvement, feature expansion roadmap.

## 10. User stories

### 10.1 Team selection and initialization

- **ID**: GH-001
- **Description**: As a user, I want to select an NFL team to manage so that I can begin my GM simulation experience with my favorite team.
- **Acceptance criteria**:
  - User sees a grid displaying all 32 NFL teams with logos and names.
  - Clicking a team loads the team's current roster, cap situation, and draft picks.
  - Dashboard displays team overview with roster count, cap space, and next steps.
  - User can return to team selection to choose a different team.

### 10.2 View current roster

- **ID**: GH-002
- **Description**: As a user, I want to view my team's current roster organized by position so that I can understand my team's strengths and weaknesses.
- **Acceptance criteria**:
  - Roster displays players grouped by position (QB, RB, WR, TE, OL, DL, LB, DB, ST).
  - Each player shows: name, position, age, contract details, and Oracle rating.
  - Starter designations are visually distinguished from backups.
  - Roster displays total count and cap hit summary.

### 10.3 Propose a trade

- **ID**: GH-003
- **Description**: As a user, I want to propose a trade to another team so that I can acquire players or draft picks that fit my team-building strategy.
- **Acceptance criteria**:
  - User can select a target team from a list of 31 AI teams.
  - Trade builder allows adding/removing players and draft picks from both sides.
  - System validates trade for cap compliance and roster limits in real-time.
  - Oracle displays trade impact analysis (future value projection) before submitting.
  - User can submit trade, save as draft, or cancel.

### 10.4 AI GM evaluates trade offer

- **ID**: GH-004
- **Description**: As a user, I want AI GMs to evaluate my trade offers realistically so that negotiations feel authentic and challenging.
- **Acceptance criteria**:
  - AI GM responds within 2 seconds of trade submission.
  - Response options: Accept, Reject, or Counter-offer with specific changes.
  - AI provides brief rationale for decision (e.g., "Doesn't address our positional needs").
  - AI evaluation considers team context, player value, and Oracle projections.
  - Counter-offers are logical and negotiable.

### 10.5 Accept or reject AI-initiated trades

- **ID**: GH-005
- **Description**: As a user, I want to receive and respond to trade offers initiated by AI GMs so that I feel like I'm part of a dynamic league ecosystem.
- **Acceptance criteria**:
  - AI GMs occasionally propose trades proactively based on team needs.
  - User receives notification of incoming trade offer.
  - User can view trade details, cap impact, and Oracle analysis.
  - User can Accept, Reject, or make Counter-offer.
  - Notification system tracks pending trade offers.

### 10.6 View available free agents

- **ID**: GH-006
- **Description**: As a user, I want to browse available free agents so that I can identify potential signings to improve my roster.
- **Acceptance criteria**:
  - Free agent list displays player name, position, age, Oracle rating, and contract demand.
  - User can filter by position, rating range, and contract value.
  - User can sort by position, rating, or contract demand.
  - Clicking a player shows detailed profile with career stats and Oracle projections.

### 10.7 Sign a free agent

- **ID**: GH-007
- **Description**: As a user, I want to make contract offers to free agents so that I can add talent to my roster within my salary cap constraints.
- **Acceptance criteria**:
  - User can make offer specifying contract years (1-5) and annual value.
  - System validates offer against available cap space.
  - User sees cap impact before submitting offer.
  - Notification received when free agent makes decision (signs with user's team, signs elsewhere, or still considering).
  - AI teams compete for same free agents creating realistic market dynamics.

### 10.8 Participate in the NFL Draft

- **ID**: GH-008
- **Description**: As a user, I want to make draft selections when my team's pick comes up so that I can add young talent to my roster.
- **Acceptance criteria**:
  - Draft board displays available prospects with Oracle ratings and projected draft position.
  - User is prompted to make selection when their pick arrives.
  - User can filter prospects by position and view detailed scouting reports.
  - Timer counts down (with auto-pick fallback) to maintain pacing.
  - AI teams make realistic selections based on team needs and best available player.
  - User sees real-time draft log showing all picks as they happen.

### 10.9 Trade draft picks during the draft

- **ID**: GH-009
- **Description**: As a user, I want to trade up or down during the draft so that I can acquire specific prospects or accumulate additional picks.
- **Acceptance criteria**:
  - User can propose trade involving current or future draft picks during the draft.
  - AI GMs evaluate draft pick trades using draft value charts and team needs.
  - Successful trade immediately updates draft order for both teams.
  - User can target specific draft positions or respond to AI trade offers.

### 10.10 Manage salary cap

- **ID**: GH-010
- **Description**: As a user, I want to view and manage my team's salary cap situation so that I can make informed financial decisions.
- **Acceptance criteria**:
  - Cap dashboard shows total cap, used cap, available cap, and future year projections (3 years).
  - Detailed breakdown displays cap hit by player with contract details.
  - System calculates dead cap penalties when cutting players.
  - Visual indicators warn when approaching cap limits.
  - All transactions (trades, signings, cuts) update cap sheet in real-time.

### 10.11 Cut a player

- **ID**: GH-011
- **Description**: As a user, I want to cut players from my roster so that I can free up cap space and roster spots.
- **Acceptance criteria**:
  - User can select any player and choose "Cut Player" action.
  - System displays dead cap penalty and cap savings before confirming.
  - Confirmation dialog prevents accidental cuts.
  - Cut player moves to free agent pool immediately.
  - Roster and cap sheet update automatically.

### 10.12 View Oracle predictions

- **ID**: GH-012
- **Description**: As a user, I want to see Oracle-powered predictions and insights so that I can make data-driven roster decisions.
- **Acceptance criteria**:
  - Player profiles display Oracle future value projections (1-year, 3-year).
  - Trade evaluations show Oracle impact analysis ("Improves your 3-year outlook by +X").
  - Draft prospects display Oracle success probability ratings.
  - Team performance predictions update based on roster changes.
  - Oracle insights appear contextually during decision-making.

### 10.13 View transaction history

- **ID**: GH-013
- **Description**: As a user, I want to view a log of all transactions (mine and league-wide) so that I can track roster changes and competitor moves.
- **Acceptance criteria**:
  - Transaction log displays all trades, signings, cuts, and draft picks chronologically.
  - User can filter transactions by type (trades, free agency, draft) and team.
  - Each transaction shows summary details (players/picks involved, teams, date).
  - Visual timeline shows user's transactions highlighted.

### 10.14 Complete simulation and view summary

- **ID**: GH-014
- **Description**: As a user, I want to receive a comprehensive summary of my off-season simulation so that I can review my decisions and see projected outcomes.
- **Acceptance criteria**:
  - Completion screen appears after draft concludes.
  - Summary report includes:
    - Before/after roster comparison
    - All user transactions with details
    - Oracle team performance prediction for upcoming season
    - Final cap space and future cap health
    - Draft grade and free agency recap
  - User can download or share summary.
  - Option to start a new simulation presented.

### 10.15 Complete the tutorial

- **ID**: GH-015
- **Description**: As a first-time user, I want to complete a tutorial so that I can learn how to use the GM Simulator effectively.
- **Acceptance criteria**:
  - Tutorial launches automatically for first-time users (can be skipped).
  - Tutorial covers: team selection, roster navigation, trade building, free agency, draft basics, and Oracle interpretation.
  - Interactive walkthrough with tooltips and guided actions.
  - Tutorial can be restarted from settings menu.
  - Completion status saved to user profile.

### 10.16 AI GMs conduct autonomous free agency

- **ID**: GH-016
- **Description**: As a user, I want AI GMs to sign free agents independently so that the league feels dynamic and competitive.
- **Acceptance criteria**:
  - AI GMs evaluate free agent market based on team needs and cap space.
  - AI teams make free agent signings during simulation progression.
  - User receives notifications when notable free agents sign (especially division rivals).
  - Free agent pool updates in real-time as players sign.
  - AI spending patterns reflect realistic team-building strategies.

### 10.17 View competitor team rosters

- **ID**: GH-017
- **Description**: As a user, I want to view other teams' rosters and cap situations so that I can identify trade partners and competitive threats.
- **Acceptance criteria**:
  - User can navigate to any of the 31 AI team pages.
  - AI team view shows roster, cap situation, and draft picks (read-only).
  - User can initiate trade from competitor team view.
  - Highlights potential trade fits based on team needs.

### 10.18 Receive AI trade offers proactively

- **ID**: GH-018
- **Description**: As a user, I want AI GMs to initiate trade offers occasionally so that I feel like part of an active league.
- **Acceptance criteria**:
  - AI GMs send unsolicited trade offers based on team needs and user roster.
  - Frequency is balanced (not overwhelming, 1-3 offers per simulation).
  - Trade offers are reasonable and contextually appropriate.
  - User receives notification and can view/respond anytime.

### 10.19 Save simulation progress

- **ID**: GH-019
- **Description**: As a user, I want to save my simulation progress so that I can resume later without losing my decisions.
- **Acceptance criteria**:
  - "Save & Exit" option available from dashboard.
  - Simulation state saved to database with user association.
  - User can resume saved simulation from main menu.
  - Multiple saved simulations supported (up to 3 active).
  - Auto-save occurs after each major transaction.

### 10.20 Authenticate securely

- **ID**: GH-020
- **Description**: As a user, I want to log in securely so that my simulation data is protected and associated with my account.
- **Acceptance criteria**:
  - GM Simulator requires user authentication to access.
  - Login flow integrates with existing SportsIQ authentication system.
  - Session management maintains user state across browser sessions.
  - User data (simulations, preferences) isolated per account.
  - Guest/demo mode available without authentication (limited functionality).

---

## Appendix: AI GM personality framework

To ensure realistic and varied AI behavior, each AI GM will have the following configurable attributes:

- **Risk Tolerance**: Conservative (avoids risky trades, prefers safe picks) to Aggressive (willing to make bold moves, trade up in draft).
- **Team Strategy**: Win-Now (values veteran talent, willing to trade picks) to Rebuild (prioritizes young talent and draft capital).
- **Positional Priority**: Team-specific (e.g., team weak at QB prioritizes QB signings/draft).
- **Trade Responsiveness**: Frequency of initiating trades and likelihood of accepting user offers.
- **Contract Philosophy**: Prefer short-term deals vs. long-term investments.

These attributes will be seeded based on real NFL teams' historical behavior patterns to create authentic experiences (e.g., Patriots = analytical/conservative, Raiders = aggressive/win-now).

---

## Appendix: Technical architecture overview

**Frontend (Angular)**
- New `gm-simulator` module with lazy loading
- Components: TeamSelectionComponent, DashboardComponent, TradeBuilderComponent, FreeAgencyComponent, DraftBoardComponent, SummaryComponent
- State management: NgRx for simulation state
- Services: SimulationService, AIGMService, TradeService, DraftService

**Backend (.NET)**
- New API controllers: `SimulationController`, `TradeController`, `DraftController`, `FreeAgencyController`
- Services: `AIGMService`, `OracleIntegrationService`, `CapManagementService`, `TransactionValidationService`
- Background jobs: AI decision-making queue, simulation state cleanup

**Database**
- New schemas: `Simulation.Simulations`, `Simulation.Transactions`, `Simulation.AIProfiles`, `Simulation.DraftProspects`
- Extended tables: `Player.Players` (add simulation context), `Core.Teams` (add AI profile reference)

**Oracle Integration**
- REST API calls to existing Python microservice
- Endpoints: `/predict/player-value`, `/predict/trade-impact`, `/predict/team-performance`
- Caching layer to reduce computation overhead

---
