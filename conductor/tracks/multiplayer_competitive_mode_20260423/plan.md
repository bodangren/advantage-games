# Implementation Plan: Multiplayer Competitive Mode

## Phase 1: WebSocket Infrastructure

- [x] Task: Set up WebSocket server with `ws` library. [0107ddc]
  - [x] Create `lib/multiplayer/ws-server.ts` with WebSocket server initialization.
  - [x] Implement connection lifecycle: open, message, close, error handlers.
  - [x] Add heartbeat mechanism (ping/pong every 30s, disconnect after 3 missed pongs).
  - [x] Write unit tests for connection lifecycle and heartbeat.
- [x] Task: Define message protocol types. [4ee9b4d]
  - [x] Create `types/multiplayer.ts` with all message types (join, leave, state_update, score_submit, round_start, round_end, game_over).
  - [x] Write unit tests for message serialization/deserialization.
- [ ] Task: Implement client-side WebSocket hook.
  - [ ] Create `hooks/useMultiplayerSocket.ts` with connect, disconnect, send, and event listener APIs.
  - [ ] Handle reconnection logic (retry 3 times with exponential backoff, 60s window).
  - [ ] Write unit tests for connection, reconnection, and message handling.
- [ ] Task: Conductor — User Manual Verification 'Phase 1: WebSocket Infrastructure' (Protocol in workflow.md)

## Phase 2: Room Management

- [ ] Task: Implement server-side room manager.
  - [ ] Create `lib/multiplayer/room-manager.ts` with create, join, leave, getRoom operations.
  - [ ] Room code generation: 6-character alphanumeric, collision-checked.
  - [ ] Room lifecycle: pending → active → completed → expired (10min inactivity).
  - [ ] Host auto-promotion on disconnect.
  - [ ] Write unit tests for all room operations and lifecycle transitions.
- [ ] Task: Implement client-side lobby UI.
  - [ ] Create `components/multiplayer/LobbyScreen.tsx` with create/join flows.
  - [ ] Display room code, player list, and host controls (start, kick, transfer host).
  - [ ] "Waiting for host..." state for non-host players.
  - [ ] Write component tests for lobby interactions.
- [ ] Task: Wire lobby to WebSocket server.
  - [ ] Host creates room via WebSocket message; server responds with room code.
  - [ ] Players join via room code; server broadcasts player list update.
  - [ ] Write integration tests for create/join flow.
- [ ] Task: Conductor — User Manual Verification 'Phase 2: Room Management' (Protocol in workflow.md)

## Phase 3: Game State Synchronization

- [ ] Task: Implement server-authoritative game loop.
  - [ ] Create `lib/multiplayer/game-session.ts` with game state machine.
  - [ ] Server runs game tick at 20Hz, broadcasts state to all room clients.
  - [ ] Server validates player inputs (word selections, answers) and updates authoritative state.
  - [ ] Write unit tests for game state machine and input validation.
- [ ] Task: Implement client-side game state consumer.
  - [ ] Create `hooks/useMultiplayerGameState.ts` that receives server state and renders locally.
  - [ ] Send player inputs to server; display server-confirmed state.
  - [ ] Handle latency compensation: optimistic UI for own inputs, rollback on rejection.
  - [ ] Write unit tests for state consumption and input handling.
- [ ] Task: Build `MultiplayerGameWrapper` component.
  - [ ] Wraps existing game components, injecting server-authoritative state.
  - [ ] Replaces local game state with server state when in multiplayer mode.
  - [ ] Write component tests for wrapper integration.
- [ ] Task: Conductor — User Manual Verification 'Phase 3: Game State Synchronization' (Protocol in workflow.md)

## Phase 4: Scoring, Leaderboard & Anti-Cheat

- [ ] Task: Implement server-side scoring engine.
  - [ ] Server calculates scores from validated inputs (correct answers, response time).
  - [ ] Round progression: server tracks round number, triggers round transitions.
  - [ ] Anti-cheat: reject score submissions that exceed maximum possible score for the round.
  - [ ] Write unit tests for scoring calculations and anti-cheat validation.
- [ ] Task: Build real-time scoreboard overlay.
  - [ ] Create `components/multiplayer/ScoreboardOverlay.tsx` showing all players' scores.
  - [ ] Animate score changes with Framer Motion.
  - [ ] Round transition screen: intermediate rankings between rounds.
  - [ ] Write component tests for scoreboard rendering and animations.
- [ ] Task: Build end-of-game podium screen.
  - [ ] Create `components/multiplayer/PodiumScreen.tsx` with final rankings.
  - [ ] XP bonus calculation: 1st +50%, 2nd +25%, 3rd +10%.
  - [ ] "Play Again" and "Leave Room" actions.
  - [ ] Write component tests for podium display and XP calculation.
- [ ] Task: Conductor — User Manual Verification 'Phase 4: Scoring, Leaderboard & Anti-Cheat' (Protocol in workflow.md)

## Phase 5: Integration Testing & Polish

- [ ] Task: End-to-end multiplayer flow test.
  - [ ] Playwright test: 2 browser contexts, create room, join, play 1 round, verify scores.
  - [ ] Test disconnect/reconnect scenario.
  - [ ] Test host disconnect and auto-promotion.
- [ ] Task: Mobile viewport verification.
  - [ ] Verify all multiplayer UI (lobby, scoreboard, podium) fits within 390×844.
  - [ ] Test touch interactions for lobby and scoreboard.
- [ ] Task: Performance benchmarking.
  - [ ] Measure WebSocket message latency under load (4 players, 20Hz updates).
  - [ ] Verify <100ms state update latency target.
- [ ] Task: Conductor — User Manual Verification 'Phase 5: Integration Testing & Polish' (Protocol in workflow.md)
