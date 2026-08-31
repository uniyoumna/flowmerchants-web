import { SidebarProvider } from "@/modules/dashboard/hooks/useSidebar";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

const DashboardShell = ({ children }: DashboardShellProps) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main layout: Top Navbar + Scrollable Content */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <Navbar />

          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardShell;
export { DashboardShell };
