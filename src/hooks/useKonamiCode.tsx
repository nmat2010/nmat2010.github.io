import { useEffect, useState, useCallback } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export const useKonamiCode = () => {
  const [success, setSuccess] = useState(false);
  const [keys, setKeys] = useState<string[]>([]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const newKeys = [...keys, event.key].slice(-KONAMI_CODE.length);
      setKeys(newKeys);

      if (newKeys.join(",") === KONAMI_CODE.join(",")) {
        setSuccess(true);
        setKeys([]);

        // Show notification
        console.log("🎉 Konami Code activated! Unlocking secret Vietnamese recipes...");
      }
    },
    [keys]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const reset = () => setSuccess(false);

  return { success, reset };
};
