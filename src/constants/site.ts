export const appConfig = {
  name: "LexCircle",
  description:
    "A law student community platform for publishing legal blogs, articles, case analysis, research papers, notes, and legal news.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  supportEmail: "support@lexcircle.dev",
};

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/latest", label: "Latest" },
  { href: "/subjects", label: "Subjects" },
  { href: "/write", label: "Write" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
];

export const footerNav = [
  { href: "/about", label: "About" },
  { href: "/write", label: "Write for LexCircle" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/disclaimer", label: "Disclaimer" },
];
