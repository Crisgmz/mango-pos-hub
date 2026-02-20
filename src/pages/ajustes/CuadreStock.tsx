import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, ClipboardCheck, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CuadreItem {
  id: string;
  date: string;
  warehouse: string;
  product: string;
  systemStock: number;
  physicalStock: number;
  status: "Pendiente" | "Aplicado";
}

const initialCuadres: CuadreItem[] = [
  { id: "c1", date: "2026-02-19", warehouse: "Principal", product: "Arroz Premium 25lb", systemStock: 45, physicalStock: 43, status: "Pendiente" },
  { id: "c2", date: "2026-02-18", warehouse: "Sucursal Norte", product: "Pollo", systemStock: 32, physicalStock: 32, status: "Aplicado" },
  { id: "c3", date: "2026-02-18", warehouse: "Principal", product: "Aceite Vegetal 1L", systemStock: 12, physicalStock: 10, status: "Pendiente" },
];

export default function CuadreStock() {
  const navigate = useNavigate();
  const [cuadres, setCuadres] = useState<CuadreItem[]>(initialCuadres);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    date: "2026-02-19",
    warehouse: "Principal",
    product: "",
    systemStock: 0,
    physicalStock: 0,
  });

  const diff = useMemo(
    () => cuadres.filter((item) => item.status === "Pendiente").reduce((acc, item) => acc + (item.physicalStock - item.systemStock), 0),
    [cuadres]
  );

  const createCuadre = () => {
    if (!form.product.trim()) {
      toast.error("Producto requerido");
      return;
    }

    setCuadres((prev) => [
      {
        id: `c${Date.now()}`,
        date: form.date,
        warehouse: form.warehouse,
        product: form.product,
        systemStock: Number(form.systemStock),
        physicalStock: Number(form.physicalStock),
        status: "Pendiente",
      },
      ...prev,
    ]);
    setIsOpen(false);
    setForm({ date: "2026-02-19", warehouse: "Principal", product: "", systemStock: 0, physicalStock: 0 });
    toast.success("Cuadre creado");
  };

  const applyCuadre = (id: string) => {
    setCuadres((prev) => prev.map((item) => (item.id === id ? { ...item, status: "Aplicado" } : item)));
    toast.success("Cuadre aplicado");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Cuadre de Stock</h1>
            <p className="text-muted-foreground">Ajustes visuales por diferencias de inventario</p>
          </div>
          <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Nuevo cuadre</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pendientes</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{cuadres.filter((item) => item.status === "Pendiente").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Aplicados</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{cuadres.filter((item) => item.status === "Aplicado").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Diferencia neta</CardTitle></CardHeader><CardContent><p className={`text-2xl font-bold ${diff < 0 ? "text-destructive" : "text-success"}`}>{diff}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5" />Cuadres de stock</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Almacen</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Sistema</TableHead>
                  <TableHead>Fisico</TableHead>
                  <TableHead>Diferencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[120px]">Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cuadres.map((item) => {
                  const itemDiff = item.physicalStock - item.systemStock;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.warehouse}</TableCell>
                      <TableCell className="font-medium">{item.product}</TableCell>
                      <TableCell>{item.systemStock}</TableCell>
                      <TableCell>{item.physicalStock}</TableCell>
                      <TableCell className={itemDiff < 0 ? "text-destructive" : "text-success"}>{itemDiff}</TableCell>
                      <TableCell><Badge variant={item.status === "Aplicado" ? "default" : "secondary"}>{item.status}</Badge></TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" disabled={item.status === "Aplicado"} onClick={() => applyCuadre(item.id)}>
                          Aplicar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo cuadre</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Almacen</Label><Input value={form.warehouse} onChange={(e) => setForm((prev) => ({ ...prev, warehouse: e.target.value }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Producto</Label><Input value={form.product} onChange={(e) => setForm((prev) => ({ ...prev, product: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Stock sistema</Label><Input type="number" min={0} value={form.systemStock} onChange={(e) => setForm((prev) => ({ ...prev, systemStock: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Stock fisico</Label><Input type="number" min={0} value={form.physicalStock} onChange={(e) => setForm((prev) => ({ ...prev, physicalStock: Number(e.target.value) }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={createCuadre}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
