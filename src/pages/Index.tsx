import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { ActiveTablesWidget } from "@/components/dashboard/ActiveTablesWidget";

const Index = () => {
  return (
    <MainLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        <WelcomeCard />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <QuickActions />
            <SalesChart />
          </div>
          <div className="space-y-6">
            <ActiveTablesWidget />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
