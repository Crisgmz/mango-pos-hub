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
import { AlertTriangle, ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface MermaRecord {
  id: string;
  date: string;
  product: string;
  warehouse: string;
  qty: number;
  unitCost: number;
  reason: string;
}

const initialRecords: MermaRecord[] = [
  { id: "m1", date: "2026-02-19", product: "Lechuga", warehouse: "Principal", qty: 8, unitCost: 35, reason: "Vencimiento" },
  { id: "m2", date: "2026-02-18", product: "Queso Mozzarella", warehouse: "Sucursal Este", qty: 2, unitCost: 280, reason: "Cadena de frio" },
  { id: "m3", date: "2026-02-17", product: "Pan", warehouse: "Principal", qty: 20, unitCost: 15, reason: "Manipulacion" },
];

export default function Mermas() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<MermaRecord[]>(initialRecords);
  const [isOpen, setIsOpen] = useState(false);
  const [reasonFilter, setReasonFilter] = useState("all");
  const [form, setForm] = useState({
    date: "2026-02-19",
    product: "",
    warehouse: "Principal",
    qty: 1,
    unitCost: 0,
    reason: "Vencimiento",
  });

  const filtered = records.filter((record) => (reasonFilter === "all" ? true : record.reason === reasonFilter));
  const totalLoss = useMemo(() => filtered.reduce((acc, record) => acc + record.qty * record.unitCost, 0), [filtered]);

  const createRecord = () => {
    if (!form.product.trim()) {
      toast.error("Producto requerido");
      return;
    }

    setRecords((prev) => [
      {
        id: `m${Date.now()}`,
        date: form.date,
        product: form.product,
        warehouse: form.warehouse,
        qty: Number(form.qty),
        unitCost: Number(form.unitCost),
        reason: form.reason,
      },
      ...prev,
    ]);
    setIsOpen(false);
    setForm({ date: "2026-02-19", product: "", warehouse: "Principal", qty: 1, unitCost: 0, reason: "Vencimiento" });
    toast.success("Merma registrada");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Mermas o Perecederos</h1>
            <p className="text-muted-foreground">Registro de perdidas y control de causas</p>
          </div>
          <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Nueva merma</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Registros</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{filtered.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Unidades perdidas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{filtered.reduce((acc, item) => acc + item.qty, 0)}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Costo perdido</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-destructive">RD$ {totalLoss.toLocaleString()}</p></CardContent></Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" />Controla mermas para mejorar compras y produccion.</p>
              <Select value={reasonFilter} onValueChange={setReasonFilter}>
                <SelectTrigger className="w-full md:w-[220px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los motivos</SelectItem>
                  <SelectItem value="Vencimiento">Vencimiento</SelectItem>
                  <SelectItem value="Manipulacion">Manipulacion</SelectItem>
                  <SelectItem value="Cadena de frio">Cadena de frio</SelectItem>
                  <SelectItem value="Produccion">Produccion</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Historial de mermas</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Almacen</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Costo unitario</TableHead>
                  <TableHead>Costo total</TableHead>
                  <TableHead>Motivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell className="font-medium">{record.product}</TableCell>
                    <TableCell>{record.warehouse}</TableCell>
                    <TableCell>{record.qty}</TableCell>
                    <TableCell>RD$ {record.unitCost.toLocaleString()}</TableCell>
                    <TableCell>RD$ {(record.qty * record.unitCost).toLocaleString()}</TableCell>
                    <TableCell><Badge variant="secondary">{record.reason}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar merma</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Cantidad</Label><Input type="number" min={1} value={form.qty} onChange={(e) => setForm((prev) => ({ ...prev, qty: Number(e.target.value) }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Producto</Label><Input value={form.product} onChange={(e) => setForm((prev) => ({ ...prev, product: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Almacen</Label><Input value={form.warehouse} onChange={(e) => setForm((prev) => ({ ...prev, warehouse: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Costo unitario</Label><Input type="number" min={0} value={form.unitCost} onChange={(e) => setForm((prev) => ({ ...prev, unitCost: Number(e.target.value) }))} /></div>
              <div className="space-y-2 md:col-span-2">
                <Label>Motivo</Label>
                <Select value={form.reason} onValueChange={(value) => setForm((prev) => ({ ...prev, reason: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vencimiento">Vencimiento</SelectItem>
                    <SelectItem value="Manipulacion">Manipulacion</SelectItem>
                    <SelectItem value="Cadena de frio">Cadena de frio</SelectItem>
                    <SelectItem value="Produccion">Produccion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={createRecord}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
