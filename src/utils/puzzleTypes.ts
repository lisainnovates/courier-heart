
export type PuzzleType = "pattern" | "memory" | "matching" | "logic";

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

export interface LogicPuzzle extends BasePuzzle {
  type: "logic";
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer: number | null;
}

export type Puzzle = PatternPuzzle | MemoryPuzzle | MatchingPuzzle | LogicPuzzle;

export const generatePuzzle = (difficulty: "easy" | "medium" | "hard", corrupted: boolean): Puzzle => {
  const puzzleTypes: PuzzleType[] = ["pattern", "memory", "matching", "logic"];
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

    case "logic":
      const logicQuestions = corrupted ? [
        {
          question: "Which symbol represents system corruption?",
          options: ["✦", "⚠", "○", "◇"],
          correct: 1
        },
        {
          question: "What happens when data fragments collide?",
          options: ["They merge", "They corrupt", "They disappear", "They multiply"],
          correct: 1
        },
        {
          question: "Which sequence shows data decay?",
          options: ["◈→⬢→◇", "✗→⚠→◈", "⬡→◇→✗", "⚠→✗→⬢"],
          correct: 1
        }
      ] : [
        {
          question: "Which symbol channels the most dream energy?",
          options: ["○", "△", "✦", "◇"],
          correct: 2
        },
        {
          question: "What creates the strongest connection?",
          options: ["Memory", "Hope", "Love", "All combined"],
          correct: 3
        },
        {
          question: "Which pattern opens the heart portal?",
          options: ["△→○→✦", "✦→◆→☆", "○→△→◇", "☆→✦→◆"],
          correct: 1
        }
      ];
      
      const question = logicQuestions[Math.floor(Math.random() * logicQuestions.length)];
      return {
        type: "logic",
        question: question.question,
        options: question.options,
        correctAnswer: question.correct,
        userAnswer: null,
        complete: false
      };

    default:
      return generatePuzzle(difficulty, corrupted);
  }
};
