import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function SidekickChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock user name - in real app would come from auth
  const userName = "there";

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add initial greeting when chat opens for the first time
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hey ${userName}, what's on your mind?`,
        },
      ]);
    }
  }, [isOpen, messages.length, userName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mock response - in real app would call AI backend
    setTimeout(() => {
      const responses = [
        "I hear you! Let's break this down together. What's the first small step you could take?",
        "That's a great challenge to work on. Have you thought about what's holding you back?",
        "I'm here for you! Sometimes talking it through helps. Tell me more about what you're facing.",
        "You've got this! Remember, every big dream starts with small actions. What feels manageable right now?",
        "I understand. Challenges are just opportunities in disguise. What would success look like for you?",
      ];
      
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: responses[Math.floor(Math.random() * responses.length)],
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="group flex items-center gap-3 bg-primary text-primary-foreground rounded-full pl-4 pr-5 py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              {/* Superhero Mask Avatar */}
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-2xl">
                🦸
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Have a challenge?</p>
                <p className="text-xs opacity-80">I can help</p>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center text-3xl">
                🦸
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Your Sidekick</h3>
                <p className="text-xs opacity-80">Here to help you conquer challenges</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">
                        🦸
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                        message.role === 'user'
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">
                      🦸
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
