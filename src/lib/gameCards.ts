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
  {
    id: 'spellweavers-run',
    title: "Spellweaver's Run",
    description: 'Collect word orbs in the correct order to form sentences in this enchanted forest runner!',
    cover: withBasePath('/games/cover/potion-rush-cover.png'),
    href: '/en/student/games/sentence/spellweavers-run',
    status: 'playable',
  },
  {
    id: 'shadow-gate-dungeon',
    title: 'Shadow Gate Dungeon',
    description: 'Collect word crystals and escape the shadow creature in this dark dungeon survival game!',
    cover: withBasePath('/games/cover/dungeon-liberator.png'),
    href: '/en/student/games/sentence/shadow-gate-dungeon',
    status: 'playable',
  },
  {
    id: 'rune-forge-chamber',
    title: 'Rune Forge Chamber',
    description: 'Tap word circles in the correct order to forge magical runes before the forge cools!',
    cover: withBasePath('/games/cover/rune-match-cover.png'),
    href: '/en/student/games/sentence/rune-forge-chamber',
    status: 'playable',
  },
  {
    id: 'village-guardian',
    title: 'Village Guardian',
    description: 'Defend the village! Rescue villagers in correct order and lead them to safety!',
    cover: withBasePath('/games/cover/rune-match-cover.png'),
    href: '/en/student/games/sentence/village-guardian',
    status: 'playable',
  },
  {
    id: 'labyrinth-goblin-king',
    title: 'Labyrinth of the Goblin King',
    description: 'Navigate the maze! Collect word orbs in order and become a Paladin to defeat the goblins!',
    cover: withBasePath('/games/cover/rune-match-cover.png'),
    href: '/en/student/games/sentence/labyrinth-goblin-king',
    status: 'playable',
  },
]
