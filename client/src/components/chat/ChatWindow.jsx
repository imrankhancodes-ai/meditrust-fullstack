import { useEffect, useRef, useState } from "react";
import { Send, MessageCircleHeart, Loader2 } from "lucide-react";
import TypingDots from "../ui/TypingDots";
import { ChatBubbleSkeleton } from "../ui/Skeletons";

export function ChatWindow({ messages, loading, sending }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length, sending]);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-4 shadow-sm">
        <ChatBubbleSkeleton />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="rounded-[2rem] border border-slate-100 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-50 text-teal-700">
          <MessageCircleHeart size={30} strokeWidth={2} />
        </div>
        <p className="font-display mt-3 font-bold text-slate-800">Ask anything about general health</p>
        <p className="mt-1 text-sm text-slate-500">
          For example: &quot;How should I store my medicines?&quot; or &quot;What should I ask my doctor about a blood test?&quot;
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <ChatBubble key={m._id} sender={m.sender} text={m.message} time={m.createdAt} />
      ))}
      {sending && <TypingDots />}
      <div ref={bottomRef} />
    </div>
  );
}

export function ChatBubble({ sender, text, time }) {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${
          isUser
            ? "rounded-br-lg bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-[0_4px_14px_rgba(17,94,89,0.3)]"
            : "rounded-bl-lg border border-slate-100 bg-white text-slate-800 shadow-sm"
        }`}
      >
        <p className="whitespace-pre-wrap">{text}</p>
        {time && (
          <div className={`mt-1 text-[11px] ${isUser ? "text-teal-100" : "text-slate-400"}`}>
            {new Date(time).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatComposer({ onSend, sending }) {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!value.trim() || sending) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a general health question…"
        className="flex-1 rounded-full border border-slate-200 bg-white px-5 py-3.5 text-sm shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200"
      />
      <button
        type="submit"
        disabled={sending || !value.trim()}
        className="btn-press touch-44 flex items-center gap-1.5 rounded-full bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(17,94,89,0.35)] hover:bg-teal-800 disabled:opacity-50"
      >
        {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} strokeWidth={2.2} />}
        <span className="hidden sm:inline">{sending ? "Sending" : "Send"}</span>
      </button>
    </form>
  );
}
