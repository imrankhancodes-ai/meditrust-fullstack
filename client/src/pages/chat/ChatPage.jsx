import { useChatHistory, useSendChat } from "../../hooks/useChat";
import { ChatWindow, ChatComposer } from "../../components/chat/ChatWindow";

export default function ChatPage() {
  const { data: messages, isLoading } = useChatHistory();
  const send = useSendChat();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold text-slate-900">Health chat</h1>
      <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
        <span className="font-bold">General guidance only — not a diagnosis.</span> This assistant
        can&apos;t diagnose or recommend dosages. For anything specific, please{" "}
        <a href="/doctors" className="font-bold underline">book a real doctor</a>.
      </div>
      <div className="mt-4 max-h-[55vh] overflow-y-auto rounded-2xl bg-slate-100/60 p-4 nice-scroll">
        <ChatWindow messages={messages} loading={isLoading} />
      </div>
      <div className="mt-3">
        <ChatComposer onSend={(msg) => send.mutate(msg)} sending={send.isPending} />
      </div>
    </div>
  );
}
