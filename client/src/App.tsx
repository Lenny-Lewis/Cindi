import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import ProductPage from './pages/ProductPage';
import SecurityPage from './pages/SecurityPage';
import TalkPage from './pages/TalkPage';

function NotFoundPage() {
  return (
    <main className="cindi-page cindi-not-found" data-scroll-section>
      <div className="cindi-page-container cindi-page-container--narrow">
        <p className="cindi-page-eyebrow">404 · Not found</p>
        <h1 className="cindi-type-display cindi-page-title">This page isn’t here.</h1>
        <Link className="cindi-btn cindi-btn--primary" to="/">Return home</Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="talk" element={<TalkPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
