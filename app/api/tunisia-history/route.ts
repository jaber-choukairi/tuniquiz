import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// Pages Wikipedia
const pages = [
  "Histoire_de_la_Tunisie",
  "Carthage",
  "Protectorat_français_de_Tunisie",
  "Révolution_tunisienne_de_2011",
  "Habib_Bourguiba",
  "Dynastie_hafsides",
  "Zine_el-Abidine_Ben_Ali",
];

// Questions locales de secours (PLUSIEURS)
const fallbackQuestions = [
  {
    question: "Qui était le premier président de la Tunisie ?",
    correct_answer: "Habib Bourguiba",
    incorrect_answers: [
      "Zine El Abidine Ben Ali",
      "Moncef Marzouki",
      "Kaïs Saïed",
    ],
  },
  {
    question: "Quel peuple a fondé la ville de Carthage ?",
    correct_answer: "Les Phéniciens",
    incorrect_answers: [
      "Les Romains",
      "Les Byzantins",
      "Les Ottomans",
    ],
  },
  {
    question: "En quelle année a eu lieu la révolution tunisienne ?",
    correct_answer: "2011",
    incorrect_answers: ["2008", "2014", "2001"],
  },
];

export async function GET() {
  try {
    // Choix aléatoire d’une page
    const page =
      pages[Math.floor(Math.random() * pages.length)];

    // Wikipedia
    const wikiRes = await fetch(
      `https://fr.wikipedia.org/api/rest_v1/page/summary/${page}`
    );
    const wikiData = await wikiRes.json();
    const summary = wikiData.extract;

    if (!summary) {
      throw new Error("Résumé Wikipedia vide");
    }

    // Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.9,
      max_tokens: 400,
      messages: [
        {
          role: "system",
          content:
            "Tu génères une question de quiz en JSON.",
        },
        {
          role: "user",
          content: `
Crée UNE question de quiz sur l'histoire de la Tunisie.
Réponds UNIQUEMENT en JSON avec ce format :

{
  "question": "...",
  "correct_answer": "...",
  "incorrect_answers": ["...", "...", "..."]
}

Texte :
${summary}
`,
        },
      ],
    });

    const raw =
      completion.choices[0]?.message?.content || "";

    // Extraire le JSON
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("JSON non trouvé");

    const question = JSON.parse(match[0]);

    if (
      !question.question ||
      !question.correct_answer ||
      !Array.isArray(question.incorrect_answers)
    ) {
      throw new Error("Format invalide");
    }

    return NextResponse.json(question);
  } catch {
    // Fallback aléatoire
    return NextResponse.json(
      fallbackQuestions[
        Math.floor(Math.random() * fallbackQuestions.length)
      ]
    );
  }
}
