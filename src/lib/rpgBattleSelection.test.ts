import { battleEnemies, battleHeroes, battleLocations } from './rpgBattleSelection'

describe('rpgBattleSelection', () => {
  it('defines hero options with sprites', () => {
    expect(battleHeroes).toEqual([
      {
        id: 'male',
        label: 'Male',
        sprite: '/games/rpg-battle/hero_male_pose_sheet_3x3.png',
      },
      {
        id: 'female',
        label: 'Female',
        sprite: '/games/rpg-battle/hero_female_pose_sheet_3x3.png',
      },
    ])
  })

  it('defines the available battle locations', () => {
    expect(battleLocations).toEqual([
      {
        id: 'forest-clearing',
        label: 'Forest Clearing',
        background: '/games/rpg-battle/locations/forest-clearing.png',
      },
      {
        id: 'ruined-road',
        label: 'Ruined Road',
        background: '/games/rpg-battle/locations/ruined-road.png',
      },
      {
        id: 'magic-arena',
        label: 'Magic Arena',
        background: '/games/rpg-battle/locations/magic-arena.png',
      },
      {
        id: 'throne-hall',
        label: 'Throne Hall',
        background: '/games/rpg-battle/locations/throne-hall.png',
      },
    ])
  })

  it('defines enemy multipliers and sprites', () => {
    expect(battleEnemies).toEqual([
      {
        id: 'slime',
        label: 'Slime',
        multiplier: 0.5,
        sprite: '/games/rpg-battle/enemy_slime_pose_sheet_3x3.png',
      },
      {
        id: 'goblin',
        label: 'Goblin',
        multiplier: 1,
        sprite: '/games/rpg-battle/enemy_goblin_pose_sheet_3x3.png',
      },
      {
        id: 'spectre',
        label: 'Spectre',
        multiplier: 1.5,
        sprite: '/games/rpg-battle/enemy_spectre_pose_sheet_3x3.png',
      },
      {
        id: 'elemental',
        label: 'Elemental',
        multiplier: 2,
        sprite: '/games/rpg-battle/enemy_elemental_pose_sheet_3x3.png',
      },
    ])
  })
})
