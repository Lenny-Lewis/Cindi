import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: 'Price TBD',
    description: 'A simple way to get started with Cindi.',
    features: ['Conversational task support', 'A starter allowance for routine tasks', 'Approval before device actions'],
    action: 'Get started',
    featured: false,
  },
  {
    name: 'Pro',
    price: 'Price TBD',
    description: 'More room for everyday work and deeper analysis.',
    features: ['Expanded task allowance', 'Business summaries and insights', 'Supported computer actions with approval'],
    action: 'Talk to us',
    featured: true,
  },
  {
    name: 'Business',
    price: 'Let’s talk',
    description: 'A plan shaped around your team and workflows.',
    features: ['Team and workspace requirements review', 'Usage and support options to be defined', 'Security and deployment discussion'],
    action: 'Contact the team',
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <main className="cindi-page cindi-page--pricing">
      <section className="cindi-page-intro" data-scroll-section>
        <div className="cindi-page-container cindi-page-container--narrow">
          <p className="cindi-page-eyebrow" data-scroll data-scroll-speed="-0.12">Pricing</p>
          <h1 className="cindi-type-display cindi-page-title cindi-reveal" data-scroll data-scroll-class="is-inview">Useful plans. Clear terms.</h1>
          <p className="cindi-page-lede cindi-reveal" data-scroll data-scroll-class="is-inview">
            Choose the level of support that fits your work. These tiers and prices are placeholders while packaging is finalized.
          </p>
        </div>
      </section>

      <section className="cindi-pricing-section" data-scroll-section aria-label="Plan comparison">
        <div className="cindi-page-container">
          <div className="cindi-pricing-grid">
            {plans.map((plan, index) => (
              <article
                className={`cindi-card cindi-pricing-card cindi-reveal ${plan.featured ? 'cindi-pricing-card--featured' : ''}`}
                data-scroll
                data-scroll-class="is-inview"
                data-scroll-speed={index === 1 ? '0.08' : '0'}
                key={plan.name}
              >
                <div className="cindi-pricing-card__top">
                  <div>
                    <p className="cindi-card__eyebrow">{plan.featured ? 'For focused work' : 'Cindi plan'}</p>
                    <h2 className="cindi-card__title">{plan.name}</h2>
                  </div>
                  {plan.featured && <span className="cindi-status" data-status="completed">Popular</span>}
                </div>
                <p className="cindi-pricing-card__price">{plan.price}</p>
                <p className="cindi-type-small cindi-pricing-card__description">{plan.description}</p>
                <ul className="cindi-pricing-card__features">
                  {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <Link className={`cindi-btn ${plan.featured ? 'cindi-btn--primary' : 'cindi-btn--secondary'} cindi-pricing-card__action`} to="/contact">
                  {plan.action}
                </Link>
              </article>
            ))}
          </div>
          <p className="cindi-type-caption cindi-pricing-note">All prices, usage allowances, and plan details are placeholders and will be confirmed before launch.</p>
        </div>
      </section>
    </main>
  );
}
