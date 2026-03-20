import { render, screen, fireEvent, act } from "@testing-library/react";
import { RealmCarverGame } from "./RealmCarverGame";
import { SentenceItem } from "@/lib/games/realmCarver";
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

describe("RealmCarverGame", () => {
  const vocabulary: SentenceItem[] = [
    { term: "The", translation: "The" },
    { term: "cat", translation: "cat" },
  ];

  it("renders the start screen initially", () => {
    render(<RealmCarverGame sentences={vocabulary} onComplete={jest.fn()} />);
    expect(screen.getByText(/Realm Carver/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Start Mapping/i })).toBeInTheDocument();
  });

  it("transitions to playing phase when start is clicked", async () => {
    render(<RealmCarverGame sentences={vocabulary} onComplete={jest.fn()} />);
    const startButton = screen.getByRole("button", { name: /Start Mapping/i });
    fireEvent.click(startButton);
    
    expect(await screen.findByTestId("konva-stage")).toBeInTheDocument();
  });
});
