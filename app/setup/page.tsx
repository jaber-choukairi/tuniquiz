"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();
  const [theme, setTheme] = useState("9");
  const [difficulty, setDifficulty] = useState("easy");

  const startGame = () => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("difficulty", difficulty);
    router.push("/game");
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Choix du thème et de la difficulté</h1>

      <div>
        <label>Thème</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="9">Culture générale</option>
          <option value="21">Sport</option>
          <option value="23">Histoire</option>
          <option value="17">Science</option>
        </select>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Difficulté</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Facile</option>
          <option value="medium">Moyen</option>
          <option value="hard">Difficile</option>
        </select>
      </div>

      <button style={{ marginTop: 20 }} onClick={startGame}>
        Lancer la partie
      </button>
    </main>
  );
}
