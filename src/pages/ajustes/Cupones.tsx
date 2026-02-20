import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  uses: number;
  maxUses: number;
  expiresAt: string;
  active: boolean;
}

const initialCoupons: Coupon[] = [
  { id: "cp1", code: "BIENVENIDO10", discount: 10, uses: 18, maxUses: 200, expiresAt: "2026-03-31", active: true },
  { id: "cp2", code: "MANGO25", discount: 25, uses: 42, maxUses: 80, expiresAt: "2026-02-28", active: true },
  { id: "cp3", code: "VIP5", discount: 5, uses: 250, maxUses: 250, expiresAt: "2026-01-31", active: false },
];

export default function Cupones() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ code: "", discount: 0, maxUses: 100, expiresAt: "2026-03-20", active: true });

  const addCoupon = () => {
    if (!form.code.trim()) {
      toast.error("Codigo requerido");
      return;
    }
    setCoupons((prev) => [...prev, { id: `cp${Date.now()}`, uses: 0, ...form }]);
    setIsOpen(false);
    setForm({ code: "", discount: 0, maxUses: 100, expiresAt: "2026-03-20", active: true });
    toast.success("Cupon creado");
  };

  const toggleCoupon = (id: string) => {
    setCoupons((prev) => prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item)));
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1"><h1 className="text-2xl font-bold">Gestion de Cupones</h1><p className="text-muted-foreground">Codigos promocionales y control de uso</p></div>
          <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Nuevo cupon</Button>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" />Cupones activos</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Codigo</TableHead><TableHead>Descuento</TableHead><TableHead>Uso</TableHead><TableHead>Maximo</TableHead><TableHead>Expira</TableHead><TableHead>Estado</TableHead><TableHead className="w-[120px]">Accion</TableHead></TableRow></TableHeader>
              <TableBody>
                {coupons.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.discount}%</TableCell>
                    <TableCell>{item.uses}</TableCell>
                    <TableCell>{item.maxUses}</TableCell>
                    <TableCell>{item.expiresAt}</TableCell>
                    <TableCell><Badge variant={item.active ? "default" : "secondary"}>{item.active ? "Activo" : "Inactivo"}</Badge></TableCell>
                    <TableCell><Button variant="outline" size="sm" onClick={() => toggleCoupon(item.id)}>{item.active ? "Pausar" : "Activar"}</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo cupon</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 md:col-span-2"><Label>Codigo</Label><Input value={form.code} onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))} /></div>
              <div className="space-y-2"><Label>Descuento (%)</Label><Input type="number" min={0} max={100} value={form.discount} onChange={(e) => setForm((prev) => ({ ...prev, discount: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Usos maximos</Label><Input type="number" min={1} value={form.maxUses} onChange={(e) => setForm((prev) => ({ ...prev, maxUses: Number(e.target.value) }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Fecha expiracion</Label><Input type="date" value={form.expiresAt} onChange={(e) => setForm((prev) => ({ ...prev, expiresAt: e.target.value }))} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button><Button onClick={addCoupon}>Guardar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
