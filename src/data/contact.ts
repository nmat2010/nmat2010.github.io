export const email = "thunma2010@gmail.com";

/**
 * Where feedback from the site is sent. Create a free form at formspree.io (or deploy your own Cloudflare Worker that
 * accepts a JSON POST), paste its URL here, e.g. "https://formspree.io/f/abcdwxyz", and notes arrive without the visitor
 * needing an email app. Left empty, the feedback dialog falls back to composing an email.
 */
export const feedbackEndpoint = "https://formspree.io/f/mnpdazeo";

/** The one resume. It is compiled from resume/resume.tex on deploy; every resume link and viewer in both modes uses this. */
export const resumeUrl = "/resume.pdf";
export const resumeFileName = "Thu-Nguyen-Resume.pdf";

export const contactLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/thu-tech/" },
  { label: "GitHub", href: "https://github.com/nmat2010" },
  { label: "Instagram", href: "https://www.instagram.com/nmat2010/" },
  { label: "Resume", href: resumeUrl },
];
