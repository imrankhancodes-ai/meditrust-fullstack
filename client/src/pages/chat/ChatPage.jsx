import { useChatHistory, useSendChat } from "../../hooks/useChat";
import { ChatWindow, ChatComposer } from "../../components/chat/ChatWindow";
import { TriangleAlert, Stethoscope } from "lucide-react";
import SectionHeading from "../../components/ui/SectionHeading";

export default function ChatPage() {
  const { data: messages, isLoading } = useChatHistory();
  const send = useSendChat();

  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeading eyebrow="Assistant" title="Health chat" />
      <div className="mt-3 flex items-start gap-2 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
        <TriangleAlert size={17} strokeWidth={2.2} className="mt-0.5 shrink-0" />
        <p>
          <span className="font-bold">General guidance only — not a diagnosis.</span> This assistant
          can&apos;t diagnose or recommend dosages. For anything specific, please{" "}
          <a href="/doctors" className="inline-flex items-center gap-1 font-bold underline">
            <Stethoscope size={14} strokeWidth={2.2} /> book a real doctor
          </a>.
        </p>
      </div>
      <div className="mt-4 max-h-[55vh] overflow-y-auto rounded-[2rem] border border-slate-100 bg-slate-100/60 p-4 nice-scroll">
        <ChatWindow messages={messages} loading={isLoading} sending={send.isPending} />
      </div>
      <div className="mt-3">
        <ChatComposer onSend={(msg) => send.mutate(msg)} sending={send.isPending} />
      </div>
    </div>
  );
}
