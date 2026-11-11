import { useState } from "react";
import { FeedbackDialog } from "./FeedbackDialog";

export const Footer = () => {
  const [feedback, setFeedback] = useState(false);
  return (
    <footer className="px-6 pb-10">
      <div className="max-w-5xl mx-auto pt-6 border-t border-border flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Thu Nguyen</p>
        <div className="flex items-center gap-6">
          <button onClick={() => setFeedback(true)} className="link-ink">
            Send feedback
          </button>
          <a href="#hero" className="link-ink">
            Back to top
          </a>
        </div>
      </div>
      {feedback && <FeedbackDialog context="view mode" onClose={() => setFeedback(false)} />}
    </footer>
  );
};
