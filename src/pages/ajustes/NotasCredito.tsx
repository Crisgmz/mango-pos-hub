import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, ReceiptText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CreditNote {
  id: string;
  date: string;
  refInvoice: string;
  customer: string;
  reason: string;
  amount: number;
  status: "Pendiente" | "Aplicada" | "Anulada";
}

const initialNotes: CreditNote[] = [
  { id: "nc1", date: "2026-02-19", refInvoice: "FAC-1201", customer: "Ana Perez", reason: "Devolucion parcial", amount: 450, status: "Aplicada" },
  { id: "nc2", date: "2026-02-18", refInvoice: "FAC-1194", customer: "Carlos Diaz", reason: "Error en cobro", amount: 300, status: "Pendiente" },
  { id: "nc3", date: "2026-02-17", refInvoice: "FAC-1188", customer: "Marta Lopez", reason: "Producto defectuoso", amount: 220, status: "Anulada" },
];

export default function NotasCredito() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<CreditNote[]>(initialNotes);
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: "2026-02-20", refInvoice: "", customer: "", reason: "", amount: 0 });

  const filtered = notes.filter((note) => (statusFilter === "all" ? true : note.status === statusFilter));

  const createNote = () => {
    if (!form.refInvoice.trim() || !form.customer.trim() || !form.reason.trim() || form.amount <= 0) {
      toast.error("Completa todos los campos requeridos");
      return;
    }
    setNotes((prev) => [{ id: `nc${Date.now()}`, ...form, status: "Pendiente" }, ...prev]);
    setOpen(false);
    setForm({ date: "2026-02-20", refInvoice: "", customer: "", reason: "", amount: 0 });
    toast.success("Nota de credito creada");
  };

  const applyNote = (id: string) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, status: "Aplicada" } : note)));
    toast.success("Nota aplicada");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}> <ArrowLeft className="h-5 w-5" /> </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Gestion de Notas de Credito</h1>
            <p className="text-muted-foreground">Anulaciones y devoluciones con trazabilidad</p>
          </div>
          <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" />Nueva nota</Button>
        </div>

        <Card>
          <CardContent className="pt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex gap-2">
              <Badge variant="secondary">Pendiente: {notes.filter((note) => note.status === "Pendiente").length}</Badge>
              <Badge variant="secondary">Aplicada: {notes.filter((note) => note.status === "Aplicada").length}</Badge>
              <Badge variant="secondary">Anulada: {notes.filter((note) => note.status === "Anulada").length}</Badge>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[220px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Aplicada">Aplicada</SelectItem>
                <SelectItem value="Anulada">Anulada</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ReceiptText className="h-5 w-5" />Notas de credito</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Factura</TableHead><TableHead>Cliente</TableHead><TableHead>Motivo</TableHead><TableHead>Monto</TableHead><TableHead>Estado</TableHead><TableHead className="w-[120px]">Accion</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell>{note.date}</TableCell>
                    <TableCell>{note.refInvoice}</TableCell>
                    <TableCell>{note.customer}</TableCell>
                    <TableCell>{note.reason}</TableCell>
                    <TableCell>RD$ {note.amount.toLocaleString()}</TableCell>
                    <TableCell><Badge variant={note.status === "Aplicada" ? "default" : "secondary"}>{note.status}</Badge></TableCell>
                    <TableCell><Button size="sm" variant="outline" disabled={note.status !== "Pendiente"} onClick={() => applyNote(note.id)}>Aplicar</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nueva nota de credito</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Factura referencia</Label><Input value={form.refInvoice} onChange={(e) => setForm((prev) => ({ ...prev, refInvoice: e.target.value }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Cliente</Label><Input value={form.customer} onChange={(e) => setForm((prev) => ({ ...prev, customer: e.target.value }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Motivo</Label><Input value={form.reason} onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Monto</Label><Input type="number" min={1} value={form.amount} onChange={(e) => setForm((prev) => ({ ...prev, amount: Number(e.target.value) }))} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={createNote}>Guardar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
