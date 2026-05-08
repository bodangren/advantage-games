'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useClassStore } from '@/store/classStore';

const AVAILABLE_GAMES = [
  { id: 'castle-defense', name: 'Castle Defense', category: 'sentence' },
  { id: 'dungeon-liberator', name: 'Dungeon Liberator', category: 'sentence' },
  { id: 'griffin-riders-escape', name: "Griffin Rider's Escape", category: 'sentence' },
  { id: 'griffin-sky-joust', name: 'Griffin Sky-Joust', category: 'sentence' },
  { id: 'gryphon-patrol', name: 'Gryphon Patrol', category: 'sentence' },
  { id: 'haunted-library', name: 'The Haunted Library', category: 'sentence' },
  { id: 'labyrinth-goblin-king', name: 'Labyrinth of the Goblin King', category: 'sentence' },
  { id: 'potion-rush', name: 'Potion Rush', category: 'sentence' },
  { id: 'realm-carver', name: 'Realm Carver', category: 'sentence' },
  { id: 'rune-forge-chamber', name: 'Rune Forge Chamber', category: 'sentence' },
  { id: 'shadow-gate-dungeon', name: 'Shadow Gate Dungeon', category: 'sentence' },
  { id: 'spellweavers-run', name: "Spellweaver's Run", category: 'sentence' },
  { id: 'storm-castle-tower', name: 'Storm the Castle Tower', category: 'sentence' },
  { id: 'village-guardian', name: 'Village Guardian', category: 'sentence' },
  { id: 'abyssal-well', name: 'The Abyssal Well', category: 'sentence' },
  { id: 'alchemists-synthesis', name: "Alchemist's Synthesis", category: 'vocabulary' },
  { id: 'archers-revenge', name: "Archer's Revenge", category: 'vocabulary' },
  { id: 'dragon-flight', name: 'Dragon Flight', category: 'vocabulary' },
  { id: 'dragon-rider', name: 'Dragon Rider', category: 'vocabulary' },
  { id: 'enchanted-library', name: 'Enchanted Library', category: 'vocabulary' },
  { id: 'magic-defense', name: 'Magic Defense', category: 'vocabulary' },
  { id: 'paladins-twin-soul', name: "Paladin's Twin-Soul", category: 'vocabulary' },
  { id: 'rpg-battle', name: 'RPG Battle', category: 'vocabulary' },
  { id: 'rune-match', name: 'Rune Match', category: 'vocabulary' },
  { id: 'wizard-vs-zombie', name: 'Wizard vs Zombie', category: 'vocabulary' },
];

const DIFFICULTY_TIERS = [
  { id: 'easy', name: 'Easy', description: 'Basic vocabulary, slower pace' },
  { id: 'medium', name: 'Medium', description: 'Standard difficulty' },
  { id: 'hard', name: 'Hard', description: 'Advanced vocabulary, faster pace' },
  { id: 'extreme', name: 'Extreme', description: 'Maximum challenge' },
];

interface NewAssignmentClientProps {
  params: Promise<{ id: string }>;
}

export default function NewAssignmentClient({ params }: NewAssignmentClientProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { createAssignment, isLoading, error, clearError } = useAssignmentStore();
  const { getClass } = useClassStore();
  
  const [classId, setClassId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [selectedPacks, setSelectedPacks] = useState<string[]>([]);
  const [difficultyTier, setDifficultyTier] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [gameSearch, setGameSearch] = useState('');

  // Resolve params promise
  params.then(({ id }) => {
    if (classId !== id) {
      setClassId(id);
    }
  });

  if (!isAuthenticated) {
    router.push('/teacher/login');
    return null;
  }

  const classData = classId ? getClass(classId) : undefined;

  if (classId && !classData) {
    router.push('/teacher/dashboard');
    return null;
  }

  if (classData && classData.teacherId !== user?.id) {
    router.push('/teacher/dashboard');
    return null;
  }

  const filteredGames = AVAILABLE_GAMES.filter(game =>
    game.name.toLowerCase().includes(gameSearch.toLowerCase()) ||
    game.id.toLowerCase().includes(gameSearch.toLowerCase())
  );

  const toggleGame = (gameId: string) => {
    setSelectedGames(prev =>
      prev.includes(gameId)
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!classId) return;

    try {
      await createAssignment({
        title,
        classId,
        gameIds: selectedGames,
        packIds: selectedPacks,
        difficultyTier,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        maxAttempts,
      });
      router.push(`/teacher/class/${classId}`);
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Assignment</h1>
            {classData && (
              <p className="text-muted-foreground mt-1">
                for {classData.name}
              </p>
            )}
          </div>
          <Button variant="outline" asChild>
            <Link href={classId ? `/teacher/class/${classId}` : '/teacher/dashboard'}>
              Cancel
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <CardDescription>
              Configure the assignment for your students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Assignment Title *
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Week 3 Vocabulary Practice"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Select Games * ({selectedGames.length} selected)
                </label>
                <Input
                  type="text"
                  placeholder="Search games..."
                  value={gameSearch}
                  onChange={(e) => setGameSearch(e.target.value)}
                  disabled={isLoading}
                  className="mb-2"
                />
                <div className="border rounded-md p-4 space-y-4 max-h-96 overflow-y-auto">
                  {['sentence', 'vocabulary'].map(category => {
                    const categoryGames = filteredGames.filter(g => g.category === category);
                    if (categoryGames.length === 0) return null;
                    
                    return (
                      <div key={category}>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          {category} Games
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {categoryGames.map(game => (
                            <label
                              key={game.id}
                              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                selectedGames.includes(game.id)
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-foreground/50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedGames.includes(game.id)}
                                onChange={() => toggleGame(game.id)}
                                disabled={isLoading}
                                className="h-4 w-4"
                              />
                              <span className="text-sm font-medium">{game.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {filteredGames.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No games found matching your search
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty Tier *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DIFFICULTY_TIERS.map(tier => (
                    <label
                      key={tier.id}
                      className={`flex flex-col p-4 rounded-lg border cursor-pointer transition-colors ${
                        difficultyTier === tier.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-foreground/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="difficulty"
                          value={tier.id}
                          checked={difficultyTier === tier.id}
                          onChange={(e) => setDifficultyTier(e.target.value)}
                          disabled={isLoading}
                          className="h-4 w-4"
                        />
                        <span className="font-medium">{tier.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground mt-1 ml-7">
                        {tier.description}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="dueDate" className="text-sm font-medium">
                    Due Date (Optional)
                  </label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="maxAttempts" className="text-sm font-medium">
                    Max Attempts *
                  </label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    min={1}
                    max={10}
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(parseInt(e.target.value) || 1)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500" role="alert">{error}</p>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading || selectedGames.length === 0}
                >
                  {isLoading ? 'Creating...' : 'Create Assignment'}
                </Button>
                <Button variant="outline" asChild>
                  <Link href={classId ? `/teacher/class/${classId}` : '/teacher/dashboard'}>
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
