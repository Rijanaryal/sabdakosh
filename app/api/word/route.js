export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word")?.trim();
  if (!word) return Response.json({ error: "Enter a word to search." }, { status: 400 });

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      next: { revalidate: 3600 },
    });
    const data = await response.json();
    if (!response.ok) return Response.json({ error: data?.message || "Word not found. Try another spelling." }, { status: response.status });
    return Response.json(data);
  } catch {
    return Response.json({ error: "Dictionary service is unavailable. Please try again." }, { status: 502 });
  }
}
