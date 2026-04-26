import { render, screen } from "@testing-library/react";
import GryphonPatrolGame from "./GryphonPatrolGame";
import React from "react";

const mockEnterFullscreen = jest.fn();
const mockExitFullscreen = jest.fn();

// Mock requestAnimationFrame globally
const mockRaf = jest.fn(() => 1);
global.requestAnimationFrame = mockRaf;
global.cancelAnimationFrame = jest.fn();

// Mock Konva Stage and Layer
jest.mock("react-konva", () => ({
  Stage: ({ children }: any) => <div data-testid="konva-stage">{children}</div>,
  Layer: ({ children }: any) => <div data-testid="konva-layer">{children}</div>,
  Rect: (props: any) => <div data-testid="konva-rect" {...props} />,
  Text: (props: any) => <div data-testid="konva-text" {...props} />,
  Circle: (props: any) => <div data-testid="konva-circle" {...props} />,
  Group: ({ children }: any) => <div data-testid="konva-group">{children}</div>,
  Line: (props: any) => <div data-testid="konva-line" {...props} />,
}));

// Mock hooks
jest.mock("@/hooks/useDirectionalInput", () => ({
  useDirectionalInput: () => ({ input: { dx: 0, dy: 0, cast: false }, consumeCast: jest.fn() }),
}));

jest.mock("@/hooks/useGameFullscreen", () => ({
  useGameFullscreen: () => ({
    containerRef: { current: null },
    enterFullscreen: mockEnterFullscreen,
    exitFullscreen: mockExitFullscreen,
  }),
}));

jest.mock("@/hooks/useAccessibilitySettings", () => ({
  useAccessibilitySettings: () => ({
    settings: {
      textSizeMultiplier: 1,
      touchTargetMultiplier: 1,
      assistMode: false,
      reduceMotion: false,
    },
    getEffectiveTextSize: (base: number) => base,
    getEffectiveTouchTarget: (base: number) => base,
  }),
}));

const mockVocabulary = [
  { term: "The brave gryphon flies", translation: "กริฟฟอนผู้กล้าหาญบิน" },
];

describe("GryphonPatrolGame", () => {
  it("renders without crashing", () => {
    render(<GryphonPatrolGame vocabList={mockVocabulary} difficulty="medium" onComplete={jest.fn()} />);
    expect(screen.getByText(/Gryphon Patrol/i)).toBeInTheDocument();
  });
});
