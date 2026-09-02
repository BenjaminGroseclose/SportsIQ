# PRD: NFL GM Simulator - Multiplayer Expansion

## 1. Product overview

### 1.1 Document title and version

- **PRD**: NFL GM Simulator - Multiplayer Expansion
- **Version**: 1.0
- **Date**: January 29, 2026

### 1.2 Product summary

The Multiplayer Expansion for the NFL GM Simulator extends the single-player experience by allowing small groups of users (2-4 players) to compete synchronously in a live off-season simulation. Users take control of different NFL franchises within the same league universe, competing for the same pool of free agents and draft prospects while negotiating trades directly with each other.

This feature introduces a "Live Lobby" system where one user acts as the Commissioner to host the simulation. It leverages the existing AI GM logic to control the remaining 28-30 teams, ensuring a full league experience even with a small group of human players. The focus is on a synchronous "Game Night" experience where friends can complete an entire off-season in a single sitting (approx. 45-60 minutes).

## 2. Goals

### 2.1 Business goals

- **Viral Acquisition**: Leverage social dynamics to drive new user acquisition through invite links.
- **Retention**: Create "appointment gaming" habits where users coordinate times to return to the platform together.
- **Engagement**: Increase average session duration significantly due to the social pressure and immersive real-time nature of multiplayer drafts.

### 2.2 User goals

- **Social Competition**: Prove superior GM skills directly against friends rather than just AI opponents.
- **Live Negotiation**: Experience the thrill of negotiating trades with human opponents in real-time.
- **Shared Narrative**: Create shared stories and moments within a friend group (e.g., stealing a draft pick right before a friend).

### 2.3 Non-goals

- **Asynchronous/Turn-based Play**: The system is designed for live, synchronous sessions, not "play-by-email" over days or weeks.
- **Large Scale Leagues**: We are not supporting 32-user leagues initially; the focus is 2-4 users + AI.
- **Cross-Platform Play**: All users must be on the web platform (no mobile app cross-play initially).
- **In-Game Chat**: Users are expected to use external tools (Discord/Slack) for communication; a built-in chat system is out of scope for V1.

## 3. User personas

### 3.1 Key user types

- **The Commissioner**: The organizer of the group who sets up the lobby, invites friends, and ensures the game flow is smooth.
- **The Competitive Friend**: Wants to outsmart their specific friends. Their primary motivation is beating their peers, not just building a good team.

### 3.2 Role-based access

- **Commissioner**: Has capabilities to kick players, force-advance timers, and pause the simulation.
- **Participant**: Can join a lobby, select a team, and interact with the simulation.

## 4. Functional requirements

### 4.1 Lobby & Invitation System

**Priority: Critical**

- **Create Lobby**: Users can create a private multiplayer session.
- **Invite System**: Generate unique, shareable URLs/codes for friends to join directly.
- **Team Selection**: Users claim available NFL teams in the lobby. Duplicate selections are prevented.
- **Ready Check**: All users must mark "Ready" before the Commissioner can start the simulation.

### 4.2 Synchronization Engine

**Priority: Critical**

- **Real-time State**: All users must see the same league state (available free agents, trade offers, draft board) instantly.
- **Phase Management**: The simulation progresses through phases (Free Agency, Draft, etc.) in lock-step.
- **Timer System**: Configurable timers for decision phases (e.g., "Draft Pick: 2 minutes", "Free Agency Round: 5 minutes").

### 4.3 Multiplayer Trading

**Priority: High**

- **P2P Trade Offers**: Users can send trade proposals to other human players.
- **Live Notifications**: Recipients see a "New Trade Offer" notification instantly.
- **Live Response**: Accepting/Rejecting a trade updates the sender's UI immediately.
- **Trade Block**: Users can mark players as "Available" to signal intent to other humans.

### 4.4 Multiplayer Draft

**Priority: Critical**

- **Draft Queue**: Visual indication of "On the Clock" for human vs. AI teams.
- **Pick Timer**: Enforced time limit for human picks.
- **Auto-Pick System**: If the timer expires or a user disconnects, the system automatically picks the highest-rated player (or best positional fit via Oracle).
- **Draft Ticker**: Real-time feed of picks from all 32 teams.

### 4.5 AI Coexistence

**Priority: High**

- **Hybrid League**: The remaining 28-30 teams are controlled by standard AI GMs.
- **Fair Competition**: AI treats human players equally; it does not "gang up" on humans.
- **AI Turn Speed**: AI turns are accelerated but visible to allow humans to track the draft flow.

### 4.6 Disconnect & Offline Handling

**Priority: Medium**

- **Disconnect Detection**: System detects if a user loses connection via socket heartbeat.
- **Immediate AI Takeover**: If a user is disconnected or goes AFK (timer expiry), the AI immediately takes over draft duties to prevent stalling the league.
- **Commissioner Kick**: The Commissioner can manually remove a permanently offline player, reverting their team to full AI control.
- **Rejoin**: Users can reconnect and reclaim their team from the interim AI if the session is still active.

