import React, { useState, useRef, useEffect } from 'react';
import { streamCoachResponse, CoachMode } from '../services/geminiService';
import { Card, Button } from './UIComponents';
import { Send, Bot, Loader2, Sparkles, Zap, BrainCircuit } from 'lucide-react';
import { ChatMessage } from '../types';

const CoachChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<CoachMode>('standard');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hello Gaurav! I am Dr. Fit. I see your bone mass is a priority. How is your back feeling today after yesterday\'s routine?', timestamp: Date.now() }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Prepare history for API
    const historyForApi = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    // Optimistic model message
    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', timestamp: Date.now() }]);

    let fullResponse = '';
    
    await streamCoachResponse(historyForApi, userMsg.text, mode, (chunk) => {
        fullResponse += chunk;
        setMessages(prev => prev.map(m => 
            m.id === modelMsgId ? { ...m, text: fullResponse } : m
        ));
        scrollToBottom();
    });

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto">
      <Card className="flex-1 flex flex-col overflow-hidden shadow-lg border-0 h-full">
        {/* Header with Mode Toggle */}
        <div className={`p-4 text-white flex items-center justify-between shadow-sm transition-colors duration-500 ${mode === 'expert' ? 'bg-gradient-to-r from-violet-600 to-purple-800' : 'bg-indigo-600'}`}>
            <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-3 relative">
                    {mode === 'expert' ? <BrainCircuit size={20} className="animate-pulse" /> : <Bot size={20} />}
                    {mode === 'expert' && <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                    </span>}
                </div>
                <div>
                    <h3 className="font-bold flex items-center gap-2">
                        Dr. Fit (AI)
                        {mode === 'expert' && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded border border-white/20 uppercase tracking-wider">Expert</span>}
                    </h3>
                    <p className="text-xs text-indigo-100 opacity-90">
                        {mode === 'expert' ? 'Deep Reasoning & Analysis' : 'Sports Medicine & Conditioning'}
                    </p>
                </div>
            </div>
            
            <button 
                onClick={() => setMode(prev => prev === 'standard' ? 'expert' : 'standard')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/20 hover:bg-black/30 text-xs font-semibold transition-all border border-white/10"
            >
                {mode === 'standard' ? (
                    <>
                        <Zap size={14} className="text-yellow-300" />
                        <span>Standard</span>
                    </>
                ) : (
                    <>
                        <Sparkles size={14} className="text-pink-300" />
                        <span>Expert</span>
                    </>
                )}
            </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                    }`}>
                        {msg.text ? (
                             <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                        ) : (
                            <div className="flex items-center gap-2 text-slate-500 py-1">
                                <Loader2 className="animate-spin h-4 w-4" />
                                <span className="text-xs font-medium">
                                    {mode === 'expert' ? 'Thinking deeply...' : 'Dr. Fit is typing...'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-slate-100">
            {mode === 'expert' && (
                <div className="mb-2 text-[10px] text-purple-600 font-medium flex items-center justify-center bg-purple-50 py-1 rounded">
                    <BrainCircuit size={12} className="mr-1.5"/> 
                    Expert Mode active: Responses may take longer but will be more thorough.
                </div>
            )}
            <div className="flex items-center gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={mode === 'expert' ? "Ask detailed questions about biomechanics..." : "Ask about form, pain, or diet..."}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <Button 
                    onClick={handleSend} 
                    disabled={loading || !input.trim()} 
                    className={`p-2.5 rounded-lg aspect-square flex items-center justify-center transition-colors ${
                        mode === 'expert' ? 'bg-violet-600 hover:bg-violet-700' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                    <Send size={18} />
                </Button>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default CoachChat;