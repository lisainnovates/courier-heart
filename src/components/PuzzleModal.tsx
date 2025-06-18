
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X, CheckCircle } from "lucide-react";

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

interface PatternPuzzle {
  sequence: string[];
  userInput: string[];
  complete: boolean;
}

export const PuzzleModal = ({ delivery, onComplete, onClose, gameState }: PuzzleModalProps) => {
  const [puzzle, setPuzzle] = useState<PatternPuzzle>({ sequence: [], userInput: [], complete: false });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Generate puzzle based on difficulty
    const generateSequence = () => {
      const symbols = delivery.corrupted ? 
        ["⚠", "✗", "◈", "⬢", "◇", "⬡"] : 
        ["✦", "◆", "○", "△", "☆", "◇"];
      
      const length = delivery.difficulty === "easy" ? 4 : 
                    delivery.difficulty === "medium" ? 6 : 8;
      
      return Array.from({ length }, () => 
        symbols[Math.floor(Math.random() * symbols.length)]
      );
    };

    setPuzzle({
      sequence: generateSequence(),
      userInput: [],
      complete: false
    });
  }, [delivery]);

  const addToSequence = (symbol: string) => {
    if (puzzle.complete) return;

    const newInput = [...puzzle.userInput, symbol];
    setPuzzle(prev => ({ ...prev, userInput: newInput }));

    // Check if sequence is complete and correct
    if (newInput.length === puzzle.sequence.length) {
      const isCorrect = newInput.every((sym, i) => sym === puzzle.sequence[i]);
      if (isCorrect) {
        setPuzzle(prev => ({ ...prev, complete: true }));
        setShowSuccess(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        // Reset on wrong sequence
        setTimeout(() => {
          setPuzzle(prev => ({ ...prev, userInput: [] }));
        }, 1000);
      }
    }
  };

  const resetPuzzle = () => {
    setPuzzle(prev => ({ ...prev, userInput: [] }));
  };

  const getSymbolColor = (symbol: string, index: number) => {
    if (puzzle.userInput.length > index) {
      return puzzle.userInput[index] === symbol ? "text-warm-teal" : "text-warm-coral";
    }
    return delivery.corrupted ? "text-warm-coral/50" : "text-warm-teal/50";
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <Card className={`w-full max-w-2xl border ${
        delivery.corrupted 
          ? "bg-creamy-white/5 backdrop-blur-sm border-warm-coral/30" 
          : "bg-creamy-white/10 backdrop-blur-sm border-soft-lavender/30"
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`font-mono text-lg ${
              delivery.corrupted ? "text-warm-coral" : "text-warm-teal"
            }`}>
              {delivery.corrupted ? "CORRUPTION DETECTED" : "DREAM ENCODING"}
            </CardTitle>
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="text-warm-teal hover:text-warm-teal/80"
            >
              <X size={16} />
            </Button>
          </div>
          <p className="text-creamy-white/90 font-serif italic">
            "{delivery.title}"
          </p>
          <p className="text-xs text-creamy-white/70 font-mono">
            RECIPIENT: {delivery.recipient}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {showSuccess ? (
            <div className="text-center space-y-4">
              <CheckCircle size={48} className="text-warm-teal mx-auto" />
              <div className="space-y-2">
                <h3 className="text-warm-teal font-mono text-lg">DELIVERY COMPLETE</h3>
                <p className="text-creamy-white/80 text-sm">
                  The dream has been successfully encoded and delivered. 
                  Another heart beats stronger in the city.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className={`font-mono text-sm mb-2 ${
                    delivery.corrupted ? "text-warm-coral" : "text-warm-teal"
                  }`}>
                    {delivery.corrupted ? "REPAIR SEQUENCE" : "MATCH THE PATTERN"}
                  </h3>
                  <p className="text-xs text-creamy-white/70">
                    {delivery.corrupted 
                      ? "Fix the corrupted data by matching the clean sequence"
                      : "Encode the dream by replicating the magical pattern"
                    }
                  </p>
                </div>

                {/* Pattern Display */}
                <div className="bg-black/30 p-4 rounded border border-soft-lavender/20">
                  <div className="flex justify-center gap-2 mb-4">
                    {puzzle.sequence.map((symbol, i) => (
                      <span
                        key={i}
                        className={`text-2xl font-mono ${getSymbolColor(symbol, i)}`}
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
                              ? "border-warm-teal text-warm-teal"
                              : "border-warm-coral text-warm-coral"
                            : "border-soft-lavender/30"
                        }`}
                      >
                        {puzzle.userInput[i] && (
                          <span className="text-lg font-mono">{puzzle.userInput[i]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Symbol Input */}
                <div className="grid grid-cols-6 gap-2">
                  {(delivery.corrupted ? 
                    ["⚠", "✗", "◈", "⬢", "◇", "⬡"] : 
                    ["✦", "◆", "○", "△", "☆", "◇"]
                  ).map((symbol) => (
                    <Button
                      key={symbol}
                      onClick={() => addToSequence(symbol)}
                      className={`aspect-square text-xl font-mono ${
                        delivery.corrupted
                          ? "bg-warm-coral/20 hover:bg-warm-coral/30 text-warm-coral border border-warm-coral/30"
                          : "bg-warm-teal/20 hover:bg-warm-teal/30 text-warm-teal border border-warm-teal/30"
                      }`}
                      disabled={puzzle.complete}
                    >
                      {symbol}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={resetPuzzle}
                    variant="outline"
                    size="sm"
                    className="text-soft-lavender/70 border-soft-lavender/20 hover:bg-soft-lavender/5 hover:text-soft-lavender/90 bg-transparent"
                  >
                    RESET
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
