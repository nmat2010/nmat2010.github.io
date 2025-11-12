import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const codeSnippets = [
  {
    lines: [
      "def solve_problem():",
      "    passion = True",
      "    while passion:",
      "        learn()",
      "        build()",
      "        iterate()",
    ],
    language: "python",
  },
  {
    lines: [
      "const engineer = {",
      "  location: 'Saigon → NYC',",
      "  focus: 'AI & Robotics',",
      "  goal: 'Impact',",
      "};",
    ],
    language: "javascript",
  },
  {
    lines: [
      "// Research mindset",
      "while (curious) {",
      "  explore();",
      "  experiment();",
      "  innovate();",
      "}",
    ],
    language: "javascript",
  },
];

export const LiveCodingAnimation = () => {
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const snippet = codeSnippets[currentSnippet];

  useEffect(() => {
    // Reset when changing snippets
    if (currentLineIndex === 0 && currentCharIndex === 0) {
      setDisplayedLines([]);
    }

    // If we've completed all lines, wait and then move to next snippet
    if (currentLineIndex >= snippet.lines.length) {
      const timeout = setTimeout(() => {
        setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
        setDisplayedLines([]);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    const currentLine = snippet.lines[currentLineIndex];

    // Type characters
    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          if (newLines.length === currentLineIndex) {
            newLines.push("");
          }
          newLines[currentLineIndex] = currentLine.substring(
            0,
            currentCharIndex + 1
          );
          return newLines;
        });
        setCurrentCharIndex((prev) => prev + 1);
      }, 50); // Typing speed
      return () => clearTimeout(timeout);
    }

    // Move to next line
    if (currentCharIndex >= currentLine.length) {
      const timeout = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 200); // Pause between lines
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex, currentSnippet, snippet.lines]);

  return (
    <motion.div
      className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Terminal window */}
      <div className="rounded-lg border border-border bg-muted/30 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <div className="text-xs text-muted-foreground ml-4">
            {snippet.language} - engineer.{snippet.language === "python" ? "py" : "js"}
          </div>
        </div>

        {/* Code content */}
        <div className="p-6 font-mono text-sm min-h-[180px]">
          {displayedLines.map((line, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 mb-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Line number */}
              <span className="text-muted-foreground/40 select-none w-6 text-right">
                {index + 1}
              </span>

              {/* Code line with syntax highlighting hints */}
              <span className="text-foreground/90">
                {line.includes("def ") || line.includes("const ") || line.includes("while ") ? (
                  <span className="text-accent">{line}</span>
                ) : line.includes("//") ? (
                  <span className="text-muted-foreground italic">{line}</span>
                ) : (
                  <span>{line}</span>
                )}
                {index === displayedLines.length - 1 && (
                  <motion.span
                    className="inline-block w-2 h-4 bg-accent ml-1"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Snippet indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {codeSnippets.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSnippet ? "bg-accent w-6" : "bg-muted-foreground/30"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>

      {/* Floating accent elements */}
      <motion.div
        className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-accent/10 blur-xl"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-secondary/10 blur-xl"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      />
    </motion.div>
  );
};
