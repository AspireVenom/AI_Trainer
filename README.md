# AI_Trainer

# 🧠 Student Fitness AI Chat App

Welcome to the Student Fitness AI Chat App — an interactive fitness dashboard built with **Vite + React** on the frontend and **Express.js** on the backend. This app allows users to generate personalized 7-day workout plans, track their exercise completion, and level up as they make progress.

---

## 🚀 Features

- 🔐 **User-Friendly Interface**: Form-based input to tailor workouts to your goals, weight, and experience.
- 📅 **Routine Generation**: AI-powered 7-day workout schedule with daily breakdowns.
- 🎮 **Gamified Progression**: Level up by completing exercises and visualize progress with a level bar.
- 🔁 **Exercise Replacement**: Replace any exercise with a predefined custom alternative.
- ☁️ **Persistent XP**: XP and levels are stored server-side for consistent progress.

---

## 🧩 Tech Stack

### Frontend (Vite + React)

- Tailwind CSS for sleek styling
- Framer Motion for animations
- React hooks for state and lifecycle management

### Backend (Express.js)

- Handles XP tracking and AI-generated routines
- Fetches and stores user XP
- Accepts form input from frontend and returns generated workout plans

---

## 📁 Project Structure

![PROJECT STRUCTURE](/docs/file_strct1.png)
![PROJECT STRUCTURE](/docs/file_strct2.png)

## ⚙️ Setup Instructions

### Prerequisites

- Node.js and npm
- OpenAI API key (for AI-generated routines)

### 1. Clone the Repository

```bash
git clone https://github.com/AspireVenom/AI_Trainer
cd AI_Trainer
```

### 2. Install Dependencies

```bash
# Install server dependencies:
cd server
npm install
cd ..

# Install client dependencies:
cd client
npm install
```

### 3. Setup Environment

Create a `.env` file in `server/`:

```env
OPENAI_API_KEY=your_openai_key_here
```

Also ensure you have a valid `firebase.ts` config in `client/src/`, but **do not commit it**.

### 4. Run the App

```bash
# Terminal 1: Start the server
cd server
node index.js

# Terminal 2: Start the client
cd client
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🧪 API Routes

### `POST /api/ask`

Generates workout plan based on user profile

- **Request**: `{ message: string }`
- **Response**: `{ reply: string }`

### `GET /api/user-xp`

Returns the current XP stored for the user

- **Response**: `{ xp: number }`

### `POST /api/increment-xp`

Adds XP (e.g. 1 point per completed exercise)

- **Request**: `{ amount: number }`
- **Response**: `{ xp: number }`

---

## 🔒 Security Notes

- `server/.env` and `client/src/firebase.ts` are **gitignored**
- Do **not** expose secrets in client-facing code

---

## 🛠️ Future Enhancements

- User login system with Firebase Auth
- Exercise database with images and difficulty levels
- Custom workout plans via drag-and-drop
- Leaderboards for top performers

---

## 📄 License

MIT

---

## 🙌 Acknowledgements

- OpenAI for GPT routines
- Tailwind & Framer Motion for UI magic
- Firebase for potential auth/storage

---

Built with 💪 \ BY DOUGLAS ALVARINO
