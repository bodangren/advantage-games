'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Wand2 } from 'lucide-react'

export default function MainMenu() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-primary">
            Vocab Arcade
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose your challenge and master new words!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50 cursor-pointer group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Wand2 className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">Magic Defense</CardTitle>
              <CardDescription>
                Defend your castles from falling words by typing their translations!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/games/magic-defense" passHref legacyBehavior>
                <Button className="w-full" size="lg">Play Now</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50 cursor-pointer group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">RPG Battle</CardTitle>
              <CardDescription>
                Duel monsters by typing the correct translations!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/games/rpg-battle" passHref legacyBehavior>
                <Button className="w-full" size="lg">Play Now</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Placeholder for future games */}
          <Card className="opacity-50 border-dashed">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                <span className="text-2xl">?</span>
              </div>
              <CardTitle className="text-2xl text-muted-foreground">Coming Soon</CardTitle>
              <CardDescription>
                More exciting games are under development.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled variant="secondary" className="w-full" size="lg">Locked</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
