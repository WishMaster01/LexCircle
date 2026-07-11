import { requireAdminPageSession } from "@/lib/auth-guards";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdminPageSession("/admin/login");

  return children;
}
