import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
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
    // { label: "Skills", id: "skills" },
    { label: "Projects", id: "projects" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-lg border-b border-border shadow-sm"
            : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-6 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-xl font-bold text-foreground hover:opacity-70 transition-opacity relative z-[1000] pointer-events-auto"
            >
              <img
                src="/logo-nav.svg"
                alt="Thu Nguyen"
                className="h-12 w-12 md:h-14 md:w-14"
              />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 relative z-[1000]">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors relative group pointer-events-auto"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
                </button>
              ))}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4 relative z-[1000]">
              <ThemeToggle />
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
              className="ml-auto flex items-center gap-2 px-6 py-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-full font-medium transition-all"
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
            {navLinks.map((link, index) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left text-2xl font-semibold text-foreground/80 hover:text-accent transition-all py-4 px-4 rounded-lg hover:bg-accent/5 border-b border-border/50"
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
