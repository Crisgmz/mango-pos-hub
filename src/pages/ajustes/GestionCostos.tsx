import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CostItem {
  id: string;
  product: string;
  unitCost: number;
  salePrice: number;
  margin: number;
  updatedAt: string;
}

const initialCosts: CostItem[] = [
  { id: "gc1", product: "Hamburguesa Clasica", unitCost: 145, salePrice: 320, margin: 54.7, updatedAt: "2026-02-18" },
  { id: "gc2", product: "Pizza Personal", unitCost: 210, salePrice: 450, margin: 53.3, updatedAt: "2026-02-19" },
  { id: "gc3", product: "Ensalada Cesar", unitCost: 130, salePrice: 290, margin: 55.1, updatedAt: "2026-02-17" },
];

export default function GestionCostos() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CostItem[]>(initialCosts);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ product: "", unitCost: 0, salePrice: 0 });

  const avgMargin = useMemo(() => (items.reduce((acc, item) => acc + item.margin, 0) / items.length || 0).toFixed(1), [items]);

  const addCost = () => {
    if (!form.product.trim() || form.unitCost <= 0 || form.salePrice <= 0) {
      toast.error("Datos invalidos de costo");
      return;
    }
    const margin = Number((((form.salePrice - form.unitCost) / form.salePrice) * 100).toFixed(1));
    setItems((prev) => [{ id: `gc${Date.now()}`, product: form.product, unitCost: form.unitCost, salePrice: form.salePrice, margin, updatedAt: "2026-02-20" }, ...prev]);
    setOpen(false);
    setForm({ product: "", unitCost: 0, salePrice: 0 });
    toast.success("Costo agregado");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1"><h1 className="text-2xl font-bold">Gestion de Costos</h1><p className="text-muted-foreground">Control de costos unitarios y margen por producto</p></div>
          <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" />Nuevo costo</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Productos con costo</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{items.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Costo total referencia</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">RD$ {items.reduce((acc, item) => acc + item.unitCost, 0).toLocaleString()}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Margen promedio</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">{avgMargin}%</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Estructura de costos</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Producto</TableHead><TableHead>Costo unitario</TableHead><TableHead>Precio venta</TableHead><TableHead>Margen</TableHead><TableHead>Actualizado</TableHead></TableRow></TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product}</TableCell>
                    <TableCell>RD$ {item.unitCost.toLocaleString()}</TableCell>
                    <TableCell>RD$ {item.salePrice.toLocaleString()}</TableCell>
                    <TableCell><Badge variant={item.margin >= 50 ? "default" : "secondary"}>{item.margin}%</Badge></TableCell>
                    <TableCell>{item.updatedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo costo de producto</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-2"><Label>Producto</Label><Input value={form.product} onChange={(e) => setForm((prev) => ({ ...prev, product: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Costo unitario</Label><Input type="number" min={1} value={form.unitCost} onChange={(e) => setForm((prev) => ({ ...prev, unitCost: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Precio de venta</Label><Input type="number" min={1} value={form.salePrice} onChange={(e) => setForm((prev) => ({ ...prev, salePrice: Number(e.target.value) }))} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={addCost}>Guardar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
