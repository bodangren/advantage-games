import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type GameCard = {
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

export default function MainMenu() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-primary">
            Vocab Arcade
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose your challenge and master new words!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {gameCards.map((game) => {
            const isPlayable = game.status === 'playable'

            return (
              <Card
                key={game.id}
                className={cn(
                  'group overflow-hidden border-2 transition-all hover:shadow-lg',
                  isPlayable ? 'hover:border-primary/50' : 'border-dashed opacity-80'
                )}
              >
                <div className="relative w-full overflow-hidden rounded-t-xl">
                  <div className="relative h-44 w-full">
                    <Image
                      src={game.cover}
                      alt={`${game.title} cover`}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className={cn(
                        'object-cover transition-transform duration-300',
                        isPlayable && 'group-hover:scale-105'
                      )}
                    />
                  </div>
                </div>
                <CardHeader className="gap-3 px-6 pt-4">
                  <CardTitle className="text-2xl">{game.title}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  {isPlayable && game.href ? (
                    <Button asChild className="w-full" size="lg">
                      <Link href={game.href}>Play Now</Link>
                    </Button>
                  ) : (
                    <Button disabled variant="secondary" className="w-full" size="lg">
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </main>
  )
}
