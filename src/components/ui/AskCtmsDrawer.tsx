import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, Send, Sparkles, X } from 'lucide-react';
import { findCtmsAnswer, SUGGESTED_CTMS_QUESTIONS } from '../../mock/ctmsAnswers';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

interface AskCtmsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskCtmsDrawer: React.FC<AskCtmsDrawerProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Namaste! I am Ask-the-CTMS, your clinical trial inquiry assistant. You can ask or click questions about study progress, active SAEs, overdue deadlines, or compliance metrics across the AIIA trial registry.',
      time: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages or typing state updates
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || query).trim();
    if (!q || isTyping) return;

    const userMsg: Message = {
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsTyping(true);

    // Short loading state before returning the appropriate mock response
    setTimeout(() => {
      const response = findCtmsAnswer(q);
      const botMsg: Message = {
        sender: 'bot',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="bg-[#1F3A34] text-white px-5 py-4 flex items-center justify-between border-b border-[#2c524a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#C2801F] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-base">Ask-the-CTMS</h3>
              <p className="text-xs text-white/75">Predefined Clinical Knowledge Engine</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Queries (Clickable) */}
        <div className="p-3 bg-[#f2f7f5] border-b border-[#e2edea]">
          <p className="text-xs font-semibold text-[#1F3A34] flex items-center gap-1.5 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#C2801F]" />
            Suggested CTMS Inquiries (Click to ask):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_CTMS_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                disabled={isTyping}
                className="text-left text-xs bg-white text-slate-700 hover:text-[#1F3A34] hover:border-[#1F3A34] hover:bg-emerald-50/50 border border-slate-200 px-2.5 py-1 rounded-full transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                  m.sender === 'user'
                    ? 'bg-[#1F3A34] text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}

          {/* Loading Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3.5 py-1.5 w-fit text-xs text-slate-500 shadow-2xs">
              <span className="w-1.5 h-1.5 bg-[#C2801F] rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-[#C2801F] rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-[#C2801F] rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] font-medium text-slate-600">Searching trial knowledge base...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar for Typing Questions */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isTyping}
              placeholder="Ask anything about your clinical trials..."
              className="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1F3A34] focus:border-[#1F3A34] disabled:bg-slate-100"
            />
            <button
              type="submit"
              disabled={!query.trim() || isTyping}
              className="p-2.5 bg-[#1F3A34] hover:bg-[#152723] text-white rounded-lg disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
              title="Send Inquiry"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            Mock response engine • Predefined TrialSetu knowledge base
          </p>
        </div>
      </div>
    </div>
  );
};
