import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { ArrowLeft, BadgeDollarSign, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CreditSale {
  id: string;
  date: string;
  customer: string;
  invoice: string;
  amount: number;
  dueDate: string;
  status: "Pendiente" | "Pagado" | "Vencido";
}

const initialSales: CreditSale[] = [
  { id: "vc1", date: "2026-02-19", customer: "Empresa Alfa", invoice: "CR-1901", amount: 12400, dueDate: "2026-03-05", status: "Pendiente" },
  { id: "vc2", date: "2026-02-17", customer: "Oficina Delta", invoice: "CR-1882", amount: 7600, dueDate: "2026-02-27", status: "Vencido" },
  { id: "vc3", date: "2026-02-14", customer: "Colegio Norte", invoice: "CR-1859", amount: 9450, dueDate: "2026-02-24", status: "Pagado" },
];

export default function VentaCredito() {
  const navigate = useNavigate();
  const [sales, setSales] = useState<CreditSale[]>(initialSales);
  const [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [maxDays, setMaxDays] = useState(30);
  const [minInitialPayment, setMinInitialPayment] = useState(20);
  const [form, setForm] = useState({
    date: "2026-02-19",
    customer: "",
    invoice: "",
    amount: 0,
    dueDate: "2026-03-05",
    status: "Pendiente" as const,
  });

  const totalPending = useMemo(
    () => sales.filter((sale) => sale.status !== "Pagado").reduce((acc, sale) => acc + sale.amount, 0),
    [sales]
  );

  const createSale = () => {
    if (!enabled) {
      toast.error("Las ventas a credito estan deshabilitadas");
      return;
    }
    if (!form.customer.trim() || !form.invoice.trim()) {
      toast.error("Cliente y factura son requeridos");
      return;
    }

    setSales((prev) => [{ id: `vc${Date.now()}`, ...form }, ...prev]);
    setIsOpen(false);
    setForm({ date: "2026-02-19", customer: "", invoice: "", amount: 0, dueDate: "2026-03-05", status: "Pendiente" });
    toast.success("Venta a credito registrada");
  };

  const markPaid = (id: string) => {
    setSales((prev) => prev.map((sale) => (sale.id === id ? { ...sale, status: "Pagado" } : sale)));
    toast.success("Venta marcada como pagada");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Venta a Credito</h1>
            <p className="text-muted-foreground">Politicas y operaciones de ventas a credito</p>
          </div>
          <Button onClick={() => setIsOpen(true)} disabled={!enabled}><Plus className="h-4 w-4 mr-2" />Nueva venta</Button>
        </div>

        <Card>
          <CardHeader><CardTitle>Politica de credito</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between rounded-md border px-3 py-2"><Label>Habilitar credito</Label><Switch checked={enabled} onCheckedChange={setEnabled} /></div>
            <div className="space-y-2"><Label>Dias maximos</Label><Input type="number" min={1} value={maxDays} onChange={(e) => setMaxDays(Number(e.target.value))} /></div>
            <div className="space-y-2"><Label>Inicial minimo (%)</Label><Input type="number" min={0} max={100} value={minInitialPayment} onChange={(e) => setMinInitialPayment(Number(e.target.value))} /></div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Operaciones</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{sales.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pendientes/Vencidas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-warning">{sales.filter((sale) => sale.status !== "Pagado").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Saldo abierto</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">RD$ {totalPending.toLocaleString()}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BadgeDollarSign className="h-5 w-5" />Ventas a credito</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Factura</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Vence</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[120px]">Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell className="font-medium">{sale.invoice}</TableCell>
                    <TableCell>RD$ {sale.amount.toLocaleString()}</TableCell>
                    <TableCell>{sale.dueDate}</TableCell>
                    <TableCell><Badge variant={sale.status === "Pagado" ? "default" : sale.status === "Vencido" ? "destructive" : "secondary"}>{sale.status}</Badge></TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" disabled={sale.status === "Pagado"} onClick={() => markPaid(sale.id)}>
                        Marcar pago
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
            <DialogHeader><DialogTitle>Nueva venta a credito</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Factura</Label><Input value={form.invoice} onChange={(e) => setForm((prev) => ({ ...prev, invoice: e.target.value }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Cliente</Label><Input value={form.customer} onChange={(e) => setForm((prev) => ({ ...prev, customer: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Monto</Label><Input type="number" min={1} value={form.amount} onChange={(e) => setForm((prev) => ({ ...prev, amount: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Fecha vencimiento</Label><Input type="date" value={form.dueDate} onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={createSale}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
