import { render, screen, fireEvent, act } from "@testing-library/react";
import { PaladinsTwinSoulGame } from "./PaladinsTwinSoulGame";
import { VocabularyItem } from "@/lib/games/paladinsTwinSoul";
import React from "react";

import { useDPad } from "@/hooks/useDPad";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";

import { GameStartScreen } from "@/components/games/game/GameStartScreen";

import { GameEndScreen } from "@/components/games/game/GameEndScreen";

import { useSound } from "@/hooks/useSound";

import { useInterval } from "@/hooks/useInterval";
import { useScopedI18n } from "@/locales/client";

import Konva from "konva";
import { Stage, Layer, Rect, Text, Circle, Group, Image as KonvaImage } from "react-konva";

import { AnimatePresence, motion } from "framer-motion";
import { Flame, Shield, Sparkles, Wand2, Trophy, ArrowLeft, ArrowRight } from "lucide-react";
import { withBasePath } from "@/lib/games/basePath";
import {
  advancePaladinsTwinSoulTime,
  createPaladinsTwinSoulState,
  getPaladinsTwinSoulResults,
} from "@/lib/games/paladinsTwinSoul";
import type {
  PaladinsTwinSoulResults,
  PaladinsTwinSoulRound,
  PaladinsTwinSoulState,
  GateSide;
} from "@/lib/games/paladinsTwinSoul";
import type { VocabularyItem } from "@/store/useGameStore";

// Mock hooks
jest.mock("@/hooks/useDPad", () => ({
  useDPad: jest.fn(() => ({ x: 0, y: 0 })),
}));

jest.mock("@/hooks/useKeyboardControls", () => ({
  useKeyboardControls: jest.fn(() => ({ x: 0, y: 0 })),
}));
jest.mock("@/hooks/useSound", () => ({
  useSound: jest.fn(() => ({ playSound: jest.fn() })),
}));
jest.mock("@/hooks/useInterval", () => ({
  useInterval: jest.fn(),
}));
jest.mock("@/locales/client", () => ({
  useScopedI18n: jest.fn(() => (key: string) => key),
}));
jest.mock("react-konva", () => ({
  Stage: ({ children }: any) => <div data-testid="konva-stage">{children}</div>,
  Layer: ({ children }: any) => <div data-testid="konva-layer">{children}</div>,
  Rect: (props: any) => <div data-testid="konva-rect" {...props} />,
  Text: (props: any) => <div data-testid="konva-text" {...props} />,
  Circle: (props: any) => <div data-testid="konva-circle" {...props} />,
  Group: ({ children }: any) => <div data-testid="konva-group">{children}</div>,
  Image: (props: any) => <div data-testid="konva-image" {...props} />,
}));
jest.mock("@/components/games/game/GameStartScreen", () => ({
  GameStartScreen: ({ onStart }: { onStart: () => void, children: any }) => <div>{children}</div>,
}));
jest.mock("@/components/games/game/GameEndScreen", () => ({
  GameEndScreen: () => <div data-testid="game-end-screen" />,
}));
describe("PaladinsTwinSoulGame", () => {
  const vocabulary: VocabularyItem[] = [
    { term: "Run", translation: "Correr" },
    { term: "Jump", translation: "Saltar" },
  ];
  it("renders the start screen initially", () => {
    render(<PaladinsTwinSoulGame vocabulary={vocabulary} onComplete={jest.fn()} />);
    expect(screen.getByText(/Paladin's Twin-Soul/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Begin Defense/i })).toBeInTheDocument();
  });

  it("transitions to playing phase when start is clicked", async () => {
    render(<PaladinsTwinSoulGame vocabulary={vocabulary} onComplete={jest.fn()} />);
    const startButton = screen.getByRole("button", { name: /Begin Defense/i });
    fireEvent.click(startButton);
    
    expect(await screen.findByTestId("konva-stage")).toBeInTheDocument();
  });

  it("renders the player and enemies", async () => {
    render(<PaladinsTwinSoulGame vocabulary={vocabulary} onComplete={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Begin Defense/i }));
    
    expect(await screen.findAllByTestId("konva-rect")).toHaveLength(26);
  });
});

  it("transitions to playing phase when start is clicked", async () => {
    render(<PaladinsTwinSoulGame vocabulary={vocabulary} onComplete={jest.fn()} />);
    const startButton = screen.getByRole("button", { name: /Begin Defense/i });
    fireEvent.click(startButton);
    
    expect(await screen.findByTestId("konva-stage")).toBeInTheDocument();
  });
  it("renders the player and enemies", async () => {
    render(<PaladinsTwinSoulGame vocabulary={vocabulary} onComplete={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Begin Defense/i }));
    
    expect(await screen.findAllByTestId("konva-rect")).toHaveLength(26);
  });
});

  it("transitions to playing phase when start is clicked", async () => {
    render(<PaladinsTwinSoulGame vocabulary={vocabulary} onComplete={jest.fn()} />);
    const startButton = screen.getByRole("button", { name: /Begin Defense/i });
    fireEvent.click(startButton);
    
    expect(await screen.findByTestId("konva-stage")).toBeInTheDocument();
  });

  it("renders the player and enemies", async () => {
    render(<PaladinsTwinSoulGame vocabulary={vocabulary} onComplete={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Begin Defense/i }));
    
    expect(await screen.findAllByTestId("konva-rect")).toHaveLength(26); // 1 player + 24 enemies + 1 background
  });
});
