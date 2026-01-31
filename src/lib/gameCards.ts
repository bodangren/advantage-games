import { withBasePath } from './basePath'

export type GameCard = {
  id: string
  title: string
  description: string
  cover: string
  href?: string
  status: 'playable' | 'coming-soon'
}

export const gameCards: GameCard[] = [
  {
    id: 'castle-defense',
    title: 'Castle Defense',
    description: 'Collect words to build towers and defend your castle!',
    cover: withBasePath('/games/cover/castle-defense-cover.png'),
    href: '/games/castle-defense',
    status: 'playable',
  },
  {
    id: 'magic-defense',
    title: 'Magic Defense',
    description: 'Defend your castles from falling words by typing their translations.',
    cover: withBasePath('/games/cover/magic-defense-cover.png'),
    href: '/games/magic-defense',
    status: 'playable',
  },
  {
    id: 'rpg-battle',
    title: 'RPG Battle',
    description: 'Duel monsters by typing the correct translations.',
    cover: withBasePath('/games/cover/rpg-battle-cover.png'),
    href: '/games/rpg-battle',
    status: 'playable',
  },
  {
    id: 'dragon-flight',
    title: 'Dragon Flight',
    description: 'Choose the correct gate to grow your dragon flight.',
    cover: withBasePath('/games/cover/dragon-flight-cover.png'),
    href: '/games/dragon-flight',
    status: 'playable',
  },
  {
    id: 'wizard-vs-zombie',
    title: 'Wizard vs Zombie',
    description: 'Survive the horde by collecting vocabulary orbs.',
    cover: withBasePath('/games/cover/wizard-vs-zombie-cover.png'),
    href: '/games/wizard-vs-zombie',
    status: 'playable',
  },
  {
    id: 'enchanted-library',
    title: 'Enchanted Library',
    description: 'Collect magic books and dodge spirits to master new words.',
    cover: withBasePath('/games/cover/enchanted-library-cover.png'),
    href: '/games/enchanted-library',
    status: 'playable',
  },
  {
    id: 'rune-match',
    title: 'Rune Match',
    description: 'Match vocabulary runes to defeat monsters in this RPG puzzle battle.',
    cover: withBasePath('/games/cover/rune-match-cover.png'),
    href: '/games/rune-match',
    status: 'playable',
  },
  {
    id: 'potion-rush',
    title: 'Potion Rush',
    description: 'Manage a busy potion shop! Brew orders by collecting the correct ingredients from the conveyor belt.',
    cover: withBasePath('/games/cover/potion-rush-cover.png'),
    href: '/games/potion-rush',
    status: 'playable',
  },
]
