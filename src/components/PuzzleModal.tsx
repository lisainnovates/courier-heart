
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X, CheckCircle, Eye, EyeOff } from "lucide-react";
import { generatePuzzle, Puzzle } from "../utils/puzzleTypes";

interface Delivery {
  id: string;
  title: string;
  description: string;
  recipient: string;
  difficulty: "easy" | "medium" | "hard";
  corrupted: boolean;
}

interface PuzzleModalProps {
  delivery: Delivery;
  onComplete: () => void;
  onClose: () => void;
  gameState: "stable" | "glitching" | "corrupted";
}

export const PuzzleModal = ({ delivery, onComplete, onClose, gameState }: PuzzleModalProps) => {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setPuzzle(generatePuzzle(delivery.difficulty, delivery.corrupted));
  }, [delivery]);

  const handleSuccess = () => {
    setPuzzle(prev => prev ? { ...prev, complete: true } : null);
    setShowSuccess(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const resetPuzzle = () => {
    setPuzzle(generatePuzzle(delivery.difficulty, delivery.corrupted));
  };

  const getPuzzleTitle = () => {
    if (!puzzle) return "";
    switch (puzzle.type) {
      case "pattern": return delivery.corrupted ? "REPAIR SEQUENCE" : "MATCH THE PATTERN";
      case "memory": return delivery.corrupted ? "RESTORE MEMORY" : "REMEMBER THE SEQUENCE";
      case "matching": return delivery.corrupted ? "RECONNECT FRAGMENTS" : "FIND THE PAIRS";
      case "logic": return delivery.corrupted ? "SOLVE CORRUPTION" : "ANSWER THE RIDDLE";
    }
  };

  const getPuzzleDescription = () => {
    if (!puzzle) return "";
    switch (puzzle.type) {
      case "pattern": return delivery.corrupted 
        ? "Fix the corrupted data by matching the clean sequence"
        : "Encode the dream by replicating the magical pattern";
      case "memory": return delivery.corrupted
        ? "Restore the lost data by remembering the correct sequence"
        : "Channel the dream memory by recalling the symbols in order";
      case "matching": return delivery.corrupted
        ? "Reconnect the fragmented data pairs to restore integrity"
        : "Match the dream symbols to create harmonious connections";
      case "logic": return delivery.corrupted
        ? "Answer the system query to bypass corruption"
        : "Solve the mystical riddle to unlock the dream's essence";
    }
  };

  if (!puzzle) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <Card className={`w-full max-w-2xl border ${
        delivery.corrupted 
          ? "bg-black/40 backdrop-blur-sm border-warm-coral/50" 
          : "bg-black/40 backdrop-blur-sm border-soft-lavender/50"
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`font-mono text-lg font-bold ${
              delivery.corrupted ? "text-warm-coral" : "text-warm-teal"
            }`}>
              {delivery.corrupted ? "CORRUPTION DETECTED" : "DREAM ENCODING"}
            </CardTitle>
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="text-creamy-white hover:text-warm-teal hover:bg-warm-teal/20"
            >
              <X size={16} />
            </Button>
          </div>
          <p className="text-creamy-white font-serif italic text-base">
            "{delivery.title}"
          </p>
          <p className="text-xs text-creamy-white/80 font-mono">
            RECIPIENT: {delivery.recipient}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {showSuccess ? (
            <div className="text-center space-y-4">
              <CheckCircle size={48} className="text-warm-teal mx-auto" />
              <div className="space-y-2">
                <h3 className="text-warm-teal font-mono text-lg font-bold">DELIVERY COMPLETE</h3>
                <p className="text-creamy-white text-sm">
                  The dream has been successfully encoded and delivered. 
                  Another heart beats stronger in the city.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className={`font-mono text-sm mb-2 font-bold ${
                    delivery.corrupted ? "text-warm-coral" : "text-warm-teal"
                  }`}>
                    {getPuzzleTitle()}
                  </h3>
                  <p className="text-xs text-creamy-white/80">
                    {getPuzzleDescription()}
                  </p>
                </div>

                {puzzle.type === "pattern" && (
                  <PatternPuzzleComponent 
                    puzzle={puzzle} 
                    setPuzzle={setPuzzle} 
                    onSuccess={handleSuccess}
                    corrupted={delivery.corrupted}
                  />
                )}

                {puzzle.type === "memory" && (
                  <MemoryPuzzleComponent 
                    puzzle={puzzle} 
                    setPuzzle={setPuzzle} 
                    onSuccess={handleSuccess}
                    corrupted={delivery.corrupted}
                  />
                )}

                {puzzle.type === "matching" && (
                  <MatchingPuzzleComponent 
                    puzzle={puzzle} 
                    setPuzzle={setPuzzle} 
                    onSuccess={handleSuccess}
                    corrupted={delivery.corrupted}
                  />
                )}

                {puzzle.type === "logic" && (
                  <LogicPuzzleComponent 
                    puzzle={puzzle} 
                    setPuzzle={setPuzzle} 
                    onSuccess={handleSuccess}
                    corrupted={delivery.corrupted}
                  />
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={resetPuzzle}
                    variant="outline"
                    size="sm"
                    className="text-creamy-white/80 border-soft-lavender/50 hover:bg-soft-lavender/20 hover:text-creamy-white bg-transparent"
                  >
                    NEW PUZZLE
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Pattern Puzzle Component
const PatternPuzzleComponent = ({ puzzle, setPuzzle, onSuccess, corrupted }) => {
  const addToSequence = (symbol: string) => {
    if (puzzle.complete) return;

    const newInput = [...puzzle.userInput, symbol];
    setPuzzle(prev => ({ ...prev, userInput: newInput }));

    if (newInput.length === puzzle.sequence.length) {
      const isCorrect = newInput.every((sym, i) => sym === puzzle.sequence[i]);
      if (isCorrect) {
        onSuccess();
      } else {
        setTimeout(() => {
          setPuzzle(prev => ({ ...prev, userInput: [] }));
        }, 1000);
      }
    }
  };

  const symbols = corrupted ? ["⚠", "✗", "◈", "⬢", "◇", "⬡"] : ["✦", "◆", "○", "△", "☆", "◇"];

  return (
    <>
      <div className="bg-black/40 p-4 rounded border border-soft-lavender/30">
        <div className="flex justify-center gap-2 mb-4">
          {puzzle.sequence.map((symbol, i) => (
            <span
              key={i}
              className={`text-2xl font-mono ${
                puzzle.userInput.length > i
                  ? puzzle.userInput[i] === symbol ? "text-warm-teal" : "text-warm-coral"
                  : corrupted ? "text-warm-coral/70" : "text-warm-teal/70"
              }`}
            >
              {symbol}
            </span>
          ))}
        </div>
        
        <div className="flex justify-center gap-2">
          {Array.from({ length: puzzle.sequence.length }).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 border-2 border-dashed flex items-center justify-center ${
                puzzle.userInput[i] 
                  ? puzzle.userInput[i] === puzzle.sequence[i]
                    ? "border-warm-teal text-warm-teal bg-warm-teal/10"
                    : "border-warm-coral text-warm-coral bg-warm-coral/10"
                  : "border-soft-lavender/50"
              }`}
            >
              {puzzle.userInput[i] && (
                <span className="text-lg font-mono">{puzzle.userInput[i]}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {symbols.map((symbol) => (
          <Button
            key={symbol}
            onClick={() => addToSequence(symbol)}
            className={`aspect-square text-xl font-mono ${
              corrupted
                ? "bg-warm-coral/30 hover:bg-warm-coral/40 text-creamy-white border border-warm-coral/50"
                : "bg-warm-teal/30 hover:bg-warm-teal/40 text-creamy-white border border-warm-teal/50"
            }`}
            disabled={puzzle.complete}
          >
            {symbol}
          </Button>
        ))}
      </div>
    </>
  );
};

// Memory Puzzle Component
const MemoryPuzzleComponent = ({ puzzle, setPuzzle, onSuccess, corrupted }) => {
  useEffect(() => {
    if (puzzle.showSequence) {
      const timer = setTimeout(() => {
        setPuzzle(prev => ({ ...prev, showSequence: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [puzzle.showSequence]);

  const addToSequence = (symbol: string) => {
    if (puzzle.complete || puzzle.showSequence) return;

    const newInput = [...puzzle.userInput, symbol];
    setPuzzle(prev => ({ ...prev, userInput: newInput }));

    if (newInput.length === puzzle.sequence.length) {
      const isCorrect = newInput.every((sym, i) => sym === puzzle.sequence[i]);
      if (isCorrect) {
        onSuccess();
      } else {
        setTimeout(() => {
          setPuzzle(prev => ({ ...prev, userInput: [], showSequence: true }));
        }, 1000);
      }
    }
  };

  const symbols = corrupted ? ["⚠", "✗", "◈", "⬢", "◇", "⬡"] : ["✦", "◆", "○", "△", "☆", "◇"];

  return (
    <>
      <div className="bg-black/40 p-4 rounded border border-soft-lavender/30">
        <div className="flex items-center justify-center gap-2 mb-4">
          {puzzle.showSequence ? <Eye size={16} className="text-warm-teal" /> : <EyeOff size={16} className="text-warm-coral" />}
          <span className="text-sm font-mono text-creamy-white">
            {puzzle.showSequence ? "MEMORIZE THIS SEQUENCE" : "RECALL THE SEQUENCE"}
          </span>
        </div>
        
        <div className="flex justify-center gap-2 mb-4">
          {puzzle.sequence.map((symbol, i) => (
            <span
              key={i}
              className={`text-2xl font-mono transition-opacity duration-300 ${
                puzzle.showSequence 
                  ? corrupted ? "text-warm-coral" : "text-warm-teal"
                  : "text-transparent"
              }`}
            >
              {symbol}
            </span>
          ))}
        </div>
        
        <div className="flex justify-center gap-2">
          {Array.from({ length: puzzle.sequence.length }).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 border-2 border-dashed flex items-center justify-center ${
                puzzle.userInput[i] 
                  ? "border-warm-teal text-warm-teal bg-warm-teal/10"
                  : "border-soft-lavender/50"
              }`}
            >
              {puzzle.userInput[i] && (
                <span className="text-lg font-mono">{puzzle.userInput[i]}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {symbols.map((symbol) => (
          <Button
            key={symbol}
            onClick={() => addToSequence(symbol)}
            className={`aspect-square text-xl font-mono ${
              corrupted
                ? "bg-warm-coral/30 hover:bg-warm-coral/40 text-creamy-white border border-warm-coral/50"
                : "bg-warm-teal/30 hover:bg-warm-teal/40 text-creamy-white border border-warm-teal/50"
            }`}
            disabled={puzzle.complete || puzzle.showSequence}
          >
            {symbol}
          </Button>
        ))}
      </div>
    </>
  );
};

// Matching Puzzle Component
const MatchingPuzzleComponent = ({ puzzle, setPuzzle, onSuccess, corrupted }) => {
  const selectSymbol = (symbol: string, id: string) => {
    if (puzzle.complete || puzzle.matchedPairs.includes(id)) return;

    const newSelected = [...puzzle.selectedPairs];
    
    if (newSelected.includes(id)) {
      // Deselect
      const index = newSelected.indexOf(id);
      newSelected.splice(index, 1);
    } else if (newSelected.length < 2) {
      // Select
      newSelected.push(id);
    }

    setPuzzle(prev => ({ ...prev, selectedPairs: newSelected }));

    // Check for matches when 2 are selected
    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      const firstPair = puzzle.pairs.find(p => p.id === first);
      const secondPair = puzzle.pairs.find(p => p.id === second);
      
      const isMatch = (firstPair?.symbol === secondPair?.match) || (firstPair?.match === secondPair?.symbol);
      
      setTimeout(() => {
        if (isMatch) {
          const newMatched = [...puzzle.matchedPairs, first, second];
          setPuzzle(prev => ({ 
            ...prev, 
            matchedPairs: newMatched, 
            selectedPairs: [] 
          }));
          
          if (newMatched.length === puzzle.pairs.length) {
            onSuccess();
          }
        } else {
          setPuzzle(prev => ({ ...prev, selectedPairs: [] }));
        }
      }, 1000);
    }
  };

  return (
    <div className="bg-black/40 p-4 rounded border border-soft-lavender/30">
      <div className="grid grid-cols-4 gap-2">
        {puzzle.pairs.map((pair) => (
          <Button
            key={pair.id}
            onClick={() => selectSymbol(pair.symbol, pair.id)}
            className={`aspect-square text-xl font-mono transition-colors ${
              puzzle.matchedPairs.includes(pair.id)
                ? "bg-warm-teal/40 text-warm-teal border border-warm-teal"
                : puzzle.selectedPairs.includes(pair.id)
                ? corrupted 
                  ? "bg-warm-coral/40 text-warm-coral border border-warm-coral" 
                  : "bg-soft-lavender/40 text-soft-lavender border border-soft-lavender"
                : corrupted
                ? "bg-warm-coral/20 hover:bg-warm-coral/30 text-creamy-white border border-warm-coral/50"
                : "bg-warm-teal/20 hover:bg-warm-teal/30 text-creamy-white border border-warm-teal/50"
            }`}
            disabled={puzzle.complete || puzzle.matchedPairs.includes(pair.id)}
          >
            {pair.symbol}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Logic Puzzle Component
const LogicPuzzleComponent = ({ puzzle, setPuzzle, onSuccess, corrupted }) => {
  const selectAnswer = (index: number) => {
    if (puzzle.complete) return;

    setPuzzle(prev => ({ ...prev, userAnswer: index }));
    
    setTimeout(() => {
      if (index === puzzle.correctAnswer) {
        onSuccess();
      } else {
        setPuzzle(prev => ({ ...prev, userAnswer: null }));
      }
    }, 1500);
  };

  return (
    <div className="bg-black/40 p-4 rounded border border-soft-lavender/30 space-y-4">
      <div className="text-center">
        <p className="text-creamy-white font-mono text-sm mb-4">
          {puzzle.question}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {puzzle.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => selectAnswer(index)}
            className={`text-left font-mono text-sm p-3 transition-colors ${
              puzzle.userAnswer === index
                ? index === puzzle.correctAnswer
                  ? "bg-warm-teal/40 text-warm-teal border border-warm-teal"
                  : "bg-warm-coral/40 text-warm-coral border border-warm-coral"
                : corrupted
                ? "bg-warm-coral/20 hover:bg-warm-coral/30 text-creamy-white border border-warm-coral/50"
                : "bg-warm-teal/20 hover:bg-warm-teal/30 text-creamy-white border border-warm-teal/50"
            }`}
            disabled={puzzle.complete || puzzle.userAnswer !== null}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};
