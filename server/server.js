import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ==== In-Memory XP Store (for now) ====
let userXP = 0;

// === Generate Workout Plan ===
app.post("/api/ask", async (req, res) => {
  const { message } = req.body;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a certified personal trainer for college students. Based on the user's goals and fitness level, return a specific 3-day or 5-day workout plan that includes:\n\n" +
            "- Exercise names\n" +
            "- Muscle groups\n" +
            "- Sets & reps\n" +
            "- Optional tips or rest days\n\nAlways format the routine in a clear way that’s easy to follow.",
        },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: chat.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// === Get XP ===
app.get("/api/user-xp", (req, res) => {
  res.json({ xp: userXP });
});

// === Increment XP ===
app.post("/api/increment-xp", (req, res) => {
  const { amount } = req.body;
  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Invalid XP amount" });
  }

  userXP += amount;
  res.json({ xp: userXP });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
