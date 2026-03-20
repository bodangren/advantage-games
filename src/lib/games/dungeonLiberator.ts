import { DUNGEON_LIBERATOR_CONFIG } from './dungeonLiberatorConfig';

export interface Position {
  x: number;
  y: number;
}

export interface Entity extends Position {
  id: string;
  size: number;
}

export interface Prisoner extends Entity {
  word: string;
  isCollected: boolean;
  isActive: boolean;
}

export interface Monster extends Entity {
  vx: number;
  vy: number;
  isActive: boolean;
}

export interface GameState {
  player: {
    x: number;
    y: number;
    size: number;
    hp: number;
    maxHp: number;
    pathHistory: Position[];
    invulnerableTime: number;
  };
  prisoners: Prisoner[];
  monsters: Monster[];
  sentence: string[];
  collectedWords: string[];
  status: 'playing' | 'won' | 'lost' | 'paused' | 'start';
  score: number;
  xp: number;
  time: number;
  exitPortal?: Position & { isActive: boolean };
}

export const createInitialDungeonLiberatorState = (sentence: string[]): GameState => ({
  player: {
    x: 195,
    y: 700,
    size: 32,
    hp: 3,
    maxHp: 3,
    pathHistory: [{ x: 195, y: 700 }],
    invulnerableTime: 0,
  },
  prisoners: [],
  monsters: [],
  sentence,
  collectedWords: [],
  status: 'start',
  score: 0,
  xp: 0,
  time: 0,
});

export const spawnDungeonLiberatorPrisoners = (state: GameState): GameState => {
  const { sentence } = state;
  const { gameWidth, gameHeight } = DUNGEON_LIBERATOR_CONFIG;
  const prisoners: Prisoner[] = sentence.map((word, i) => ({
    id: `prisoner-${i}`,
    x: 50 + Math.random() * (gameWidth - 100),
    y: 100 + Math.random() * (gameHeight - 300),
    size: DUNGEON_LIBERATOR_CONFIG.prisoner.size,
    word,
    isCollected: false,
    isActive: true,
  }));
  return { ...state, prisoners };
};

export const spawnDungeonLiberatorMonsters = (state: GameState): GameState => {
  const { gameWidth, gameHeight } = DUNGEON_LIBERATOR_CONFIG;
  const monsters: Monster[] = [1, 2, 3].map((i) => ({
    id: `monster-${i}`,
    x: Math.random() * gameWidth,
    y: 100 + Math.random() * (gameHeight / 2),
    vx: (Math.random() - 0.5) * DUNGEON_LIBERATOR_CONFIG.monster.speed * 2,
    vy: (Math.random() - 0.5) * DUNGEON_LIBERATOR_CONFIG.monster.speed * 2,
    size: DUNGEON_LIBERATOR_CONFIG.monster.size,
    isActive: true,
  }));
  return { ...state, monsters };
};

export const handleDungeonLiberatorInput = (state: GameState, input: { dx: number, dy: number }, deltaTime: number): GameState => {
  if (state.status !== 'playing') return state;

  const { player } = state;
  const { speed, size } = DUNGEON_LIBERATOR_CONFIG.player;
  const { gameWidth, gameHeight } = DUNGEON_LIBERATOR_CONFIG;

  let nextX = player.x + input.dx * speed * deltaTime;
  let nextY = player.y + input.dy * speed * deltaTime;

  nextX = Math.max(size / 2, Math.min(gameWidth - size / 2, nextX));
  nextY = Math.max(size / 2, Math.min(gameHeight - size / 2, nextY));

  const lastPoint = player.pathHistory[player.pathHistory.length - 1];
  const dist = Math.sqrt(Math.pow(nextX - lastPoint.x, 2) + Math.pow(nextY - lastPoint.y, 2));
  
  const nextPathHistory = [...player.pathHistory];
  if (dist > 2) {
    nextPathHistory.push({ x: nextX, y: nextY });
    if (nextPathHistory.length > DUNGEON_LIBERATOR_CONFIG.pathHistoryLimit) {
      nextPathHistory.shift();
    }
  }

  return {
    ...state,
    player: { ...player, x: nextX, y: nextY, pathHistory: nextPathHistory }
  };
};

