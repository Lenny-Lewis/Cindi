import { useRef, useState } from 'react';
import { BarChart3, Code2, FolderKanban, LogOut, Menu, MessageSquareText, Plus, Search, Settings2, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ClaudeChatInput, { type ClaudeChatInputPayload } from '../components/ui/claude-style-chat-input';

type SentMessage = { id: number; payload: ClaudeChatInputPayload };

export default function ChatPage() {
  const [messages, setMessages] = useState<SentMessage[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nextMessageId = useRef(0);

  const handleSendMessage = (payload: ClaudeChatInputPayload) => {
    nextMessageId.current += 1;
    setMessages((current) => [...current, { id: nextMessageId.current, payload }]);
  };

  const startNewChat = () => {
    setMessages([]);
    setSidebarOpen(false);
  };

  return (
    <main className="cindi-chat-page dark" data-scroll-section>
      <aside className={`cindi-chat-sidebar${sidebarOpen ? ' is-open' : ''}`} aria-label="Chat workspace">
        <div className="cindi-chat-sidebar__top">
          <Link className="cindi-chat-brand" to="/chat" aria-label="Cindi chat home"><span className="cindi-chat-brand__mark"><Sparkles size={17} /></span><span>Cindi</span></Link>
          <button type="button" className="cindi-chat-sidebar__collapse" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)}><X size={17} /></button>
        </div>

        <nav className="cindi-chat-workspace-nav" aria-label="Workspace navigation">
          <button type="button" className="is-current" onClick={startNewChat}><Plus size={16} /><span>New chat</span></button>
          <button type="button"><FolderKanban size={16} /><span>Projects</span></button>
          <button type="button"><MessageSquareText size={16} /><span>Artifacts</span></button>
          <button type="button"><Code2 size={16} /><span>Code</span></button>
          <button type="button"><BarChart3 size={16} /><span>Insights</span></button>
        </nav>

        <div className="cindi-chat-history-heading"><span>Recent conversations</span><button type="button" aria-label="Search conversations"><Search size={15} /></button></div>
        <div className="cindi-chat-history">
          {messages.length > 0 ? (
            <button type="button" className="cindi-chat-history__item" onClick={() => setSidebarOpen(false)}>{messages[0].payload.message || 'File and document review'}</button>
          ) : (
            <p>Your conversations will appear here.</p>
          )}
        </div>

        <Link to="/" className="cindi-chat-exit"><LogOut size={16} /><span>Exit chat</span></Link>
        <div className="cindi-chat-account"><span className="cindi-chat-account__avatar">C</span><span><strong>Cindi</strong><small>Preview</small></span><button type="button" aria-label="Workspace settings"><Settings2 size={16} /></button></div>
      </aside>

      {sidebarOpen && <button type="button" className="cindi-chat-sidebar-scrim" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} />}

      <section className="cindi-chat-main" aria-label="Chat with Cindi">
        <div className="cindi-chat-mobile-topbar">
          <button type="button" aria-label="Open sidebar" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <span>Cindi</span>
          <span className="cindi-chat-mobile-topbar__actions">
            <button type="button" aria-label="Start new chat" onClick={startNewChat}><Plus size={19} /></button>
            <Link to="/" aria-label="Exit chat and return home"><LogOut size={17} /></Link>
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="cindi-chat-welcome">
            <div className="cindi-chat-welcome__mark" aria-hidden="true"><Sparkles size={22} /></div>
            <h1>What can I help with?</h1>
          </div>
        ) : (
          <ol className="cindi-chat-thread" role="log" aria-label="Conversation messages" aria-live="polite">
            {messages.map(({ id, payload }) => (
              <li className="cindi-chat-thread__message" key={id}>
                <p>{payload.message || 'Please review the attached material.'}</p>
                {payload.files.length > 0 && <span>{payload.files.map((file) => file.name).join(', ')}</span>}
                {payload.pastedContent.length > 0 && <span>{payload.pastedContent.length} pasted text item{payload.pastedContent.length === 1 ? '' : 's'}</span>}
                <small>{payload.model} · {payload.effort} effort{payload.isThinkingEnabled ? ' · Thinking on' : ''}{payload.mode === 'Work' ? ' · Work' : ''}</small>
              </li>
            ))}
          </ol>
        )}

        <div className="cindi-chat-compose-area">
          <ClaudeChatInput onSendMessage={handleSendMessage} />
        </div>
      </section>
    </main>
  );
}
