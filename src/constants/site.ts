export const appConfig = {
  name: "InkSphere",
  description:
    "A multi-user community publishing platform with editorial workflows, moderation, analytics, and explainable discovery.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  supportEmail: "support@inksphere.dev",
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
