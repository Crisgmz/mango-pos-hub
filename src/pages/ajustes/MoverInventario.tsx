import { useState } from "react";
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

interface Transfer {
  id: string;
  date: string;
  from: string;
  to: string;
  product: string;
  qty: number;
  requestedBy: string;
  status: "Pendiente" | "En transito" | "Completado";
}

const initialTransfers: Transfer[] = [
  { id: "t1", date: "2026-02-19", from: "Principal", to: "Sucursal Norte", product: "Arroz Premium 25lb", qty: 5, requestedBy: "Luis", status: "Pendiente" },
  { id: "t2", date: "2026-02-18", from: "Principal", to: "Sucursal Este", product: "Aceite Vegetal 1L", qty: 10, requestedBy: "Diana", status: "En transito" },
  { id: "t3", date: "2026-02-17", from: "Sucursal Norte", to: "Principal", product: "Pollo", qty: 4, requestedBy: "Jose", status: "Completado" },
];

export default function MoverInventario() {
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState<Transfer[]>(initialTransfers);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    date: "2026-02-19",
    from: "Principal",
    to: "Sucursal Norte",
    product: "",
    qty: 1,
    requestedBy: "",
  });

  const filtered = transfers.filter((transfer) =>
    statusFilter === "all" ? true : transfer.status === statusFilter
  );

  const createTransfer = () => {
    if (!form.product.trim() || !form.requestedBy.trim()) {
      toast.error("Producto y solicitante son requeridos");
      return;
    }
    if (form.from === form.to) {
      toast.error("Origen y destino deben ser diferentes");
      return;
    }

    setTransfers((prev) => [
      {
        id: `t${Date.now()}`,
        date: form.date,
        from: form.from,
        to: form.to,
        product: form.product,
        qty: Number(form.qty),
        requestedBy: form.requestedBy,
        status: "Pendiente",
      },
      ...prev,
    ]);

    setIsOpen(false);
    setForm({ date: "2026-02-19", from: "Principal", to: "Sucursal Norte", product: "", qty: 1, requestedBy: "" });
    toast.success("Transferencia creada");
  };

  const advanceStatus = (id: string) => {
    setTransfers((prev) =>
      prev.map((transfer) => {
        if (transfer.id !== id) return transfer;
        if (transfer.status === "Pendiente") return { ...transfer, status: "En transito" };
        if (transfer.status === "En transito") return { ...transfer, status: "Completado" };
        return transfer;
      })
    );
    toast.success("Estado actualizado");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Mover Inventario entre Almacenes</h1>
            <p className="text-muted-foreground">Transferencias de stock entre bodegas</p>
          </div>
          <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Nueva transferencia</Button>
        </div>

        <Card>
          <CardContent className="pt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex gap-2">
              <Badge variant="secondary">Pendiente: {transfers.filter((t) => t.status === "Pendiente").length}</Badge>
              <Badge variant="secondary">En transito: {transfers.filter((t) => t.status === "En transito").length}</Badge>
              <Badge variant="secondary">Completado: {transfers.filter((t) => t.status === "Completado").length}</Badge>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[220px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="En transito">En transito</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5" />Transferencias</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Desde</TableHead>
                  <TableHead>Hacia</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Solicitado por</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[120px]">Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>{transfer.date}</TableCell>
                    <TableCell>{transfer.from}</TableCell>
                    <TableCell>{transfer.to}</TableCell>
                    <TableCell className="font-medium">{transfer.product}</TableCell>
                    <TableCell>{transfer.qty}</TableCell>
                    <TableCell>{transfer.requestedBy}</TableCell>
                    <TableCell><Badge variant={transfer.status === "Completado" ? "default" : "secondary"}>{transfer.status}</Badge></TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" disabled={transfer.status === "Completado"} onClick={() => advanceStatus(transfer.id)}>
                        Avanzar
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
              <div className="space-y-2"><Label>Cantidad</Label><Input type="number" min={1} value={form.qty} onChange={(e) => setForm((prev) => ({ ...prev, qty: Number(e.target.value) }))} /></div>
              <div className="space-y-2">
                <Label>Origen</Label>
                <Select value={form.from} onValueChange={(value) => setForm((prev) => ({ ...prev, from: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Principal">Principal</SelectItem>
                    <SelectItem value="Sucursal Norte">Sucursal Norte</SelectItem>
                    <SelectItem value="Sucursal Este">Sucursal Este</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destino</Label>
                <Select value={form.to} onValueChange={(value) => setForm((prev) => ({ ...prev, to: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Principal">Principal</SelectItem>
                    <SelectItem value="Sucursal Norte">Sucursal Norte</SelectItem>
                    <SelectItem value="Sucursal Este">Sucursal Este</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2"><Label>Producto</Label><Input value={form.product} onChange={(e) => setForm((prev) => ({ ...prev, product: e.target.value }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Solicitado por</Label><Input value={form.requestedBy} onChange={(e) => setForm((prev) => ({ ...prev, requestedBy: e.target.value }))} /></div>
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
