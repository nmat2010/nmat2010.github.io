export const Footer = () => (
  <footer className="px-6 pb-10">
    <div className="max-w-5xl mx-auto pt-6 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} Thu Nguyen</p>
      <a href="#hero" className="link-ink">
        Back to top
      </a>
    </div>
  </footer>
);
