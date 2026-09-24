import VisualPlaceholder from '../components/VisualPlaceholder';

export default function SecurityPage() {
  return (
    <main className="cindi-page cindi-page--security">
      <section className="cindi-page-intro" data-scroll-section>
        <div className="cindi-page-container cindi-page-container--narrow">
          <p className="cindi-page-eyebrow" data-scroll data-scroll-speed="-0.1">Security</p>
          <h1 className="cindi-type-display cindi-page-title cindi-reveal" data-scroll data-scroll-class="is-inview">Useful help, with your control intact.</h1>
          <p className="cindi-page-lede cindi-reveal" data-scroll data-scroll-class="is-inview">
            Device actions are designed to be explicit and bounded. Cindi should tell you what it plans to do and wait for your decision.
          </p>
        </div>
      </section>

      <section className="cindi-security-section" data-scroll-section>
        <div className="cindi-page-container cindi-security-grid">
          <div className="cindi-security-copy cindi-reveal" data-scroll data-scroll-class="is-inview">
            <p className="cindi-page-eyebrow">01 · Before an action</p>
            <h2 className="cindi-type-h1">How permissions work</h2>
            <p className="cindi-type-body cindi-page-copy">
              When a task needs to act on your computer, Cindi presents the action and asks you to confirm it first. You can review the request and decline it. Nothing is run just because it appeared in the conversation.
            </p>
          </div>
          <div className="cindi-security-visual cindi-reveal" data-scroll data-scroll-class="is-inview">
            <span className="cindi-page-orbit" aria-hidden="true" data-scroll data-scroll-speed="0.12" />
            <VisualPlaceholder label="Permission request UI example" />
          </div>
        </div>
      </section>

      <section className="cindi-security-section" data-scroll-section>
        <div className="cindi-page-container cindi-security-grid cindi-security-grid--reverse">
          <div className="cindi-security-copy cindi-reveal" data-scroll data-scroll-class="is-inview">
            <p className="cindi-page-eyebrow">02 · Defined boundaries</p>
            <h2 className="cindi-type-h1">What Cindi can—and can’t—do</h2>
            <p className="cindi-type-body cindi-page-copy">
              The local agent is limited to a defined set of permitted actions. It can run supported programs or carry out approved tasks; it does not have arbitrary shell access or unrestricted control of your computer. If an action is outside its permitted set, it cannot run it through the agent.
            </p>
          </div>
          <div className="cindi-security-boundary cindi-reveal" data-scroll data-scroll-class="is-inview" data-scroll-speed="0.08">
            <span className="cindi-security-boundary__label">Permission boundary</span>
            <span className="cindi-security-boundary__line" aria-hidden="true" />
            <span className="cindi-security-boundary__result">Only defined, approved actions can run</span>
          </div>
        </div>
      </section>

      <section className="cindi-security-section cindi-security-section--last" data-scroll-section>
        <div className="cindi-page-container cindi-page-container--narrow cindi-reveal" data-scroll data-scroll-class="is-inview">
          <p className="cindi-page-eyebrow">03 · Data handling</p>
          <h2 className="cindi-type-h1">Your data</h2>
          <p className="cindi-type-body cindi-page-copy">
            The local agent handles approved actions on your device. AI conversations and any business information you connect may also be processed by services needed to provide Cindi. We will publish the specific providers, storage, retention, and deletion details before launch; those details are not yet confirmed here.
          </p>
          <p className="cindi-security-disclosure">
            Data-handling policy details are to be confirmed before this page is treated as a complete privacy statement.
          </p>
        </div>
      </section>
    </main>
  );
}
