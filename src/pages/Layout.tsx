import { ReactNode } from "react";
import { Footer } from "@/components/ui/Footer"; 

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
