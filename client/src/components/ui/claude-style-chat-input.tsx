import { useCallback, useEffect, useRef, useState, type ClipboardEvent, type DragEvent, type FormEvent, type KeyboardEvent } from 'react';
import { ArrowUp, Check, ChevronDown, FileText, Plus, X } from 'lucide-react';

export type ChatModel = 'Cindi 1.5' | 'Scylla 2';
export type ModelEffort = 'Low' | 'Medium' | 'High' | 'Extra' | 'Max';
export type ChatMode = 'Chat' | 'Work';

const AVAILABLE_MODELS: { id: ChatModel; description: string }[] = [
  { id: 'Cindi 1.5', description: 'Everyday tasks and conversation' },
  { id: 'Scylla 2', description: 'Heavier, multi-step work' },
];
const UPCOMING_MODELS = ['Argus', 'Hydra'] as const;

export type ClaudeChatInputPayload = {
  message: string;
  files: File[];
  pastedContent: string[];
  model: ChatModel;
  effort: ModelEffort;
  isThinkingEnabled: boolean;
  mode: ChatMode;
};

type ClaudeChatInputProps = {
  onSendMessage: (payload: ClaudeChatInputPayload) => void;
};

type PastedItem = { id: string; content: string };

export default function ClaudeChatInput({ onSendMessage }: ClaudeChatInputProps) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [pastedItems, setPastedItems] = useState<PastedItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ChatModel>('Cindi 1.5');
  const [effort, setEffort] = useState<ModelEffort>('Medium');
  const [isThinkingEnabled, setIsThinkingEnabled] = useState(true);
  const [mode, setMode] = useState<ChatMode>('Chat');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEffortMenuOpen, setIsEffortMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 320)}px`;
  }, [message]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsEffortMenuOpen(false);
      }
    };
    const closeEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsEffortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', closeOutside);
    window.addEventListener('keydown', closeEscape);
    return () => {
      document.removeEventListener('mousedown', closeOutside);
      window.removeEventListener('keydown', closeEscape);
    };
  }, [isMenuOpen]);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    setFiles((current) => {
      const next = Array.from(incoming).filter((file) => !current.some((item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified));
      return [...current, ...next];
    });
  }, []);

  const handleDrop = (event: DragEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const incomingFiles = Array.from(event.clipboardData.items)
      .filter((item) => item.kind === 'file')
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null);
    if (incomingFiles.length) {
      event.preventDefault();
      addFiles(incomingFiles);
      return;
    }
    const content = event.clipboardData.getData('text/plain');
    if (content.length > 300) {
      event.preventDefault();
      setPastedItems((items) => [...items, { id: `${Date.now()}-${Math.random()}`, content }]);
    }
  };

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim() && files.length === 0 && pastedItems.length === 0) return;
    onSendMessage({ message: message.trim(), files, pastedContent: pastedItems.map(({ content }) => content), model: selectedModel, effort, isThinkingEnabled, mode });
    setMessage('');
    setFiles([]);
    setPastedItems([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const hasContent = Boolean(message.trim() || files.length || pastedItems.length);

  return (
    <form
      className={`cindi-chat-composer${isDragging ? ' cindi-chat-composer--dragging' : ''}`}
      onSubmit={handleSend}
      onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        const nextTarget = event.relatedTarget;
        if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) setIsDragging(false);
      }}
      onDrop={handleDrop}
    >
      {(files.length > 0 || pastedItems.length > 0) && (
        <div className="cindi-chat-attachments" aria-label="Attachments">
          {pastedItems.map((item) => (
            <div className="cindi-chat-attachment cindi-chat-attachment--paste" key={item.id}>
              <FileText aria-hidden="true" size={16} />
              <span className="cindi-chat-attachment__name">{item.content.slice(0, 64).replace(/\s+/g, ' ')}…</span>
              <button type="button" className="cindi-chat-attachment__remove" aria-label="Remove pasted text" onClick={() => setPastedItems((items) => items.filter(({ id }) => id !== item.id))}><X size={14} /></button>
            </div>
          ))}
          {files.map((file, index) => <FileAttachment key={`${file.name}-${file.size}-${file.lastModified}-${index}`} file={file} onRemove={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))} />)}
        </div>
      )}

      {isDragging && <div className="cindi-chat-drop-hint" aria-hidden="true">Drop files to attach</div>}

      <label htmlFor="cindi-chat-message" className="sr-only">Message {selectedModel}</label>
      <textarea
        id="cindi-chat-message"
        ref={textareaRef}
        className="cindi-chat-textarea"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        placeholder={`Ask ${selectedModel.startsWith('Cindi') ? 'Cindi' : 'Scylla'} anything...`}
        rows={1}
      />

      <div className="cindi-chat-actions">
        <div className="cindi-chat-actions__left">
          <button type="button" className="cindi-chat-icon-button" aria-label="Attach files" onClick={() => fileInputRef.current?.click()}><Plus aria-hidden="true" size={20} /></button>
          <input ref={fileInputRef} className="sr-only" type="file" multiple onChange={(event) => { if (event.target.files) addFiles(event.target.files); event.target.value = ''; }} aria-label="Choose files to attach" />
          <div className="cindi-chat-mode-toggle" role="group" aria-label="Chat mode">
            {(['Chat', 'Work'] as const).map((item) => <button type="button" key={item} className={mode === item ? 'is-active' : ''} aria-pressed={mode === item} onClick={() => setMode(item)}>{item}</button>)}
          </div>
        </div>

        <div className="cindi-chat-actions__right">
          <div className="cindi-chat-model-picker" ref={menuRef}>
            <button type="button" className="cindi-chat-model-select" aria-haspopup="menu" aria-expanded={isMenuOpen} aria-controls="cindi-chat-model-menu" onClick={() => { setIsMenuOpen((open) => !open); setIsEffortMenuOpen(false); }}>
              <span>{selectedModel}</span><span className="cindi-chat-model-select__effort">{effort}</span><ChevronDown aria-hidden="true" size={14} className={isMenuOpen ? 'is-open' : ''} />
            </button>
            {isMenuOpen && (
              <div className={`cindi-chat-model-menu${isEffortMenuOpen ? ' has-effort-open' : ''}`} id="cindi-chat-model-menu" role="menu" aria-label="Model and effort settings">
                <div className="cindi-chat-model-menu__models">
                  {AVAILABLE_MODELS.map(({ id, description }) => (
                    <button type="button" role="menuitemradio" aria-checked={selectedModel === id} className={`cindi-chat-model-menu__option${selectedModel === id ? ' is-selected' : ''}`} key={id} onClick={() => { setSelectedModel(id); setIsMenuOpen(false); setIsEffortMenuOpen(false); }}>
                      <span className="cindi-chat-model-menu__name">{id}{selectedModel === id && <Check aria-hidden="true" size={15} />}</span>
                      <span className="cindi-chat-model-menu__description">{description}</span>
                    </button>
                  ))}
                  {UPCOMING_MODELS.map((model) => <button type="button" role="menuitem" className="cindi-chat-model-menu__option is-disabled" key={model} disabled><span className="cindi-chat-model-menu__name">{model}<span className="cindi-chat-model-menu__status">Coming soon</span></span></button>)}
                </div>
                <button type="button" className={`cindi-chat-effort-row${isEffortMenuOpen ? ' is-selected' : ''}`} aria-expanded={isEffortMenuOpen} onClick={() => setIsEffortMenuOpen((open) => !open)}>
                  <span>Effort</span><span>{effort}<ChevronDown aria-hidden="true" size={14} /></span>
                </button>
                {isEffortMenuOpen && (
                  <div className="cindi-chat-effort-menu" role="group" aria-label="Choose reasoning effort">
                    <p>Higher effort can take longer, but helps with more complex tasks.</p>
                    {(['Low', 'Medium', 'High', 'Extra', 'Max'] as const).map((item) => <button type="button" key={item} className={effort === item ? 'is-selected' : ''} aria-pressed={effort === item} onClick={() => setEffort(item)}>{item}{effort === item && <Check aria-hidden="true" size={15} />}</button>)}
                    <div className="cindi-chat-thinking-row"><span><strong>Thinking</strong><small>Use deeper reasoning for complex tasks</small></span><button type="button" role="switch" aria-checked={isThinkingEnabled} aria-label="Thinking" onClick={() => setIsThinkingEnabled((enabled) => !enabled)} className={isThinkingEnabled ? 'is-on' : ''}><span /></button></div>
                  </div>
                )}
                <p className="cindi-chat-model-menu__footnote">Choose the model and reasoning level for this conversation.</p>
              </div>
            )}
          </div>
          <button type="submit" className="cindi-chat-send" aria-label="Send message" disabled={!hasContent}><ArrowUp aria-hidden="true" size={18} /></button>
        </div>
      </div>
    </form>
  );
}

function FileAttachment({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file.type.startsWith('image/')) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className="cindi-chat-attachment">
      {preview ? <img className="cindi-chat-attachment__preview" src={preview} alt="" /> : <FileText aria-hidden="true" size={16} />}
      <span className="cindi-chat-attachment__name" title={file.name}>{file.name}</span>
      <span className="cindi-chat-attachment__size">{formatFileSize(file.size)}</span>
      <button type="button" className="cindi-chat-attachment__remove" aria-label={`Remove ${file.name}`} onClick={onRemove}><X size={14} /></button>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** unitIndex)).toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
