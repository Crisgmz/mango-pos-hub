import { MainLayout } from "@/components/layout/MainLayout";
import { VentasSidebar } from "@/components/ventas/VentasSidebar";
import { TablesGrid } from "@/components/ventas/TablesGrid";

const Ventas = () => {
  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        <VentasSidebar />
        <TablesGrid />
      </div>
    </MainLayout>
  );
};

export default Ventas;
