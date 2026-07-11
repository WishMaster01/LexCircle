export const appConfig = {
  name: "LexCircle",
  description:
    "A law student community platform for publishing legal blogs, articles, case notes, and research papers.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  supportEmail: "support@lexcircle.dev",
};

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Community" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/articles", label: "My Articles" },
  { href: "/dashboard/analytics", label: "Analytics" },
];

export const footerNav = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/community", label: "Community" },
  { href: "/dashboard/settings", label: "Settings" },
];
