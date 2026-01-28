import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TableCard } from "./TableCard";
import { OrderScreen } from "./OrderScreen";
import { QuickSaleScreen } from "./QuickSaleScreen";
import { ManualSaleScreen } from "./ManualSaleScreen";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table } from "@/types/pos";
import { toast } from "sonner";

const initialTables: Table[] = [
  { id: "1", code: "SP01", status: "disponible", zone: "salon" },
  { id: "2", code: "SP02", status: "ocupado", guests: 4, time: "45:23", total: 2850, zone: "salon" },
  { id: "3", code: "SP03", status: "ocupado", guests: 2, time: "28:10", total: 1200, zone: "salon" },
  { id: "4", code: "SP04", status: "disponible", zone: "salon" },
  { id: "5", code: "SP05", status: "disponible", zone: "salon" },
  { id: "6", code: "SP06", status: "ocupado", guests: 6, time: "1:05:00", total: 4500, zone: "salon" },
  { id: "7", code: "SP07", status: "disponible", zone: "salon" },
  { id: "8", code: "SP08", status: "disponible", zone: "salon" },
  { id: "9", code: "TR01", status: "disponible", zone: "terraza" },
  { id: "10", code: "TR02", status: "ocupado", guests: 3, time: "35:00", total: 1800, zone: "terraza" },
  { id: "11", code: "TR03", status: "disponible", zone: "terraza" },
  { id: "12", code: "TR04", status: "ocupado", guests: 2, time: "15:00", total: 950, zone: "terraza" },
  { id: "13", code: "VIP01", status: "disponible", zone: "vip" },
  { id: "14", code: "VIP02", status: "ocupado", guests: 8, time: "2:00:00", total: 12500, zone: "vip" },
];

export function TablesGrid() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  
  const [activeZone, setActiveZone] = useState("salon");
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showQuickSale, setShowQuickSale] = useState(false);
  const [showManualSale, setShowManualSale] = useState(false);

  const filteredTables = tables.filter((table) => table.zone === activeZone);
  const occupiedCount = filteredTables.filter((t) => t.status === "ocupado").length;
  const availableCount = filteredTables.filter((t) => t.status === "disponible").length;

  // Handle mode changes
  if (mode === "rapida" && !showQuickSale && !selectedTable && !showManualSale) {
    return (
      <div className="flex-1">
        <QuickSaleScreen onBack={() => window.history.back()} />
      </div>
    );
  }

  if (mode === "manual" && !showManualSale && !selectedTable && !showQuickSale) {
    return (
      <div className="flex-1">
        <ManualSaleScreen
          onBack={() => window.history.back()}
          tables={tables}
          onTableAssigned={(tableId) => {
            setTables((prev) =>
              prev.map((t) =>
                t.id === tableId
                  ? { ...t, status: "ocupado" as const, time: "00:00" }
                  : t
              )
            );
          }}
        />
      </div>
    );
  }

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
  };

  const handleOrderComplete = (tableId?: string) => {
    if (tableId) {
      setTables((prev) =>
        prev.map((t) =>
          t.id === tableId
            ? { ...t, status: "disponible" as const, guests: undefined, time: undefined, total: undefined }
            : t
        )
      );
      toast.success("Mesa liberada");
    }
    setSelectedTable(null);
  };

  // Show order screen when table is selected
  if (selectedTable) {
    return (
      <OrderScreen
        table={selectedTable}
        onBack={() => setSelectedTable(null)}
        onOrderComplete={handleOrderComplete}
      />
    );
  }

  return (
    <div className="flex-1 p-6">
      <Tabs value={activeZone} onValueChange={setActiveZone}>
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-secondary p-1 rounded-xl">
            <TabsTrigger
              value="salon"
              className="rounded-lg px-4 py-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              Salón Principal
            </TabsTrigger>
            <TabsTrigger
              value="terraza"
              className="rounded-lg px-4 py-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              Terraza
            </TabsTrigger>
            <TabsTrigger
              value="vip"
              className="rounded-lg px-4 py-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              VIP
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">
                {availableCount} disponibles
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-sm text-muted-foreground">
                {occupiedCount} ocupadas
              </span>
            </div>
          </div>
        </div>

        <TabsContent value={activeZone} className="mt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredTables.map((table) => (
              <TableCard
                key={table.id}
                code={table.code}
                status={table.status}
                guests={table.guests}
                time={table.time}
                total={table.total}
                onClick={() => handleTableClick(table)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
