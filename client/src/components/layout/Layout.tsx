import { useEffect, useRef, useState } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { KineticTypographyLoader } from '../ui/loading-animation';

const BOOT_SESSION_KEY = 'cindi.boot-sequence.played';

const navigation = [
  { label: 'Home', to: '/', end: true },
  { label: 'Product', to: '/product' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Security', to: '/security' },
  { label: 'About', to: '/about' },
];

function SiteNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="hero-header fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 text-black sm:px-8 sm:py-5">
      <Link to="/" className="logo-lockup focus-ring flex items-center gap-3 text-black" aria-label="Mainframe home" onClick={closeMenu}>
        <span className="text-[21px] tracking-tight sm:text-[26px]">Cindi®</span>
        <span aria-hidden="true" className="select-none text-[25px] leading-none sm:text-[30px]">✳︎</span>
      </Link>

      <nav className="hidden items-center text-[23px] md:flex" aria-label="Main navigation">
        {navigation.map(({ label, to, end }, index) => (
          <span key={to}>
            <NavLink to={to} end={end} className={({ isActive }) => `focus-ring transition-opacity hover:opacity-60 ${isActive ? 'underline underline-offset-4' : ''}`}>
              {label}
            </NavLink>
            {index < navigation.length - 1 && <span>, </span>}
          </span>
        ))}
      </nav>

      <div className="hidden items-center gap-5 md:flex">
        <NavLink to="/contact" className={({ isActive }) => `focus-ring text-[23px] underline underline-offset-2 transition-opacity hover:opacity-60 ${isActive ? 'opacity-60' : ''}`}>
          Get in touch
        </NavLink>
        <NavLink to="/talk" className={({ isActive }) => `focus-ring text-[23px] underline underline-offset-2 transition-opacity hover:opacity-60 ${isActive ? 'opacity-60' : ''}`}>
          Let’s talk
        </NavLink>
      </div>

      <button
        ref={toggleRef}
        type="button"
        className="focus-ring relative z-40 flex flex-col gap-[5px] p-2 md:hidden"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className={`hamburger-bar ${menuOpen ? 'hamburger-top-open' : ''}`} />
        <span className={`hamburger-bar ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`hamburger-bar ${menuOpen ? 'hamburger-bottom-open' : ''}`} />
      </button>

      <nav
        id="mobile-navigation"
        className={`mobile-overlay fixed inset-0 z-[9] flex flex-col justify-center gap-8 bg-white/95 px-8 backdrop-blur-sm md:hidden ${menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {navigation.map(({ label, to, end }) => (
          <NavLink key={to} to={to} end={end} onClick={closeMenu} tabIndex={menuOpen ? 0 : -1} className={({ isActive }) => `focus-ring text-[32px] font-medium ${isActive ? 'underline underline-offset-4' : ''}`}>
            {label}
          </NavLink>
        ))}
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
          <NavLink to="/contact" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1} className={({ isActive }) => `focus-ring w-fit text-[26px] underline underline-offset-2 ${isActive ? 'opacity-60' : ''}`}>
            Get in touch
          </NavLink>
          <NavLink to="/talk" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1} className={({ isActive }) => `focus-ring w-fit text-[26px] underline underline-offset-2 ${isActive ? 'opacity-60' : ''}`}>
            Let’s talk
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="cindi-site-footer" data-scroll-section>
      <div className="cindi-site-footer__inner">
        <Link to="/" className="cindi-wordmark cindi-site-brand" aria-label="Cindi home">
          CINDI<span className="cindi-wordmark__mark" aria-hidden="true">C</span>
        </Link>
        <p className="cindi-type-small cindi-site-footer__note">A capable assistant. Clear about every action.</p>
        <nav className="cindi-footer-links" aria-label="Footer navigation">
          <Link to="/security">Security</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
      <p className="cindi-type-caption cindi-site-footer__copyright">© {new Date().getFullYear()} Cindi. Product details are being finalized.</p>
    </footer>
  );
}

export default function Layout() {
  const location = useLocation();
  const [shouldPlayBoot] = useState(() => {
    try {
      return window.sessionStorage.getItem(BOOT_SESSION_KEY) !== 'true';
    } catch {
      return false;
    }
  });
  const [isBooting, setIsBooting] = useState(shouldPlayBoot);

  useEffect(() => {
    if (!shouldPlayBoot) return;
    try {
      window.sessionStorage.setItem(BOOT_SESSION_KEY, 'true');
    } catch {
      // The sequence still plays if session storage is unavailable.
    }
  }, [shouldPlayBoot]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const scroll = new LocomotiveScroll({
      lenisOptions: { smoothWheel: true, duration: 1.1 },
    });
    scroll.scrollTo(0, { immediate: true });
    const refreshFrame = window.requestAnimationFrame(() => scroll.resize());

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      scroll.destroy();
    };
  }, [location.pathname]);

  return (
    <div className={`cindi-site${isBooting ? ' cindi-site--booting' : ''}`} data-scroll-container>
      <SiteNavigation />
      <div className="cindi-route-content" style={{ paddingTop: location.pathname === '/' || location.pathname === '/talk' ? 0 : '5rem' }}>
        <Outlet />
      </div>
      {location.pathname !== '/talk' && <SiteFooter />}
      <KineticTypographyLoader shouldPlay={shouldPlayBoot} onComplete={() => setIsBooting(false)} />
    </div>
  );
}
