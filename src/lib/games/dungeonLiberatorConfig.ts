export const DUNGEON_LIBERATOR_CONFIG = {
  gameWidth: 390,
  gameHeight: 844,
  
  player: {
    speed: 200,
    initialHp: 3,
    size: 32,
  },
  
  monster: {
    speed: 120,
    size: 32,
  },

  prisoner: {
    size: 24,
    spacing: 20, // Distance in pixels between followers
  },

  colors: {
    floor: "#2c3e50",
    wall: "#1a1a1a",
    player: "#3498db",
    monster: "#e74c3c",
    prisoner: "#f1c40f",
    correct: "#2ecc71",
  },

  pathHistoryLimit: 1000, // Max points to store in history
};
