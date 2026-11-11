import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Download, ExternalLink, X } from "lucide-react";
import { resumeFileName, resumeUrl } from "@/data/contact";

/** Phones and browsers without a built-in PDF viewer can't show the file inline, so they get the two buttons instead. */
const canEmbed = () => {
  if (typeof navigator === "undefined") return true;
  if ((navigator as Navigator & { pdfViewerEnabled?: boolean }).pdfViewerEnabled === false) return false;
  return !(window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 768);
};

const button =
  "flex items-center gap-2 rounded-md bg-card px-3 py-1.5 text-sm font-bold text-card-foreground hover:bg-lantern hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * The resume, read without leaving the site: the one PDF (`resumeUrl`) shown in a dialog, with Download and Open in new tab.
 * Every "resume" link in both modes opens this. It renders into <body> so it is never clipped or moved by the Play-mode
 * overlays it can be opened from.
 */
export const ResumeDialog = ({ onClose }: { onClose: () => void }) => {
  const close = useRef<HTMLButtonElement>(null);
  const inline = canEmbed();

  useEffect(() => close.current?.focus(), []);

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#2a1a0e]/60 p-2 sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      // keys pressed here are never game keys
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Escape") onClose();
      }}
      onKeyUp={(e) => e.stopPropagation()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Resume"
        className="flex max-h-[94vh] w-[min(96vw,56rem)] flex-col overflow-hidden rounded-lg bg-card text-card-foreground shadow-2xl"
        style={{ height: inline ? "94vh" : "auto" }}
      >
        <header className="flex flex-wrap items-center gap-2 bg-card-foreground px-3 py-2.5 text-card sm:px-4">
          <h2 className="mr-auto font-display text-xl font-bold tracking-wide">Resume</h2>
          <a href={resumeUrl} download={resumeFileName} className={button}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Download
          </a>
          <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={button}>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            <span className="max-sm:hidden">Open in new tab</span>
            <span className="sm:hidden">New tab</span>
          </a>
          <button
            ref={close}
            onClick={onClose}
            aria-label="Close resume"
            className="rounded-md bg-card p-1.5 text-card-foreground hover:bg-lantern hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        {inline ? (
          <iframe title="Resume (PDF)" src={`${resumeUrl}#view=FitH`} className="min-h-0 flex-1 border-0 bg-white" />
        ) : (
          <p className="p-6 font-serif text-lg leading-snug">
            Your browser can't show the PDF here. Use Download or Open in new tab above to read it.
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
};