## 5. User experience

### 5.1 Lobby Flow

1.  User A clicks "Multiplayer" -> "Host Game".
2.  User A configures settings (Draft Timer: 90s, Difficulty: Hard).
3.  User A copies "Invite Link" and sends it to friends.
4.  User B clicks the link -> SportsIQ loads directly into the lobby.
5.  All users select teams and click "Ready".
6.  Commissioner clicks "Start Season".

### 5.2 The "War Room" (Main Interface)

- **Header**: Shows current phase, global timer, and active user status (online indicators).
- **Activity Feed**: Prominent central log of all actions ("User B traded Pick 4 to AI Team X").
- **Alerts**: Distinct visual/audio cues for "Your Turn" and "Trade Received".

### 5.3 Draft Night Experience

- **On The Clock**: When a human is picking, the UI highlights their avatar.
- **Urgency**: Visual effects (pulsing timer, sound effects) increase as the clock runs down.
- **Snipe Notification**: If a user queues a player who gets drafted by someone else immediately before, a specific "Sniped!" notification appears.

## 6. Narrative

It's Tuesday night. You send the **SportsIQ Link** to your group chat. Three friends jump in. You claim the Bears, Mike takes the Packers, and Sarah takes the Chiefs.

The lobby fills up. You hit **Start**, and the pressure is on.

Free Agency opens. You see Mike frantically bidding on the top Wide Receiver. You decide to drive the price up, offering $1M more, forcing him to overpay or lose his target. He messages you angrily in Discord.

Then, the Draft. The Packers are picking right before you. You need a cornerstone QB. You watch the timer tick down... 10 seconds... 5 seconds... Mike trades the pick to the AI-controlled Raiders! You breathe a sigh of relief, only to realize the Raiders need a QB too. The pick comes in: It's your guy.

The room erupts. This isn't just a spreadsheet simulation anymore; it's a battle of wits.

## 7. Success metrics

### 7.1 User-centric metrics

- **Completion Rate**: Percentage of multiplayer sessions that reach the "Season Summary" screen (target: >75%).
- **Latency**: Average time for a trade offer to appear on opponent's screen (target: <200ms).
- **Session Length**: Average time to complete a 4-player simulation (target: <60 mins).

### 7.2 Business metrics

- **K-Factor**: Average number of new users invited per host (target: >1.5).
- **Retention**: Percentage of users who return for a second multiplayer session (target: >40%).

### 7.3 Technical metrics

- **Socket Stability**: Percentage of sessions with zero disconnects.
- **Sync Errors**: Rate of "desync" events where clients see different game states (target: <0.1%).

## 8. Technical considerations

### 8.1 Architecture

- **SignalR (ASP.NET Core)**: Primary technology for real-time bi-directional communication between server and clients.
- **Lobby Manager**: In-memory service (or Redis-backed) to hold transient lobby state (connectedUserIds, currentPhase, timers).
- **State Broadcasting**: Backend pushes full `LobbyState` diffs to clients on every change event to ensure consistency.

### 8.2 Data Handling

- **Transient vs. Persistent**: Multiplayer sessions are transient. Data is only written to permanent SQL storage upon "Save" or "Completion".
- **Concurrency**: Optimistic concurrency control on "Player Claims" (e.g., two users trying to sign the same Free Agent at the exact same second).

### 8.3 Scalability

- **Vertical Scaling**: Initially, host all active lobbies on a single SignalR node for simplicity.
- **Message Backplane**: If scaling beyond one server is needed later, use Redis backplane for SignalR to distribute messages across instances.

## 9. Milestones & sequencing

### 9.1 Phase 1: Connectivity (4 Weeks)

- Implement SignalR Hubs in .NET backend.
- Create Lobby Creation and Joining UI in Angular.
- Implement basic "Presence" (seeing who is in the room).

### 9.2 Phase 2: Synchronization (4 Weeks)

- Sync the "World State" (Current Date, Phase, Roster Data).
- Implement "Ready" lock-step mechanism to block phase advancement.
- Implement shared Timer service.

### 9.3 Phase 3: Gameplay Interaction (4 Weeks)

- Implement Peer-to-Peer Trade logic.
- Real-time Draft board updates.
- AI Takeover logic for disconnects and timeouts.

## 10. User stories

### 10.1 Host a Lobby

- **ID**: MP-001
- **Description**: As a user, I want to create a multiplayer lobby so I can invite friends to play.
- **Acceptance Criteria**:
  - "Host Game" button creates a new session ID.
  - Generates a unique URL for sharing.
  - Host is placed in the "Staging" area as the Commissioner.

### 10.2 Join a Lobby

