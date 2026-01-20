"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Player = {
  name: string;
  position: number;
};

export default function Game() {
  const router = useRouter(); // ✅ hook au bon endroit

  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);

  // Choix par tour
  const [theme, setTheme] = useState("9");
  const [difficulty, setDifficulty] = useState("easy");

  // Jeu
  const [step, setStep] = useState<"choice" | "question">("choice");
  const [question, setQuestion] = useState<any>(null);
  const [message, setMessage] = useState("");

  const MAX_CASE = 10;

  // Charger joueurs
  useEffect(() => {
    const storedPlayers = localStorage.getItem("players");
    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers));
    }
  }, []);

  // Charger question
const loadQuestion = async () => {
  // 🇹🇳 Histoire tunisienne (Wikipedia API)
if (theme === "tunisia-history") {
  const res = await fetch("/api/tunisia-history");
  const data = await res.json();
  setQuestion(data);
  setStep("question");
  return;
}


  // 🌍 AUTRES THÈMES (Open Trivia DB)
  try {
    const res = await fetch(
      `/api/quiz?category=${theme}&difficulty=${difficulty}`
    );

    if (!res.ok) {
      setMessage("❌ Erreur chargement question");
      return;
    }

    const data = await res.json();
    setQuestion(data);
    setStep("question");
  } catch {
    setMessage("❌ Erreur réseau");
  }
};



  // Réponse joueur
  const answer = (choice: string) => {
    let move = 1;
    if (difficulty === "medium") move = 2;
    if (difficulty === "hard") move = 3;

    const updatedPlayers = [...players];

    if (choice === question.correct_answer) {
      updatedPlayers[currentPlayer].position += move;

      // 🏆 VICTOIRE
      if (updatedPlayers[currentPlayer].position >= MAX_CASE) {
        updatedPlayers[currentPlayer].position = MAX_CASE;
        localStorage.setItem(
          "winner",
          updatedPlayers[currentPlayer].name
        );
        router.push("/winner");
        return;
      }

      setMessage("✅ Bonne réponse → Avance !");
    } else {
      updatedPlayers[currentPlayer].position -= 1;
      if (updatedPlayers[currentPlayer].position < 0) {
        updatedPlayers[currentPlayer].position = 0;
      }
      setMessage("❌ Mauvaise réponse → Recule !");
    }

    setPlayers(updatedPlayers);
    localStorage.setItem("players", JSON.stringify(updatedPlayers));

    setTimeout(() => {
      setMessage("");
      setQuestion(null);
      setStep("choice");
      setCurrentPlayer((prev) => (prev + 1) % players.length);
    }, 1200);
  };

  if (players.length === 0) {
    return <p className="p-6 text-white">Chargement...</p>;
  }

  const answers =
    question &&
    [...question.incorrect_answers, question.correct_answer].sort();

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-700 to-purple-800 p-4">
      <div className="max-w-md mx-auto">

        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-4 text-center">
          <p className="text-sm text-gray-600">🎯 Tour de</p>
          <h2 className="text-2xl font-extrabold text-gray-900">
            {players[currentPlayer].name}
          </h2>
        </div>

        {/* 🎲 Plateau dynamique */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {Array.from({ length: MAX_CASE + 1 }).map((_, index) => {
            const playersHere = players.filter(
              (p) => p.position === index
            );

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow p-2 flex flex-col"
              >
                <div className="text-xs font-semibold text-gray-700 mb-1">
                  Case {index}
                </div>

                <div className="flex flex-col gap-1">
                  {playersHere.map((p, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${
                          p.name === players[currentPlayer].name
                            ? "bg-indigo-600 text-white"
                            : "bg-indigo-200 text-indigo-900"
                        }`}
                    >
                      👤 {p.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Choix */}
        {step === "choice" && (
          <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
            <h3 className="font-bold text-gray-900 mb-3">
              Choix pour {players[currentPlayer].name}
            </h3>

<select
  value={theme}
  onChange={(e) => setTheme(e.target.value)}
  className="w-full border border-gray-400 p-3 rounded-xl
             text-gray-900 mb-3"
>
  <option value="9">🌍 Culture générale</option>
  <option value="21">⚽ Football / Sport</option>
  <option value="22">🗺️ Géographie</option>
  <option value="23">🏛️ Histoire</option>
  <option value="17">🧠 Science</option>

  {/* Tunisie */}
  <option value="tunisia-history">🇹🇳 Histoire tunisienne</option>
</select>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border border-gray-400 p-3 rounded-xl
                         text-gray-900 mb-4"
            >
              <option value="easy">Facile (+1)</option>
              <option value="medium">Moyen (+2)</option>
              <option value="hard">Difficile (+3)</option>
            </select>

            <button
              onClick={loadQuestion}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700
                         text-white py-3 rounded-xl font-bold shadow
                         active:scale-95"
            >
              🚀 Lancer la question
            </button>
          </div>
        )}

        {/* Question */}
        {step === "question" && question && (
          <div className="bg-white rounded-2xl shadow-xl p-4">
            <h3
              className="font-semibold text-gray-900 mb-4"
              dangerouslySetInnerHTML={{ __html: question.question }}
            />

            {answers.map((a: string, i: number) => (
              <button
                key={i}
                onClick={() => answer(a)}
                className="w-full mb-3 p-3 rounded-xl border
                           text-gray-900 text-left font-medium
                           hover:bg-indigo-50 active:scale-95"
                dangerouslySetInnerHTML={{ __html: a }}
              />
            ))}
          </div>
        )}

        {message && (
          <p
            className={`mt-4 text-center font-bold text-lg
              ${
                message.includes("Bonne")
                  ? "text-green-300"
                  : "text-red-300"
              }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
