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
import { ArrowLeft, GitBranch, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface TransferPayment {
  id: string;
  date: string;
  reference: string;
  bankFrom: string;
  bankTo: string;
  amount: number;
  status: "Pendiente" | "Confirmado";
}

const initialTransfers: TransferPayment[] = [
  { id: "tr1", date: "2026-02-19", reference: "TRX-11022", bankFrom: "Popular", bankTo: "Banreservas", amount: 12500, status: "Pendiente" },
  { id: "tr2", date: "2026-02-18", reference: "TRX-11010", bankFrom: "BHD", bankTo: "Popular", amount: 9300, status: "Confirmado" },
  { id: "tr3", date: "2026-02-17", reference: "TRX-10991", bankFrom: "Banreservas", bankTo: "BHD", amount: 18750, status: "Confirmado" },
];

export default function Transferencias() {
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState<TransferPayment[]>(initialTransfers);
  const [isOpen, setIsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({
    date: "2026-02-19",
    reference: "",
    bankFrom: "Popular",
    bankTo: "Banreservas",
    amount: 0,
  });

  const filtered = transfers.filter((transfer) => (statusFilter === "all" ? true : transfer.status === statusFilter));
  const totalAmount = useMemo(() => filtered.reduce((acc, transfer) => acc + transfer.amount, 0), [filtered]);

  const createTransfer = () => {
    if (!form.reference.trim() || form.amount <= 0) {
      toast.error("Referencia y monto validos son requeridos");
      return;
    }
    if (form.bankFrom === form.bankTo) {
      toast.error("Banco origen y destino deben ser diferentes");
      return;
    }

    setTransfers((prev) => [
      {
        id: `tr${Date.now()}`,
        date: form.date,
        reference: form.reference,
        bankFrom: form.bankFrom,
        bankTo: form.bankTo,
        amount: Number(form.amount),
        status: "Pendiente",
      },
      ...prev,
    ]);

    setIsOpen(false);
    setForm({ date: "2026-02-19", reference: "", bankFrom: "Popular", bankTo: "Banreservas", amount: 0 });
    toast.success("Transferencia registrada");
  };

  const confirmTransfer = (id: string) => {
    setTransfers((prev) => prev.map((transfer) => (transfer.id === id ? { ...transfer, status: "Confirmado" } : transfer)));
    toast.success("Transferencia confirmada");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Transferencias</h1>
            <p className="text-muted-foreground">Pagos y movimientos por transferencia bancaria</p>
          </div>
          <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Nueva transferencia</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Movimientos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{filtered.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pendientes</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-warning">{filtered.filter((transfer) => transfer.status === "Pendiente").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Monto total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">RD$ {totalAmount.toLocaleString()}</p></CardContent></Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[220px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Confirmado">Confirmado</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5" />Historial de transferencias</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Referencia</TableHead>
                  <TableHead>Banco origen</TableHead>
                  <TableHead>Banco destino</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[120px]">Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>{transfer.date}</TableCell>
                    <TableCell className="font-medium">{transfer.reference}</TableCell>
                    <TableCell>{transfer.bankFrom}</TableCell>
                    <TableCell>{transfer.bankTo}</TableCell>
                    <TableCell>RD$ {transfer.amount.toLocaleString()}</TableCell>
                    <TableCell><Badge variant={transfer.status === "Confirmado" ? "default" : "secondary"}>{transfer.status}</Badge></TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" disabled={transfer.status === "Confirmado"} onClick={() => confirmTransfer(transfer.id)}>
                        Confirmar
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
            <DialogHeader><DialogTitle>Nueva transferencia</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Referencia</Label><Input value={form.reference} onChange={(e) => setForm((prev) => ({ ...prev, reference: e.target.value }))} /></div>
              <div className="space-y-2">
                <Label>Banco origen</Label>
                <Select value={form.bankFrom} onValueChange={(value) => setForm((prev) => ({ ...prev, bankFrom: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Popular">Popular</SelectItem>
                    <SelectItem value="Banreservas">Banreservas</SelectItem>
                    <SelectItem value="BHD">BHD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Banco destino</Label>
                <Select value={form.bankTo} onValueChange={(value) => setForm((prev) => ({ ...prev, bankTo: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Popular">Popular</SelectItem>
                    <SelectItem value="Banreservas">Banreservas</SelectItem>
                    <SelectItem value="BHD">BHD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2"><Label>Monto</Label><Input type="number" min={1} value={form.amount} onChange={(e) => setForm((prev) => ({ ...prev, amount: Number(e.target.value) }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={createTransfer}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
