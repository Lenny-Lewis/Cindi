import VisualPlaceholder from '../components/VisualPlaceholder';

export default function AboutPage() {
  return (
    <main className="cindi-page cindi-page--about">
      <section className="cindi-about-section" data-scroll-section>
        <div className="cindi-page-container cindi-about-grid">
          <div className="cindi-about-copy" data-scroll data-scroll-class="is-inview">
            <p className="cindi-page-eyebrow">About Cindi</p>
            <h1 className="cindi-type-display cindi-page-title">A more considered way to work with AI.</h1>
            <p className="cindi-type-body cindi-page-copy">
              Cindi is being built by a team focused on making capable AI useful in everyday work—while keeping people informed and in control of what happens on their devices.
            </p>
            <p className="cindi-type-body cindi-page-copy">
              This is a placeholder for the story behind the project: what inspired it, who is building it, and the principles guiding the work. We’ll add the team’s details here.
            </p>
          </div>
          <div className="cindi-about-visual" data-scroll data-scroll-speed="0.08">
            <VisualPlaceholder label="Cindi team or founder portrait" />
          </div>
        </div>
      </section>
    </main>
  );
}
