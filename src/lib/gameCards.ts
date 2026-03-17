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
    href: '/en/student/games/sentence/castle-defense',
    status: 'playable',
  },
  {
    id: 'dragon-rider',
    title: 'Dragon Rider',
    description: 'Ride your dragon to protect your village',
    cover: withBasePath('/games/dragon-rider/loading-screen-background.png'),
    href: '/en/student/games/vocabulary/dragon-rider',
    status: 'playable',
  },
  {
    id: 'magic-defense',
    title: 'Magic Defense',
    description: 'Defend your castles from falling words by typing their translations.',
    cover: withBasePath('/games/cover/magic-defense-cover.png'),
    href: '/en/student/games/vocabulary/magic-defense',
    status: 'playable',
  },
  {
    id: 'rpg-battle',
    title: 'RPG Battle',
    description: 'Duel monsters by typing the correct translations.',
    cover: withBasePath('/games/cover/rpg-battle-cover.png'),
    href: '/en/student/games/vocabulary/rpg-battle',
    status: 'playable',
  },
  {
    id: 'dragon-flight',
    title: 'Dragon Flight',
    description: 'Choose the correct gate to grow your dragon flight.',
    cover: withBasePath('/games/cover/dragon-flight-cover.png'),
    href: '/en/student/games/vocabulary/dragon-flight',
    status: 'playable',
  },
  {
    id: 'wizard-vs-zombie',
    title: 'Wizard vs Zombie',
    description: 'Survive the horde by collecting vocabulary orbs.',
    cover: withBasePath('/games/cover/wizard-vs-zombie-cover.png'),
    href: '/en/student/games/vocabulary/wizard-vs-zombie',
    status: 'playable',
  },
  {
    id: 'enchanted-library',
    title: 'Enchanted Library',
    description: 'Collect magic books and dodge spirits to master new words.',
    cover: withBasePath('/games/cover/enchanted-library-cover.png'),
    href: '/en/student/games/vocabulary/enchanted-library',
    status: 'playable',
  },
  {
    id: 'rune-match',
    title: 'Rune Match',
    description: 'Match vocabulary runes to defeat monsters in this RPG puzzle battle.',
    cover: withBasePath('/games/cover/rune-match-cover.png'),
    href: '/en/student/games/vocabulary/rune-match',
    status: 'playable',
  },
  {
    id: 'potion-rush',
    title: 'Potion Rush',
    description: 'Manage a busy potion shop! Brew orders by collecting the correct ingredients from the conveyor belt.',
    cover: withBasePath('/games/cover/potion-rush-cover.png'),
    href: '/en/student/games/sentence/potion-rush',
    status: 'playable',
  },
  {
    id: 'dungeon-liberator',
    title: 'Dungeon Liberator',
    description: 'Rescue prisoners by collecting them in the correct word order and escape the dungeon!',
    cover: withBasePath('/games/cover/dungeon-liberator.png'),
    href: '/en/student/games/sentence/dungeon-liberator',
    status: 'playable',
  },
]
