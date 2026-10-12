import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
  Target,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AiAssistantView: React.FC = () => {
  const {
    aiMessages,
    sendAiMessage,
    isAiThinking,
    user
  } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, isAiThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isAiThinking) return;
    sendAiMessage(inputPrompt.trim());
    setInputPrompt('');
  };

  const samplePrompts = [
    "Plan my day around my highest-priority tasks.",
    "What deadlines and bills do I have this week?",
    "Help me prepare for my CloudScale interview.",
    "Break my learning goal into actionable steps.",
    "Find documents that are nearing expiry."
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-teal-950/30 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              LifeOS AI Personal Assistant
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 uppercase">
                Active Intelligence
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Provider: <span className="text-slate-300 font-semibold">{user.aiProvider === 'mock_intelligent' ? 'Local Intelligent Engine (Deterministic)' : 'Connected LLM Service'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Authorized Data Retrieval Only</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        {aiMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold
                ${isUser
                  ? 'bg-teal-500 text-slate-950 ring-1 ring-teal-400/50'
                  : 'bg-indigo-600 text-white ring-1 ring-indigo-400/50'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2
                  ${isUser
                    ? 'bg-teal-500/15 border border-teal-500/30 text-teal-100 rounded-tr-none'
                    : 'bg-slate-800/70 border border-slate-700/60 text-slate-200 rounded-tl-none shadow-md'
                  }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>
                <span className="text-[10px] text-slate-500 block text-right pt-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isAiThinking && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span>Analyzing LifeOS data records...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0 text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-teal-400" /> Prompts:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputPrompt(p);
              sendAiMessage(p);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-teal-400 whitespace-nowrap transition-colors flex-shrink-0 text-xs"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="flex gap-2 flex-shrink-0">
        <input
          type="text"
          placeholder="Ask LifeOS to organize tasks, summarize commitments, or schedule events..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-teal-500 transition-colors shadow-inner"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isAiThinking}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
