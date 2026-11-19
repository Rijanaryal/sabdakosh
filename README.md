# Morphem Dictionary

A polished English dictionary with Nepali translation support, pronunciation, examples, synonyms, and antonyms.

## Tech stack
- Next.js 15 App Router
- React
- JavaScript
- Tailwind CSS
- Dictionary API: dictionaryapi.dev
- Translation API: MyMemory (English → Nepali)

## Run locally
1. Install Node.js 20+.
2. Extract this project.
3. Open the folder in your terminal (or Google Antigravity).
4. Run:

```bash
npm install
npm run dev
```

5. Open http://localhost:3000

## Deploy
Push the folder to GitHub and import it into Vercel. No environment variables are needed for the demo.

## Notes
- Definitions come from dictionaryapi.dev and are not AI-generated.
- Nepali translations are machine-translated and can sometimes be imperfect.
- If an entry includes a dictionary audio URL, the player uses it; otherwise browser speech synthesis reads the word.
- The favicon and app logo are `public/morphem.svg`.