export const getFollowerPositions = (state: GameState): Position[] => {
  const { player, collectedWords } = state;
  const { spacing } = DUNGEON_LIBERATOR_CONFIG.prisoner;
  
  const positions: Position[] = [];
  const history = player.pathHistory;
  let currentDist = 0;
  let followerIndex = 0;
  
  for (let i = history.length - 2; i >= 0 && followerIndex < collectedWords.length; i--) {
    const p1 = history[i + 1];
    const p2 = history[i];
    const segmentDist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    currentDist += segmentDist;
    
    if (currentDist >= spacing) {
      positions.push(p2);
      currentDist = 0;
      followerIndex++;
    }
  }
  return positions;
};

const checkCollision = (a: { x: number, y: number, size: number }, b: { x: number, y: number, size: number }): boolean => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < (a.size + b.size) / 2;
};

export const tickDungeonLiberator = (state: GameState, deltaTime: number): GameState => {
  if (state.status !== 'playing') return state;

  const { player, prisoners, monsters, sentence, collectedWords, exitPortal } = state;
  let nextCollectedWords = [...collectedWords];
  let nextHp = player.hp;
  let nextStatus = state.status;
  let nextExitPortal = exitPortal;
  let nextInvulnerableTime = Math.max(0, player.invulnerableTime - deltaTime);

  // Update Monsters
  const { gameWidth, gameHeight } = DUNGEON_LIBERATOR_CONFIG;
  const nextMonsters = monsters.map(m => {
    let nx = m.x + m.vx * deltaTime;
    let ny = m.y + m.vy * deltaTime;
    let nvx = m.vx;
    let nvy = m.vy;

    if (nx < m.size / 2 || nx > gameWidth - m.size / 2) nvx = -nvx;
    if (ny < m.size / 2 || ny > gameHeight - m.size / 2) nvy = -nvy;

    return { ...m, x: nx, y: ny, vx: nvx, vy: nvy };
  });

  // Check collision with monsters
  if (nextInvulnerableTime === 0) {
    for (const m of nextMonsters) {
      if (checkCollision(player, m)) {
        nextHp -= 1;
        nextInvulnerableTime = 1;
        if (nextHp <= 0) nextStatus = 'lost';
        break;
      }
    }
  }

  // Check Line vs Monster
  const followerPositions = getFollowerPositions(state);
  for (const m of nextMonsters) {
    for (let i = 0; i < followerPositions.length; i++) {
      if (checkCollision({ ...followerPositions[i], size: DUNGEON_LIBERATOR_CONFIG.prisoner.size }, m)) {
        // Monster hit the line! Lost all followers from this point back
        nextCollectedWords = nextCollectedWords.slice(0, i);
        // Reset path history to prevent followers from jumping
        // Actually, simplest is just to shrink collectedWords
        break;
      }
    }
  }

  // Check prisoner collection
  const nextPrisoners = prisoners.map(p => {
    if (!p.isActive || p.isCollected) return p;
    if (checkCollision(player, p)) {
      const targetWord = sentence[nextCollectedWords.length];
      if (p.word === targetWord) {
        nextCollectedWords.push(p.word);
        return { ...p, isCollected: true };
      } else {
        if (nextInvulnerableTime === 0) {
          nextHp -= 1;
          nextInvulnerableTime = 1;
          if (nextHp <= 0) nextStatus = 'lost';
        }
        return p; 
      }
    }
    return p;
  });

  // Spawn exit portal
  if (nextCollectedWords.length === sentence.length && !nextExitPortal) {
    nextExitPortal = { x: 195, y: 100, isActive: true };
  }

  // Check win condition
  if (nextExitPortal?.isActive && checkCollision(player, { ...nextExitPortal, size: 40 })) {
    nextStatus = 'won';
  }

  return {
    ...state,
    player: { ...player, hp: nextHp, invulnerableTime: nextInvulnerableTime },
    prisoners: nextPrisoners,
    monsters: nextMonsters,
    collectedWords: nextCollectedWords,
    exitPortal: nextExitPortal,
    status: nextStatus,
    time: state.time + deltaTime,
    xp: nextCollectedWords.length,
    score: nextCollectedWords.length * 100,
  };
};
