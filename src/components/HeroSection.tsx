import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import profileImg from "@/assets/profile.jpeg";

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

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left side - Name and intro with Vietnamese motifs */}
          <div className="space-y-8">
            {/* Vietnamese decorative element - Lotus flower motif */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/30 to-secondary/30 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-accent/20 to-secondary/20 animate-pulse delay-100"></div>
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-accent/10 to-secondary/10 animate-pulse delay-200"></div>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-glow-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-secondary animate-glow-pulse" style={{ animationDelay: '100ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-accent animate-glow-pulse" style={{ animationDelay: '200ms' }}></div>
              </div>
            </div>

            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white leading-none tracking-tight">
              Thu Nguyen
            </h1>

            <div className="relative">
              <p className="text-xl md:text-2xl text-white/90 font-light">
                Từ Hà Nội đến Stony Brook
              </p>
              <p className="text-lg md:text-xl text-white/60 mt-1">
                From Hanoi to Stony Brook
              </p>
              {/* Vietnamese wave pattern */}
              <div className="absolute -bottom-2 left-0 w-24 h-0.5 bg-gradient-to-r from-accent via-secondary to-transparent"></div>
            </div>

            <p className="text-lg text-white/80 max-w-xl leading-relaxed">
              Building AI systems that preserve human stories and amplify human
              potential, not replace it.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="group px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-[var(--shadow-glow)] relative overflow-hidden"
              >
                <span className="relative z-10">View My Work</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              </a>
              <a
                href="#contact"
                className="px-8 py-4 border-2 border-white/20 hover:border-accent text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-[var(--shadow-soft)]"
              >
                Get in Touch
              </a>
            </div>
          </div>

          {/* Right side - Profile picture with Vietnamese-inspired decorative elements */}
          <div className="relative flex justify-center items-center">
            <div className="relative">
              {/* Vietnamese bamboo-inspired circular patterns */}
              <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full border-2 border-accent/20 animate-float"></div>
              <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full border border-secondary/30 animate-float" style={{ animationDelay: '1s' }}></div>
              
              <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full border-2 border-secondary/20 animate-float" style={{ animationDelay: '2s' }}></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full border border-accent/30 animate-float" style={{ animationDelay: '3s' }}></div>

              {/* Profile image with lotus petal frame effect */}
              <div className="relative z-10">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/30 via-secondary/20 to-transparent blur-2xl"></div>
                <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-accent/30 shadow-[var(--shadow-glow)]">
                  <img
                    src={profileImg}
                    alt="Thu Nguyen"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Vietnamese star/flower pattern orbits */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 -z-10">
                <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-accent/20" strokeDasharray="2,4" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-secondary/20" strokeDasharray="3,3" />
                </svg>
              </div>
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
