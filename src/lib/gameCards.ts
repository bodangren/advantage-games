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
    id: 'magic-defense',
    title: 'Magic Defense',
    description: 'Defend your castles from falling words by typing their translations.',
    cover: '/games/cover/magic-defense-cover.png',
    href: '/games/magic-defense',
    status: 'playable',
  },
  {
    id: 'rpg-battle',
    title: 'RPG Battle',
    description: 'Duel monsters by typing the correct translations.',
    cover: '/games/cover/rpg-battle-cover.png',
    href: '/games/rpg-battle',
    status: 'playable',
  },
  {
    id: 'dragon-flight',
    title: 'Dragon Flight',
    description: 'Choose the correct gate to grow your dragon flight.',
    cover: '/games/cover/dragon-flight-cover.png',
    status: 'coming-soon',
  },
  {
    id: 'treasure-chest-rush',
    title: 'Treasure Chest Rush',
    description: 'Stop the spinning locks on the correct translations.',
    cover: '/games/cover/treasure-chest-rush-cover.png',
    status: 'coming-soon',
  },
  {
    id: 'light-barrier',
    title: 'Light Barrier',
    description: 'Connect the correct translations to hold back the horde.',
    cover: '/games/cover/light-barrier-cover.png',
    status: 'coming-soon',
  },
  {
    id: 'word-collapse',
    title: 'Word Collapse',
    description: 'Tap matching word pairs to clear the board.',
    cover: '/games/cover/word-collapse-cover.png',
    status: 'coming-soon',
  },
  {
    id: 'magic-spell-scroll',
    title: 'Magic Spell Scroll',
    description: 'Find camouflaged words hidden in a magical scene.',
    cover: '/games/cover/magic-spell-scroll-cover.png',
    status: 'coming-soon',
  },
  {
    id: 'castle-tower-stack',
    title: 'Castle Tower Stack',
    description: 'Stack matching translations to build a towering fortress.',
    cover: '/games/cover/castle-tower-stack-cover.png',
    status: 'coming-soon',
  },
  {
    id: 'zombie-escape',
    title: 'Zombie Escape',
    description: 'Grab the correct word to survive the undead chase.',
    cover: '/games/cover/zombie-escape-cover.png',
    status: 'coming-soon',
  },
]
