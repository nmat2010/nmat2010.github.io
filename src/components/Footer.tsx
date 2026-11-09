export const Footer = () => (
  <footer className="px-6 pb-10">
    <div className="max-w-5xl mx-auto pt-6 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} Thu Nguyen</p>
      <a href="#hero" className="link-ink">
        Back to top
      </a>
    </div>
    <p className="max-w-5xl mx-auto pt-3 text-xs text-muted-foreground">
      Puppy bark in the alley: recording by{" "}
      <a href="https://commons.wikimedia.org/wiki/File:Imbir_-_szczekni%C4%99cie.webm" className="link-ink" target="_blank" rel="noreferrer">
        Julo
      </a>
      , CC BY-SA 4.0, via Wikimedia Commons.
    </p>
  </footer>
);
