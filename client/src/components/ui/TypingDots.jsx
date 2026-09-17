// Animated three-dot typing bubble for the chat AI reply wait state.
export default function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
        <span className="typing-dot h-2 w-2 rounded-full bg-teal-600" />
        <span className="typing-dot h-2 w-2 rounded-full bg-teal-600" />
        <span className="typing-dot h-2 w-2 rounded-full bg-teal-600" />
      </div>
    </div>
  );
}
