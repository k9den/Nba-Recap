'use client';

import { SetStateAction, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generateRecap } from "../lib/gemini";
import { useEffect } from "react";

export default function GameRecapPage() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [activeRecap, setActiveRecap] = useState<{
    id: number;
    title: string;
    summary: string;
    videoUrl: string;
    thumbnail: string;
  } | null>(null);
  const [team, setTeam] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [recaps, setRecaps] = useState(
    
    [
      {
        id: 1,
        title: "Embiid ERUPTS for 70 points vs San Antontio Spurs - 2024-01-22",
        summary: "Embiid scores 70 points in a historic performance, leading the 76ers to a 130-120 victory over the Spurs. His incredible shooting and rebounding display was complemented by Harden's 20 assists.",
        videoUrl: "https://www.youtube.com/embed/9SjvZPFiDH0",
        thumbnail: "/embiid70.jpg"
      },
    ]);
  
    useEffect(() => {
      const saved = localStorage.getItem("nba-recaps");
      if (saved) {
        setRecaps(JSON.parse(saved));
      }
    }, []);
    useEffect(() => {
      localStorage.setItem("nba-recaps", JSON.stringify(recaps));
    }, [recaps]);
    
  

  const handleOpenModal = (recap: { id: number; title: string; summary: string; videoUrl: string; thumbnail: string; } | null) => {
    setActiveRecap(recap);
    setOpenModal(true);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);

    try {
      const localDate = new Date(date);
      const utcDateString = new Date(
        Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate())
      ).toISOString().split("T")[0];

      const displayDate = localDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      const gamesRes = await fetch(`https://api-nba-v1.p.rapidapi.com/games?date=${utcDateString}`, {
        headers: new Headers({
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
          'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
        }),
      });
      const gamesData = await gamesRes.json();
      const games = gamesData.response;

      const game = games.find((g: { teams: { home: { name: string; }; visitors: { name: string; }; }; }) =>
        g.teams.home.name.toLowerCase().includes(team.toLowerCase()) ||
        g.teams.visitors.name.toLowerCase().includes(team.toLowerCase())
      );

      if (!game) {
        alert(`No games found for ${team} on ${date}`);
        setLoading(false);
        return;
      }

      const gameId = game.id;

      const statsRes = await fetch(`https://api-nba-v1.p.rapidapi.com/players/statistics?game=${gameId}`, {
        headers: new Headers({
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
          'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
        }),
      });
      const statsData = await statsRes.json();

      const stats = statsData.response;
      if (!Array.isArray(stats)) throw new Error("No player stats returned for this game.");

      const topScorers = stats
        .filter((p) => p.points > 10)
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)
        .map((p) => `${p.player.firstname} ${p.player.lastname} (${p.team.name}): ${p.points} pts`);

      const gameData = `
        Date: ${date}
        Home Team: ${game.teams.home.name} (${game.scores.home.points})
        Visitor Team: ${game.teams.visitors.name} (${game.scores.visitors.points})
        Top Players: ${topScorers.join(', ')}
      `;

      const aiRecap = await generateRecap(gameData);

      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      const nbaChannelId = "UCWJ2lWNubArHWmf3FIHbfcQ";
      const query = `${game.teams.home.name} vs ${game.teams.visitors.name} highlights ${displayDate}`;
      const youtubeRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&channelId=${nbaChannelId}&key=${apiKey}`
      );

      const youtubeData = await youtubeRes.json();
      const videoId = youtubeData.items?.[0]?.id?.videoId;
      const videoUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : "";
      const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";

      const newRecap = {
        id: recaps.length + 1,
        title: `${game.teams.home.name} vs ${game.teams.visitors.name} - ${displayDate}`,
        summary: aiRecap,
        videoUrl,
        thumbnail
      };

      setRecaps([newRecap, ...recaps]);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate recap.');
    }

    setLoading(false);
  };
  

  return (
    <div className={darkMode ? "dark bg-gradient-to-br from-black to-gray-900 text-white min-h-screen" : "bg-white text-black min-h-screen"}>
      <header className="sticky top-0 z-50 backdrop-blur bg-black/50 p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">NBARecapAI</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="text-sm text-white border px-3 py-1 rounded">
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <section className="text-center py-20">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          NBA Recaps in Seconds
        </motion.h2>
        <p className="text-lg text-gray-500 mb-6">WATCH HIGHLIGHTS AND READ SMART SUMMARIES INSTANTLY</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 justify-center items-center w-full max-w-md mx-auto">
          <Input 
            placeholder="Team name" 
            value={team} 
            onChange={(e) => setTeam(e.target.value)} 
            required
            className="w-full"
          />
          <Input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required
            className="w-full bg-gray"
          />
          <Button type="submit" 
          disabled={loading} 
          className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
            {loading ? 'Generating...' : 'Generate Recap'}
          </Button>
        </form>
        <Button
          type="button"
          className="w-full max-w-md mx-auto mt-4 bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 cursor-pointer"
          onClick={() => {
            const defaultRecap = {
              id: 1,
              title: "Embiid ERUPTS for 70 points vs San Antontio Spurs - 2024-01-22",
              summary: "Embiid scores 70 points in a historic performance, leading the 76ers to a 130-120 victory over the Spurs. His incredible shooting and rebounding display was complemented by Harden's 20 assists.",
              videoUrl: "https://www.youtube.com/embed/9SjvZPFiDH0",
              thumbnail: "/embiid70.jpg"
            };
            setRecaps([defaultRecap]);
            localStorage.setItem("nba-recaps", JSON.stringify([defaultRecap]));
          }}
        >
          Clear Recaps
        </Button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {loading
    ? Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl h-[300px]"
        >
          <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-2xl"></div>
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      ))
    : recaps.map((recap) => (
        <motion.div
          key={recap.id}
          whileHover={{ scale: 1.02 }}
          className="cursor-pointer relative backdrop-blur-md bg-white/5 rounded-2xl shadow-xl overflow-hidden"
          onClick={() => handleOpenModal(recap)}
        >
          <Card>
            <CardContent>
              {recap.thumbnail && (
                <div className="relative">
                  <img
                    src={recap.thumbnail}
                    alt="Video Thumbnail"
                    className="rounded-t-lg w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/70 backdrop-blur-md p-3 rounded-full">
                      <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{recap.title}</h3>
                <p className="text-gray-300 text-sm">
                  {recap.summary.length > 100 ? `${recap.summary.slice(0, 100)}...` : recap.summary}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
</div>


      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <div className="max-w-2xl bg-black text-white border border-gray-700">
            <DialogHeader>
              <DialogTitle>
                <div className="text-2xl font-bold">{activeRecap?.title}</div>
              </DialogTitle>
            </DialogHeader>
            {activeRecap?.videoUrl && (
              <iframe
                src={activeRecap.videoUrl}
                title="NBA Highlights"
                className="rounded-lg w-full aspect-video mb-4"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            <p className="text-gray-300 text-sm">{activeRecap?.summary}</p>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="mt-20 text-center text-sm text-gray-500">
        Built for Google AI Hackathon 2025 · GitHub · Privacy · Terms
      </footer>
    </div>
  );
};
