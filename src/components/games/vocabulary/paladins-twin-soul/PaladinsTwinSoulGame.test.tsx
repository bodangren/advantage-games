import { render, screen, fireEvent, act } from "@testing-library/react";
import { PaladinsTwinSoulGame } from "./PaladinsTwinSoulGame";
import { VocabularyItem } from "@/lib/games/paladinsTwinSoul";
import React from "react";

// Mock Konva Stage and Layer
jest.mock("react-konva", () => ({
  Stage: ({ children }: any) => <div data-testid="konva-stage">{children}</div>,
  Layer: ({ children }: any) => <div data-testid="konva-layer">{children}</div>,
  Rect: (props: any) => <div data-testid="konva-rect" {...props} />,
  Text: (props: any) => <div data-testid="konva-text" {...props} />,
  Circle: (props: any) => <div data-testid="konva-circle" {...props} />,
  Group: ({ children }: any) => <div data-testid="konva-group">{children}</div>,
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
    
    expect(await screen.findAllByTestId("konva-rect")).toHaveLength(26); // 1 player + 24 enemies + 1 background
  });
});
