import React, { useEffect, useState } from "react";
import "../App.css";

interface LevelProgressProps {
  completedCount: number;
  level: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  completedCount,
  level,
}) => {
  const [prevLevel, setPrevLevel] = useState(level);
  const [isLevelingUp, setIsLevelingUp] = useState(false);

  useEffect(() => {
    if (level > prevLevel) {
      setIsLevelingUp(true);
      setTimeout(() => setIsLevelingUp(false), 1000); // match animation duration
      setPrevLevel(level);
    }
  }, [level, prevLevel]);

  const nextLevelThreshold = level * 10;
  const progress = Math.min((completedCount / nextLevelThreshold) * 100, 100);

  return (
    <div
      className={`w-full max-w-md mx-auto my-6 p-4 rounded-xl bg-white shadow-md border border-gray-200 ${
        isLevelingUp ? "level-up" : ""
      }`}
    >
      <div className="text-center text-xl font-bold text-indigo-600 mb-2">
        🧠 Fitness Level: {level}
      </div>
      <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-sm text-center text-gray-600 mt-1">
        {completedCount}/{nextLevelThreshold} exercises to reach Level{" "}
        {level + 1}
      </div>
    </div>
  );
};

export default LevelProgress;
