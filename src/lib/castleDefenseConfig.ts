export type EnemyType = 'SOLDIER' | 'TANK' | 'BOSS'

export interface EnemyStats {
  type: EnemyType
  hp: number
  speed: number
  reward: number // XP or Score
  cost: number // For wave budget
  radius: number
  color: string
}

export const CASTLE_DEFENSE_CONFIG = {
  WAVE: {
    INITIAL_BUDGET: 12, // Slight bump to start
    MULTIPLIER: 1.6, // Steeper curve
    COOLDOWN_MS: 5000,
    MAX_CONCURRENT_ENEMIES: 15,
  },
  ENEMIES: {
    SOLDIER: {
      type: 'SOLDIER',
      hp: 6,
      speed: 1.6, 
      reward: 10,
      cost: 1,
      radius: 15,
      color: '#ef4444', 
    } as EnemyStats,
    TANK: {
      type: 'TANK',
      hp: 30,
      speed: 1.1, 
      reward: 25,
      cost: 4,
      radius: 20,
      color: '#7f1d1d', 
    } as EnemyStats,
    BOSS: {
      type: 'BOSS',
      hp: 150,
      speed: 0.75, 
      reward: 100,
      cost: 15,
      radius: 35,
      color: '#4c0519', 
    } as EnemyStats,
  },
  TOWER: {
      COST: 0, 
      DAMAGE: 2, 
      RANGE: 180, // 200 -> 180
      COOLDOWN: 1200, // 800ms -> 1200ms
  }
}