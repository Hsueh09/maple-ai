"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  Sparkles,
  Sword,
  Shield,
  Scroll,
  Map,
  ExternalLink,
} from "lucide-react";

interface Source {
  title: string;
  url: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

const SUGGESTIONS = [
  { icon: Sword, text: "推薦最強裝備組合" },
  { icon: Shield, text: "如何提升防禦力？" },
  { icon: Scroll, text: "技能加點攻略" },
  { icon: Map, text: "副本攻略指南" },
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText.trim() }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "魔法連結中斷，請稍後再試...",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSuggestionClick = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-center border-b border-border/50 bg-card/50 px-4 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/50">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>

            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-foreground">
              楓之谷 - 楓星AI小助手
            </h1>

            <p className="text-xs text-muted-foreground">
              您的專屬遊戲顧問
            </p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
        ) : (
          <div className="mx-auto max-w-3xl space-y-4 p-4">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}

            {isLoading && <LoadingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="border-t border-border/50 bg-card/30 p-4 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative flex items-end gap-2 rounded-xl border border-border/50 bg-input p-2 ring-1 ring-transparent transition-all focus-within:border-primary/50 focus-within:ring-primary/20">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="輸入訊息詢問遊戲助手..."
              rows={1}
              className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>

          <p className="mt-2 text-center text-xs text-muted-foreground">
            AI 助手可能會產生不準確的資訊，請自行驗證重要內容
          </p>
        </form>
      </footer>
    </div>
  );
}

function WelcomeScreen({
  onSuggestionClick,
}: {
  onSuggestionClick: (text: string) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-8">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 ring-2 ring-primary/30">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-foreground">
          歡迎來到楓之谷 - 楓星AI小助手
        </h2>

        <p className="max-w-md text-center text-muted-foreground">
          我是您的專屬 AI 遊戲助手，可以為您提供裝備推薦、技能配置、副本攻略等各種遊戲指引
        </p>
      </div>

      <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-4 text-left transition-all hover:border-primary/50 hover:bg-card"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary transition-colors group-hover:bg-primary/20">
              <suggestion.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>

            <span className="text-sm font-medium text-foreground">
              {suggestion.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "border border-border/50 bg-card text-card-foreground"
        }`}
      >
        {!isUser && (
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary">
              AI 助手
            </span>
          </div>
        )}

        <div className="whitespace-pre-wrap text-base leading-7">
          {message.content}
        </div>

        {/* =========================
            參考來源
        ========================= */}

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-4 border-t border-border/50 pt-3">
            <div className="mb-2 text-sm font-semibold text-foreground">
              參考來源
            </div>

            <div className="space-y-2">
              {message.sources.map((source, index) => (
                <a
                  key={`${source.url}-${index}`}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 rounded-lg border border-border/40 bg-background/50 px-3 py-2 text-sm text-primary transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />

                  <span className="leading-5">
                    {source.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl border border-border/50 bg-card px-4 py-3">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />

          <span className="text-xs font-medium text-primary">
            AI 助手
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60" />
          </div>

          <span className="text-xs text-muted-foreground">
            正在查閱古老的知識...
          </span>
        </div>
      </div>
    </div>
  );
}

