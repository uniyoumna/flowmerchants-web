import { redirect } from "next/navigation";
import { serverTokenStorage } from "@/modules/auth/utils/serverTokenStorage";
import { DashboardShell } from "@/modules/dashboard/components/layout";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const accessToken = await serverTokenStorage.getAccessToken();

  if (!accessToken) {
    redirect("/login");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
