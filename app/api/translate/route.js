export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text")?.trim();
  if (!text) return Response.json({ error: "Nothing to translate." }, { status: 400 });
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ne`;
    const response = await fetch(url, { next: { revalidate: 1800 } });
    const data = await response.json();
    const translated = data?.responseData?.translatedText;
    if (!translated) throw new Error("No translation");
    return Response.json({ translation: translated });
  } catch {
    return Response.json({ error: "Translation could not be loaded right now." }, { status: 502 });
  }
}
