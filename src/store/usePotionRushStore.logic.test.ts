import { usePotionRushStore } from "./usePotionRushStore";

describe("PotionRush Store Logic", () => {
  const mockVocabList = [
    { term: "The cat sits", translation: "แมวนั่ง", id: "1" },
    { term: "I love you", translation: "ฉันรักเธอ", id: "2" },
  ];

  beforeEach(() => {
    usePotionRushStore.getState().reset();
  });

  describe("day completion", () => {
    it("should end game with victory when day completes with reputation above zero", () => {
      const store = usePotionRushStore.getState();
      store.startGame(mockVocabList, "normal");
      
      // Fast-forward dayTime to completion (dayTime += dt * 0.01, so dt = 100 should make it 1.0)
      store.tick(100, 800);
      
      const state = usePotionRushStore.getState();
      expect(state.gameState).toBe("GAME_OVER");
      expect(state.reputation).toBeGreaterThan(0);
      expect(state.dayTime).toBeGreaterThanOrEqual(1);
    });

    it("should not end game before day completes", () => {
      const store = usePotionRushStore.getState();
      store.startGame(mockVocabList, "normal");
      
      // Small tick should not complete the day
      store.tick(10, 800);
      
      const state = usePotionRushStore.getState();
      expect(state.gameState).toBe("PLAYING");
      expect(state.dayTime).toBeLessThan(1);
    });
  });

  describe("blocked cauldron drop", () => {
    it("should preserve ingredient when dropped on WARNING cauldron", () => {
      const store = usePotionRushStore.getState();
      store.startGame(mockVocabList, "normal");
      
      // Set up a WARNING cauldron
      const state = usePotionRushStore.getState();
      const nextCauldrons = [...state.cauldrons];
      nextCauldrons[0] = { ...nextCauldrons[0], state: "WARNING" };
      usePotionRushStore.setState({ cauldrons: nextCauldrons });
      
      // Add an ingredient to conveyor
      const ingredient = {
        id: "test-ingredient",
        word: "The",
        x: 100,
        y: 500,
        type: "herb" as const,
        width: 80,
        isDragging: false,
      };
      usePotionRushStore.setState({ conveyorItems: [ingredient] });
      
      // Try to drop on blocked cauldron
      store.handleDropIngredient(0, "test-ingredient", { x: 100, y: 100 });
      
      const afterState = usePotionRushStore.getState();
      expect(afterState.conveyorItems).toHaveLength(1);
      expect(afterState.conveyorItems[0].id).toBe("test-ingredient");
    });

    it("should preserve ingredient when dropped on COMPLETED cauldron", () => {
      const store = usePotionRushStore.getState();
      store.startGame(mockVocabList, "normal");
      
      // Set up a COMPLETED cauldron
      const state = usePotionRushStore.getState();
      const nextCauldrons = [...state.cauldrons];
      nextCauldrons[1] = { ...nextCauldrons[1], state: "COMPLETED" };
      usePotionRushStore.setState({ cauldrons: nextCauldrons });
      
      // Add an ingredient to conveyor
      const ingredient = {
        id: "test-ingredient-2",
        word: "cat",
        x: 100,
        y: 500,
        type: "mushroom" as const,
        width: 80,
        isDragging: false,
      };
      usePotionRushStore.setState({ conveyorItems: [ingredient] });
      
      // Try to drop on blocked cauldron
      store.handleDropIngredient(1, "test-ingredient-2", { x: 100, y: 100 });
      
      const afterState = usePotionRushStore.getState();
      expect(afterState.conveyorItems).toHaveLength(1);
      expect(afterState.conveyorItems[0].id).toBe("test-ingredient-2");
    });

    it("should consume ingredient when dropped on IDLE cauldron", () => {
      const store = usePotionRushStore.getState();
      store.startGame(mockVocabList, "normal");
      
      // Set up customers so first word matches
      const state = usePotionRushStore.getState();
      const customer = {
        id: "cust-1",
        type: "human" as const,
        request: mockVocabList[0],
        patience: 60,
        maxPatience: 60,
        state: "WAITING" as const,
      };
      usePotionRushStore.setState({ 
        customers: [customer, null, null],
        activeWordPool: ["The", "cat", "sits"]
      });
      
      // Add an ingredient to conveyor
      const ingredient = {
        id: "test-ingredient-3",
        word: "The",
        x: 100,
        y: 500,
        type: "herb" as const,
        width: 80,
        isDragging: false,
      };
      usePotionRushStore.setState({ conveyorItems: [ingredient] });
      
      // Drop on IDLE cauldron with matching first word
      store.handleDropIngredient(0, "test-ingredient-3", { x: 100, y: 100 });
      
      const afterState = usePotionRushStore.getState();
      expect(afterState.conveyorItems).toHaveLength(0);
      expect(afterState.cauldrons[0].state).toBe("BREWING");
    });
  });
});
