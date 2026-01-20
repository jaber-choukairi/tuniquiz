"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Player = {
  name: string;
  position: number;
};

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState("");
  const router = useRouter();

  const addPlayer = () => {
    if (!name.trim()) return;
    setPlayers([...players, { name, position: 0 }]);
    setName("");
  };

  const startGame = () => {
    localStorage.setItem("players", JSON.stringify(players));
    router.push("/game");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-800 p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6">
        {/* Titre */}
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-1">
          🎮 Quiz Board
        </h1>
        <p className="text-center text-gray-700 mb-6">
          Jeu de quiz multi-joueurs
        </p>

        {/* Ajout joueur */}
        <div className="flex mb-4">
          <input
            className="flex-1 border border-gray-400 rounded-l-xl p-3
                       text-gray-900 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Nom du joueur"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={addPlayer}
            className="bg-indigo-700 text-white px-4 rounded-r-xl
                       font-bold active:scale-95"
          >
            +
          </button>
        </div>

        {/* Liste joueurs */}
        <div className="mb-4">
          {players.length === 0 && (
            <p className="text-sm text-gray-600 text-center">
              Ajoutez au moins <span className="font-semibold">2 joueurs</span>
            </p>
          )}

          <ul className="flex flex-wrap gap-2 justify-center">
            {players.map((p, i) => (
              <li
                key={i}
                className="bg-indigo-200 text-indigo-900
                           px-3 py-1 rounded-full text-sm font-semibold"
              >
                👤 {p.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Bouton démarrer */}
        {players.length > 1 && (
          <button
            onClick={startGame}
            className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-700
                       text-white py-3 rounded-xl font-bold shadow
                       active:scale-95"
          >
            🚀 Démarrer le jeu
          </button>
        )}
      </div>
    </main>
  );
}
