import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ArrowLeft, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PaymentHistory {
  id: string;
  date: string;
  reference: string;
  customer: string;
  method: "Efectivo" | "Tarjeta" | "Transferencia";
  amount: number;
  status: "Completado" | "Anulado";
}

const initialHistory: PaymentHistory[] = [
  { id: "h1", date: "2026-02-19", reference: "PAY-9001", customer: "Mesa 12", method: "Tarjeta", amount: 1850, status: "Completado" },
  { id: "h2", date: "2026-02-19", reference: "PAY-9002", customer: "Delivery #42", method: "Transferencia", amount: 1220, status: "Completado" },
  { id: "h3", date: "2026-02-18", reference: "PAY-8971", customer: "Mesa 5", method: "Efectivo", amount: 940, status: "Anulado" },
  { id: "h4", date: "2026-02-18", reference: "PAY-8962", customer: "Mesa 9", method: "Tarjeta", amount: 2410, status: "Completado" },
];

export default function HistorialPagos() {
  const navigate = useNavigate();
  const [history] = useState<PaymentHistory[]>(initialHistory);
  const [methodFilter, setMethodFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PaymentHistory | null>(null);

  const filtered = history.filter((payment) => {
    const byMethod = methodFilter === "all" ? true : payment.method === methodFilter;
    const q = search.toLowerCase();
    const bySearch = payment.reference.toLowerCase().includes(q) || payment.customer.toLowerCase().includes(q);
    return byMethod && bySearch;
  });

  const totalFiltered = useMemo(() => filtered.reduce((acc, payment) => acc + payment.amount, 0), [filtered]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Informacion Historica de Pagos</h1>
            <p className="text-muted-foreground">Trazabilidad de pagos por metodo y estado</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Registros filtrados</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{filtered.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Completados</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">{filtered.filter((payment) => payment.status === "Completado").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Monto filtrado</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">RD$ {totalFiltered.toLocaleString()}</p></CardContent></Card>
        </div>

        <Card>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Buscar referencia o cliente" value={search} onChange={(e) => setSearch(e.target.value)} className="md:col-span-2" />
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los metodos</SelectItem>
                <SelectItem value="Efectivo">Efectivo</SelectItem>
                <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                <SelectItem value="Transferencia">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" />Historial</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Referencia</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Metodo</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[100px]">Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell className="font-medium">{payment.reference}</TableCell>
                    <TableCell>{payment.customer}</TableCell>
                    <TableCell><Badge variant="secondary">{payment.method}</Badge></TableCell>
                    <TableCell>RD$ {payment.amount.toLocaleString()}</TableCell>
                    <TableCell><Badge variant={payment.status === "Completado" ? "default" : "destructive"}>{payment.status}</Badge></TableCell>
                    <TableCell><Button variant="outline" size="sm" onClick={() => setSelected(payment)}>Ver</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Detalle de pago</DialogTitle></DialogHeader>
            {selected && (
              <div className="space-y-3 text-sm">
                <p><span className="text-muted-foreground">Referencia:</span> {selected.reference}</p>
                <p><span className="text-muted-foreground">Fecha:</span> {selected.date}</p>
                <p><span className="text-muted-foreground">Cliente:</span> {selected.customer}</p>
                <p><span className="text-muted-foreground">Metodo:</span> {selected.method}</p>
                <p><span className="text-muted-foreground">Monto:</span> RD$ {selected.amount.toLocaleString()}</p>
                <p><span className="text-muted-foreground">Estado:</span> {selected.status}</p>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setSelected(null)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