- **ID**: MP-002
- **Description**: As a user with a link, I want to join a specific lobby.
- **Acceptance Criteria**:
  - Clicking the link loads the specific lobby.
  - User is prompted to select a team from the remaining available teams.
  - Lobby list updates for all other users to show the new joiner.

### 10.3 Commissioner Kick

- **ID**: MP-003
- **Description**: As the host, I want to kick a disruptive or AFK player.
- **Acceptance Criteria**:
  - Commissioner sees a "Kick" button next to other players' names.
  - Kicked user is removed from the session.
  - Their team immediately reverts to AI control.

### 10.4 Live Draft Pick

- **ID**: MP-004
- **Description**: As a user, I want to see opponent picks instantly.
- **Acceptance Criteria**:
  - When User B confirms a pick, User A's board updates without refreshing.
  - The "On the Clock" indicator moves to the next team immediately.

### 10.5 Auto-Pick Timeout

- **ID**: MP-005
- **Description**: As the system, I want to auto-pick for a user if they take too long so the game keeps moving.
- **Acceptance Criteria**:
  - When draft timer hits 0:00, system selects highest rated player on board.
  - Pick is logged as "Auto-picked" in the feed.
  - Turn passes to the next team.

### 10.6 Receive Trade Offer from Human Player

- **ID**: MP-006
- **Description**: As a user, I want to receive trade offers from other human players so I can negotiate directly.
- **Acceptance Criteria**:
  - User receives instant notification when another player sends a trade offer.
  - Trade offer shows all details (players, picks involved).
  - User can view oracle impact analysis before responding.
  - User can Accept, Reject, or Counter-offer.

### 10.7 Send Trade Offer to Human Player

- **ID**: MP-007
- **Description**: As a user, I want to send a trade offer to another human player so I can negotiate specific deals.
- **Acceptance Criteria**:
  - Trade builder allows selecting another player from the lobby.
  - User can add/remove players and draft picks from both sides.
  - System validates cap compliance before submission.
  - Recipient receives notification instantly.

### 10.8 Disconnect and AI Takeover

- **ID**: MP-008
- **Description**: As the system, I want to detect disconnects and assign AI control so the league isn't stalled.
- **Acceptance Criteria**:
  - User disconnect is detected within 5 seconds via heartbeat.
  - If during draft phase, AI auto-picks for the disconnected user's team.
  - Disconnected user's status shows "Offline" in the lobby.
  - User can rejoin within 10 minutes and reclaim their team.

### 10.9 Commissioner Force Advance Timer

- **ID**: MP-009
- **Description**: As the Commissioner, I want to manually force advance the phase so we can keep the game moving.
- **Acceptance Criteria**:
  - Commissioner sees "Force Advance" button.
  - Clicking it skips remaining timer and moves to next phase.
  - All users are notified of the advance.

### 10.10 Configure Lobby Settings

- **ID**: MP-010
- **Description**: As the Commissioner, I want to configure game settings so the experience matches our preferences.
- **Acceptance Criteria**:
  - Settings include: Draft Pick Timer (30s-5m), Free Agency Round Duration, AI Difficulty (Easy/Medium/Hard).
  - Settings are applied when simulation starts.
  - All players see the configured settings before readying up.

### 10.11 Real-time Activity Feed

- **ID**: MP-011
- **Description**: As a user, I want to see all league activities in real-time so I can track competitor moves.
- **Acceptance Criteria**:
  - Activity feed displays trades, signings, draft picks as they occur.
  - Human player actions are highlighted differently from AI actions.
  - Feed is sorted chronologically with timestamps.
  - User can filter by team or action type.

### 10.12 See Online Player Status

- **ID**: MP-012
- **Description**: As a user, I want to see who is online in the lobby so I know if my opponents are present.
- **Acceptance Criteria**:
  - Each player shows an online indicator (green dot) next to their name.
  - Indicator updates instantly when players join/leave/disconnect.
  - Offline players show a "Offline" badge.

### 10.13 Complete Multiplayer Simulation

- **ID**: MP-013
- **Description**: As a user, I want to complete the simulation with my friends and see final results.
- **Acceptance Criteria**:
  - Simulation concludes after all draft rounds are complete.
  - Summary screen shows all players' final rosters and team performance predictions.
  - Comparative standings show user's ranking among the group.
  - Option to start a new session or return to main menu.

### 10.14 Authenticate for Multiplayer

- **ID**: MP-014
- **Description**: As a user, I want to authenticate so my multiplayer sessions are secure and associated with my account.
- **Acceptance Criteria**:
  - Multiplayer requires login (same auth as single-player simulator).
  - Session data is tied to user account.
  - User can only join/host if logged in.

### 10.15 Mark Players as Available for Trade

- **ID**: MP-015
- **Description**: As a user, I want to mark players as available so other humans know I'm open to trading them.
- **Acceptance Criteria**:
  - "Trade Block" button toggles players on a public list.
  - Other players see available players marked clearly.
  - Sends no automatic notification but signals intent.
