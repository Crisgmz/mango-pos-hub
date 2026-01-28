import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table } from "@/types/pos";
import { Users } from "lucide-react";

interface TableSelectionModalProps {
  open: boolean;
  onClose: () => void;
  tables: Table[];
  onSelectTable: (table: Table) => void;
}

export function TableSelectionModal({
  open,
  onClose,
  tables,
  onSelectTable,
}: TableSelectionModalProps) {
  const [activeZone, setActiveZone] = useState("salon");

  const filteredTables = tables.filter(
    (table) => table.zone === activeZone && table.status === "disponible"
  );

  const zones = [
    { id: "salon", label: "Salón Principal" },
    { id: "terraza", label: "Terraza" },
    { id: "vip", label: "VIP" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Seleccionar Mesa para Venta Manual</DialogTitle>
        </DialogHeader>

        <Tabs value={activeZone} onValueChange={setActiveZone}>
          <TabsList className="w-full">
            {zones.map((zone) => (
              <TabsTrigger key={zone.id} value={zone.id} className="flex-1">
                {zone.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeZone} className="mt-4">
            {filteredTables.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay mesas disponibles en esta zona
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {filteredTables.map((table) => (
                  <Button
                    key={table.id}
                    variant="outline"
                    className="h-20 flex flex-col gap-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => onSelectTable(table)}
                  >
                    <span className="font-bold text-lg">{table.code}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>Disponible</span>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
