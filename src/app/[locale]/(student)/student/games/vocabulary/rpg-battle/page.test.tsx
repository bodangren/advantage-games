import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import RpgBattlePage from "./page";
import React from "react";

// Mock the game store
jest.mock("@/store/useGameStore", () => ({
  useGameStore: jest.fn((selector) =>
    selector({
      vocabulary: [
        { term: "A", translation: "1" },
        { term: "B", translation: "2" },
        { term: "C", translation: "3" },
        { term: "D", translation: "4" },
        { term: "E", translation: "5" },
      ],
      setVocabulary: jest.fn(),
      setLastResult: jest.fn(),
    }),
  ),
}));

// Mock useScopedI18n
jest.mock("@/locales/client", () => ({
  useScopedI18n: () => jest.fn((key) => key),
}));

// Mock the RPG battle store
jest.mock("@/store/useRPGBattleStore", () => {
  const actual = jest.requireActual("@/store/useRPGBattleStore");
  const mockState = {
    playerHealth: 100,
    playerMaxHealth: 100,
    enemyHealth: 100,
    enemyMaxHealth: 100,
    turn: "player",
    status: "idle",
    battleLog: [],
    playerPose: "idle",
    enemyPose: "idle",
    inputLocked: false,
    revealedTranslation: null,
    selectionStep: "ready",
    selectedHeroId: "male",
    selectedLocationId: "magic-arena",
    selectedEnemyId: "goblin",
    streak: 0,
    initializeBattle: jest.fn(),
    setStatus: jest.fn(),
    setTurn: jest.fn(),
    damageEnemy: jest.fn(),
    enemyAttack: jest.fn(),
    submitAnswer: jest.fn(),
    addLogEntry: jest.fn(),
    selectHero: jest.fn(),
    selectLocation: jest.fn(),
    selectEnemy: jest.fn(),
    resetSelection: jest.fn(),
  };
  return {
    ...actual,
    useRPGBattleStore: Object.assign(
      (selector?: (state: typeof mockState) => unknown) => (selector ? selector(mockState) : mockState),
      {
        getState: () => ({
          ...mockState,
          status: "playing", // Default to playing for getState calls in tests
        }),
        setState: jest.fn(),
      },
    ),
  };
});

jest.mock("next/link", () => {
  const Link = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return <a href={href}>{children}</a>;
  };
  Link.displayName = "Link";
  return Link;
});

// Mock useSound
jest.mock("@/hooks/useSound", () => ({
  useSound: () => ({ playSound: jest.fn() }),
}));

describe("RpgBattlePage", () => {
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            vocabulary: [
              { term: "A", translation: "1" },
              { term: "B", translation: "2" },
              { term: "C", translation: "3" },
              { term: "D", translation: "4" },
              { term: "E", translation: "5" },
            ],
          }),
      }),
    ) as jest.Mock;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the RPG battle shell", async () => {
    render(<RpgBattlePage />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Use translation keys matching the mock
    expect(screen.getAllByText(/games.rpgBattle.title/i)[0]).toBeInTheDocument();
    expect(screen.getByText("rpgBattle.battlePreparation")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /backToGames/i }),
    ).toHaveAttribute("href", "/student/games");
  });

  it("shows the selection modal before the battle starts", async () => {
    render(<RpgBattlePage />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getAllByText(/games.rpgBattle.title/i)[0]).toBeInTheDocument();
  });

  it("starts the battle once selections are complete", async () => {
    render(<RpgBattlePage />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Click start button to transition from StartScreen to Game
    const startButton = screen.getByRole("button", {
      name: /common.startBattle/i,
    });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId("battle-stage")).toBeInTheDocument();
    });
  });

  it("applies the selected location background to the battle stage", async () => {
    render(<RpgBattlePage />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Click start button
    const startButton = screen.getByRole("button", {
      name: /common.startBattle/i,
    });
    fireEvent.click(startButton);

    await waitFor(() => {
      const stage = screen.getByTestId("battle-stage");
      expect(stage.style.backgroundImage).toContain(
        "background_magic_arena.png",
      );
    });
  });
});
