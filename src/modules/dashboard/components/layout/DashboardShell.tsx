import { SidebarProvider } from "@/modules/dashboard/hooks/useSidebar";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

const DashboardShell = ({ children }: DashboardShellProps) => {
  return (
    <SidebarProvider>
      <div className="fixed inset-0 flex overflow-hidden bg-[#F8FAFC]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main layout: Top Navbar + Scrollable Content */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <Navbar />

          <main className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <div className="flex min-h-full flex-col p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardShell;
export { DashboardShell };
