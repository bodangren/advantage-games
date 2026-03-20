"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Stage, Layer, Rect, Text, Group, Circle } from 'react-konva';
import { DUNGEON_LIBERATOR_CONFIG } from '@/lib/games/dungeonLiberatorConfig';
import { 
  createInitialDungeonLiberatorState, 
  tickDungeonLiberator, 
  handleDungeonLiberatorInput,
  spawnDungeonLiberatorPrisoners,
  spawnDungeonLiberatorMonsters,
  getFollowerPositions,
  GameState 
} from '@/lib/games/dungeonLiberator';
import { VocabularyItem } from '@/store/useGameStore';
import { useDirectionalInput } from '@/hooks/useDirectionalInput';
import { GameStartScreen } from '@/components/games/game/GameStartScreen';
import { GameEndScreen } from '@/components/games/game/GameEndScreen';
import { Shield, Users, Ghost, Portal } from 'lucide-react';

export interface DungeonLiberatorGameProps {
  vocabList: VocabularyItem[];
  difficulty: string;
  onComplete: (results: { xp: number; accuracy: number; difficulty: string; score: number }) => void;
}

const DungeonLiberatorGame: React.FC<DungeonLiberatorGameProps> = ({ vocabList, difficulty, onComplete }) => {
  const [gameState, setGameState] = useState<GameState>(() => 
    createInitialDungeonLiberatorState(vocabList[0]?.sentence?.split(' ') || [])
  );
  
  const [dimensions, setDimensions] = useState({ width: 390, height: 844 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTickTime = useRef<number>(Date.now());
  const { input } = useDirectionalInput();

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const update = useCallback(() => {
    if (gameState.status !== 'playing') return;

    const now = Date.now();
    const deltaTime = (now - lastTickTime.current) / 1000;
    lastTickTime.current = now;

    setGameState((prev) => {
      let next = tickDungeonLiberator(prev, deltaTime);
      if (input.dx !== 0 || input.dy !== 0) {
        next = handleDungeonLiberatorInput(next, { dx: input.dx, dy: input.dy }, deltaTime);
      }
      return next;
    });
  }, [gameState.status, input]);

  useEffect(() => {
    const interval = setInterval(update, 1000 / 60);
    return () => clearInterval(interval);
  }, [update]);

  useEffect(() => {
    if (gameState.status === 'won' || gameState.status === 'lost') {
      onComplete({
        xp: gameState.xp,
        accuracy: gameState.collectedWords.length / gameState.sentence.length,
        difficulty,
        score: gameState.score
      });
    }
  }, [gameState.status, gameState.xp, gameState.score, gameState.collectedWords.length, gameState.sentence.length, difficulty, onComplete]);

  const handleStart = () => {
    const initialState = createInitialDungeonLiberatorState(vocabList[0]?.sentence?.split(' ') || []);
    let withAssets = spawnDungeonLiberatorPrisoners(initialState);
    withAssets = spawnDungeonLiberatorMonsters(withAssets);
    setGameState({ ...withAssets, status: 'playing' });
    lastTickTime.current = Date.now();
  };

  const scale = Math.min(dimensions.width / 390, dimensions.height / 844);
  const followerPositions = getFollowerPositions(gameState);

  if (gameState.status === 'start') {
    return (
      <GameStartScreen
        gameTitle="Dungeon Liberator"
        gameSubtitle="Rescue the prisoners and lead them to freedom!"
        icon={Shield}
        vocabulary={vocabList}
        instructions={[
          { step: 1, text: "Move the Knight using WASD or Arrows" },
          { step: 2, text: "Collect prisoners in the correct sentence order" },
          { step: 3, text: "Avoid monsters and lead your followers to the exit" }
        ]}
        controls={[
          { label: "Move", keys: "WASD / Arrows", color: "bg-blue-500" }
        ]}
        startButtonText="START MISSION"
        onStart={handleStart}
      />
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-slate-950">
      <Stage width={dimensions.width} height={dimensions.height} scaleX={scale} scaleY={scale}>
        <Layer>
          {/* Floor */}
          <Rect 
            width={390} height={844} 
            fill={DUNGEON_LIBERATOR_CONFIG.colors.floor} 
          />

          {/* Prisoners (Uncollected) */}
          {gameState.prisoners.map(p => !p.isCollected && p.isActive && (
            <Group key={p.id} x={p.x} y={p.y}>
              <Circle
                radius={p.size / 2}
                fill={DUNGEON_LIBERATOR_CONFIG.colors.prisoner}
                stroke="white"
                strokeWidth={1}
              />
              <Text 
                text={p.word}
                x={-50} y={p.size / 2 + 5}
                width={100} align="center"
                fill="white" fontSize={14} fontStyle="bold"
              />
            </Group>
          ))}

          {/* Followers (Rescued line) */}
          {followerPositions.map((pos, i) => (
            <Group key={`follower-${i}`} x={pos.x} y={pos.y}>
              <Circle
                radius={DUNGEON_LIBERATOR_CONFIG.prisoner.size / 2}
                fill={DUNGEON_LIBERATOR_CONFIG.colors.correct}
                opacity={0.8}
              />
              <Text 
                text={gameState.collectedWords[i]}
                x={-50} y={-DUNGEON_LIBERATOR_CONFIG.prisoner.size / 2 - 15}
                width={100} align="center"
                fill="#2ecc71" fontSize={12} fontStyle="bold"
              />
            </Group>
          ))}

          {/* Monsters */}
          {gameState.monsters.map(m => m.isActive && (
            <Group key={m.id} x={m.x} y={m.y}>
              <Circle
                radius={m.size / 2}
                fill={DUNGEON_LIBERATOR_CONFIG.colors.monster}
                shadowBlur={10}
                shadowColor="red"
              />
              <Ghost size={m.size} color="white" />
            </Group>
          ))}

          {/* Exit Portal */}
          {gameState.exitPortal?.isActive && (
            <Group x={gameState.exitPortal.x} y={gameState.exitPortal.y}>
              <Circle
                radius={30}
                fillRadialGradientStartPoint={{ x: 0, y: 0 }}
                fillRadialGradientStartRadius={0}
                fillRadialGradientEndPoint={{ x: 0, y: 0 }}
                fillRadialGradientEndRadius={30}
                fillRadialGradientColorStops={[0, '#9b59b6', 1, '#2c3e50']}
                shadowBlur={20}
                shadowColor="#9b59b6"
              />
              <Text 
                text="EXIT"
                x={-20} y={-10}
                fill="white" fontSize={14} fontStyle="bold"
              />
            </Group>
          )}

          {/* Player */}
          <Group 
            x={gameState.player.x} 
            y={gameState.player.y}
            opacity={gameState.player.invulnerableTime > 0 ? 0.5 : 1}
          >
            <Circle
              radius={gameState.player.size / 2}
              fill={DUNGEON_LIBERATOR_CONFIG.colors.player}
              stroke="white"
              strokeWidth={2}
            />
            <Shield size={gameState.player.size * 0.6} color="white" />
          </Group>

          {/* HUD Overlay */}
          <Group y={20} x={10}>
            <Rect width={370} height={80} fill="rgba(0,0,0,0.6)" cornerRadius={10} />
            <Text 
              text={gameState.sentence.join(' ')}
              x={10} y={10} width={350} align="center"
              fontSize={16} fill="white" opacity={0.5}
            />
            <Text 
              text={gameState.collectedWords.join(' ')}
              x={10} y={40} width={350} align="center"
              fontSize={20} fill="#2ecc71" fontStyle="bold"
            />
          </Group>

          {/* HP Bar */}
          <Group x={10} y={110}>
            {[...Array(gameState.player.maxHp)].map((_, i) => (
              <Circle 
                key={i}
                x={i * 25 + 10}
                y={10}
                radius={8}
                fill={i < gameState.player.hp ? "#e74c3c" : "#2d3748"}
              />
            ))}
          </Group>
        </Layer>
      </Stage>

      {gameState.status === 'won' && (
        <GameEndScreen
          status="victory"
          title="Freedom!"
          subtitle="All prisoners rescued and safely escaped."
          score={gameState.score}
          xp={gameState.xp}
          accuracy={1}
          onRestart={handleStart}
          onExit={() => {}}
        />
      )}

      {gameState.status === 'lost' && (
        <GameEndScreen
          status="defeat"
          title="Captured!"
          subtitle="The monsters were too strong this time."
          score={gameState.score}
          xp={gameState.xp}
          accuracy={gameState.collectedWords.length / gameState.sentence.length}
          onRestart={handleStart}
          onExit={() => {}}
        />
      )}
    </div>
  );
};

export default DungeonLiberatorGame;
