import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { FeedbackDialog } from "@/components/shared/FeedbackDialog";
import { Section } from "@/components/view/Section";
import { ContactBody } from "@/components/shared/ContactBody";

/** View mode's contact board: the letter, plus a way to leave a message without an email app. */
export const ContactSection = () => {
  const [open, setOpen] = useState(false);
  return (
    <Section id="contact" title="Contact">
      <ContactBody />
      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-lantern hover:text-white"
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          Leave a message
        </button>
        <p className="font-serif text-base text-card-foreground/75">An idea, a change, or just hello.</p>
      </div>
      {open && <FeedbackDialog context="view mode" onClose={() => setOpen(false)} />}
    </Section>
  );
};
