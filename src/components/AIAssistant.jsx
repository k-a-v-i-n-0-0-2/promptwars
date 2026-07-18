import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';
import {
  Send,
  Sparkles,
  Mic,
  Clock,
  MapPin,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Bot,
  User,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   Mock conversations & responses
   ────────────────────────────────────────────────────────── */
const SUGGESTED_PROMPTS = [
  { icon: Clock, text: 'What are the current gate wait times?' },
  { icon: MapPin, text: 'Show me the nearest restrooms' },
  { icon: AlertTriangle, text: 'Activate emergency protocol' },
  { icon: TrendingUp, text: 'Predict crowd flow for next hour' },
];

const SOPHIA_RESPONSES = {
  'What are the current gate wait times?': `Here are the current gate wait times:

| Gate | Wait Time | Status |
|------|-----------|--------|
| Gate 1 | 1.2 min | 🟢 Normal |
| Gate 2 | 3.8 min | 🟡 Moderate |
| Gate 3 | 0.9 min | 🟢 Normal |
| Gate 4 | 2.1 min | 🟢 Normal |

**Recommendation:** Gate 2 is experiencing above-average wait times. Consider redirecting incoming traffic from Parking Lot B to Gate 3 instead.`,
  'Show me the nearest restrooms': `There are **4 restroom facilities** currently available near your location:

1. **Restroom A** — North Stand, Level 1 (2 min walk) — _Low traffic_
2. **Restroom B** — East Stand, Level 2 (4 min walk) — _Moderate traffic_
3. **Restroom C** — South Stand, Level 1 (5 min walk) — _Low traffic_
4. **Restroom D** — West VIP Lounge (3 min walk) — _VIP only_

Would you like me to highlight the route on the stadium map?`,
  'Activate emergency protocol': `⚠️ **Emergency Protocol Activation**

This will trigger the following actions:
- Activate all **24 emergency exit routes**
- Notify **stadium security** and **medical teams**
- Enable **PA system** emergency broadcast
- Engage **crowd dispersion** algorithms

Are you sure you want to proceed? This action is logged and auditable.`,
  'Predict crowd flow for next hour': `Based on current telemetry data and historical patterns:

📊 **Next Hour Prediction (18:00 – 19:00)**

- **Entry rate**: Expected to decrease by **22%** as kickoff approaches
- **Concession zones**: Traffic will spike by **35%** during halftime
- **Exit gates**: Minimal activity until post-match
- **Risk areas**: Section NW may reach **95% capacity** — recommend proactive management

_Confidence level: **94.2%** based on 12 similar match-day patterns._`,
};

const DEFAULT_RESPONSE = `I can help with that! Let me analyze the stadium data...

Based on current conditions, here are my observations:

- **Overall stadium health**: Excellent (98.7% safety score)
- **Crowd density**: Within normal parameters across all sections
- **Active alerts**: None at this time

Is there anything specific you'd like me to investigate further?`;

/* ──────────────────────────────────────────────────────────
   Typing animation component
   ────────────────────────────────────────────────────────── */
const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-cyan"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1, 0.85] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </div>
);

/* ──────────────────────────────────────────────────────────
   Soundwave visualizer for AI "voice"
   ────────────────────────────────────────────────────────── */
const Soundwave = () => (
  <div className="flex items-end gap-[2px] h-4">
    {Array.from({ length: 16 }).map((_, i) => (
      <motion.div
        key={i}
        className="w-[2px] bg-cyan rounded-full"
        animate={{ height: [4, Math.random() * 14 + 4, 4] }}
        transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.05 }}
      />
    ))}
  </div>
);

