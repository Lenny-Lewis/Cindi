import { useRef, useState } from 'react';
import ClaudeChatInput, { type ClaudeChatInputPayload } from '../components/ui/claude-style-chat-input';

type SentMessage = {
  id: number;
  payload: ClaudeChatInputPayload;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<SentMessage[]>([]);
  const nextMessageId = useRef(0);

  const handleSendMessage = (payload: ClaudeChatInputPayload) => {
    nextMessageId.current += 1;
    setMessages((current) => [...current, { id: nextMessageId.current, payload }]);
  };

  return (
    <main className="cindi-page cindi-chat-page" data-scroll-section>
      <div className="cindi-chat-page__inner">
        <ol className="cindi-chat-thread" role="log" aria-label="Conversation messages" aria-live="polite">
          {messages.map(({ id, payload }) => (
            <li className="cindi-chat-thread__message" key={id}>
              <p>{payload.message || 'Attached files'}</p>
              {payload.files.length > 0 && <span>{payload.files.map((file) => file.name).join(', ')}</span>}
            </li>
          ))}
        </ol>

        <ClaudeChatInput onSendMessage={handleSendMessage} />
      </div>
    </main>
  );
}
