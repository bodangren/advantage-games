const ORIGINAL_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH;

async function loadGameCards(basePath?: string) {
  if (typeof basePath === 'string') {
    process.env.NEXT_PUBLIC_BASE_PATH = basePath;
  } else {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
  }
  jest.resetModules();
  const gameCardsModule = await import('./gameCards');
  return gameCardsModule.gameCards;
}

afterEach(() => {
  if (typeof ORIGINAL_BASE_PATH === 'string') {
    process.env.NEXT_PUBLIC_BASE_PATH = ORIGINAL_BASE_PATH;
  } else {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
  }
  jest.resetModules();
});

describe('gameCards', () => {
  it('contains playable cards with routes', async () => {
    const gameCards = await loadGameCards();
    const playable = gameCards.filter((card) => card.status === 'playable');

    expect(playable.map((card) => card.id)).toEqual(
      expect.arrayContaining([
        'magic-defense',
        'rpg-battle',
        'dragon-flight',
        'wizard-vs-zombie',
        'rune-match',
        'enchanted-library',
      ])
    );
    playable.forEach((card) => {
      expect(card.href).toMatch(/^\/([a-z]{2}\/)?student\/games\//);
    });
  });

  it('uses the configured base path for cover images', async () => {
    const gameCards = await loadGameCards('/vocab');

    gameCards.forEach((card) => {
      expect(card.cover.startsWith('/vocab/games/')).toBe(true);
    });
  });

  it('uses unique identifiers for cards', async () => {
    const gameCards = await loadGameCards();
    const ids = gameCards.map((card) => card.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('marks only implemented games as playable', async () => {
    const gameCards = await loadGameCards();
    const fs = await import('fs');
    const path = await import('path');

    const playableCards = gameCards.filter((card) => card.status === 'playable');
    const missingGames: string[] = [];

    playableCards.forEach((card) => {
      const gameId = card.id;
      const isVocab = gameId.includes('vocabulary') || 
        ['dragon-flight', 'dragon-rider', 'rpg-battle', 'magic-defense', 'wizard-vs-zombie', 
         'rune-match', 'archers-revenge', 'enchanted-library', 'alchemists-synthesis',
         'paladins-twin-soul'].includes(gameId);
      const gameType = isVocab ? 'vocabulary' : 'sentence';
      
      // Check page and API - these must exist for all playable games
      const pagePath = path.join(process.cwd(), 'src/app/[locale]/(student)/student/games', gameType, gameId);
      const apiPath = path.join(process.cwd(), 'src/app/api/v1/games', gameId);
      
      const hasPage = fs.existsSync(pagePath);
      const hasApi = fs.existsSync(apiPath);
      
      // For babel-architect specifically, check all surfaces since it has no implementation
      if (gameId === 'babel-architect') {
        const componentPath = path.join(process.cwd(), 'src/components/games', gameType, gameId);
        const logicPath = path.join(process.cwd(), 'src/lib/games');
        const hasComponent = fs.existsSync(componentPath);
        const logicFiles = fs.readdirSync(logicPath).filter((f: string) => {
          return f.toLowerCase().includes('babelarchitect') && !f.endsWith('.test.ts') && !f.endsWith('.test.tsx');
        });
        const hasLogic = logicFiles.length > 0;
        
        if (!hasComponent || !hasPage || !hasApi || !hasLogic) {
          missingGames.push(gameId);
        }
        return;
      }
      
      if (!hasPage || !hasApi) {
        missingGames.push(`${gameId}: page=${hasPage}, api=${hasApi}`);
      }
    });

    expect(missingGames).toEqual([]);
  });
});
