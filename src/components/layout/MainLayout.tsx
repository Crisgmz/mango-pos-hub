import { ReactNode } from "react";
import { TopNavigation } from "./TopNavigation";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
