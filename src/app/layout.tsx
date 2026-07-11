import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";
import { AppProviders } from "@/components/providers/app-providers";
import { appConfig } from "@/constants/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.url),
  title: {
    default: `${appConfig.name} | Community Publishing Platform`,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">
        <AppProviders>
          <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 sm:px-6 lg:px-8">
            <AppHeader />
            <main className="flex-1 py-8">{children}</main>
            <AppFooter />
          </div>
          <Toaster richColors position="top-right" />
        </AppProviders>
      </body>
    </html>
  );
}
