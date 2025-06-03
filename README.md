# 🏀 NBA Recap Generator

An AI-powered web app that generates personalized **NBA game recaps** using Google Gemini and displays **YouTube highlight videos** — all in a sleek, interactive interface.

## 🚀 Features

- 🔎 **Search Any NBA Matchup** by team and date
- 🤖 **AI-Generated Summaries** using Gemini
- 📺 **Auto-Embedded Game Highlights** from YouTube
- 📂 **Recent Searches & Saved Recaps**
- 🎨 Clean, responsive UI built with Tailwind + Framer Motion

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [React](https://react.dev/)
- **UI**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **AI Integration**: [Google Gemini API](https://ai.google.dev/)
- **Data/Media**: YouTube Data API
- **State**: React Hooks, useState, useEffect
  
## 📸 Demo Preview

> <img width="1506" alt="Screenshot 2025-06-02 at 11 55 43 PM" src="https://github.com/user-attachments/assets/aebfab33-ea74-44a0-ac7d-b136d02a0607" />
<img width="1506" alt="Screenshot 2025-06-02 at 11 56 07 PM" src="https://github.com/user-attachments/assets/1cc12968-5152-4228-8285-e77157a83198" />


![NBA Recap Screenshot](public/preview.png)


## 🧑‍💻 How It Works

1. User enters an NBA Team and date like `"Lakers 2024-01-15"`
2. App fetches highlights via YouTube API
3. Gemini API generates a summary of the game
4. Recap is displayed in a modal with highlight video and AI-written text

## 🧪 Running Locally

```bash
git clone https://github.com/k9den/Nba-Recap.git
cd Nba-Recap
npm install
npm run dev

