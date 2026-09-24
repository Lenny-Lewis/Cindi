import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

const WORDS = ['LOADING', 'ASSEMBLING', 'FINALIZING'];
const STEP_MS = 750;
const FINAL_WORD_HOLD_MS = 180;
const EXIT_MS = 400;
const REDUCED_EXIT_MS = 180;

type KineticTypographyLoaderProps = {
  shouldPlay: boolean;
  onComplete: () => void;
};

type CharacterTransform = {
  from: string;
  to: string;
};

function randomTransform() {
  const x = (Math.random() - 0.5) * 800;
  const y = (Math.random() - 0.5) * 800;
  const z = (Math.random() - 0.5) * 800;
  const rotateX = (Math.random() - 0.5) * 360;
  const rotateY = (Math.random() - 0.5) * 360;
  return `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

export const KineticTypographyLoader = ({ shouldPlay, onComplete }: KineticTypographyLoaderProps) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(!shouldPlay);
  const onCompleteRef = useRef(onComplete);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const word = WORDS[wordIndex];
  const transforms = useMemo<CharacterTransform[]>(
    () => word.split('').map(() => ({ from: randomTransform(), to: randomTransform() })),
    [word],
  );

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(query.matches);
    updatePreference();
    query.addEventListener('change', updatePreference);
    return () => query.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!shouldPlay || isDone) return;

    let exitTimer: number;
    let completeTimer: number;

    if (prefersReducedMotion) {
      exitTimer = window.setTimeout(() => setIsExiting(true), 80);
      completeTimer = window.setTimeout(() => {
        setIsDone(true);
        onCompleteRef.current();
      }, 80 + REDUCED_EXIT_MS);
    } else {
      const wordTimer = window.setInterval(() => {
        setWordIndex((current) => Math.min(current + 1, WORDS.length - 1));
      }, STEP_MS);
      exitTimer = window.setTimeout(() => {
        window.clearInterval(wordTimer);
        setIsExiting(true);
      }, STEP_MS * WORDS.length + FINAL_WORD_HOLD_MS);
      completeTimer = window.setTimeout(() => {
        setIsDone(true);
        onCompleteRef.current();
      }, STEP_MS * WORDS.length + FINAL_WORD_HOLD_MS + EXIT_MS);

      return () => {
        window.clearInterval(wordTimer);
        window.clearTimeout(exitTimer);
        window.clearTimeout(completeTimer);
      };
    }

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
    };
  }, [isDone, prefersReducedMotion, shouldPlay]);

  if (!shouldPlay || isDone) return null;

  return (
    <div
      className={`loader-container${isExiting ? ' loader-container--exiting' : ''}${prefersReducedMotion ? ' loader-container--reduced' : ''}`}
      role="status"
      aria-label="Loading Cindi"
    >
      <h1 className={`loader-word${prefersReducedMotion ? ' loader-word--reduced' : ''}`} aria-hidden="true">
        {prefersReducedMotion ? 'LOADING' : word.split('').map((char, index) => (
          <span
            className="char"
            key={`${word}-${index}`}
            style={{
              '--transform-from': transforms[index].from,
              '--transform-to': transforms[index].to,
              animationDelay: `${index * 24}ms, ${430 + index * 10}ms`,
            } as CSSProperties}
          >
            {char}
          </span>
        ))}
      </h1>

      <span className="sr-only">Initializing Cindi</span>
    </div>
  );
};
