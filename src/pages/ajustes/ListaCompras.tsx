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
import { ArrowLeft, ClipboardList, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ShoppingItem {
  id: string;
  product: string;
  supplier: string;
  minStock: number;
  currentStock: number;
  suggestedQty: number;
  status: "Pendiente" | "Ordenado";
}

const initialItems: ShoppingItem[] = [
  { id: "l1", product: "Arroz Premium 25lb", supplier: "Distribuidora Centro", minStock: 20, currentStock: 8, suggestedQty: 25, status: "Pendiente" },
  { id: "l2", product: "Aceite Vegetal 1L", supplier: "Alimentos Caribe", minStock: 18, currentStock: 7, suggestedQty: 20, status: "Pendiente" },
  { id: "l3", product: "Queso Mozzarella", supplier: "Lacteos Nacional", minStock: 10, currentStock: 9, suggestedQty: 8, status: "Ordenado" },
];

export default function ListaCompras() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    product: "",
    supplier: "",
    minStock: 0,
    currentStock: 0,
    suggestedQty: 1,
  });

  const pendingCount = useMemo(() => items.filter((item) => item.status === "Pendiente").length, [items]);

  const createItem = () => {
    if (!form.product.trim() || !form.supplier.trim()) {
      toast.error("Producto y proveedor son requeridos");
      return;
    }

    setItems((prev) => [
      {
        id: `l${Date.now()}`,
        product: form.product,
        supplier: form.supplier,
        minStock: Number(form.minStock),
        currentStock: Number(form.currentStock),
        suggestedQty: Number(form.suggestedQty),
        status: "Pendiente",
      },
      ...prev,
    ]);
    setIsOpen(false);
    setForm({ product: "", supplier: "", minStock: 0, currentStock: 0, suggestedQty: 1 });
    toast.success("Producto agregado a lista de compras");
  };

  const markOrdered = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: "Ordenado" } : item)));
    toast.success("Marcado como ordenado");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Lista de Compras</h1>
            <p className="text-muted-foreground">Planificacion de compras por faltantes de stock</p>
          </div>
          <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Agregar item</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Items</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{items.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pendientes</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-warning">{pendingCount}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Ordenados</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">{items.length - pendingCount}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" />Items sugeridos de compra</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Stock min.</TableHead>
                  <TableHead>Stock actual</TableHead>
                  <TableHead>Cantidad sugerida</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[120px]">Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{item.minStock}</TableCell>
                    <TableCell className={item.currentStock < item.minStock ? "text-destructive" : ""}>{item.currentStock}</TableCell>
                    <TableCell>{item.suggestedQty}</TableCell>
                    <TableCell><Badge variant={item.status === "Ordenado" ? "default" : "secondary"}>{item.status}</Badge></TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" disabled={item.status === "Ordenado"} onClick={() => markOrdered(item.id)}>
                        Ordenar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Agregar item de compra</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 md:col-span-2"><Label>Producto</Label><Input value={form.product} onChange={(e) => setForm((prev) => ({ ...prev, product: e.target.value }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Proveedor</Label><Input value={form.supplier} onChange={(e) => setForm((prev) => ({ ...prev, supplier: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Stock minimo</Label><Input type="number" min={0} value={form.minStock} onChange={(e) => setForm((prev) => ({ ...prev, minStock: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Stock actual</Label><Input type="number" min={0} value={form.currentStock} onChange={(e) => setForm((prev) => ({ ...prev, currentStock: Number(e.target.value) }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Cantidad sugerida</Label><Input type="number" min={1} value={form.suggestedQty} onChange={(e) => setForm((prev) => ({ ...prev, suggestedQty: Number(e.target.value) }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={createItem}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
