import VisualPlaceholder from '../components/VisualPlaceholder';

const capabilities = [
  {
    number: '01',
    eyebrow: 'Less repetition',
    title: 'Daily task automation',
    copy: 'Cindi helps take routine work off your list. Describe the outcome you need, review the proposed steps, and let approved tasks move forward with clear status along the way.',
    visual: 'Screenshot: Daily task automation',
  },
  {
    number: '02',
    eyebrow: 'A clearer view',
    title: 'Business summaries and insights',
    copy: 'Bring connected business information into a concise summary. Cindi can highlight changes and useful patterns, then help you decide what to look at next.',
    visual: 'Screenshot: Business insights dashboard',
  },
  {
    number: '03',
    eyebrow: 'Ask in plain language',
    title: 'A conversational assistant',
    copy: 'Talk through a question or task instead of navigating a maze of controls. Cindi uses a language model to understand requests, ask for clarification, and explain the next step.',
    visual: 'Screenshot: Cindi conversation',
  },
  {
    number: '04',
    eyebrow: 'Your device, your approval',
    title: 'Actions on your computer',
    copy: 'A local agent can launch supported programs and perform permitted actions on your computer. Cindi shows what it intends to do and waits for your confirmation before it runs.',
    visual: 'Screenshot: Approved device action',
  },
];

export default function ProductPage() {
  return (
    <main className="cindi-page cindi-page--product">
      <section className="cindi-page-intro" data-scroll-section>
        <div className="cindi-page-container">
          <p className="cindi-page-eyebrow" data-scroll data-scroll-speed="-0.12">Product</p>
          <h1 className="cindi-type-display cindi-page-title cindi-reveal" data-scroll data-scroll-class="is-inview">
            From a clear request to useful action.
          </h1>
          <p className="cindi-page-lede cindi-reveal" data-scroll data-scroll-class="is-inview">
            Cindi brings conversation, business context, and carefully approved computer actions into one assistant.
          </p>
        </div>
      </section>

      {capabilities.map((capability, index) => (
        <section className="cindi-capability" data-scroll-section key={capability.number}>
          <div className={`cindi-page-container cindi-capability__grid ${index % 2 ? 'cindi-capability__grid--reverse' : ''}`}>
            <div className="cindi-capability__copy cindi-reveal" data-scroll data-scroll-class="is-inview">
              <span className="cindi-capability__number cindi-code">{capability.number}</span>
              <p className="cindi-page-eyebrow">{capability.eyebrow}</p>
              <h2 className="cindi-type-h1">{capability.title}</h2>
              <p className="cindi-type-body cindi-page-copy">{capability.copy}</p>
            </div>
            <div className="cindi-capability__visual cindi-reveal" data-scroll data-scroll-class="is-inview">
              <span className="cindi-page-orbit" aria-hidden="true" data-scroll data-scroll-speed="0.16" />
              <VisualPlaceholder label={capability.visual} />
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
