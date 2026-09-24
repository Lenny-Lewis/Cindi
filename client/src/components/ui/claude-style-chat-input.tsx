import { useCallback, useEffect, useRef, useState, type DragEvent, type FormEvent, type KeyboardEvent } from 'react';
import { ArrowUp, ChevronDown, FileText, Plus, X } from 'lucide-react';

type AvailableModel = 'Cindi' | 'Scylla';
const UPCOMING_MODELS = ['Argus', 'Hydra'] as const;
type ModelEffort = 'Light' | 'Medium' | 'Heavy';

export type ClaudeChatInputPayload = {
  message: string;
  files: File[];
  effort: ModelEffort;
};

type ClaudeChatInputProps = {
  onSendMessage: (payload: ClaudeChatInputPayload) => void;
};

export default function ClaudeChatInput({ onSendMessage }: ClaudeChatInputProps) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [effort, setEffort] = useState<ModelEffort>('Medium');
  const [selectedModel, setSelectedModel] = useState<AvailableModel>('Cindi');
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 192)}px`;
  }, [message]);

  useEffect(() => {
    if (!isModelMenuOpen) return;

    const closeMenu = (event: MouseEvent) => {
      if (modelPickerRef.current && !modelPickerRef.current.contains(event.target as Node)) setIsModelMenuOpen(false);
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setIsModelMenuOpen(false);
    };
    document.addEventListener('mousedown', closeMenu);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeMenu);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isModelMenuOpen]);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    setFiles((current) => {
      const uniqueFiles = Array.from(incoming).filter((file) =>
        !current.some((existing) => existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified),
      );
      return [...current, ...uniqueFiles];
    });
  }, []);

  const handleDrop = (event: DragEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim() && files.length === 0) return;

    onSendMessage({ message: message.trim(), files, effort });
    setMessage('');
    setFiles([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const hasContent = Boolean(message.trim() || files.length);

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
      <div className="cindi-chat-files" aria-label="Attached files">
        {files.map((file, index) => (
          <div className="cindi-chat-file" key={`${file.name}-${file.size}-${file.lastModified}-${index}`}>
            <FileText aria-hidden="true" size={16} />
            <span className="cindi-chat-file__name" title={file.name}>{file.name}</span>
            <span className="cindi-chat-file__size">{formatFileSize(file.size)}</span>
            <button
              type="button"
              className="cindi-chat-file__remove"
              aria-label={`Remove ${file.name}`}
              onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}
            >
              <X aria-hidden="true" size={14} />
            </button>
          </div>
        ))}
      </div>

      {isDragging && <div className="cindi-chat-drop-hint" aria-hidden="true">Drop files to attach</div>}

      <label htmlFor="cindi-chat-message" className="sr-only">Message {selectedModel}</label>
      <textarea
        id="cindi-chat-message"
        ref={textareaRef}
        className="cindi-chat-textarea"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Ask ${selectedModel} anything...`}
        rows={1}
      />

      <div className="cindi-chat-actions">
        <div className="cindi-chat-actions__left">
          <button
            type="button"
            className="cindi-chat-icon-button"
            aria-label="Attach files"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus aria-hidden="true" size={20} />
          </button>
          <input
            ref={fileInputRef}
            className="sr-only"
            type="file"
            multiple
            onChange={(event) => {
              if (event.target.files) addFiles(event.target.files);
              event.target.value = '';
            }}
            aria-label="Choose files to attach"
          />
          <label className="cindi-chat-effort">
            <span>Effort</span>
            <select aria-label="Reasoning effort" value={effort} onChange={(event) => setEffort(event.target.value as ModelEffort)}>
              <option value="Light">Light</option>
              <option value="Medium">Medium</option>
              <option value="Heavy">Heavy</option>
            </select>
            <ChevronDown aria-hidden="true" size={14} />
          </label>
        </div>

        <div className="cindi-chat-actions__right">
          <div className="cindi-chat-model-picker" ref={modelPickerRef}>
            <button
              type="button"
              className="cindi-chat-model-select"
              aria-haspopup="menu"
              aria-expanded={isModelMenuOpen}
              aria-controls="cindi-chat-model-menu"
              onClick={() => setIsModelMenuOpen((open) => !open)}
            >
              <span>{selectedModel}</span>
              <ChevronDown aria-hidden="true" size={15} className={isModelMenuOpen ? 'is-open' : ''} />
            </button>
            {isModelMenuOpen && (
              <div className="cindi-chat-model-menu" id="cindi-chat-model-menu" role="menu" aria-label="Choose a model">
                {(['Cindi', 'Scylla'] as const).map((model) => (
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={selectedModel === model}
                    className={`cindi-chat-model-menu__option${selectedModel === model ? ' is-selected' : ''}`}
                    key={model}
                    onClick={() => {
                      setSelectedModel(model);
                      setIsModelMenuOpen(false);
                    }}
                  >
                    <span className="cindi-chat-model-menu__name">{model}</span>
                  </button>
                ))}
                {UPCOMING_MODELS.map((model) => (
                  <button type="button" role="menuitem" className="cindi-chat-model-menu__option is-disabled" key={model} disabled>
                    <span className="cindi-chat-model-menu__name">{model}<span className="cindi-chat-model-menu__status">Coming soon</span></span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="cindi-chat-send" aria-label="Send message" disabled={!hasContent}>
            <ArrowUp aria-hidden="true" size={18} />
          </button>
        </div>
      </div>

      <p className="cindi-chat-disclaimer">Model responses will be connected when the model version is finalized.</p>
    </form>
  );
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** unitIndex)).toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
