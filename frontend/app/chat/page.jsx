'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shell } from '../../components/Shell';
import { Send, User, Bot, Loader2, Mic, Paperclip, X, Trash2 } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: "Welcome to your secure truth sanctuary. I'm here to listen and help you document your perspective with complete privacy. What would you like to discuss?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);
  const idCounter = useRef(messages.length + 1);

  // Cleanup object URLs when component unmounts or attachments change
  useEffect(() => {
    return () => {
      attachments.forEach(a => URL.revokeObjectURL(a.previewUrl));
    };
  }, [attachments]);

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        previewUrl: URL.createObjectURL(file)
      }));
      setAttachments(prev => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      URL.revokeObjectURL(newAttachments[index].previewUrl);
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const previews = attachments.map(a => ({
    name: a.file.name,
    url: a.previewUrl,
    type: a.file.type,
    size: a.file.size
  }));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = {
      id: `user-${idCounter.current++}`,
      role: 'user',
      content: input,
      attachments: previews
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachments([]);
    setIsTyping(true);

    // Build conversation history string for context
    const conversationHistory = messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const formData = new FormData();
    formData.append("message", input);
    formData.append("conversation_history", conversationHistory);

    if (messages.length >= 7) {
        setShowGenerateReport(!showGenerateReport);
      }

    try {
       
        const response = await fetch("http://127.0.0.1:8000/chat", {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        console.log(data);

        if (data.success) {
          const newQuestionCount = data.question_count || (questionCount + 1);
          setQuestionCount(newQuestionCount);

          const assistantMsg = {
            id: `ai-${idCounter.current++}`,
            role: 'assistant',
            content: data.message
          };
          setMessages(prev => [...prev, assistantMsg]);

          // Show generate report button after the bot mentions it or at appropriate times
          if (data.message.toLowerCase().includes('generate report') || data.message.toLowerCase().includes('click')) {
            setShowGenerateReport(true);
          }
        }
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = {
        id: `ai-${idCounter.current++}`,
        role: 'assistant',
        content: 'Sorry, there was an error processing your message. Please try again.'
      };
      setMessages(prev => [...prev, errorMsg]);

    }
    setIsTyping(false);


  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the entire conversation? This action cannot be undone.')) {
      setMessages([{ id: '1', role: 'assistant', content: "Welcome to your secure truth sanctuary. I'm here to listen and help you document your perspective with complete privacy. What would you like to discuss?" }]);
      setAttachments([]);
      setInput('');
      idCounter.current = 2;
    }
  };

  return (
    <Shell>
      <div className="absolute inset-0 -z-10 mesh-gradient opacity-20" />
      
      <main className="flex-1 flex flex-col h-screen pt-28 pb-64">
        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-12 space-y-6 custom-scrollbar">
          <div className="mx-auto max-w-2xl w-full">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`flex items-start gap-4 mb-8 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`p-2 rounded-xl ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'} border border-white/10 shrink-0`}>
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <div className={`max-w-[85%] rounded-[1.5rem] p-5 lg:p-6 shadow-xl border ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white border-primary/20 rounded-tr-none' 
                      : 'glass-card text-text-main border-white/10 rounded-tl-none backdrop-blur-3xl'
                  }`}>
                    <p className={`text-sm md:text-base leading-relaxed ${msg.role === 'user' ? 'font-medium' : 'font-normal'}`}>
                      {msg.content}
                    </p>
                    
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {msg.attachments.map((file, idx) => (
                          <motion.div 
                            key={idx} 
                            whileHover={{ scale: 1.02 }}
                            className={`relative rounded-xl overflow-hidden border border-white/10 group cursor-pointer ${file.type.startsWith('image/') ? 'aspect-video' : 'p-3 bg-black/20 hover:bg-black/30'} transition-all`}
                          >
                            {file.type.startsWith('image/') ? (
                              <>
                                <img 
                                  src={file.url} 
                                  alt={file.name} 
                                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-[10px] text-white font-bold uppercase tracking-widest">View Image</span>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg">
                                  <Paperclip className="h-4 w-4 text-primary" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold truncate text-text-main">{file.name}</p>
                                  <p className="text-[10px] text-text-dim/60">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4 mb-8"
                >
                  <div className="p-2 rounded-xl bg-secondary/20 text-secondary border border-white/10 shrink-0">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="glass-card p-4 rounded-[1.5rem] rounded-tl-none border-white/10">
                    <div className="flex gap-1.5">
                       <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-bounce [animation-delay:-0.3s]"></span>
                       <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-bounce [animation-delay:-0.15s]"></span>
                       <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-bounce"></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
          <div className="h-32 w-full bg-gradient-to-t from-background to-transparent" />
          <div className="bg-background pb-10 px-6">
            <div className="mx-auto max-w-2xl w-full pointer-events-auto">
              {/* Attachment Preview Bar */}
              <AnimatePresence>
                {previews.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="flex gap-3 mb-4 overflow-x-auto pb-2 px-2 custom-scrollbar"
                  >
                    {previews.map((file, idx) => (
                      <motion.div 
                        key={idx}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden glass-card border-white/20 group"
                      >
                        {file.type.startsWith('image/') ? (
                          <img 
                            src={file.url} 
                            alt={file.name}
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                            <Paperclip className="h-6 w-6 text-primary mb-1" />
                            <span className="text-[8px] truncate w-full px-1">{file.name}</span>
                          </div>
                        )}
                        <button 
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="absolute top-1 right-1 p-1 bg-rose/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSend} className="relative group">
                <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center bg-white dark:bg-slate-900 border border-white/20 dark:border-white/10 rounded-full p-1.5 pl-6 shadow-2xl transition-all group-focus-within:border-primary/50">
                  <div className="flex items-center gap-2 mr-2">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileSelect} 
                      multiple 
                      className="hidden" 
                    />
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-text-dim/40 hover:text-primary transition-all"
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <button type="button" className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-text-dim/40 hover:text-primary transition-all">
                      <Mic className="h-5 w-5" />
                    </button>
                    <button 
                      type="button" 
                      onClick={handleClear}
                      className="p-2 hover:bg-rose/10 rounded-full text-text-dim/40 hover:text-rose transition-all"
                      title="Clear Chat"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message TruthFlow..."
                    className="flex-1 bg-transparent px-2 py-3 text-sm md:text-base text-text-main focus:outline-none placeholder:text-text-dim/30"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={(!input.trim() && attachments.length === 0) || isTyping}
                    className="p-3 bg-primary text-white rounded-full shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
                  >
                    <Send className="h-5 w-5" />
                  </motion.button>
                </div>
              </form>
              <p className="mt-4 text-center text-[10px] text-text-dim/40 font-bold tracking-[0.2em] uppercase">
                TruthFlow may analyze your input for enhanced clarity. End-to-end encrypted.
              </p>
            </div>
          </div>
        </div>
      </main>
    </Shell>
  );
}