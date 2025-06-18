import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X, CheckCircle, Eye, EyeOff, Sparkles } from "lucide-react";
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
    }, 2500);
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
    }
  };

  if (!puzzle) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <Card className={`w-full max-w-3xl border shadow-2xl animate-scale-in ${
        delivery.corrupted 
          ? "bg-black/60 backdrop-blur-md border-warm-coral/50 shadow-warm-coral/20" 
          : "bg-black/60 backdrop-blur-md border-soft-lavender/50 shadow-soft-lavender/20"
      }`}>
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className={`font-mono text-xl font-bold flex items-center gap-2 ${
                delivery.corrupted ? "text-warm-coral" : "text-warm-teal"
              }`}>
                {delivery.corrupted ? "⚠ CORRUPTION DETECTED" : "✦ DREAM ENCODING"}
              </CardTitle>
              <p className="text-creamy-white font-poppins text-lg italic font-light">
                "{delivery.title}"
              </p>
              <p className="text-xs text-creamy-white/70 font-mono uppercase tracking-wider">
                RECIPIENT: {delivery.recipient}
              </p>
            </div>
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="text-creamy-white hover:text-warm-teal hover:bg-warm-teal/20 transition-all duration-200"
            >
              <X size={18} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {showSuccess ? (
            <div className="text-center space-y-6 py-8">
              <div className="relative">
                <CheckCircle size={64} className="text-warm-teal mx-auto animate-pulse" />
                <Sparkles size={24} className="absolute -top-2 -right-2 text-warm-teal animate-spin" />
              </div>
              <div className="space-y-4">
                <h3 className="text-warm-teal font-mono text-2xl font-bold tracking-wide">DELIVERY COMPLETE</h3>
                <p className="text-creamy-white text-base font-poppins leading-relaxed max-w-md mx-auto">
                  The dream has been successfully encoded and delivered. 
                  Another heart beats stronger in the city's digital soul.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                <div className="text-center p-6 bg-black/40 rounded-lg border border-soft-lavender/30">
                  <h3 className={`font-mono text-lg mb-3 font-bold tracking-wide ${
                    delivery.corrupted ? "text-warm-coral" : "text-warm-teal"
                  }`}>
                    {getPuzzleTitle()}
                  </h3>
                  <p className="text-sm text-creamy-white/90 font-poppins leading-relaxed">
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

                <div className="flex justify-center pt-4">
                  <Button
                    onClick={resetPuzzle}
                    variant="outline"
                    className="text-creamy-white/80 border-soft-lavender/50 hover:bg-soft-lavender/20 hover:text-creamy-white bg-transparent font-mono font-medium px-6 py-2 transition-all duration-200"
                  >
                    GENERATE NEW PUZZLE
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
    <div className="space-y-8">
      <div className="bg-black/60 p-8 rounded-lg border border-soft-lavender/30 backdrop-blur-sm">
        <div className="flex justify-center gap-4 mb-8">
          {puzzle.sequence.map((symbol, i) => (
            <div
              key={i}
              className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 text-3xl font-mono transition-all duration-300 ${
                puzzle.userInput.length > i
                  ? puzzle.userInput[i] === symbol 
                    ? "border-warm-teal bg-warm-teal/20 text-warm-teal shadow-lg shadow-warm-teal/20" 
                    : "border-warm-coral bg-warm-coral/20 text-warm-coral animate-pulse"
                  : corrupted 
                    ? "border-warm-coral/50 text-warm-coral/70 bg-warm-coral/10" 
                    : "border-warm-teal/50 text-warm-teal/70 bg-warm-teal/10"
              }`}
            >
              {symbol}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-3">
          {Array.from({ length: puzzle.sequence.length }).map((_, i) => (
            <div
              key={i}
              className={`w-12 h-12 border-2 border-dashed flex items-center justify-center rounded transition-all duration-300 ${
                puzzle.userInput[i] 
                  ? puzzle.userInput[i] === puzzle.sequence[i]
                    ? "border-warm-teal text-warm-teal bg-warm-teal/10 shadow-inner"
                    : "border-warm-coral text-warm-coral bg-warm-coral/10 animate-pulse"
                  : "border-soft-lavender/50 bg-soft-lavender/5"
              }`}
            >
              {puzzle.userInput[i] && (
                <span className="text-xl font-mono">{puzzle.userInput[i]}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {symbols.map((symbol) => (
          <Button
            key={symbol}
            onClick={() => addToSequence(symbol)}
            className={`aspect-square text-2xl font-mono transition-all duration-200 hover:scale-105 ${
              corrupted
                ? "bg-warm-coral/30 hover:bg-warm-coral/50 text-creamy-white border border-warm-coral/50 shadow-lg hover:shadow-warm-coral/20"
                : "bg-warm-teal/30 hover:bg-warm-teal/50 text-creamy-white border border-warm-teal/50 shadow-lg hover:shadow-warm-teal/20"
            }`}
            disabled={puzzle.complete}
          >
            {symbol}
          </Button>
        ))}
      </div>
    </div>
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
    <div className="space-y-8">
      <div className="bg-black/60 p-8 rounded-lg border border-soft-lavender/30 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-3 mb-6">
          {puzzle.showSequence ? <Eye size={20} className="text-warm-teal" /> : <EyeOff size={20} className="text-warm-coral" />}
          <span className="text-base font-mono text-creamy-white font-medium">
            {puzzle.showSequence ? "MEMORIZE THIS SEQUENCE" : "RECALL THE SEQUENCE"}
          </span>
        </div>
        
        <div className="flex justify-center gap-4 mb-8">
          {puzzle.sequence.map((symbol, i) => (
            <div
              key={i}
              className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 text-3xl font-mono transition-all duration-500 ${
                puzzle.showSequence 
                  ? corrupted 
                    ? "border-warm-coral bg-warm-coral/20 text-warm-coral shadow-lg shadow-warm-coral/20" 
                    : "border-warm-teal bg-warm-teal/20 text-warm-teal shadow-lg shadow-warm-teal/20"
                  : "border-transparent bg-black/40 text-transparent"
              }`}
            >
              {puzzle.showSequence ? symbol : "?"}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-3">
          {Array.from({ length: puzzle.sequence.length }).map((_, i) => (
            <div
              key={i}
              className={`w-12 h-12 border-2 border-dashed flex items-center justify-center rounded transition-all duration-300 ${
                puzzle.userInput[i] 
                  ? "border-warm-teal text-warm-teal bg-warm-teal/10 shadow-inner"
                  : "border-soft-lavender/50 bg-soft-lavender/5"
              }`}
            >
              {puzzle.userInput[i] && (
                <span className="text-xl font-mono">{puzzle.userInput[i]}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {symbols.map((symbol) => (
          <Button
            key={symbol}
            onClick={() => addToSequence(symbol)}
            className={`aspect-square text-2xl font-mono transition-all duration-200 hover:scale-105 ${
              corrupted
                ? "bg-warm-coral/30 hover:bg-warm-coral/50 text-creamy-white border border-warm-coral/50 shadow-lg hover:shadow-warm-coral/20"
                : "bg-warm-teal/30 hover:bg-warm-teal/50 text-creamy-white border border-warm-teal/50 shadow-lg hover:shadow-warm-teal/20"
            }`}
            disabled={puzzle.complete || puzzle.showSequence}
          >
            {symbol}
          </Button>
        ))}
      </div>
    </div>
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
    <div className="bg-black/60 p-8 rounded-lg border border-soft-lavender/30 backdrop-blur-sm">
      <div className="grid grid-cols-4 gap-4">
        {puzzle.pairs.map((pair) => (
          <Button
            key={pair.id}
            onClick={() => selectSymbol(pair.symbol, pair.id)}
            className={`aspect-square text-2xl font-mono transition-all duration-300 hover:scale-105 ${
              puzzle.matchedPairs.includes(pair.id)
                ? "bg-warm-teal/50 text-warm-teal border-2 border-warm-teal shadow-lg shadow-warm-teal/20"
                : puzzle.selectedPairs.includes(pair.id)
                ? corrupted 
                  ? "bg-warm-coral/50 text-warm-coral border-2 border-warm-coral shadow-lg shadow-warm-coral/20" 
                  : "bg-soft-lavender/50 text-soft-lavender border-2 border-soft-lavender shadow-lg shadow-soft-lavender/20"
                : corrupted
                ? "bg-warm-coral/20 hover:bg-warm-coral/40 text-creamy-white border border-warm-coral/50 shadow-md"
                : "bg-warm-teal/20 hover:bg-warm-teal/40 text-creamy-white border border-warm-teal/50 shadow-md"
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
