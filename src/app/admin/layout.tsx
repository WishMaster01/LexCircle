import { requireAdminPageSession } from "@/lib/auth-guards";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdminPageSession();

  return children;
}
