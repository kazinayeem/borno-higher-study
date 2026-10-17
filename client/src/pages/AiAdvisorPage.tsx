import React, { useState, useRef, useEffect } from 'react';
import { consultAdvisor } from '../services/api.js';
import { Sparkles, Send, ShieldCheck, ExternalLink, Bot, User, Bookmark, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  citations?: { title: string; url: string; verifiedDate: string; type: string }[];
  matchedUnis?: any[];
  matchedSchs?: any[];
}

export const AiAdvisorPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'agent',
      text: `Hello! I am the **Borno Study Advisor**, your grounded AI assistant for international university discovery.\n\nI answer your questions using verified records across 30 destinations with official source citations. How can I help plan your studies today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "Find Master's programs in Computer Science in Finland under €16,000",
    "Compare Germany, Finland, and Netherlands for Software Engineering",
    "Which universities accept my current IELTS 6.5 score?",
    "Show fully funded scholarships open to Bangladeshi students",
    "Compare tuition and living costs for universities in Italy and Germany",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const q = (queryText || input).trim();
    if (!q || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await consultAdvisor(q);
      const agentMsg: Message = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        text: res.answer,
        citations: res.citations,
        matchedUnis: res.matchedUniversities,
        matchedSchs: res.matchedScholarships,
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'agent',
          text: `⚠️ I encountered a temporary network issue. Please check the directory pages directly while the service synchronizes.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Banner */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shadow-xs">
              <Sparkles className="w-6 h-6 text-teal-600 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy">
                Borno Study Advisor
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Grounded RAG retrieval over verified university admissions datasets</span>
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Zero Hallucination Guarantee
          </span>
        </div>

        {/* Chat Window */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card flex flex-col h-[650px] overflow-hidden">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'agent' && (
                  <div className="w-9 h-9 rounded-2xl bg-brand-navy text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-5 h-5 text-teal-400" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-sm space-y-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none font-medium'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {/* Message body with Markdown line breaks */}
                  <div className="whitespace-pre-line text-xs sm:text-sm">
                    {msg.text}
                  </div>

                  {/* Matched Universities preview pills */}
                  {msg.matchedUnis && msg.matchedUnis.length > 0 && (
                    <div className="pt-3 border-t border-slate-200/80 space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Quick University Links:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.matchedUnis.slice(0, 3).map((uni: any) => (
                          <Link
                            key={uni.slug}
                            to={`/universities/${uni.slug}`}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-teal-500 text-brand-navy inline-flex items-center gap-1 shadow-2xs"
                          >
                            <span>{uni.name}</span>
                            <ArrowRight className="w-3 h-3 text-teal-600" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Official Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-3 border-t border-slate-200/80 space-y-1.5">
                      <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span>Verified Citations ({msg.citations.length}):</span>
                      </p>
                      <div className="space-y-1">
                        {msg.citations.map((c, i) => (
                          <a
                            key={i}
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-teal-700 hover:underline flex items-center gap-1 font-medium"
                          >
                            <span>• {c.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-9 h-9 rounded-2xl bg-teal-100 text-teal-900 flex items-center justify-center shrink-0 font-bold text-xs">
                    You
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start items-center text-xs text-slate-500">
                <div className="w-9 h-9 rounded-2xl bg-brand-navy text-white flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-teal-400 animate-pulse" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-teal-600"></div>
                  <span>Searching verified databases & official admissions portals...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-6 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap">
            <span className="text-slate-400 font-bold shrink-0">Suggestions:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 text-slate-700 shrink-0 font-medium transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about university programs, deadlines, scholarships, or visa policies…"
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-1 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              <span>Ask Advisor</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Disclaimer Note */}
        <p className="text-center text-[11px] text-slate-400">
          ⚠️ <strong>Advisory Notice:</strong> The Borno Study Advisor provides factual admissions synthesis and official citations. It does not provide legal immigration counsel or guarantee visa approvals or scholarship awards.
        </p>
      </div>
    </div>
  );
};
