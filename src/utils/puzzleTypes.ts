
export type PuzzleType = "pattern" | "memory" | "matching";

export interface BasePuzzle {
  type: PuzzleType;
  complete: boolean;
}

export interface PatternPuzzle extends BasePuzzle {
  type: "pattern";
  sequence: string[];
  userInput: string[];
}

export interface MemoryPuzzle extends BasePuzzle {
  type: "memory";
  sequence: string[];
  userInput: string[];
  showSequence: boolean;
  currentStep: number;
}

export interface MatchingPuzzle extends BasePuzzle {
  type: "matching";
  pairs: { symbol: string; match: string; id: string }[];
  selectedPairs: string[];
  matchedPairs: string[];
}

export type Puzzle = PatternPuzzle | MemoryPuzzle | MatchingPuzzle;

export const generatePuzzle = (difficulty: "easy" | "medium" | "hard", corrupted: boolean): Puzzle => {
  const puzzleTypes: PuzzleType[] = ["pattern", "memory", "matching"];
  const randomType = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
  
  const symbols = corrupted ? 
    ["⚠", "✗", "◈", "⬢", "◇", "⬡"] : 
    ["✦", "◆", "○", "△", "☆", "◇"];
  
  const length = difficulty === "easy" ? 4 : 
                difficulty === "medium" ? 6 : 8;

  switch (randomType) {
    case "pattern":
      return {
        type: "pattern",
        sequence: Array.from({ length }, () => 
          symbols[Math.floor(Math.random() * symbols.length)]
        ),
        userInput: [],
        complete: false
      };

    case "memory":
      return {
        type: "memory",
        sequence: Array.from({ length: Math.max(3, length - 2) }, () => 
          symbols[Math.floor(Math.random() * symbols.length)]
        ),
        userInput: [],
        showSequence: true,
        currentStep: 0,
        complete: false
      };

    case "matching":
      const pairCount = Math.max(3, Math.floor(length / 2));
      const pairs = Array.from({ length: pairCount }, (_, i) => ({
        symbol: symbols[i % symbols.length],
        match: symbols[(i + 1) % symbols.length],
        id: `pair-${i}`
      }));
      return {
        type: "matching",
        pairs: [...pairs, ...pairs].sort(() => Math.random() - 0.5),
        selectedPairs: [],
        matchedPairs: [],
        complete: false
      };

    default:
      return generatePuzzle(difficulty, corrupted);
  }
};
