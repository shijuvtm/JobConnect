import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { Mic, MicOff, Volume2, RotateCcw, ChevronRight, Sparkles } from 'lucide-react';

/* ──────────────────────────────────────────────
   Web Speech API helpers
────────────────────────────────────────────── */
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

function speak(text, onEnd) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.95;
  utterance.pitch = 1;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

/* ──────────────────────────────────────────────
   Phase constants
────────────────────────────────────────────── */
const PHASE = {
  SETUP: 'setup',         // role selection screen
  THINKING: 'thinking',   // waiting for AI question
  SPEAKING: 'speaking',   // AI is speaking question
  LISTENING: 'listening', // mic is active, capturing user
  PROCESSING: 'processing', // user stopped, sending answer to AI
  COMPLETE: 'complete',   // 5 questions done, show scorecard
};

export default function VoiceInterview() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /* Interview state */
  const [phase, setPhase] = useState(PHASE.SETUP);
  const [role, setRole] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [transcript, setTranscript] = useState('');     // live mic transcript
  const [aiText, setAiText] = useState('');             // current AI question text
  const [scorecard, setScorecard] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0); // 0-based (0–4)
  const TOTAL = 5;

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  /* Auto-scroll chat */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, aiText, transcript]);

  /* ── Fetch next AI question/scorecard ── */
  const fetchNextAI = useCallback(async (history) => {
    setPhase(PHASE.THINKING);
    try {
      const res = await axios.post(`${API_URL}/api/voice-interview/`, {
        role,
        conversation_history: history,
      });
      const { response, is_complete } = res.data;
      setAiText(response);

      if (is_complete) {
        setScorecard(response);
        setPhase(PHASE.COMPLETE);
        speak(
          "The interview is complete! Your scorecard is now displayed on screen.",
        );
        return;
      }

      // Add AI turn to history
      const updated = [...history, { speaker: 'ai', text: response }];
      setConversationHistory(updated);
      setPhase(PHASE.SPEAKING);

      // Speak the question, then switch to LISTENING
      speak(response, () => {
        setPhase(PHASE.LISTENING);
        startListening(updated);
      });
    } catch (err) {
      console.error(err);
      setAiText('Sorry, I had trouble connecting. Please try again.');
      setPhase(PHASE.SPEAKING);
    }
  }, [role]); // eslint-disable-line

  /* ── Start microphone ── */
  const startListening = useCallback((currentHistory) => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(final || interim);
    };

    recognition.onend = () => {
      // Only proceed if we captured something
      setTranscript((prev) => {
        if (prev.trim()) {
          const answer = prev.trim();
          const updated = [...currentHistory, { speaker: 'candidate', text: answer }];
          setConversationHistory(updated);
          setTranscript('');
          setQuestionIndex((q) => q + 1);
          setPhase(PHASE.PROCESSING);
          fetchNextAI(updated);
        } else {
          // Nothing heard — go back to listening
          setPhase(PHASE.LISTENING);
          startListening(currentHistory);
        }
        return '';
      });
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      if (event.error === 'no-speech') {
        recognition.stop();
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [fetchNextAI]);

  /* ── Stop mic manually ── */
  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  /* ── Begin interview ── */
  const startInterview = (e) => {
    e.preventDefault();
    if (!role.trim()) return;
    setConversationHistory([]);
    setQuestionIndex(0);
    setTranscript('');
    setScorecard('');
    fetchNextAI([]);
  };

  /* ── Restart ── */
  const restart = () => {
    window.speechSynthesis.cancel();
    recognitionRef.current?.abort();
    setPhase(PHASE.SETUP);
    setConversationHistory([]);
    setTranscript('');
    setAiText('');
    setScorecard('');
    setQuestionIndex(0);
  };

  /* ── End interview early ── */
  const endInterview = () => {
    window.speechSynthesis.cancel();
    recognitionRef.current?.abort();
    setTranscript('');
    // If no conversation at all, just restart to setup
    if (conversationHistory.length === 0) {
      restart();
      return;
    }
    // Trigger scorecard with whatever history exists
    const endSignal = [
      ...conversationHistory,
      { speaker: 'candidate', text: '[Candidate ended the interview early]' },
      { speaker: 'candidate', text: '[Candidate ended the interview early]' },
      { speaker: 'candidate', text: '[Candidate ended the interview early]' },
      { speaker: 'candidate', text: '[Candidate ended the interview early]' },
      { speaker: 'candidate', text: '[Candidate ended the interview early]' },
    ];
    setPhase(PHASE.PROCESSING);
    fetchNextAI(endSignal);
  };

  /* ───────────────────────────────────────── */
  /* RENDER                                     */
  /* ───────────────────────────────────────── */

  const phaseLabel = {
    [PHASE.THINKING]: 'AI is thinking…',
    [PHASE.SPEAKING]: 'AI is speaking…',
    [PHASE.LISTENING]: 'Listening — speak now',
    [PHASE.PROCESSING]: 'Processing your answer…',
    [PHASE.COMPLETE]: 'Interview complete!',
  }[phase] || '';

  const micActive = phase === PHASE.LISTENING;
  const micBusy = [PHASE.THINKING, PHASE.SPEAKING, PHASE.PROCESSING].includes(phase);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* ── HEADER ── */}
      <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-blue-400">
            <NavLink to="/">JobConnect</NavLink>
          </h1>
          <nav className="hidden md:flex text-sm font-medium text-slate-400 items-center gap-6">
            <NavLink to="/jobs" className="hover:text-white transition">Jobs</NavLink>
            <NavLink to="/services" className="hover:text-white transition">Services</NavLink>
            <NavLink to="/application" className="hover:text-white transition">My Applications</NavLink>
            <NavLink to="/login" onClick={() => localStorage.clear()} className="hover:text-white transition">Logout</NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-slate-500">Hello, {username}</span>
            <button className="md:hidden text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden border-t border-slate-800 px-4 py-4 space-y-3">
            <NavLink to="/jobs" className="block text-sm text-slate-400 hover:text-white">Jobs</NavLink>
            <NavLink to="/services" className="block text-sm text-slate-400 hover:text-white">Services</NavLink>
            <NavLink to="/application" className="block text-sm text-slate-400 hover:text-white">My Applications</NavLink>
            <NavLink to="/login" onClick={() => localStorage.clear()} className="block text-sm text-slate-400 hover:text-white">Logout</NavLink>
          </nav>
        )}
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 py-8">

        {/* ─ SETUP SCREEN ─ */}
        {phase === PHASE.SETUP && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-6">
              <Mic className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-3xl font-black mb-2">Voice AI Interview</h2>
            <p className="text-slate-400 mb-8 max-w-sm text-sm">
              Simulate a real interview. The AI asks 5 progressive questions — you answer by voice. You'll get a detailed scorecard at the end.
            </p>

            {!SpeechRecognition && (
              <div className="mb-6 px-4 py-3 bg-amber-900/30 border border-amber-600/40 rounded-xl text-amber-400 text-sm">
                ⚠️ Your browser doesn't support Speech Recognition. Please use Chrome or Edge.
              </div>
            )}

            <form onSubmit={startInterview} className="w-full max-w-sm space-y-4">
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Target Job Role (e.g. React Developer)"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
                required
              />
              <button
                type="submit"
                disabled={!SpeechRecognition}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <ChevronRight className="w-4 h-4" /> Start Interview
              </button>
            </form>
          </div>
        )}

        {/* ─ INTERVIEW SCREEN ─ */}
        {phase !== PHASE.SETUP && phase !== PHASE.COMPLETE && (
          <div className="flex-1 flex flex-col gap-6">

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                Question {Math.min(questionIndex + 1, TOTAL)} / {TOTAL}
              </span>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(Math.min(questionIndex, TOTAL) / TOTAL) * 100}%` }}
                />
              </div>
              <button
                onClick={restart}
                title="Restart"
                className="text-slate-500 hover:text-white transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation bubbles */}
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[50vh] pr-1">
              {conversationHistory.map((turn, i) => (
                <div key={i} className={`flex ${turn.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                    ${turn.speaker === 'ai'
                      ? 'bg-slate-800 text-slate-200 rounded-tl-none'
                      : 'bg-blue-600 text-white rounded-tr-none'
                    }`}>
                    {turn.text}
                  </div>
                </div>
              ))}

              {/* Live transcript (user is speaking) */}
              {transcript && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-none text-sm bg-blue-600/50 border border-blue-500/30 text-blue-200 italic">
                    {transcript}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Status + Mic */}
            <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-800">
              <p className={`text-sm font-medium ${micActive ? 'text-green-400' : 'text-slate-400'}`}>
                {micActive && <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping" />}
                {phaseLabel}
              </p>

              <button
                onClick={micActive ? stopListening : undefined}
                disabled={micBusy}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                  ${micActive
                    ? 'bg-red-600 hover:bg-red-500 shadow-red-600/40 scale-110'
                    : micBusy
                      ? 'bg-slate-700 cursor-not-allowed'
                      : 'bg-slate-700'
                  }`}
              >
                {/* Pulsing ring when listening */}
                {micActive && (
                  <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
                )}
                {micActive
                  ? <MicOff className="w-8 h-8 text-white" />
                  : phase === PHASE.SPEAKING
                    ? <Volume2 className="w-8 h-8 text-blue-400 animate-pulse" />
                    : <Mic className="w-8 h-8 text-slate-400" />
                }
              </button>

              <p className="text-xs text-slate-600">
                {micActive ? 'Tap to stop and send your answer' : 'Mic activates automatically after the AI speaks'}
              </p>

              {/* End Interview Button */}
              <button
                onClick={endInterview}
                disabled={micBusy && phase !== PHASE.LISTENING}
                className="mt-2 flex items-center gap-2 px-5 py-2 rounded-full border border-red-800/60 bg-red-950/40 text-red-400 text-xs font-semibold hover:bg-red-900/50 hover:text-red-300 hover:border-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                End Interview
              </button>
            </div>
          </div>
        )}

        {/* ─ COMPLETE / SCORECARD ─ */}
        {phase === PHASE.COMPLETE && (
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold">Your Interview Scorecard</h2>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
              <pre className="whitespace-pre-wrap text-sm text-slate-200 font-sans leading-relaxed">
                {scorecard}
              </pre>
            </div>

            <div className="flex gap-3">
              <button
                onClick={restart}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button
                onClick={() => navigate('/services')}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-colors"
              >
                Back to Services
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
