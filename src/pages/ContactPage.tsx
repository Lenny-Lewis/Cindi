import IntakeForm from '../components/IntakeForm';

export default function ContactPage() {
  return (
    <main className="cindi-page cindi-page--contact">
      <section className="cindi-page-intro cindi-page-intro--compact" data-scroll-section>
        <div className="cindi-page-container cindi-page-container--narrow">
          <p className="cindi-page-eyebrow" data-scroll data-scroll-speed="-0.1">Contact</p>
          <h1 className="cindi-type-display cindi-page-title cindi-reveal" data-scroll data-scroll-class="is-inview">Start a conversation.</h1>
          <p className="cindi-page-lede cindi-reveal" data-scroll data-scroll-class="is-inview">
            Tell us what you’re exploring, ask a question, or share a little about your team.
          </p>
        </div>
      </section>
      <IntakeForm variant="page" />
    </main>
  );
}