/* ──────────────────────────────────────────────────────────
   Message bubble
   ────────────────────────────────────────────────────────── */
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
          isUser ? 'bg-purple/15' : 'bg-gradient-to-br from-cyan/20 to-purple/20'
        }`}
      >
        {isUser ? <User size={14} className="text-purple" /> : <Bot size={14} className="text-cyan" />}
      </div>

      {/* Content */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-purple/10 border border-purple/15 text-text-primary'
            : 'glass text-text-primary'
        }`}
      >
        {/* Safe markdown rendering with DOMPurify */}
        {msg.content.split('\n').map((line, i) => {
          // Bold
          const rendered = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>');
          // Italic
          const rendered2 = rendered.replace(/_(.*?)_/g, '<em class="text-text-secondary">$1</em>');
          // Code
          const rendered3 = rendered2.replace(/`(.*?)`/g, '<code class="bg-surface-raised px-1.5 py-0.5 rounded text-cyan text-xs">$1</code>');

          const safeHtml = DOMPurify.sanitize(rendered3, { ALLOWED_TAGS: ['strong', 'em', 'code', 'br', 'span', 'div', 'p'], ALLOWED_ATTR: ['class'] });

          if (line.startsWith('|')) {
            // Table rows
            return (
              <div key={i} className="text-xs text-text-secondary font-mono overflow-x-auto" dangerouslySetInnerHTML={{ __html: safeHtml }} />
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={i} className="flex items-start gap-2 ml-2">
                <span className="text-cyan mt-1.5">•</span>
                <span dangerouslySetInnerHTML={{ __html: safeHtml.slice(2) }} />
              </div>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            return (
              <div key={i} className="ml-2 text-text-secondary" dangerouslySetInnerHTML={{ __html: safeHtml }} />
            );
          }
          if (line.trim() === '') return <br key={i} />;
          return <p key={i} dangerouslySetInnerHTML={{ __html: safeHtml }} />;
        })}
      </div>
    </motion.div>
  );
};

/* ──────────────────────────────────────────────────────────
   AI Assistant Component
   ────────────────────────────────────────────────────────── */
const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm **Sophia**, your AI Stadium Coordinator for the FIFA World Cup 2026. 🏟️

I can help you with real-time crowd monitoring, safety protocols, gate management, and much more.

What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    // Sanitize and limit input length
    const cleanText = text.trim().slice(0, 500);
    if (!cleanText) return;

    const userMsg = { id: Date.now(), role: 'user', content: cleanText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const systemPrompt = `You are Sophia, the virtual AI Stadium Coordinator for MetLife Arena during the FIFA World Cup 2026.
Here is the active stadium telemetry (real-time data):
- Active Spectators: 87,432
- Live Match: Argentina 2 - 1 Portugal (74th minute)
- Audio/Atmosphere: 94 dB (Peak 106 dB)
- Avg Gate Wait Time: 2.4 min (24/24 gates open)
- Safety Index: 98.7% (NOMINAL status)
- Ambient Temperature: 24.2 °C, Humidity: 46.8%, Airflow: 14.8 km/h
- Active alerts: None.

Please use this real-time data to answer the user's questions. Speak as a professional stadium coordinator. Keep answers concise, and format tables or lists in clean markdown.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      // Build conversation history payload in Gemini format
      const apiMessages = [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${cleanText}` }]
        }
      ];

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: apiMessages
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: replyText }
      ]);
    } catch (error) {
      // Structured error handling without leaking full details to console in production
      clearTimeout(timeoutId);
      const isTimeout = error.name === 'AbortError';
      // Fallback to offline template if network/key fails
      const fallbackResponse = SOPHIA_RESPONSES[text] || DEFAULT_RESPONSE;
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: 'assistant', content: `[OFFLINE MODE] ${fallbackResponse}` }
        ]);
      }, 1000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-h-[700px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-purple flex items-center justify-center">
              <Sparkles size={18} className="text-void" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald border-2 border-void" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary font-display">Sophia</h2>
            <div className="text-xs text-text-muted flex items-center gap-2">
              Arena AI Coordinator
              <Soundwave />
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-smooth"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan/20 to-purple/20 flex items-center justify-center shrink-0">
              <Bot size={14} className="text-cyan" />
            </div>
            <div className="glass rounded-2xl">
              <TypingDots />
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-4">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt.text}
              onClick={() => sendMessage(prompt.text)}
              className="glass rounded-xl px-4 py-3 text-left text-xs text-text-secondary hover:text-text-primary hover:border-glass-border-hover transition-all duration-200 flex items-center gap-3 group cursor-pointer"
            >
              <prompt.icon size={14} className="text-cyan shrink-0" />
              <span className="flex-1">{prompt.text}</span>
              <ChevronRight size={12} className="text-text-faint group-hover:text-cyan transition-colors" />
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="glass rounded-2xl flex items-center gap-3 px-4 py-3 focus-within:border-cyan/30 transition-colors duration-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Sophia anything..."
            aria-label="Ask Sophia anything"
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-faint focus:outline-none"
          />
          <button type="button" aria-label="Voice input" className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors text-text-muted hover:text-text-secondary cursor-pointer">
            <Mic size={16} />
          </button>
          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim()}
            className="p-2 rounded-lg bg-cyan/15 text-cyan hover:bg-cyan/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIAssistant;
