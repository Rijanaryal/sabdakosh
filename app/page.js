"use client";

import { useState } from "react";
import {
  Search, BookOpen, Sparkles, Volume2, Languages, ArrowRight,
  Bookmark, History, ChevronDown, ChevronUp, Quote, Loader2,
  AlertCircle, Copy, Check, Menu, X, Heart
} from "lucide-react";

const examples = ["ephemeral", "serendipity", "eloquent", "resilience"];
const recentDefault = ["sonder", "eloquent", "ephemeral"];

export default function Home() {
  const [word, setWord] = useState("");
  const [entry, setEntry] = useState(null);
  const [searched, setSearched] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nepali, setNepali] = useState(false);
  const [translations, setTranslations] = useState({});
  const [translating, setTranslating] = useState(false);
  const [recent, setRecent] = useState(recentDefault);
  const [expanded, setExpanded] = useState({});
  const [copied, setCopied] = useState(false);

  const definitions = entry?.[0]?.meanings || [];
  const phonetics = entry?.[0]?.phonetics || [];
  const phonetic = entry?.[0]?.phonetic || phonetics.find(p => p.text)?.text || "";
  const audio = phonetics.find(p => p.audio)?.audio;

  async function searchWord(value = word) {
    const clean = value.trim();
    if (!clean) return;
    setLoading(true); setError(""); setEntry(null); setSearched(clean); setNepali(false);
    setWord(clean);
    try {
      const res = await fetch(`/api/word?word=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Word not found.");
      setEntry(data);
      setRecent(prev => [clean, ...prev.filter(x => x.toLowerCase() !== clean.toLowerCase())].slice(0, 6));
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  async function translateAll() {
    if (!entry) return;
    setNepali(true);
    const texts = [];
    definitions.forEach((meaning, i) => meaning.definitions.forEach((d, j) => texts.push({ key: `${i}-${j}`, text: d.definition })));
    setTranslating(true);
    const missing = texts.filter(t => !translations[t.key]);
    await Promise.all(missing.map(async item => {
      try {
        const r = await fetch(`/api/translate?text=${encodeURIComponent(item.text)}`);
        const d = await r.json();
        if (d.translation) setTranslations(prev => ({ ...prev, [item.key]: d.translation }));
      } catch {}
    }));
    setTranslating(false);
  }

  function playAudio() {
    if (audio) new Audio(audio).play().catch(() => {});
    else if (searched && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(searched);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  }

  async function copyWord() {
    await navigator.clipboard.writeText(searched);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />
      <header className="header">
        <a className="brand" href="/" aria-label="Morphem home">
          <img src="/morphem.svg" alt="Morphem logo" className="logo" />
          <span className="brand-name">morphem<span>.</span></span>
        </a>
        <div className="header-right">
          <span className="header-tag"><span className="dot" /> ENGLISH · नेपाली</span>
          <a className="about-link" href="#about">About</a>
        </div>
      </header>

      <section className="hero">
        <div className="eyebrow"><Sparkles size={14} /> YOUR WORD EXPLORER</div>
        <h1>Words have <span>worlds.</span></h1>
        <p className="hero-sub">Find the meaning. Feel the language.<br className="hidden sm:block" /> Understand every word, in English and Nepali.</p>

        <form className="search-wrap" onSubmit={e => { e.preventDefault(); searchWord(); }}>
          <Search className="search-icon" size={21} />
          <input value={word} onChange={e => setWord(e.target.value)} placeholder="Search any word..." aria-label="Search a word" />
          {word && <button type="button" className="clear-btn" onClick={() => setWord("")}>×</button>}
          <button className="search-button" type="submit" disabled={loading}>{loading ? <Loader2 className="spin" size={18}/> : <>Explore <ArrowRight size={16}/></>}</button>
        </form>
        <div className="suggestions">
          <span>Try:</span>
          {examples.map(w => <button key={w} onClick={() => searchWord(w)}>{w}</button>)}
        </div>
      </section>

      <section className="content">
        {!entry && !loading && !error && (
          <div className="welcome-grid">
            <div className="welcome-card large">
              <div className="welcome-icon"><BookOpen size={22}/></div>
              <h2>A word is more<br/>than a definition.</h2>
              <p>Discover nuance, usage, pronunciation, and its Nepali meaning—all in one place.</p>
              <div className="decor-word">curiosity</div>
            </div>
            <div className="welcome-card small">
              <div className="mini-label">MADE FOR WORD LOVERS</div>
              <div className="nepali-sample">शब्दको संसार</div>
              <p>English words, explained in a way that feels clear.</p>
            </div>
          </div>
        )}
        {loading && <div className="loading-card"><Loader2 className="spin" size={26}/><p>Looking up <b>{searched}</b>…</p><span>Finding its meanings and usage</span></div>}
        {error && <div className="error-card"><AlertCircle size={20}/><div><b>We couldn't find that word.</b><p>{error}</p></div></div>}

        {entry && (
          <div className="result">
            <div className="result-top">
              <div>
                <div className="word-heading">{entry[0].word}</div>
                <div className="phonetic-line">{phonetic && <span>{phonetic}</span>} <button onClick={playAudio} className="audio-btn" aria-label="Play pronunciation"><Volume2 size={17}/></button></div>
              </div>
              <div className="result-actions">
                <button className="icon-btn" title="Copy word" onClick={copyWord}>{copied ? <Check size={17}/> : <Copy size={17}/>}</button>
                <button className={`translate-btn ${nepali ? "active" : ""}`} onClick={translateAll}><Languages size={16}/> {nepali ? "नेपाली अर्थ" : "Translate to Nepali"}</button>
              </div>
            </div>
            {entry[0].meanings.map((meaning, i) => (
              <article className="meaning-card" key={`${meaning.partOfSpeech}-${i}`}>
                <div className="part-of-speech"><span>{meaning.partOfSpeech}</span><span className="meaning-count">{meaning.definitions.length} {meaning.definitions.length === 1 ? "meaning" : "meanings"}</span></div>
                {meaning.definitions.map((d, j) => (
                  <div className="definition" key={j}>
                    <div className="definition-number">{j + 1}</div>
                    <div className="definition-body">
                      <p className="definition-text">{d.definition}</p>
                      {nepali && <div className="translation">{translating && !translations[`${i}-${j}`] ? <span className="translate-loading">Translating…</span> : translations[`${i}-${j}`] || "Translation unavailable"}</div>}
                      {d.example && <div className="example"><Quote size={13}/><span>{d.example}</span></div>}
                      {(d.synonyms?.length > 0 || d.antonyms?.length > 0) && (
                        <div className="word-relations">
                          {d.synonyms?.length > 0 && <div><span className="relation-label">Synonyms</span>{d.synonyms.slice(0, 6).map(s => <button key={s} onClick={() => searchWord(s)}>{s}</button>)}</div>}
                          {d.antonyms?.length > 0 && <div><span className="relation-label">Antonyms</span>{d.antonyms.slice(0, 6).map(s => <button key={s} onClick={() => searchWord(s)}>{s}</button>)}</div>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {meaning.synonyms?.length > 0 && <div className="extra-relations"><span>Synonyms</span>{meaning.synonyms.slice(0, 8).map(s => <button key={s} onClick={() => searchWord(s)}>{s}</button>)}</div>}
                {meaning.antonyms?.length > 0 && <div className="extra-relations"><span>Antonyms</span>{meaning.antonyms.slice(0, 8).map(s => <button key={s} onClick={() => searchWord(s)}>{s}</button>)}</div>}
              </article>
            ))}
            <div className="source-note">Definitions sourced from a public dictionary database. Translation is machine-generated; context may affect Nepali wording.</div>
          </div>
        )}
      </section>

      <section className="below">
        <div className="section-head"><div><div className="mini-label">KEEP EXPLORING</div><h3>Your recent searches</h3></div><History size={18}/></div>
        <div className="recent-list">
          {recent.map((w, i) => <button className="recent-item" key={w} onClick={() => searchWord(w)}><span className="recent-number">0{i+1}</span><span>{w}</span><ArrowRight size={15}/></button>)}
        </div>
      </section>

      <footer id="about">
        <div className="footer-brand"><img src="/morphem.svg" alt="" className="logo small-logo"/> morphem<span>.</span></div>
        <p>Words · Meaning · Understanding</p>
        <div className="footer-note">Built for curious minds <Heart size={12}/></div>
      </footer>
    </main>
  );
}
