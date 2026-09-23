import { useEffect, useRef, useState } from 'react';
import IntakeForm from '../components/IntakeForm';
import SplineScene from '../components/SplineScene';

const EMAIL = 'hello@mainframe.co';
const message = 'Glad you stopped in. Good taste tends to find us. Now, what are we building?';

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    let index = 0;
    let interval: number | undefined;
    const delay = window.setTimeout(() => {
      interval = window.setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          if (interval !== undefined) window.clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(delay);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [speed, startDelay, text]);

  return { displayed, done };
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="4" y="1" width="7" height="8" rx="1" stroke="currentColor" />
      <path d="M8 10.5H2a1 1 0 0 1-1-1v-7" stroke="currentColor" />
    </svg>
  );
}

export default function HomePage() {
  const copyTimerRef = useRef<number | undefined>(undefined);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const { displayed, done } = useTypewriter(message);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActionsVisible(true);
      return;
    }
    const timer = window.setTimeout(() => setActionsVisible(true), 400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => () => {
    if (copyTimerRef.current !== undefined) window.clearTimeout(copyTimerRef.current);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopyStatus('Copied!');
    } catch {
      setCopyStatus('Copy failed. Email hello@mainframe.co');
    }
    if (copyTimerRef.current !== undefined) window.clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(() => setCopyStatus(''), 1800);
  };

  return (
    <main className="relative min-h-screen bg-white text-black">
      <section id="home" className="hero-section relative z-[1] flex h-screen flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0" data-scroll-section>
        <div className="hero-copy relative z-10 max-w-xl">
          <p className="intro-label pointer-events-none mb-5 select-none sm:mb-6">
            Hey there, meet A.R.I.A,<br />Mainframe&apos;s Adaptive Response Interface Agent
          </p>

          <p className="typewriter-copy mb-5 min-h-[54px] sm:mb-6">
            <span className="sr-only">{message}</span>
            <span aria-hidden="true">{displayed}</span>
            {!done && <span className="typewriter-cursor" aria-hidden="true" />}
          </p>

          <div className={`action-pills flex flex-wrap gap-y-1 ${actionsVisible ? 'action-pills-visible' : ''}`}>
            <a href="mailto:hello@mainframe.co?subject=An%20idea%20for%20Mainframe" className="action-pill action-pill-light">Pitch us an idea</a>
            <a href="#openings" className="action-pill action-pill-light">Come work here</a>
            <a href="mailto:hello@mainframe.co" className="action-pill action-pill-light">Send a brief hello</a>
            <a href="#studio" className="action-pill action-pill-light">See how we operate</a>
            <button type="button" onClick={copyEmail} aria-label={copyStatus === 'Copied!' ? 'Email address copied' : `Copy ${EMAIL} to clipboard`} className="action-pill action-pill-outline focus-ring">
              <span>{copyStatus || <>Reach us: <span className="underline underline-offset-1">{EMAIL}</span></>}</span>
              {copyStatus ? null : <CopyIcon />}
            </button>
          </div>
        </div>
      </section>

      <SplineScene />
      <IntakeForm />
    </main>
  );
}
