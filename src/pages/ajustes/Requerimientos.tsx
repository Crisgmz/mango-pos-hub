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
import { ArrowLeft, FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface RequestItem {
  id: string;
  date: string;
  from: string;
  to: string;
  product: string;
  qty: number;
  priority: "Baja" | "Media" | "Alta";
  status: "Pendiente" | "Aprobado" | "Rechazado";
}

const initialRequests: RequestItem[] = [
  { id: "r1", date: "2026-02-19", from: "Sucursal Norte", to: "Principal", product: "Arroz Premium 25lb", qty: 8, priority: "Alta", status: "Pendiente" },
  { id: "r2", date: "2026-02-18", from: "Sucursal Este", to: "Principal", product: "Aceite Vegetal 1L", qty: 15, priority: "Media", status: "Aprobado" },
  { id: "r3", date: "2026-02-17", from: "Sucursal Norte", to: "Principal", product: "Queso Mozzarella", qty: 4, priority: "Baja", status: "Rechazado" },
];

export default function Requerimientos() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  const [isOpen, setIsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({
    date: "2026-02-19",
    from: "Sucursal Norte",
    to: "Principal",
    product: "",
    qty: 1,
    priority: "Media" as const,
  });

  const filtered = requests.filter((item) => (statusFilter === "all" ? true : item.status === statusFilter));

  const createRequest = () => {
    if (!form.product.trim()) {
      toast.error("Producto requerido");
      return;
    }

    setRequests((prev) => [
      {
        id: `r${Date.now()}`,
        date: form.date,
        from: form.from,
        to: form.to,
        product: form.product,
        qty: Number(form.qty),
        priority: form.priority,
        status: "Pendiente",
      },
      ...prev,
    ]);

    setIsOpen(false);
    setForm({ date: "2026-02-19", from: "Sucursal Norte", to: "Principal", product: "", qty: 1, priority: "Media" });
    toast.success("Requerimiento creado");
  };

  const updateStatus = (id: string, status: "Aprobado" | "Rechazado") => {
    setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    toast.success(`Requerimiento ${status.toLowerCase()}`);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Requerimientos</h1>
            <p className="text-muted-foreground">Solicitudes de stock entre sucursales y almacen central</p>
          </div>
          <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Nuevo requerimiento</Button>
        </div>

        <Card>
          <CardContent className="pt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex gap-2">
              <Badge variant="secondary">Pendiente: {requests.filter((item) => item.status === "Pendiente").length}</Badge>
              <Badge variant="secondary">Aprobado: {requests.filter((item) => item.status === "Aprobado").length}</Badge>
              <Badge variant="secondary">Rechazado: {requests.filter((item) => item.status === "Rechazado").length}</Badge>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[220px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Aprobado">Aprobado</SelectItem>
                <SelectItem value="Rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Listado de requerimientos</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Solicita</TableHead>
                  <TableHead>Abastece</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[180px]">Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.from}</TableCell>
                    <TableCell>{item.to}</TableCell>
                    <TableCell className="font-medium">{item.product}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>
                      <Badge variant={item.priority === "Alta" ? "destructive" : "secondary"}>{item.priority}</Badge>
                    </TableCell>
                    <TableCell><Badge variant={item.status === "Aprobado" ? "default" : "secondary"}>{item.status}</Badge></TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" disabled={item.status !== "Pendiente"} onClick={() => updateStatus(item.id, "Aprobado")}>Aprobar</Button>
                      <Button size="sm" variant="outline" disabled={item.status !== "Pendiente"} onClick={() => updateStatus(item.id, "Rechazado")}>Rechazar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo requerimiento</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Cantidad</Label><Input type="number" min={1} value={form.qty} onChange={(e) => setForm((prev) => ({ ...prev, qty: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Sucursal solicitante</Label><Input value={form.from} onChange={(e) => setForm((prev) => ({ ...prev, from: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Almacen origen</Label><Input value={form.to} onChange={(e) => setForm((prev) => ({ ...prev, to: e.target.value }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Producto</Label><Input value={form.product} onChange={(e) => setForm((prev) => ({ ...prev, product: e.target.value }))} /></div>
              <div className="space-y-2 md:col-span-2">
                <Label>Prioridad</Label>
                <Select value={form.priority} onValueChange={(value: "Baja" | "Media" | "Alta") => setForm((prev) => ({ ...prev, priority: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={createRequest}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
