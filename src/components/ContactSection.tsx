import { Section } from "./Section";
import { contactLinks, email } from "@/data/contact";

export const ContactBody = () => (
  <>
    <p className="font-script text-4xl leading-tight md:text-5xl">Dear friend,</p>
    <div className="mt-5 max-w-[46ch] space-y-3 font-serif text-xl leading-relaxed md:text-2xl">
      <p>Thank you for visiting my digital home.</p>
      <p>
        I'm open to work and research opportunities, collaborations, and conversations. Please contact me through:
      </p>
    </div>
    <a
      href={`mailto:${email}`}
      className="link-card mt-7 block font-display font-bold tracking-[-0.01em] leading-none text-[clamp(1.4rem,5.2vw,3.2rem)] break-all sm:break-normal"
    >
      {email}
    </a>
    <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold">
      {contactLinks.map((link) => (
        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="link-card">
          {link.label}
        </a>
      ))}
    </div>
    <div className="mt-10 border-t border-card-foreground/25 pt-5">
      <p className="font-script text-3xl leading-tight">Warmly, Thu</p>
      <p className="mt-1 font-serif text-base text-card-foreground/75">Cảm ơn bạn đã ghé thăm.</p>
    </div>
  </>
);

export const ContactSection = () => (
  <Section id="contact" title="Contact">
    <ContactBody />
  </Section>
);
