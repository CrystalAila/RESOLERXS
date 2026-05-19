import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import { SidebarProvider } from "../contexts/SidebarContext";
import { HeaderProvider } from "../contexts/HeaderContext";

const LayoutContent = () => (
  <div className="min-h-screen bg-rx-bg">
    <AppSidebar />
    <AppHeader />
    <main className="pt-16 pl-0 transition-all sm:pl-64">
      <div className="p-4 sm:p-8">
        <Outlet />
      </div>
    </main>
  </div>
);

const AppLayout = () => (
  <HeaderProvider>
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  </HeaderProvider>
);

export default AppLayout;
