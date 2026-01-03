import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { gameCards } from '@/lib/gameCards'

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
