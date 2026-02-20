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
import { ArrowLeft, ClipboardList, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SalidaRecord {
  id: string;
  date: string;
  product: string;
  qty: number;
  warehouse: string;
  reason: string;
  responsible: string;
}

const initialRecords: SalidaRecord[] = [
  { id: "s1", date: "2026-02-19", product: "Tomate", qty: 12, warehouse: "Principal", reason: "Consumo interno", responsible: "Juan Perez" },
  { id: "s2", date: "2026-02-19", product: "Arroz Premium 25lb", qty: 3, warehouse: "Sucursal Norte", reason: "Transferencia", responsible: "Maria Ruiz" },
  { id: "s3", date: "2026-02-18", product: "Aceite Vegetal 1L", qty: 6, warehouse: "Principal", reason: "Produccion", responsible: "Carlos Peña" },
];

export default function SalidaInventario() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<SalidaRecord[]>(initialRecords);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    date: "2026-02-19",
    product: "",
    qty: 1,
    warehouse: "Principal",
    reason: "Consumo interno",
    responsible: "",
  });

  const filtered = records.filter((record) => {
    const q = query.toLowerCase();
    return (
      record.product.toLowerCase().includes(q) ||
      record.reason.toLowerCase().includes(q) ||
      record.responsible.toLowerCase().includes(q)
    );
  });

  const totalToday = useMemo(
    () => filtered.filter((record) => record.date === "2026-02-19").reduce((acc, record) => acc + record.qty, 0),
    [filtered]
  );

  const createRecord = () => {
    if (!form.product.trim() || !form.responsible.trim()) {
      toast.error("Producto y responsable son requeridos");
      return;
    }

    setRecords((prev) => [
      {
        id: `s${Date.now()}`,
        date: form.date,
        product: form.product,
        qty: Number(form.qty),
        warehouse: form.warehouse,
        reason: form.reason,
        responsible: form.responsible,
      },
      ...prev,
    ]);
    setIsOpen(false);
    setForm({ date: "2026-02-19", product: "", qty: 1, warehouse: "Principal", reason: "Consumo interno", responsible: "" });
    toast.success("Salida de inventario registrada");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Registro de Salida de Inventario</h1>
            <p className="text-muted-foreground">Control visual de salidas de stock</p>
          </div>
          <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Nueva salida</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Registros</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{filtered.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Unidades hoy</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{totalToday}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Ultima fecha</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{filtered[0]?.date ?? "-"}</p></CardContent></Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar producto, motivo o responsable" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" />Salidas registradas</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Almacen</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Responsable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell className="font-medium">{record.product}</TableCell>
                    <TableCell><Badge variant="secondary">{record.qty}</Badge></TableCell>
                    <TableCell>{record.warehouse}</TableCell>
                    <TableCell>{record.reason}</TableCell>
                    <TableCell>{record.responsible}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar salida</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Cantidad</Label><Input type="number" min={1} value={form.qty} onChange={(e) => setForm((prev) => ({ ...prev, qty: Number(e.target.value) }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Producto</Label><Input value={form.product} onChange={(e) => setForm((prev) => ({ ...prev, product: e.target.value }))} /></div>
              <div className="space-y-2">
                <Label>Almacen</Label>
                <Select value={form.warehouse} onValueChange={(value) => setForm((prev) => ({ ...prev, warehouse: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Principal">Principal</SelectItem>
                    <SelectItem value="Sucursal Norte">Sucursal Norte</SelectItem>
                    <SelectItem value="Sucursal Este">Sucursal Este</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Motivo</Label>
                <Select value={form.reason} onValueChange={(value) => setForm((prev) => ({ ...prev, reason: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consumo interno">Consumo interno</SelectItem>
                    <SelectItem value="Produccion">Produccion</SelectItem>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                    <SelectItem value="Merma">Merma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2"><Label>Responsable</Label><Input value={form.responsible} onChange={(e) => setForm((prev) => ({ ...prev, responsible: e.target.value }))} /></div>
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
