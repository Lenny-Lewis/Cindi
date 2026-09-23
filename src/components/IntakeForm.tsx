import { useRef, useState, type DragEvent, type FormEvent } from 'react';

const EMAIL = 'hello@mainframe.co';

export default function IntakeForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [project, setProject] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('');

  const addFiles = (incoming: FileList | File[]) => {
    const nextFiles = Array.from(incoming);
    setFiles((current) => [...current, ...nextFiles.filter((file) => !current.some((existing) => existing.name === file.name && existing.size === file.size))]);
    setStatus('');
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = [project.trim(), files.length ? `\nFiles to attach: ${files.map((file) => file.name).join(', ')}` : ''].join('');
    const subject = encodeURIComponent('A project for Mainframe');
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;
    setStatus('Your email draft is ready. Attach the selected files before sending.');
  };

  return (
    <section id="intake" aria-labelledby="intake-heading" className="intake-section relative z-[1] px-5 py-20 sm:px-8 sm:py-28 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 grid gap-5 sm:mb-16 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p data-scroll data-scroll-speed="-0.2" className="mb-4 text-sm uppercase tracking-[0.14em] text-black/55">A good place to start</p>
            <h2 id="intake-heading" data-scroll data-scroll-speed="-0.1" className="max-w-3xl text-4xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Tell us what you&apos;re thinking.
            </h2>
          </div>
          <p className="max-w-xs text-base leading-relaxed text-black/65 sm:text-lg">A little context goes a long way. We&apos;ll take it from here.</p>
        </div>

        <form onSubmit={handleSubmit} className="border-t border-black/20">
          <label htmlFor="project-description" className="sr-only">Tell me about your project</label>
          <textarea
            id="project-description"
            required
            value={project}
            onChange={(event) => setProject(event.target.value)}
            placeholder="Tell me about your project..."
            rows={5}
            className="intake-textarea w-full resize-y border-0 border-b border-black/20 bg-transparent py-6 text-xl leading-relaxed text-black placeholder:text-black/40 sm:py-8 sm:text-2xl"
          />

          <div
            onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              const nextTarget = event.relatedTarget;
              if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={`my-6 flex min-h-24 flex-col items-start justify-center gap-3 border border-dashed px-5 py-5 transition-colors sm:my-8 sm:flex-row sm:items-center sm:justify-between sm:px-7 ${isDragging ? 'border-black bg-black/[0.04]' : 'border-black/25'}`}
          >
            <div>
              <p className="text-base">Have a brief or some references?</p>
              <p className="mt-1 text-sm text-black/55">Drop files here or choose them from your device.</p>
            </div>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="intake-secondary-button shrink-0 rounded-full border border-black/30 px-5 py-2 text-sm transition-colors hover:bg-black hover:text-white">
              Choose files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="sr-only"
              onChange={(event) => { if (event.target.files) addFiles(event.target.files); event.target.value = ''; }}
              aria-label="Choose project files to attach"
            />
          </div>

          {files.length > 0 && (
            <ul aria-label="Selected files" className="-mt-3 mb-6 flex flex-wrap gap-2 sm:-mt-4 sm:mb-8">
              {files.map((file, index) => (
                <li key={`${file.name}-${file.size}-${index}`} className="inline-flex items-center gap-2 rounded-full bg-black/[0.06] px-3 py-1.5 text-sm">
                  <span className="max-w-[15rem] truncate">{file.name}</span>
                  <button type="button" onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))} aria-label={`Remove ${file.name}`} className="rounded-full px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">×</button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-xl text-sm leading-relaxed text-black/55">Files are listed in your email draft for reference. Please attach them before sending.</p>
            <button type="submit" className="intake-send-button inline-flex items-center gap-5 rounded-full bg-black px-7 py-3 text-base text-white transition-colors hover:bg-black/75">
              Send your note <span aria-hidden="true">↗</span>
            </button>
          </div>
          <p role="status" aria-live="polite" className="mt-4 min-h-6 text-sm text-black/65">{status}</p>
        </form>
      </div>
    </section>
  );
}
