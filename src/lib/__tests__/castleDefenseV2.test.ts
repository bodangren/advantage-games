import {
  createInitialState,
  movePlayer,
  spawnEnemy,
  moveEnemy,
  circlesCollide,
  inRange,
  collectWords,
  checkTowerActivation,
  updateTowers,
  updateProjectiles,
  checkBaseDamage,
  advanceCastleDefenseTime,
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_RADIUS,
  BASE_HP,
  SPAWN_RATE_MS,
} from '../castleDefenseV2'

describe('castleDefenseV2', () => {
  describe('createInitialState', () => {
    it('should create valid initial state with empty vocabulary', () => {
      const state = createInitialState([])

      expect(state.status).toBe('playing')
      expect(state.player.x).toBe(GAME_WIDTH / 2)
      expect(state.player.y).toBe(GAME_HEIGHT - 100)
      expect(state.player.radius).toBe(PLAYER_RADIUS)
      expect(state.player.inventory).toEqual([])
      expect(state.enemies).toEqual([])
      expect(state.base.hp).toBe(BASE_HP)
      expect(state.wave).toBe(1)
    })

    it('should assign target words to tower slots from vocabulary', () => {
      const vocab = [
        { term: 'hello', translation: 'hola' },
        { term: 'world', translation: 'mundo' },
      ]
      const state = createInitialState(vocab)

      expect(state.towerSlots.length).toBeGreaterThan(0)
      expect(state.towerSlots[0].targetWord).toBe('hola')
      expect(state.towerSlots[1].targetWord).toBe('mundo')
    })

    it('should set initial target word from vocabulary', () => {
      const vocab = [{ term: 'test', translation: 'prueba' }]
      const state = createInitialState(vocab)

      expect(state.targetWord).toBe('prueba')
    })
  })

  describe('movePlayer', () => {
    it('should move player right', () => {
      const player = createInitialState([]).player
      const moved = movePlayer(player, { dx: 1, dy: 0 }, 50)
      expect(moved.x).toBeGreaterThan(player.x)
      expect(moved.y).toBe(player.y)
    })

    it('should clamp player to game bounds', () => {
      const player = { ...createInitialState([]).player, x: GAME_WIDTH - 5 }
      const moved = movePlayer(player, { dx: 1, dy: 0 }, 50)
      expect(moved.x).toBeLessThanOrEqual(GAME_WIDTH - PLAYER_RADIUS)
    })

    it('should normalize diagonal movement', () => {
      const player = createInitialState([]).player
      const diagonal = movePlayer(player, { dx: 1, dy: 1 }, 50)
      const straight = movePlayer(player, { dx: 1, dy: 0 }, 50)

      // Diagonal distance should be same as straight distance
      const diagDist = Math.sqrt(
        (diagonal.x - player.x) ** 2 + (diagonal.y - player.y) ** 2
      )
      const straightDist = straight.x - player.x
      expect(diagDist).toBeCloseTo(straightDist, 1)
    })
  })

  describe('circlesCollide', () => {
    it('should return true for overlapping circles', () => {
      expect(circlesCollide(0, 0, 10, 15, 0, 10)).toBe(true)
    })

    it('should return false for non-overlapping circles', () => {
      expect(circlesCollide(0, 0, 10, 30, 0, 10)).toBe(false)
    })
  })

  describe('inRange', () => {
    it('should return true for points within range', () => {
      expect(inRange(0, 0, 10, 0, 20)).toBe(true)
    })

    it('should return false for points outside range', () => {
      expect(inRange(0, 0, 30, 0, 20)).toBe(false)
    })
  })

  describe('spawnEnemy', () => {
    it('should spawn soldier by default', () => {
      const enemy = spawnEnemy([{ x: 0, y: 100 }], 1, () => 0.5)
      expect(enemy.type).toBe('soldier')
      expect(enemy.waypointIndex).toBe(0)
    })

    it('should spawn tank after wave 2 with right roll', () => {
      const enemy = spawnEnemy([{ x: 0, y: 100 }], 3, () => 0.2)
      expect(enemy.type).toBe('tank')
    })

    it('should spawn boss after wave 5 with right roll', () => {
      const enemy = spawnEnemy([{ x: 0, y: 100 }], 5, () => 0.05)
      expect(enemy.type).toBe('boss')
    })
  })

  describe('moveEnemy', () => {
    it('should move enemy toward waypoint', () => {
      const path = [{ x: 50, y: 100 }, { x: 200, y: 100 }]
      const enemy = { ...spawnEnemy(path, 1), x: 10, y: 100, waypointIndex: 0 }
      // Enemy at x=10, should move toward first waypoint at x=50
      const moved = moveEnemy(enemy, path, 50)

      // Should be moving toward x=50
      expect(moved.x).toBeGreaterThan(enemy.x)
    })

    it('should advance waypoint when reached', () => {
      const path = [{ x: 0, y: 100 }, { x: 200, y: 100 }]
      const enemy = { ...spawnEnemy(path, 1), x: 0, y: 100 }
      const moved = moveEnemy(enemy, path, 50)
      expect(moved.waypointIndex).toBe(1)
    })
  })

  describe('collectWords', () => {
    it('should collect word when player collides', () => {
      const player = { ...createInitialState([]).player, x: 100, y: 100 }
      const words = [{
        id: 'word-1',
        x: 105,
        y: 100,
        radius: 25,
        term: 'test',
        translation: 'prueba',
        isCorrect: true,
        isCollected: false,
      }]

      const result = collectWords(player, words)
      expect(result.player.inventory).toContain('prueba')
      expect(result.words[0].isCollected).toBe(true)
      expect(result.collectedWord).not.toBeNull()
    })

    it('should not collect already collected words', () => {
      const player = { ...createInitialState([]).player, x: 100, y: 100 }
      const words = [{
        id: 'word-1',
        x: 105,
        y: 100,
        radius: 25,
        term: 'test',
        translation: 'prueba',
        isCorrect: true,
        isCollected: true,
      }]

      const result = collectWords(player, words)
      expect(result.player.inventory).toHaveLength(0)
      expect(result.collectedWord).toBeNull()
    })
  })

  describe('checkBaseDamage', () => {
    it('should damage base when enemy reaches end', () => {
      const path = [{ x: 0, y: 0 }, { x: 100, y: 0 }]
      const enemy = { ...spawnEnemy(path, 1), waypointIndex: 2 }
      const base = { x: 100, y: 0, hp: 100, maxHp: 100, radius: 40 }

      const result = checkBaseDamage([enemy], base, path)
      expect(result.base.hp).toBeLessThan(100)
      expect(result.enemies).toHaveLength(0)
      expect(result.damage).toBeGreaterThan(0)
    })
  })

  describe('advanceCastleDefenseTime', () => {
    const vocabulary = [
      { term: 'hello', translation: 'hola' },
      { term: 'world', translation: 'mundo' },
      { term: 'goodbye', translation: 'adios' },
      { term: 'friend', translation: 'amigo' },
    ]

    it('should move player based on input', () => {
      const state = createInitialState(vocabulary)
      const nextState = advanceCastleDefenseTime(state, 50, { dx: 1, dy: 0 }, vocabulary)
      expect(nextState.player.x).toBeGreaterThan(state.player.x)
    })

    it('should increase game time', () => {
      const state = createInitialState(vocabulary)
      const nextState = advanceCastleDefenseTime(state, 50, { dx: 0, dy: 0 }, vocabulary)
      expect(nextState.gameTime).toBe(50)
    })

    it('should spawn enemies after spawn timer', () => {
      const state = { ...createInitialState(vocabulary), spawnTimer: SPAWN_RATE_MS - 10 }
      const nextState = advanceCastleDefenseTime(state, 50, { dx: 0, dy: 0 }, vocabulary)
      expect(nextState.enemies.length).toBeGreaterThan(0)
    })

    it('should set gameover when base HP reaches 0', () => {
      const state = { ...createInitialState(vocabulary), base: { ...createInitialState(vocabulary).base, hp: 0 } }
      const nextState = advanceCastleDefenseTime(state, 50, { dx: 0, dy: 0 }, vocabulary)
      expect(nextState.status).toBe('gameover')
    })

    it('should not update when status is not playing', () => {
      const state = { ...createInitialState(vocabulary), status: 'gameover' as const }
      const nextState = advanceCastleDefenseTime(state, 50, { dx: 1, dy: 0 }, vocabulary)
      expect(nextState.player.x).toBe(state.player.x)
    })
  })
})
