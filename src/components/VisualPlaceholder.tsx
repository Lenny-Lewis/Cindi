type VisualPlaceholderProps = {
  label: string;
  className?: string;
};

export default function VisualPlaceholder({ label, className = '' }: VisualPlaceholderProps) {
  return (
    <div className={`site-visual-placeholder ${className}`} role="img" aria-label={`Placeholder visual: ${label}`}>
      <svg aria-hidden="true" className="site-placeholder-icon" viewBox="0 0 40 40" fill="none">
        <rect x="6.5" y="7.5" width="27" height="25" rx="4" stroke="currentColor" />
        <path d="M12 14h16M12 19h10M12 25h5m5 0h6" stroke="currentColor" strokeLinecap="round" />
      </svg>
      <span className="site-visual-placeholder__label">[ {label} ]</span>
      <span className="site-visual-placeholder__hint">Placeholder for future product imagery</span>
    </div>
  );
}
