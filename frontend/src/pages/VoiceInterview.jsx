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
   Config
────────────────────────────────────────────── */
const TOTAL = 5;
const AUTO_CLOSE_SECONDS = 10;
const AFTER_INTERVIEW_ROUTE = '/services';

/* ──────────────────────────────────────────────
   Phase constants
────────────────────────────────────────────── */
const PHASE = {
  SETUP: 'setup',
  THINKING: 'thinking',
  SPEAKING: 'speaking',
  LISTENING: 'listening',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
};

export default function VoiceInterview() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [phase, setPhase] = useState(PHASE.SETUP);
  const [role, setRole] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [aiText, setAiText] = useState('');
  const [scorecard, setScorecard] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [micError, setMicError] = useState('');
  const [autoClose, setAutoClose] = useState(true);
  const [closeCountdown, setCloseCountdown] = useState(AUTO_CLOSE_SECONDS);

  /* Refs: safe to read inside speech/timer callbacks */
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const activeRef = useRef(false);        // interview is running
  const roleRef = useRef('');
  const historyRef = useRef([]);          // conversation for the current turn
  const committedRef = useRef('');        // text from earlier mic sessions this turn
  const transcriptRef = useRef('');       // full text of this turn
  const stopRequestedRef = useRef(false); // user tapped the mic to submit
  const fatalErrorRef = useRef(null);     // permission/network errors

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, aiText, transcript]);

  /* ── Stop speech + mic and detach handlers so nothing restarts ── */
  const stopAll = useCallback(() => {
    activeRef.current = false;
    window.speechSynthesis.cancel();

    const rec = recognitionRef.current;
    if (rec) {
      rec.onresult = null;
      rec.onend = null;
      rec.onerror = null;
      try { rec.abort(); } catch { /* already stopped */ }
      recognitionRef.current = null;
    }

    committedRef.current = '';
    transcriptRef.current = '';
    stopRequestedRef.current = false;
    fatalErrorRef.current = null;
    setTranscript('');
    setMicError('');
  }, []);

  useEffect(() => () => stopAll(), [stopAll]);

  const requestAI = async (history) => {
    const res = await axios.post(`${API_URL}/api/voice-interview/`, {
      role: roleRef.current,
      conversation_history: history,
    });
    return res.data; // { response, is_complete }
  };

  const finishWithScorecard = (text) => {
    stopAll();
    setScorecard(text);
    setAutoClose(true);
    setCloseCountdown(AUTO_CLOSE_SECONDS);
    setPhase(PHASE.COMPLETE);
    speak('The interview is complete! Your scorecard is now displayed on screen.');
  };

  /* ── Start a fresh answer turn ── */
  const beginTurn = (history) => {
    committedRef.current = '';
    transcriptRef.current = '';
    stopRequestedRef.current = false;
    fatalErrorRef.current = null;
    setTranscript('');
    setMicError('');
    startListening(history);
  };

  /* ── Start or restart the mic session (keeps text collected so far) ── */
  const startListening = (history) => {
    if (!SpeechRecognition || !activeRef.current) return;
    historyRef.current = history;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;      // keep listening through pauses
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const current = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(' ');
      const full = [committedRef.current, current].filter(Boolean).join(' ').trim();
      transcriptRef.current = full;
      setTranscript(full);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      fatalErrorRef.current = event.error;
    };

    recognition.onend = () => {
      if (!activeRef.current || recognitionRef.current !== recognition) return;
      recognitionRef.current = null;

      // Real failure (permission, network): stop and let the user retry
      if (fatalErrorRef.current) {
        setMicError(
          fatalErrorRef.current === 'not-allowed'
            ? 'Microphone permission denied. Allow mic access, then tap to retry.'
            : 'Speech recognition stopped. Tap the mic to retry.'
        );
        return;
      }

      // Chrome ended the session by itself (pause or time limit): keep the text and resume
      if (!stopRequestedRef.current) {
        committedRef.current = transcriptRef.current;
        startListening(historyRef.current);
        return;
      }

      // User tapped the mic to finish the answer
      const answer = transcriptRef.current.trim();
      if (answer) {
        submitAnswer(historyRef.current, answer);
      } else {
        // Nothing said yet: keep listening
        beginTurn(historyRef.current);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      console.error(err);
      setMicError('Could not start the microphone. Tap the mic to retry.');
    }
  };

  /* ── Tap the mic: finish answer, or retry after an error ── */
  const onMicClick = () => {
    if (micError) {
      beginTurn(historyRef.current);
      return;
    }
    if (phase === PHASE.LISTENING) {
      stopRequestedRef.current = true;
      recognitionRef.current?.stop(); // onend will submit the answer
    }
  };

  const submitAnswer = (history, answer) => {
    const updated = [...history, { speaker: 'candidate', text: answer }];
    setConversationHistory(updated);
    setQuestionIndex((q) => q + 1);
    handleAIReply(updated);
  };

  const handleAIReply = async (history) => {
    if (!activeRef.current) return;
    setPhase(PHASE.THINKING);

    try {
      const { response, is_complete } = await requestAI(history);
      if (!activeRef.current) return;

      if (is_complete) {
        finishWithScorecard(response);
        return;
      }

      const updated = [...history, { speaker: 'ai', text: response }];
      setConversationHistory(updated);
      setAiText(response);
      setPhase(PHASE.SPEAKING);

      speak(response, () => {
        if (!activeRef.current) return;
        setPhase(PHASE.LISTENING);
        beginTurn(updated);
      });
    } catch (err) {
      console.error(err);
      if (!activeRef.current) return;
      setAiText('Sorry, I had trouble connecting. Please try again.');
      setPhase(PHASE.SPEAKING);
    }
  };

  const startInterview = (e) => {
    e.preventDefault();
    if (!role.trim()) return;

    stopAll();
    roleRef.current = role.trim();
    activeRef.current = true;
    setConversationHistory([]);
    setQuestionIndex(0);
    setScorecard('');
    setAutoClose(true);
    handleAIReply([]);
  };

  const restart = () => {
    stopAll();
    setPhase(PHASE.SETUP);
    setConversationHistory([]);
    setAiText('');
    setScorecard('');
    setQuestionIndex(0);
    setAutoClose(true);
    setCloseCountdown(AUTO_CLOSE_SECONDS);
  };

  const endInterview = async () => {
    if (conversationHistory.length === 0) {
      restart();
      return;
    }

    stopAll();
    setPhase(PHASE.THINKING);

    const endSignal = [
      ...conversationHistory,
      ...Array.from({ length: 5 }, () => ({
        speaker: 'candidate',
        text: '[Candidate ended the interview early]',
      })),
    ];

    try {
      const { response } = await requestAI(endSignal);
      finishWithScorecard(response);
    } catch (err) {
      console.error(err);
      setScorecard('Could not generate the scorecard. Please try again.');
      setPhase(PHASE.COMPLETE);
    }
  };

  /* ── Countdown after scorecard, then leave the page ── */
  useEffect(() => {
    if (phase !== PHASE.COMPLETE || !autoClose) return;

    if (closeCountdown <= 0) {
      navigate(AFTER_INTERVIEW_ROUTE, { replace: true });
      return;
    }

    const timer = setTimeout(() => setCloseCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, autoClose, closeCountdown, navigate]);

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

  const micActive = phase === PHASE.LISTENING && !micError;
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
                  d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
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

        {/* ─ SETUP ─ */}
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

        {/* ─ INTERVIEW ─ */}
        {phase !== PHASE.SETUP && phase !== PHASE.COMPLETE && (
          <div className="flex-1 flex flex-col gap-6">

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
              <button onClick={restart} title="Restart" className="text-slate-500 hover:text-white transition">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-[50vh] pr-1">
              {conversationHistory.map((turn, i) => (
                <div key={i} className={`flex ${turn.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                    ${turn.speaker === 'ai'
                      ? 'bg-slate-800 text-slate-200 rounded-tl-none'
                      : 'bg-blue-600 text-white rounded-tr-none'}`}>
                    {turn.text}
                  </div>
                </div>
              ))}

              {transcript && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-none text-sm bg-blue-600/50 border border-blue-500/30 text-blue-200 italic">
                    {transcript}
                  </div>
                </div>
              )}

              {aiText && phase !== PHASE.LISTENING && conversationHistory.length === 0 && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-none text-sm bg-slate-800 text-slate-200">
                    {aiText}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-800">
              <p className={`text-sm font-medium ${micActive ? 'text-green-400' : 'text-slate-400'}`}>
                {micActive && <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping" />}
                {micError ? micError : phaseLabel}
              </p>

              <button
                onClick={onMicClick}
                disabled={micBusy}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                  ${micActive
                    ? 'bg-red-600 hover:bg-red-500 shadow-red-600/40 scale-110'
                    : micError
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : micBusy
                        ? 'bg-slate-700 cursor-not-allowed'
                        : 'bg-slate-700'}`}
              >
                {micActive && (
                  <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
                )}
                {micActive
                  ? <MicOff className="w-8 h-8 text-white" />
                  : micError
                    ? <Mic className="w-8 h-8 text-white" />
                    : phase === PHASE.SPEAKING
                      ? <Volume2 className="w-8 h-8 text-blue-400 animate-pulse" />
                      : <Mic className="w-8 h-8 text-slate-400" />}
              </button>

              <p className="text-xs text-slate-600">
                {micError
                  ? 'Tap the mic to retry'
                  : micActive
                    ? 'Take your time. Tap the mic when you finish your answer'
                    : 'Mic activates automatically after the AI speaks'}
              </p>

              <button
                onClick={endInterview}
                disabled={micBusy}
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

        {/* ─ SCORECARD ─ */}
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

            {autoClose && (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm text-slate-400">
                <span>Returning to services in {closeCountdown}s</span>
                <button
                  onClick={() => setAutoClose(false)}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Stay here
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={restart}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button
                onClick={() => navigate(AFTER_INTERVIEW_ROUTE)}
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
