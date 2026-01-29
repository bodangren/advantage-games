import {
  createCastleDefenseState,
  movePlayer,
  circlesCollide,
  spawnEnemy,
  advanceCastleDefenseTime,
  collectWords,
  spawnSentenceWords,
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_RADIUS,
  WORD_RADIUS,
  BASE_HP,
  SPAWN_RATE_MS,
  parseSentenceWords,
  validateWordCollection,
  resetSentenceProgress,
  isSentenceComplete,
} from '../castleDefense'

describe('castleDefense', () => {
  describe('parseSentenceWords', () => {
    it('splits a sentence into words', () => {
      expect(parseSentenceWords('The cat sits')).toEqual(['The', 'cat', 'sits'])
    })

    it('returns empty array for empty string', () => {
      expect(parseSentenceWords('')).toEqual([])
    })

    it('handles multiple spaces', () => {
      expect(parseSentenceWords('The   cat   sits')).toEqual(['The', 'cat', 'sits'])
    })

    it('strips common punctuation', () => {
      expect(parseSentenceWords('Hello, world!')).toEqual(['Hello', 'world'])
    })
  })

  describe('spawnSentenceWords', () => {
    it('returns correct number of word orbs', () => {
      const words = spawnSentenceWords('The cat sits', () => 0.5)
      expect(words).toHaveLength(3)
    })

    it('assigns one sentence word to each orb', () => {
      const words = spawnSentenceWords('The cat sits', () => 0.5)
      expect(words.map(word => word.translation)).toEqual(['The', 'cat', 'sits'])
    })

    it('includes all words from the sentence', () => {
      const words = spawnSentenceWords('The cat sits', () => 0.5)
      expect(new Set(words.map(word => word.translation))).toEqual(new Set(['The', 'cat', 'sits']))
    })

    it('spawns orbs within game bounds', () => {
      const words = spawnSentenceWords('The cat sits', () => 0.5)
      for (const word of words) {
        expect(word.x).toBeGreaterThanOrEqual(WORD_RADIUS)
        expect(word.x).toBeLessThanOrEqual(GAME_WIDTH - WORD_RADIUS)
        expect(word.y).toBeGreaterThanOrEqual(WORD_RADIUS)
        expect(word.y).toBeLessThanOrEqual(GAME_HEIGHT - WORD_RADIUS)
      }
    })
  })

  describe('validateWordCollection', () => {
    const sentenceWords = ['The', 'cat', 'sits']

    it('allows collecting the first word', () => {
      expect(validateWordCollection([], 0, sentenceWords)).toBe(true)
    })

    it('allows collecting the second word after the first', () => {
      expect(validateWordCollection([0], 1, sentenceWords)).toBe(true)
    })

    it('rejects collecting a later word out of order', () => {
      expect(validateWordCollection([0], 2, sentenceWords)).toBe(false)
    })

    it('rejects collecting an already collected word', () => {
      expect(validateWordCollection([0, 1], 1, sentenceWords)).toBe(false)
    })
  })

  describe('collectWords', () => {
    const sentenceWords = ['The', 'cat', 'sits']

    const makeWord = (index: number) => ({
      id: `word-${index}`,
      x: 100,
      y: 100,
      radius: WORD_RADIUS,
      term: sentenceWords[index],
      translation: sentenceWords[index],
      isCorrect: true,
      isCollected: false,
      sentenceIndex: index,
    })

    it('adds the next sequential word index when collected', () => {
      const player = { ...createCastleDefenseState([]).player, x: 100, y: 100 }
      const words = [makeWord(0)]

      const result = collectWords(player, words, sentenceWords, [])

      expect(result.collectedWordIndices).toEqual([0])
      expect(result.words[0].isCollected).toBe(true)
      expect(result.invalidCollection).toBe(false)
    })

    it('flags invalid collection when a later word is collected', () => {
      const player = { ...createCastleDefenseState([]).player, x: 100, y: 100 }
      const words = [makeWord(2)]

      const result = collectWords(player, words, sentenceWords, [0])

      expect(result.collectedWordIndices).toEqual([0])
      expect(result.words[0].isCollected).toBe(false)
      expect(result.invalidCollection).toBe(true)
    })
  })

  describe('resetSentenceProgress', () => {
    it('clears collected indices and respawns sentence words', () => {
      const vocabulary = [{ term: 'The cat sits', translation: 'แมวนั่งอยู่' }]
      const state = createCastleDefenseState(vocabulary)
      const seededWords = spawnSentenceWords(state.currentSentenceEnglish, () => 0.5).map((word, index) => ({
        ...word,
        isCollected: index === 0,
      }))

      const resetState = resetSentenceProgress({
        ...state,
        collectedWordIndices: [0],
        words: seededWords,
      })

      expect(resetState.collectedWordIndices).toEqual([])
      expect(resetState.words).toHaveLength(state.sentenceWords.length)
      expect(resetState.words.every(word => !word.isCollected)).toBe(true)
      expect(new Set(resetState.words.map(word => word.translation))).toEqual(new Set(state.sentenceWords))
    })
  })

  describe('isSentenceComplete', () => {
    it('returns true when all words are collected', () => {
      expect(isSentenceComplete([0, 1, 2], 3)).toBe(true)
    })

    it('returns false when words are missing', () => {
      expect(isSentenceComplete([0, 1], 3)).toBe(false)
    })
  })

  describe('createCastleDefenseState', () => {
    it('should create valid initial state with empty vocabulary', () => {
      const state = createCastleDefenseState([])

      expect(state.status).toBe('playing')
      expect(state.player.x).toBe(GAME_WIDTH / 2)
      expect(state.player.y).toBe(GAME_HEIGHT - 100)
      expect(state.player.radius).toBe(PLAYER_RADIUS)
      expect(state.player.inventory).toEqual([])
      expect(state.enemies).toEqual([])
      expect(state.base.hp).toBe(BASE_HP)
      expect(state.wave).toBe(1)
      expect(state.currentSentenceEnglish).toBe('')
      expect(state.currentSentenceThai).toBe('')
      expect(state.sentenceWords).toEqual([])
      expect(state.collectedWordIndices).toEqual([])
      expect(state.sentenceCompleted).toBe(false)
    })

    it('should assign target words to tower slots from vocabulary', () => {
      const vocab = [
        { term: 'hello', translation: 'hola' },
        { term: 'world', translation: 'mundo' },
      ]
      const state = createCastleDefenseState(vocab)

      expect(state.towerSlots.length).toBeGreaterThan(0)
      expect(state.towerSlots[0].targetWord).toBe('hola')
      expect(state.towerSlots[1].targetWord).toBe('mundo')
    })

    it('should set initial target word from vocabulary', () => {
      const vocab = [{ term: 'test', translation: 'prueba' }]
      const state = createCastleDefenseState(vocab)

      expect(state.targetWord).toBe('prueba')
    })

    it('should initialize sentence fields from first vocabulary item', () => {
      const vocab = [
        { term: 'The cat is on the mat', translation: 'แมวอยู่บนพรม' },
        { term: 'I like to eat apples', translation: 'ฉันชอบกินแอปเปิ้ล' },
      ]
      const state = createCastleDefenseState(vocab)

      expect(state.currentSentenceEnglish).toBe('The cat is on the mat')
      expect(state.currentSentenceThai).toBe('แมวอยู่บนพรม')
      expect(state.sentenceWords).toEqual(['The', 'cat', 'is', 'on', 'the', 'mat'])
      expect(state.collectedWordIndices).toEqual([])
      expect(state.sentenceCompleted).toBe(false)
    })
  })

  describe('movePlayer', () => {
    it('should move player right', () => {
      const player = createCastleDefenseState([]).player
      const moved = movePlayer(player, { dx: 1, dy: 0 }, 50)
      expect(moved.x).toBeGreaterThan(player.x)
      expect(moved.y).toBe(player.y)
    })

    it('should clamp player to game bounds', () => {
      const player = { ...createCastleDefenseState([]).player, x: GAME_WIDTH - 5 }
      const moved = movePlayer(player, { dx: 1, dy: 0 }, 50)
      expect(moved.x).toBeLessThanOrEqual(GAME_WIDTH - PLAYER_RADIUS)
    })

    it('should normalize diagonal movement', () => {
      const player = createCastleDefenseState([]).player
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

  describe('spawnEnemy', () => {
    it('should spawn soldier by default', () => {
      const enemy = spawnEnemy([{ x: 0, y: 100 }], 1, () => 0.5)
      expect(enemy.type).toBe('soldier')
    })

    it('should spawn tank after wave 2 with right roll', () => {
      const enemy = spawnEnemy([{ x: 0, y: 100 }], 3, () => 0.2)
      expect(enemy.type).toBe('tank')
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
      const state = createCastleDefenseState(vocabulary)
      const nextState = advanceCastleDefenseTime(state, 50, { dx: 1, dy: 0 }, vocabulary)
      expect(nextState.player.x).toBeGreaterThan(state.player.x)
    })

    it('should increase game time', () => {
      const state = createCastleDefenseState(vocabulary)
      const nextState = advanceCastleDefenseTime(state, 50, { dx: 0, dy: 0 }, vocabulary)
      expect(nextState.gameTime).toBe(50)
    })

    it('should spawn enemies after spawn timer', () => {
      const state = { ...createCastleDefenseState(vocabulary), spawnTimer: SPAWN_RATE_MS - 10 }
      const nextState = advanceCastleDefenseTime(state, 50, { dx: 0, dy: 0 }, vocabulary)
      expect(nextState.enemies.length).toBeGreaterThan(0)
    })

    it('should set gameover when base HP reaches 0', () => {
      const state = { 
        ...createCastleDefenseState(vocabulary), 
        base: { ...createCastleDefenseState(vocabulary).base, hp: 0 } 
      }
      const nextState = advanceCastleDefenseTime(state, 50, { dx: 0, dy: 0 }, vocabulary)
      expect(nextState.status).toBe('gameover')
    })

    it('marks sentence complete and awards points when all words are collected', () => {
      const baseState = createCastleDefenseState(vocabulary)
      const state = {
        ...baseState,
        sentenceWords: ['hello', 'world'],
        collectedWordIndices: [0, 1],
        sentenceCompleted: false,
        words: [],
        enemies: [],
      }

      const nextState = advanceCastleDefenseTime(state, 0, { dx: 0, dy: 0 }, vocabulary)

      expect(nextState.sentenceCompleted).toBe(true)
      expect(nextState.score).toBe(state.score + 50)
    })
  })
})
