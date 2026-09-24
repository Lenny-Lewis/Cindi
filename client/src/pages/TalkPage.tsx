import { lazy, Suspense, useEffect, useState } from 'react';
import VisualPlaceholder from '../components/VisualPlaceholder';

const Spline = lazy(() => import('@splinetool/react-spline'));
const SCENE_URL = 'https://prod.spline.design/oZqt8PQLGrwglf6H/scene.splinecode';
const TALK_MESSAGE = 'Talk to Cindi';

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

function useTypewriterThenErase(text: string, reducedMotion: boolean, speed = 38, holdDuration = 5000, startDelay = 600) {
  const [displayed, setDisplayed] = useState(reducedMotion ? text : '');
  const [cursorVisible, setCursorVisible] = useState(!reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayed(text);
      setCursorVisible(false);
      return;
    }

    let index = 0;
    let typeInterval: number | undefined;
    let eraseInterval: number | undefined;
    let holdTimeout: number | undefined;

    const startTimeout = window.setTimeout(() => {
      typeInterval = window.setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));

        if (index >= text.length) {
          if (typeInterval !== undefined) window.clearInterval(typeInterval);
          setCursorVisible(false);
          holdTimeout = window.setTimeout(() => {
            setCursorVisible(true);
            eraseInterval = window.setInterval(() => {
              index -= 1;
              setDisplayed(text.slice(0, index));
              if (index <= 0) {
                if (eraseInterval !== undefined) window.clearInterval(eraseInterval);
                setCursorVisible(false);
              }
            }, speed);
          }, holdDuration);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(startTimeout);
      if (typeInterval !== undefined) window.clearInterval(typeInterval);
      if (holdTimeout !== undefined) window.clearTimeout(holdTimeout);
      if (eraseInterval !== undefined) window.clearInterval(eraseInterval);
    };
  }, [holdDuration, reducedMotion, speed, startDelay, text]);

  return { displayed, cursorVisible };
}

export default function TalkPage() {
  const reducedMotion = usePrefersReducedMotion();
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const { displayed, cursorVisible } = useTypewriterThenErase(TALK_MESSAGE, reducedMotion);

  return (
    <main className="cindi-page cindi-page--talk">
      <section className="cindi-talk-section" data-scroll-section>
        <div className="cindi-talk-scene-frame" aria-label="Interactive Cindi scene">
          {reducedMotion ? (
            <VisualPlaceholder label="Interactive Cindi scene (disabled by reduced-motion preference)" className="cindi-talk-reduced-placeholder" />
          ) : (
            <Suspense fallback={<VisualPlaceholder label="Loading interactive Cindi scene" className="cindi-talk-reduced-placeholder" />}>
              <Spline
                scene={SCENE_URL}
                className="cindi-talk-spline"
                style={{ width: '100%', height: '100%' }}
              />
            </Suspense>
          )}
        </div>
        <p
          className={`cindi-talk-message${reducedMotion ? ' is-inview' : ''}`}
          data-scroll
          data-scroll-class="is-inview"
          data-scroll-repeat="true"
        >
          <span className="sr-only">{TALK_MESSAGE}</span>
          <span aria-hidden="true">{displayed}</span>
          {cursorVisible && <span className="typewriter-cursor cindi-talk-cursor" aria-hidden="true" />}
        </p>
      </section>

      <div className="cindi-talk-controls" role="group" aria-label="Voice controls">
        <button
          type="button"
          className={`cindi-talk-control${isMicMuted ? ' is-muted' : ' is-active'}`}
          aria-label={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
          aria-pressed={!isMicMuted}
          title={isMicMuted ? 'Microphone muted' : 'Microphone listening'}
          onClick={() => setIsMicMuted((muted) => !muted)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2.5" width="6" height="12" rx="3" />
            <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.5M9 21.5h6" />
            {isMicMuted && <path d="m4 4 16 16" />}
          </svg>
        </button>
        <button
          type="button"
          className={`cindi-talk-control cindi-talk-control--speaker${isSpeakerMuted ? ' is-muted' : ' is-active'}`}
          aria-label={isSpeakerMuted ? 'Unmute Cindi’s voice' : 'Mute Cindi’s voice'}
          aria-pressed={!isSpeakerMuted}
          title={isSpeakerMuted ? 'Cindi’s voice muted' : 'Cindi’s voice audible'}
          onClick={() => setIsSpeakerMuted((muted) => !muted)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
            {isSpeakerMuted ? <path d="m17 9 5 6m0-6-5 6" /> : <><path d="M16 9a4 4 0 0 1 0 6" /><path d="M18.5 6.5a7.5 7.5 0 0 1 0 11" /></>}
          </svg>
        </button>
      </div>
    </main>
  );
}
