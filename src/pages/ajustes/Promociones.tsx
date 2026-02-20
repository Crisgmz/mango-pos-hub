import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Percent, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Promotion {
  id: string;
  name: string;
  type: string;
  value: number;
  from: string;
  to: string;
  active: boolean;
}

const initialPromotions: Promotion[] = [
  { id: "pr1", name: "Happy Lunch", type: "Descuento", value: 15, from: "2026-02-01", to: "2026-02-28", active: true },
  { id: "pr2", name: "2x1 Bebidas", type: "Combo", value: 50, from: "2026-02-10", to: "2026-03-10", active: true },
  { id: "pr3", name: "Fin de semana VIP", type: "Cashback", value: 8, from: "2026-01-01", to: "2026-01-31", active: false },
];

export default function Promociones() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Descuento", value: 0, from: "2026-02-20", to: "2026-03-20", active: true });

  const addPromotion = () => {
    if (!form.name.trim()) {
      toast.error("Nombre de promocion requerido");
      return;
    }
    setPromotions((prev) => [...prev, { id: `pr${Date.now()}`, ...form }]);
    setIsOpen(false);
    setForm({ name: "", type: "Descuento", value: 0, from: "2026-02-20", to: "2026-03-20", active: true });
    toast.success("Promocion creada");
  };

  const togglePromotion = (id: string) => {
    setPromotions((prev) => prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item)));
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1"><h1 className="text-2xl font-bold">Promociones y Descuentos</h1><p className="text-muted-foreground">Campañas comerciales por periodo</p></div>
          <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Nueva promocion</Button>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Percent className="h-5 w-5" />Promociones</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Tipo</TableHead><TableHead>Valor</TableHead><TableHead>Desde</TableHead><TableHead>Hasta</TableHead><TableHead>Estado</TableHead><TableHead className="w-[120px]">Accion</TableHead></TableRow></TableHeader>
              <TableBody>
                {promotions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.value}%</TableCell>
                    <TableCell>{item.from}</TableCell>
                    <TableCell>{item.to}</TableCell>
                    <TableCell><Badge variant={item.active ? "default" : "secondary"}>{item.active ? "Activa" : "Inactiva"}</Badge></TableCell>
                    <TableCell><Button variant="outline" size="sm" onClick={() => togglePromotion(item.id)}>{item.active ? "Pausar" : "Activar"}</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nueva promocion</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 md:col-span-2"><Label>Nombre</Label><Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Tipo</Label><Input value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Valor (%)</Label><Input type="number" min={0} value={form.value} onChange={(e) => setForm((prev) => ({ ...prev, value: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Desde</Label><Input type="date" value={form.from} onChange={(e) => setForm((prev) => ({ ...prev, from: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Hasta</Label><Input type="date" value={form.to} onChange={(e) => setForm((prev) => ({ ...prev, to: e.target.value }))} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button><Button onClick={addPromotion}>Guardar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
