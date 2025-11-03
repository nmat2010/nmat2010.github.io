export const initConsoleMessages = () => {
  // Only run in browser
  if (typeof window === "undefined") return;

  const styles = {
    title:
      "color: #e94560; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(233, 69, 96, 0.3);",
    subtitle: "color: #0f4c75; font-size: 16px; font-weight: bold;",
    normal: "color: #666; font-size: 14px;",
    code: "background: #f5f5f5; color: #e94560; padding: 2px 6px; border-radius: 3px; font-family: monospace;",
    link: "color: #0f4c75; font-size: 14px; font-weight: bold;",
    emoji: "font-size: 20px;",
  };

  console.clear();

  console.log("%c👋 Hello, fellow developer!", styles.title);
  console.log(
    "%cI see you're curious about how this site works. I like you already!",
    styles.normal
  );
  console.log("");

  console.log("%c🔍 What you're looking at:", styles.subtitle);
  console.log("%c├─ Built with React + TypeScript + Vite", styles.normal);
  console.log("%c├─ Styled with Tailwind CSS + Shadcn UI", styles.normal);
  console.log("%c├─ Animated with Framer Motion", styles.normal);
  console.log("%c├─ 3D Globe powered by Three.js + React Three Fiber", styles.normal);
  console.log("%c└─ Deployed with love and lots of coffee ☕", styles.normal);
  console.log("");

  console.log("%c🎮 Try This:", styles.subtitle);
  console.log(
    "%cType the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A",
    styles.code
  );
  console.log("%cUnlock secret Vietnamese recipes! 🍜", styles.normal);
  console.log("");

  console.log("%c💡 Fun Facts:", styles.subtitle);
  console.log(
    "%c• This portfolio has more easter eggs than a chocolate factory 🥚",
    styles.normal
  );
  console.log(
    "%c• I debug with console.log() just like you (we all do, don't lie) 😄",
    styles.normal
  );
  console.log(
    "%c• Vietnamese coffee has more caffeine than your average energy drink",
    styles.normal
  );
  console.log(
    "%c• I've spent more time centering divs than I care to admit",
    styles.normal
  );
  console.log("");

  console.log("%c🚀 Interested in collaborating?", styles.subtitle);
  console.log(
    "%cI'm always open to interesting projects, research opportunities, or just chatting about AI, robotics, and the future of tech!",
    styles.normal
  );
  console.log("");

  console.log("%c📧 Contact me:", styles.link);
  console.log("%cEmail: your.email@example.com", styles.normal);
  console.log("%cLinkedIn: /in/your-linkedin", styles.normal);
  console.log("%cGitHub: @yourusername", styles.normal);
  console.log("");

  console.log(
    "%c🎨 P.S. If you're reading this, you might enjoy this:",
    styles.subtitle
  );
  console.log("%c╔═══════════════════════════════════════╗", styles.normal);
  console.log("%c║   while (!succeed) {                  ║", styles.code);
  console.log("%c║       tryAgain();                     ║", styles.code);
  console.log("%c║       if (dead) break;                ║", styles.code);
  console.log("%c║   }                                   ║", styles.code);
  console.log("%c╚═══════════════════════════════════════╝", styles.normal);
  console.log("");

  console.log(
    "%c✨ Made with passion in Stony Brook, NY 🇺🇸 by way of Vietnam 🇻🇳",
    styles.emoji
  );
  console.log("");

  // Fun interactive function in console
  (window as any).hireMe = () => {
    console.log("%c🎉 Great choice!", styles.title);
    console.log(
      "%cLet's build something amazing together!",
      styles.subtitle
    );
    console.log("%cReach out at: your.email@example.com", styles.link);
    return "👍 You won't regret it!";
  };

  (window as any).vietnameseRecipe = () => {
    console.log("%c🍜 Here's a quick Phở recipe:", styles.subtitle);
    console.log("%c1. Boil chicken and water", styles.normal);
    console.log("%c2. Add star anise, cinnamon, ginger", styles.normal);
    console.log("%c3. Simmer for 2 hours", styles.normal);
    console.log("%c4. Serve with noodles and fresh herbs", styles.normal);
    console.log(
      "%cOr... just use the Konami code for more! ↑↑↓↓←→←→BA",
      styles.code
    );
    return "🍲 Enjoy!";
  };

  console.log("%cTry typing: %chireMe()%c or %cvietnameseRecipe()",
    styles.normal,
    styles.code,
    styles.normal,
    styles.code
  );
};
