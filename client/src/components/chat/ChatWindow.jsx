import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

export function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  if (loading) {
    return (
      <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-12 w-3/4" />
        ))}
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <div className="text-4xl">💬</div>
        <p className="mt-2 font-bold text-slate-800">Ask anything about general health</p>
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
      <div ref={bottomRef} />
    </div>
  );
}

export function ChatBubble({ sender, text, time }) {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${
          isUser
            ? "rounded-br-md bg-teal-700 text-white"
            : "rounded-bl-md bg-white text-slate-800 shadow-sm"
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
        className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
      />
      <button
        type="submit"
        disabled={sending || !value.trim()}
        className="btn-press flex items-center gap-1.5 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-50"
      >
        <Send size={16} /> {sending ? "…" : "Send"}
      </button>
    </form>
  );
}
