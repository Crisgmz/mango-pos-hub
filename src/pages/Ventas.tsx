import { MainLayout } from "@/components/layout/MainLayout";
import { TablesGrid } from "@/components/ventas/TablesGrid";

const Ventas = () => {
  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <TablesGrid />
      </div>
    </MainLayout>
  );
};

export default Ventas;

