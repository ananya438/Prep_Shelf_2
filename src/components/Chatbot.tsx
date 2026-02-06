import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };

const HELP_PROMPTS = [
  'Where can I find PYQs for CSE Semester 3?',
  'How do I contribute resources?',
  'What subjects are available for B.Tech?',
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your PrepShelf assistant. I can help you navigate the platform, find resources, and answer questions. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if (!content) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (apiKey) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content:
                  'You are PrepShelf assistant. Help university students find PYQs, Notes, Assignments, Solutions. Guide them to use filters. Mention Contribute page for submissions. Be brief.',
              },
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: 'user', content },
            ],
            max_tokens: 200,
          }),
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not process that.';
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      } else {
        const fallback = getFallbackReply(content);
        setMessages((prev) => [...prev, { role: 'assistant', content: fallback }]);
      }
    } catch {
      const fallback = getFallbackReply(content);
      setMessages((prev) => [...prev, { role: 'assistant', content: fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackReply = (content: string): string => {
    const lower = content.toLowerCase();
    if (lower.includes('pyq') || lower.includes('question')) {
      return "You can find PYQs in the PYQs section. Use filters (Degree, Branch, Semester, Subject). Head to the PYQs page from the navigation.";
    }
    if (lower.includes('note')) {
      return "Notes are in the Notes section. Filter by your degree, branch, semester, and subject.";
    }
    if (lower.includes('assignment') || lower.includes('solution')) {
      return "Assignments and Solutions are in their respective sections. Use the top navigation and apply filters.";
    }
    if (lower.includes('contribute') || lower.includes('submit')) {
      return "To contribute, go to the Contribute page, fill the form with resource details, upload a PDF, and submit. Resources go through admin moderation.";
    }
    return "I can help you find PYQs, Notes, Assignments, and Solutions. Use the navigation to browse. Visit Contribute to share resources. Add VITE_OPENAI_API_KEY for AI responses.";
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-24 right-6 z-40 w-[calc(100vw-3rem)] max-w-md bg-white rounded-2xl shadow-soft-lg border border-stone-200 overflow-hidden"
          >
            <div className="bg-primary-600 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-display font-semibold">PrepShelf Assistant</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            <div className="h-64 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-stone-100 text-stone-800'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-stone-100 rounded-2xl px-4 py-2">
                    <span className="text-sm text-stone-600">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-2 border-t border-stone-200">
              <div className="flex gap-2 flex-wrap mb-2">
                {HELP_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(p)}
                    className="text-xs px-2 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about resources..."
                  className="flex-1 px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Chat input"
                />
                <button
                  onClick={() => sendMessage()}
                  className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-primary-600 text-white rounded-full shadow-soft-lg flex items-center justify-center hover:shadow-glow transition-shadow focus-ring"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </motion.button>
    </>
  );
}
