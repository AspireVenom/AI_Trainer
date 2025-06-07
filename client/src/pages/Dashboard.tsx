import React, { useState, useEffect, FormEvent } from "react";
import ExerciseCard from "../components/ExerciseCard";
import LevelProgress from "../components/LevelProgress";

import "../App.css";

interface Exercise {
  name: string;
  details: string;
}

interface DayPlan {
  day: string;
  exercises: Exercise[];
}

const Dashboard = () => {
  const API_BASE = import.meta.env.VITE_API_URL || "";
  const [input, setInput] = useState("");
  const [goals, setGoals] = useState("");
  const [weight, setWeight] = useState("");
  const [experience, setExperience] = useState("");
  const [routine, setRoutine] = useState<DayPlan[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [level, setLevel] = useState(1);

  const [originalRoutine, setOriginalRoutine] = useState<DayPlan[]>([]);

  useEffect(() => {
    const fetchXP = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/user-xp`);
        const data = await res.json();
        setCompletedCount(data.xp);
        setLevel(Math.floor(data.xp / 10) + 1);
      } catch (err) {
        console.error("Failed to load XP data:", err);
      }
    };
    fetchXP();
  }, [API_BASE]);

  const handleCompleteExercise = async (day: string, index: number) => {
    const updated = [...routine];
    const dayToUpdate = updated.find((d) => d.day === day);
    if (dayToUpdate) {
      dayToUpdate.exercises.splice(index, 1);
      setRoutine(updated);

      try {
        const res = await fetch(`${API_BASE}/api/increment-xp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 1 }),
        });
        const data = await res.json();
        setCompletedCount(data.xp);
        setLevel(Math.floor(data.xp / 10) + 1);
      } catch (err) {
        console.error("Failed to update XP:", err);
      }
    }
  };

  const parseSchedule = (response: string): DayPlan[] => {
    const startIndex = response.search(/\*\*?Day\s*\d+[:]?/i);
    const clean = startIndex >= 0 ? response.slice(startIndex) : response;
    const lines = clean.split("\n");
    const schedule: DayPlan[] = [];
    let currentDay = "";
    let currentExercises: Exercise[] = [];

    for (const line of lines) {
      if (/^(?:\*\*)?Day\s*\d+[:]??|^[A-Za-z]+day[:]??$/i.test(line.trim())) {
        if (currentDay) {
          schedule.push({ day: currentDay, exercises: currentExercises });
        }
        currentDay = line.replace(/\*\*/g, "").replace(":", "").trim();
        currentExercises = [];
      } else if (/\w/.test(line)) {
        const cleaned = line.replace(/^\d+\.\s*/, "").trim();
        const separatorIndex = cleaned.indexOf(" - ");
        if (separatorIndex !== -1) {
          const name = cleaned.slice(0, separatorIndex).trim();
          const details = cleaned.slice(separatorIndex + 3).trim();
          currentExercises.push({ name, details });
        } else {
          currentExercises.push({
            name: cleaned,
            details: "No details provided.",
          });
        }
      }
    }
    if (currentDay) {
      schedule.push({ day: currentDay, exercises: currentExercises });
    }

    return schedule;
  };

  const fetchRoutine = async (customPrompt?: string) => {
    const fullPrompt =
      (customPrompt && customPrompt.trim() !== "" ? customPrompt : null) ??
      `You are a professional certified trainer. Based on the following user profile and only scientifically proven exercises and methods, generate a full 7-day workout plan:

- Weight: ${weight} lbs
- Goals: ${goals}
- Gym Experience: ${experience} level
- Equipment: full gym access
- Schedule: 5 workout days per week

Do not ask for additional information. Format the output using "Day 1:", "Day 2:", etc., with 3–5 exercises under each. Format each exercise like:
"1. Exercise Name - Description of sets, reps, or duration."`;

    try {
      const res = await fetch(`${API_BASE}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: fullPrompt }),
      });

      const data = await res.json();
      const parsedSchedule = parseSchedule(data.reply);
      setRoutine(parsedSchedule);
      setOriginalRoutine(JSON.parse(JSON.stringify(parsedSchedule)));
      setShowForm(false);
    } catch (err) {
      console.error("Failed to fetch routine:", err);
    }
  };

  return (
    <div className="page">
      <h1>🏋️‍♂️ Student Fitness AI Chat</h1>

      {showForm && (
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            fetchRoutine(input);
          }}
        >
          <input
            type="text"
            placeholder="💡 Your fitness goals (e.g. build muscle, lose fat)"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
          />
          <input
            type="number"
            placeholder="⚖️ Current weight in lbs"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            <option value="">🧠 Select your gym experience</option>
            <option value="no">No experience</option>
            <option value="some">Some experience</option>
            <option value="advanced">Advanced experience</option>
          </select>
          <input
            type="text"
            placeholder="🎯 Optional focus (e.g. core, arms)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">🚀 Generate Routine</button>
        </form>
      )}

      {!showForm && (
        <>
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
            <LevelProgress completedCount={completedCount} level={level} />
          </div>
          <div className="routine-grid">
            {routine.map((day, dayIndex) => {
              const originalExercises =
                originalRoutine[dayIndex]?.exercises || [];
              const isRecoveryDay = originalExercises.every((ex) =>
                /rest|cardio|stretching|recovery/i.test(ex.name),
              );
              const isCompletedDay =
                !isRecoveryDay &&
                originalExercises.length > 0 &&
                day.exercises.length === 0;

              return (
                <div
                  key={dayIndex}
                  className={`day-card ${isRecoveryDay ? "rest" : ""}`}
                >
                  <h2 className="day-title">{day.day}</h2>
                  {isCompletedDay ? (
                    <p className="rest-message">
                      🎉 You’ve completed all exercises for this day! Great
                      work.
                    </p>
                  ) : isRecoveryDay ? (
                    <p className="rest-message">
                      🌿 Recovery day — light cardio, stretching, or yoga
                    </p>
                  ) : (
                    <>
                      {day.exercises.map((ex, i) => (
                        <ExerciseCard
                          key={`${dayIndex}-${i}`}
                          name={ex.name}
                          details={ex.details}
                          onComplete={() => handleCompleteExercise(day.day, i)}
                          onReplace={() => {
                            const replacement = {
                              name: "Custom Exercise",
                              details: "3 sets x 10 reps – replaced manually",
                            };
                            const updated = [...routine];
                            const dayToUpdate = updated.find(
                              (d) => d.day === day.day,
                            );
                            if (dayToUpdate) {
                              dayToUpdate.exercises[i] = replacement;
                              setRoutine(updated);
                            }
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
