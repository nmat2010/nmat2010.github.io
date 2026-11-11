import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation = ({ onPlay, onHome }: { onPlay: () => void; onHome: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // Close mobile menu on scroll
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "About", id: "about" },
    { label: "Experience", id: "experience" },
    { label: "Projects", id: "projects" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 text-foreground ${
          isScrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[75rem] mx-auto py-4 px-6 relative z-10">
          <div className="flex items-center justify-between">
            <a href="#hero" className="text-lg font-bold tracking-tight text-foreground relative z-[1000]">
              Thu Nguyen
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 relative z-[1000]">
              <button onClick={onHome} className="text-sm font-medium text-foreground hover:text-accent transition-colors pointer-events-auto link-ink">
                Homepage
              </button>
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm font-medium text-foreground hover:text-accent transition-colors pointer-events-auto link-ink"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={onPlay}
                className="rounded-md bg-primary px-3.5 py-1.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-lantern hover:text-white"
              >
                My little Saigon alley
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4 relative z-[1000]">
              <button
                onClick={onPlay}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground"
              >
                Play
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                className="pointer-events-auto relative z-[1001]"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay - Outside nav for proper positioning */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-background z-[1000] animate-fade-in overflow-y-auto"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {/* Nav bar spacer */}
          <div className="h-[80px]" />

          {/* Close button at top */}
          <div className="px-6 pb-4">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="ml-auto flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-sm font-medium transition-all"
            >
              <X className="w-5 h-5" />
              Close Menu
            </button>
          </div>

          {/* Menu content */}
          <div
            className="px-6 py-4 space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onHome();
              }}
              className="block w-full text-left text-4xl font-bold tracking-tight text-foreground hover:text-accent transition-colors py-4 border-b border-border"
            >
              Homepage
            </button>
            {navLinks.map((link, index) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left text-4xl font-bold tracking-tight text-foreground hover:text-accent transition-colors py-4 border-b border-border"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
