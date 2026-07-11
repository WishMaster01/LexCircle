import { requireUserPageSession } from "@/lib/auth-guards";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireUserPageSession();

  return children;
}
