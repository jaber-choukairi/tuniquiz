import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");

  const url = `https://opentdb.com/api.php?amount=1&category=${category}&difficulty=${difficulty}&type=multiple`;

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data.results[0]);
}
