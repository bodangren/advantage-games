import { 
  createInitialDungeonLiberatorState, 
  tickDungeonLiberator,
  handleDungeonLiberatorInput,
  getFollowerPositions
} from './dungeonLiberator';
import { DUNGEON_LIBERATOR_CONFIG } from './dungeonLiberatorConfig';

describe('DungeonLiberator Logic', () => {
  const sentence = ['The', 'knight', 'rescued', 'the', 'prisoner'];

  it('should initialize with start status', () => {
    const state = createInitialDungeonLiberatorState(sentence);
    expect(state.status).toBe('start');
  });

  describe('Movement & Path History', () => {
    it('should move player and update pathHistory', () => {
      let state = createInitialDungeonLiberatorState(sentence);
      state.status = 'playing';
      
      state = handleDungeonLiberatorInput(state, { dx: 1, dy: 0 }, 1); // Move right
      state = tickDungeonLiberator(state, 1);
      
      expect(state.player.x).toBeGreaterThan(195);
      expect(state.player.pathHistory.length).toBeGreaterThan(1);
    });

    it('should clamp player within boundaries', () => {
      let state = createInitialDungeonLiberatorState(sentence);
      state.status = 'playing';
      state.player.x = 10;
      
      state = handleDungeonLiberatorInput(state, { dx: -1, dy: 0 }, 1); // Move left
      state = tickDungeonLiberator(state, 1);
      
      expect(state.player.x).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Trailing Followers', () => {
    it('should position followers along path history', () => {
      let state = createInitialDungeonLiberatorState(sentence);
      state.status = 'playing';
      
      for (let i = 0; i < 100; i++) {
        state.player.x += 1;
        state.player.pathHistory.push({ x: state.player.x, y: state.player.y });
      }

      state.collectedWords = ['The', 'knight'];
      
      const positions = getFollowerPositions(state);
      
      expect(positions.length).toBe(2);
      expect(positions[0].x).toBeLessThan(state.player.x);
      expect(positions[1].x).toBeLessThan(positions[0].x);
    });
  });

  describe('Collection & Progression', () => {
    it('should collect correct prisoner', () => {
      let state = createInitialDungeonLiberatorState(sentence);
      state.status = 'playing';
      state.player.x = 100;
      state.player.y = 100;
      state.prisoners = [{
        id: 'p1', x: 105, y: 105, size: 24, 
        word: 'The', isCollected: false, isActive: true 
      }];
      
      state = tickDungeonLiberator(state, 0.1);
      
      expect(state.collectedWords).toContain('The');
      expect(state.prisoners[0].isCollected).toBe(true);
    });

    it('should not collect wrong prisoner', () => {
      let state = createInitialDungeonLiberatorState(sentence);
      state.status = 'playing';
      state.player.x = 100;
      state.player.y = 100;
      state.prisoners = [{
        id: 'p1', x: 105, y: 105, size: 24, 
        word: 'knight', isCollected: false, isActive: true 
      }];
      
      state = tickDungeonLiberator(state, 0.1);
      
      expect(state.collectedWords.length).toBe(0);
      expect(state.player.hp).toBeLessThan(3);
    });

    it('should spawn exit portal when all words collected', () => {
      let state = createInitialDungeonLiberatorState(sentence);
      state.status = 'playing';
      state.collectedWords = ['The', 'knight', 'rescued', 'the', 'prisoner'];
      
      state = tickDungeonLiberator(state, 0.1);
      
      expect(state.exitPortal).toBeDefined();
      expect(state.exitPortal?.isActive).toBe(true);
    });
  });

  describe('Hazards & Monsters', () => {
    it('should move monsters in tick', () => {
      let state = createInitialDungeonLiberatorState(sentence);
      state.status = 'playing';
      state.monsters = [{
        id: 'm1', x: 100, y: 100, vx: 50, vy: 0, size: 32, isActive: true 
      }];
      
      state = tickDungeonLiberator(state, 1);
      
      expect(state.monsters[0].x).toBeGreaterThan(100);
    });

    it('should lose HP when hit by monster', () => {
      let state = createInitialDungeonLiberatorState(sentence);
      state.status = 'playing';
      state.player.x = 100;
      state.player.y = 100;
      state.monsters = [{
        id: 'm1', x: 105, y: 105, vx: 0, vy: 0, size: 32, isActive: true 
      }];
      
      state = tickDungeonLiberator(state, 0.1);
      
      expect(state.player.hp).toBeLessThan(3);
    });

    it('should lose followers when monster hits the line', () => {
      let state = createInitialDungeonLiberatorState(sentence);
      state.status = 'playing';
      state.player.x = 200;
      state.player.y = 200;
      state.player.pathHistory = [
        { x: 100, y: 200 },
        { x: 120, y: 200 },
        { x: 140, y: 200 },
        { x: 160, y: 200 },
        { x: 180, y: 200 },
        { x: 200, y: 200 }
      ];
      state.collectedWords = ['The', 'knight'];
      
      state.monsters = [{
        id: 'm1', x: 180, y: 200, vx: 0, vy: 0, size: 32, isActive: true 
      }];
      
      state = tickDungeonLiberator(state, 0.1);
      
      expect(state.collectedWords.length).toBeLessThan(2);
    });
  });
});
