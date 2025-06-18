
interface GameHeaderProps {
  gameState: "stable" | "glitching" | "corrupted";
}

export const GameHeader = ({ gameState }: GameHeaderProps) => {
  const getStatusColor = () => {
    switch (gameState) {
      case "corrupted": return "text-red-400";
      case "glitching": return "text-yellow-400";
      default: return "text-green-400";
    }
  };

  const getStatusText = () => {
    switch (gameState) {
      case "corrupted": return "SYSTEM CRITICAL";
      case "glitching": return "SIGNAL UNSTABLE";
      default: return "CONNECTION STABLE";
    }
  };

  const getTitleClass = () => {
    switch (gameState) {
      case "corrupted": 
        return "text-red-400 transform transition-all duration-1000";
      case "glitching": 
        return "text-green-400 opacity-90 transform transition-all duration-500";
      default: 
        return "text-green-400 transform transition-all duration-300";
    }
  };

  return (
    <header className="p-6 border-b border-green-400/20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className={`text-2xl font-mono font-bold ${getTitleClass()}`}>
            COURIER.EXE
          </h1>
          <p className="text-sm text-green-300/70 font-mono">
            Digital Witch • Dream Delivery Service
          </p>
        </div>
        
        <div className="text-right">
          <div className={`text-sm font-mono transition-colors duration-1000 ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          <div className="text-xs text-green-300/50 font-mono mt-1">
            v2.3.7-beta
          </div>
        </div>
      </div>
    </header>
  );
};
