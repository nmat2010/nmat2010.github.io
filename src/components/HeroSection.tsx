import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import profileImg from "@/assets/profile.jpg";

export const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(233, 69, 96, 0.5)";
      ctx.strokeStyle = "rgba(233, 69, 96, 0.2)";

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToNext = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, hsl(var(--hero-gradient-start) / 0.9), hsl(var(--hero-gradient-end) / 0.95)), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="animate-fade-in-up">
            <div className="mb-4 text-accent font-medium flex items-center gap-2">
              <span className="inline-block w-12 h-0.5 bg-accent"></span>
              <span className="text-white/80">From Hanoi to Stony Brook</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-none">
              Thu Nguyen
            </h1>
            <div className="relative pl-6 border-l-4 border-accent/50 mb-8">
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                Building AI-powered solutions for social impact
              </p>
              <p className="text-lg text-white/70 mt-2">
                Computer Engineering Sophomore | 2× Hackathon Winner | Future AI/Robotics Researcher
              </p>
            </div>
            
            {/* Vietnamese decorative element */}
            <div className="flex items-center gap-3 mb-8 text-white/60">
              <span className="text-2xl">🏮</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse delay-75"></span>
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse delay-150"></span>
              </div>
              <span className="text-sm">Designing technology with humanity at heart</span>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() =>
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-3 bg-accent text-white rounded-full font-medium hover:shadow-[0_0_30px_hsl(var(--accent)/0.5)] transition-all hover:scale-105"
              >
                View My Work
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full font-medium hover:bg-white/20 transition-all hover:scale-105"
              >
                Get in Touch
              </button>
            </div>
          </div>

          {/* Right side - Profile image with Vietnamese-inspired decoration */}
          <div className="relative animate-scale-in">
            {/* Decorative elements inspired by Vietnamese patterns */}
            <div className="absolute -top-6 -right-6 w-32 h-32 border-4 border-accent/30 rounded-full"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 border-4 border-secondary/30 rounded-full"></div>
            
            {/* Main image container */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent to-secondary rounded-2xl opacity-20 blur-2xl animate-glow-pulse" />
              <div className="relative rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
                <img
                  src={profileImg}
                  alt="Thu Nguyen - Computer Engineering Student"
                  className="w-full h-auto"
                />
                {/* Subtle overlay with Vietnamese-inspired pattern */}
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-secondary/10 pointer-events-none"></div>
              </div>
            </div>

            {/* Additional decorative accent */}
            <div className="absolute top-1/2 -right-8 text-6xl opacity-20 animate-float">
              ✨
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 hover:text-white transition-all animate-float"
        aria-label="Scroll to next section"
      >
        <ChevronDown className="h-8 w-8" />
      </button>
    </section>
  );
};
