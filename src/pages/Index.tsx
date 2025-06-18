
import { useState, useEffect } from "react";
import { MatrixRain } from "../components/MatrixRain";
import { DeliverySystem } from "../components/DeliverySystem";
import { CityStatus } from "../components/CityStatus";
import { PuzzleModal } from "../components/PuzzleModal";
import { GameHeader } from "../components/GameHeader";

const Index = () => {
  const [cityHearts, setCityHearts] = useState(3);
  const [totalHearts, setTotalHearts] = useState(12);
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [gameState, setGameState] = useState("stable"); // stable, corrupted, glitching

  useEffect(() => {
    // Determine game state based on city hearts
    if (cityHearts <= 2) {
      setGameState("corrupted");
    } else if (cityHearts <= 5) {
      setGameState("glitching");
    } else {
      setGameState("stable");
    }
  }, [cityHearts]);

  const startDelivery = (delivery) => {
    setCurrentDelivery(delivery);
    setShowPuzzle(true);
  };

  const completePuzzle = () => {
    setCityHearts(prev => Math.min(prev + 1, totalHearts));
    setShowPuzzle(false);
    setCurrentDelivery(null);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${
      gameState === "corrupted" ? "bg-red-950" : 
      gameState === "glitching" ? "bg-gray-900" : "bg-black"
    }`}>
      <MatrixRain intensity={gameState === "corrupted" ? "high" : gameState === "glitching" ? "medium" : "low"} />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <GameHeader gameState={gameState} />
        
        <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6">
          <div className="flex-1">
            <DeliverySystem onStartDelivery={startDelivery} gameState={gameState} />
          </div>
          
          <div className="lg:w-80">
            <CityStatus 
              hearts={cityHearts} 
              totalHearts={totalHearts} 
              gameState={gameState} 
            />
          </div>
        </div>
      </div>

      {showPuzzle && currentDelivery && (
        <PuzzleModal
          delivery={currentDelivery}
          onComplete={completePuzzle}
          onClose={() => setShowPuzzle(false)}
          gameState={gameState}
        />
      )}
    </div>
  );
};

export default Index;
