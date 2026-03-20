"use client";

import React, { useCallback, useState } from "react";
import { Stage, Layer, Rect, Text, Circle } from "react-konva";
import { useInterval } from "@/hooks/useInterval";
import {
  createArchersRevengeState,
  GAME_WIDTH,
  GAME_HEIGHT,
  type ArchersRevengeState,
  type ArchersRevengeResults,
} from "@/lib/games/archersRevenge";
import type { VocabularyItem, Difficulty } from "@/store/useGameStore";

type ArchersRevengeGameProps = {
  vocabulary: VocabularyItem[];
    difficulty?: Difficulty;
    onComplete?: (results: ArchersRevengeResults) => void;
    onRestart?: () => void;
};

export function ArchersRevengeGame({
  vocabulary,
  difficulty = "normal",
  onComplete,
  onRestart,
}: ArchersRevengeGameProps) {
  const [gameState, setGameState] = useState<ArchersRevengeState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scale, setScale] = useState(1);

  const startGame = useCallback(() => {
    try {
      const state = createArchersRevengeState(vocabulary, { difficulty });
      setGameState(state);
      setIsPlaying(true);
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  }, [vocabulary, difficulty]);

  const handleComplete = useCallback(() => {
    if (!gameState) return;

    const results: ArchersRevengeResults = {
      score: gameState.score,
      accuracy:
        gameState.totalAttempts > 0
          ? gameState.correctAnswers / gameState.totalAttempts
          : 0,
      xp: Math.floor(gameState.score / 10),
      correctAnswers: gameState.correctAnswers,
      totalAttempts: gameState.totalAttempts,
      wavesCompleted: gameState.wave - 1,
      timeTaken: Math.floor(gameState.gameTime / 1000),
      difficulty: gameState.difficulty,
    };

    setIsPlaying(false);
    onComplete?.(results);
  }, [gameState, onComplete]);

  React.useEffect(() => {
    const handleResize = () => {
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      const scaleX = containerWidth / GAME_WIDTH;
      const scaleY = containerHeight / GAME_HEIGHT;
      setScale(Math.min(scaleX, scaleY, 1));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isPlaying || !gameState) {
    return (
      <div className="flex flex-col items-center justify-center bg-slate-900 p-8">
        <h2 className="mb-4 text-2xl font-bold text-white">
          Archer&apos;s Revenge
        </h2>
        <p className="mb-2 text-slate-300">
          Target: {gameState?.targetWord.term || "Loading..."}
        </p>
        <p className="mb-6 text-slate-400">
          Enemies: {gameState?.enemies.length || 0}
        </p>
        <button
          onClick={startGame}
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-slate-900">
      <Stage width={GAME_WIDTH * scale} height={GAME_HEIGHT * scale}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            fill="#1e293b"
          />

          <Text
            x={10}
            y={10}
            text={`Target: ${gameState.targetWord.term}`}
            fontSize={20}
            fill="#ffffff"
          />

          <Text
            x={10}
            y={40}
            text={`HP: ${gameState.hp}/${gameState.maxHp}`}
            fontSize={16}
            fill="#ef4444"
          />

          <Text
            x={10}
            y={60}
            text={`Score: ${gameState.score}`}
            fontSize={16}
            fill="#22c55e"
          />

          <Text
            x={10}
            y={80}
            text={`Wave: ${gameState.wave}`}
            fontSize={16}
            fill="#3b82f6"
          />

          {gameState.enemies.map((enemy) => (
            <React.Fragment key={enemy.id}>
              <Circle
                x={enemy.x}
                y={enemy.y}
                radius={25}
                fill={enemy.shieldUp ? "#6b7280" : "#22c55e"}
                stroke={enemy.shieldUp ? "#374151" : "#16a34a"}
                strokeWidth={2}
              />
              <Text
                x={enemy.x - 30}
                y={enemy.y + 30}
                text={enemy.translation}
                fontSize={12}
                fill="#ffffff"
                width={60}
                align="center"
              />
            </React.Fragment>
          ))}

          <Rect
            x={GAME_WIDTH / 2 - 20}
            y={GAME_HEIGHT - 60}
            width={40}
            height={40}
            fill="#f59e0b"
            cornerRadius={4}
          />

          <Text
            x={GAME_WIDTH / 2 - 10}
            y={GAME_HEIGHT - 50}
            text="🏹"
            fontSize={24}
          />
        </Layer>
      </Stage>
    </div>
  );
}
