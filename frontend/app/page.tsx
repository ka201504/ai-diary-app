"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, BookHeart, Sparkles, Frown, Meh, Smile } from "lucide-react";

export default function Home() {
  // ▼ 修正ポイント1: 環境変数からAPIのURLを取得（なければlocalhostを使う）
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const [text, setText] = useState("");
  const [diaries, setDiaries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDiaries = async () => {
    try {
      // ▼ 修正ポイント2: 変数 API_URL を使用
      const res = await fetch(`${API_URL}/diaries`);
      if (!res.ok) return;
      const data = await res.json();
      setDiaries(data);
    } catch (error) {
      console.error("Error fetching diaries:", error);
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, []);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      // ▼ 修正ポイント3: 変数 API_URL を使用
      await fetch(`${API_URL}/diaries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      setText("");
      fetchDiaries();
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "positive": return <Smile className="text-orange-400 w-8 h-8" strokeWidth={1.5} />;
      case "negative": return <Frown className="text-blue-400 w-8 h-8" strokeWidth={1.5} />;
      default: return <Meh className="text-slate-400 w-8 h-8" strokeWidth={1.5} />;
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-transparent">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">

        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/30 pb-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3 tracking-tight">
              <BookHeart className="text-indigo-500 w-10 h-10" />
              AI Diary
            </h1>
            <p className="text-slate-500 text-sm font-medium pl-1">あなたの心に寄り添う、やさしい日記帳</p>
          </div>
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold bg-indigo-50/50 px-3 py-1 rounded-full">
            <Sparkles className="w-4 h-4" />
            <span>AI</span>
          </div>
        </header>

        {/* Input Area */}
        <div className="relative mb-12 group">
          <input
            className="glass-input w-full p-5 pl-6 pr-16 rounded-2xl text-lg text-slate-700 placeholder:text-slate-400"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
            placeholder="今日はどんなことがありましたか？..."
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !text}
            className="absolute right-3 top-3 bg-indigo-500 text-white p-2.5 rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/30 active:scale-95"
          >
            {isLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Diary List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-600 mb-4 px-1">最近の記録</h2>
          <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {diaries.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-slate-400 py-10"
                >
                  まだ日記がありません。最初の一言を書いてみましょう。
                </motion.div>
              ) : (
                diaries.map((diary) => (
                  <motion.div
                    key={diary.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-white/60 hover:bg-white/80 transition-all p-6 rounded-2xl border border-white/50 shadow-sm hover:shadow-md mb-4 flex gap-4 items-start group"
                  >
                    <div className="flex-shrink-0 pt-1 group-hover:scale-110 transition-transform duration-300">
                      {getMoodIcon(diary.mood)}
                    </div>
                    <div className="flex-grow">
                      <p className="text-slate-700 leading-relaxed text-lg">{diary.content}</p>
                      <div className="mt-2 flex gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diary.mood === 'positive' ? 'bg-orange-100 text-orange-600' :
                          diary.mood === 'negative' ? 'bg-blue-100 text-blue-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                          {diary.mood === 'positive' ? 'Positive' : diary.mood === 'negative' ? 'Negative' : 'Neutral'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}