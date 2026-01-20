"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WinnerPage() {
  const [winner, setWinner] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedWinner = localStorage.getItem("winner");

    if (!storedWinner) {
      router.push("/game");
    } else {
      setWinner(storedWinner);
    }
  }, [router]);

  if (!winner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Chargement...
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-600 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full">
        <h1 className="text-3xl font-extrabold mb-4 text-gray-900">
          🏆 Félicitations !
        </h1>

        <p className="text-lg text-gray-700 mb-6">
          Le gagnant est
        </p>

        <p className="text-4xl font-extrabold text-indigo-700 mb-8">
          {winner}
        </p>

        <button
          onClick={() => {
            localStorage.removeItem("winner");
            localStorage.removeItem("players");
            router.push("/");
          }}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow hover:bg-indigo-700 active:scale-95"
        >
          🔁 Rejouer
        </button>
      </div>
    </main>
  );
}
