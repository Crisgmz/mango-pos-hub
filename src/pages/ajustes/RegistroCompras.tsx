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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Plus, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Compra {
  id: string;
  date: string;
  invoice: string;
  supplier: string;
  warehouse: string;
  total: number;
  paymentStatus: "Pagado" | "Parcial" | "Pendiente";
}

const initialCompras: Compra[] = [
  { id: "rc1", date: "2026-02-19", invoice: "FAC-1023", supplier: "Distribuidora Centro", warehouse: "Principal", total: 28500, paymentStatus: "Parcial" },
  { id: "rc2", date: "2026-02-18", invoice: "FAC-1021", supplier: "Alimentos Caribe", warehouse: "Sucursal Norte", total: 14300, paymentStatus: "Pagado" },
  { id: "rc3", date: "2026-02-17", invoice: "FAC-1019", supplier: "Lacteos Nacional", warehouse: "Principal", total: 9200, paymentStatus: "Pendiente" },
];

export default function RegistroCompras() {
  const navigate = useNavigate();
  const [compras, setCompras] = useState<Compra[]>(initialCompras);
  const [isOpen, setIsOpen] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [form, setForm] = useState<{
    date: string;
    invoice: string;
    supplier: string;
    warehouse: string;
    total: number;
    paymentStatus: "Pagado" | "Parcial" | "Pendiente";
  }>({
    date: "2026-02-19",
    invoice: "",
    supplier: "",
    warehouse: "Principal",
    total: 0,
    paymentStatus: "Pendiente",
  });

  const filtered = compras.filter((compra) => (paymentFilter === "all" ? true : compra.paymentStatus === paymentFilter));
  const totalCompras = useMemo(() => filtered.reduce((acc, compra) => acc + compra.total, 0), [filtered]);

  const createCompra = () => {
    if (!form.invoice.trim() || !form.supplier.trim()) {
      toast.error("Factura y proveedor son requeridos");
      return;
    }

    setCompras((prev) => [
      {
        id: `rc${Date.now()}`,
        date: form.date,
        invoice: form.invoice,
        supplier: form.supplier,
        warehouse: form.warehouse,
        total: Number(form.total),
        paymentStatus: form.paymentStatus,
      },
      ...prev,
    ]);
    setIsOpen(false);
    setForm({ date: "2026-02-19", invoice: "", supplier: "", warehouse: "Principal", total: 0, paymentStatus: "Pendiente" });
    toast.success("Compra registrada");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Registro de Compras</h1>
            <p className="text-muted-foreground">Historial de compras realizadas por proveedor y almacen</p>
          </div>
          <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Registrar compra</Button>
        </div>

        <Card>
          <CardContent className="pt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="space-x-2">
              <Badge variant="secondary">Pagado: {compras.filter((item) => item.paymentStatus === "Pagado").length}</Badge>
              <Badge variant="secondary">Parcial: {compras.filter((item) => item.paymentStatus === "Parcial").length}</Badge>
              <Badge variant="secondary">Pendiente: {compras.filter((item) => item.paymentStatus === "Pendiente").length}</Badge>
            </div>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full md:w-[240px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los pagos</SelectItem>
                <SelectItem value="Pagado">Pagado</SelectItem>
                <SelectItem value="Parcial">Parcial</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" />Compras registradas (RD$ {totalCompras.toLocaleString()})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Factura</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Almacen</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Pago</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((compra) => (
                  <TableRow key={compra.id}>
                    <TableCell>{compra.date}</TableCell>
                    <TableCell className="font-medium">{compra.invoice}</TableCell>
                    <TableCell>{compra.supplier}</TableCell>
                    <TableCell>{compra.warehouse}</TableCell>
                    <TableCell>RD$ {compra.total.toLocaleString()}</TableCell>
                    <TableCell><Badge variant={compra.paymentStatus === "Pagado" ? "default" : "secondary"}>{compra.paymentStatus}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar compra</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Numero factura</Label><Input value={form.invoice} onChange={(e) => setForm((prev) => ({ ...prev, invoice: e.target.value }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Proveedor</Label><Input value={form.supplier} onChange={(e) => setForm((prev) => ({ ...prev, supplier: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Almacen</Label><Input value={form.warehouse} onChange={(e) => setForm((prev) => ({ ...prev, warehouse: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Total</Label><Input type="number" min={0} value={form.total} onChange={(e) => setForm((prev) => ({ ...prev, total: Number(e.target.value) }))} /></div>
              <div className="space-y-2 md:col-span-2">
                <Label>Estado de pago</Label>
                <Select value={form.paymentStatus} onValueChange={(value: "Pagado" | "Parcial" | "Pendiente") => setForm((prev) => ({ ...prev, paymentStatus: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pagado">Pagado</SelectItem>
                    <SelectItem value="Parcial">Parcial</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={createCompra}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
