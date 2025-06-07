import React, { useState } from "react";
import { motion } from "framer-motion";

interface ExerciseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  details: string;
  onReplace: () => void;
  onComplete: () => void;
}

const ExerciseCard = ({
  name,
  details,
  onReplace,
  onComplete,
}: ExerciseCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [customSets, setCustomSets] = useState("");
  const [customReps, setCustomReps] = useState("");

  const isRest = /rest|cardio|stretching|recovery/i.test(name);

  const toggleDetails = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!isRest && target.tagName !== "INPUT" && target.tagName !== "BUTTON") {
      setShowDetails((prev) => !prev);
    }
  };

  return (
    <motion.div
      className={`exercise-card ${showDetails ? "active" : ""}`}
      onClick={toggleDetails}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <h2>{name}</h2>

      {showDetails && !isRest && (
        <>
          <p>{details}</p>

          <input
            type="text"
            placeholder="Sets"
            value={customSets}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setCustomSets(e.target.value)}
          />
          <input
            type="text"
            placeholder="Reps"
            value={customReps}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setCustomReps(e.target.value)}
          />

          <div className="actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
            >
              ✅ Done
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReplace();
              }}
            >
              🔁 Replace
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ExerciseCard;
