import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { gameCards } from '@/lib/gameCards'

export default function MainMenu() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-6xl space-y-12">
        <header className="text-center space-y-6">
          <h1 className="text-7xl font-serif font-black tracking-tighter uppercase text-primary italic">
            Vocab Arcade
          </h1>
          <p className="text-xl font-mono uppercase tracking-widest text-muted-foreground">
            // Select your challenge //
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
          {gameCards.map((game) => {
            const isPlayable = game.status === 'playable'

            return (
              <Card
                key={game.id}
                className={cn(
                  'group overflow-hidden transition-none',
                  !isPlayable && 'border-dashed opacity-60'
                )}
              >
                <div className="relative w-full overflow-hidden border-b-heavy border-foreground bg-secondary">
                  <Image
                    src={game.cover}
                    alt={`${game.title} cover`}
                    width={1024}
                    height={1536}
                    sizes="(min-width: 1280px) 320px, (min-width: 768px) 50vw, 100vw"
                    className={cn(
                      'w-full h-auto object-contain transition-none grayscale hover:grayscale-0',
                      isPlayable && 'group-hover:scale-105'
                    )}
                  />
                </div>
                <CardHeader className="gap-3 px-6 pt-6">
                  <CardTitle>{game.title}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-4">
                  {isPlayable && game.href ? (
                    <Button asChild className="w-full" size="lg">
                      <Link href={game.href}>Initiate Sequence</Link>
                    </Button>
                  ) : (
                    <Button disabled variant="secondary" className="w-full" size="lg">
                      Data Locked
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
