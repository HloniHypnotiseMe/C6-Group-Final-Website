import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Phone, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { whatsappApi } from '@/services/api';

interface Message {
  id: string; text: string; sender: 'user' | 'bot'; timestamp: Date;
}

const BOT_RESPONSES: Record<string, string> = {
  'pricing packages': `*Our Packages:*

Lead Package - FREE
Diamond - R299/month
Gold - R699/month
Platinum - R1499/month

All paid plans include a 14-day free trial. Visit /packages for details.`,
  'ai audit': `*Free AI Business Audit*

Our AI analyses your business in 3 minutes and identifies revenue opportunities. You'll receive:
- Revenue gap analysis
- SEO score
- Growth recommendations
- Personalised action plan

Start your free audit at /audit`,
  'ai tools': `*AI Tools Marketplace*

We have 100+ AI tools across categories:
- Content Creation (blog writer, social media)
- Marketing (SEO, email campaigns)
- Sales (proposals, outreach)
- Analytics (forecasting, trends)
- Operations (HR, finance, legal)

Browse all tools at /ai-tools`,
  'support': `*Contact C6GROUP*

WhatsApp: 073 555 8440
Email: hello@c6group.co.za
Website: c6group.co.za

We're available Monday-Friday, 8am-6pm SAST.`,
  'book demo': `*Book a Demo*

Our team would love to show you how C6GROUP can help your business grow.

Contact us via WhatsApp at 073 555 8440 to schedule a personalised demo.`,
  'default': `Hello! Welcome to C6GROUP - your AI-powered business growth partner for South African SMEs.

How can I help you today?`,
};

const quickReplies = [
  'Pricing & Packages',
  'AI Business Audit',
  'AI Tools Marketplace',
  'Contact & Support',
];

export function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: BOT_RESPONSES['default'], sender: 'bot', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const getLocalResponse = (input: string): string => {
    const lower = input.toLowerCase();
    for (const [key, response] of Object.entries(BOT_RESPONSES)) {
      if (key !== 'default' && lower.includes(key.split(' ')[0])) return response;
    }
    return BOT_RESPONSES['default'];
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await whatsappApi.sendMessage({ message: text, type: 'text' });
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data?.reply || response.data?.message || getLocalResponse(text),
        sender: 'bot', timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: getLocalResponse(text), sender: 'bot', timestamp: new Date()
      }]);
    } finally { setIsTyping(false); }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          style={{ height: '500px', maxHeight: 'calc(100vh - 120px)' }}>
          {/* Header */}
          <div className="bg-emerald-600 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">C6GROUP Support</p>
                <p className="text-emerald-200 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full" /> Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <a href="tel:+27735558440" className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Phone className="w-4 h-4" />
              </a>
              <button onClick={() => setIsOpen(false)} className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div key={msg.id} className={cn('flex', msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn('max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-md'
                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-md shadow-sm'
                )}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className={cn('text-[10px] mt-1', msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400')}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 pt-2 pb-1 flex flex-wrap gap-1.5 shrink-0 bg-slate-50 border-t border-slate-100">
            {quickReplies.map((reply) => (
              <button key={reply} onClick={() => sendMessage(reply)}
                className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors"
              >{reply}</button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(inputValue); }} className="flex gap-2">
              <input type="text" value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-slate-100 border-0 rounded-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button type="submit" disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 disabled:opacity-40 transition-colors shrink-0"
              >
                {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAB */}
      <button onClick={() => setIsOpen(!isOpen)}
        className={cn('fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105',
          isOpen ? 'bg-slate-700 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
}
