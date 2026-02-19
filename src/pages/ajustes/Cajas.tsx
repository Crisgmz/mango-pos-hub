import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, Plus, Wallet, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CashRegister {
  id: string;
  name: string;
  location: string;
  printer: string;
  active: boolean;
  defaultAmount: number;
}

const initialRegisters: CashRegister[] = [
  { id: "1", name: "Caja Principal", location: "Área principal", printer: "Impresora 1", active: true, defaultAmount: 5000 },
  { id: "2", name: "Caja Barra", location: "Barra", printer: "Impresora 2", active: true, defaultAmount: 3000 },
  { id: "3", name: "Caja Terraza", location: "Terraza", printer: "Impresora 3", active: false, defaultAmount: 2000 },
];

export default function Cajas() {
  const navigate = useNavigate();
  const [registers, setRegisters] = useState<CashRegister[]>(initialRegisters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<CashRegister | null>(null);
  const [form, setForm] = useState({ name: "", location: "", printer: "", active: true, defaultAmount: 5000 });

  const resetForm = () => { setForm({ name: "", location: "", printer: "", active: true, defaultAmount: 5000 }); setEditing(null); };
  const openAdd = () => { resetForm(); setIsModalOpen(true); };
  const openEdit = (r: CashRegister) => {
    setEditing(r);
    setForm({ name: r.name, location: r.location, printer: r.printer, active: r.active, defaultAmount: r.defaultAmount });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("El nombre es requerido"); return; }
    if (editing) {
      setRegisters(prev => prev.map(r => r.id === editing.id ? { ...r, ...form } : r));
      toast.success("Caja actualizada");
    } else {
      setRegisters(prev => [...prev, { ...form, id: Date.now().toString() }]);
      toast.success("Caja creada");
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => { setRegisters(prev => prev.filter(r => r.id !== id)); toast.success("Caja eliminada"); };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Cajas</h1>
            <p className="text-muted-foreground">Configuración de puntos de venta</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Agregar Caja</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Cajas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{registers.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Activas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-success">{registers.filter(r => r.active).length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Fondo Inicial Total</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-warning">RD$ {registers.filter(r => r.active).reduce((s, r) => s + r.defaultAmount, 0).toLocaleString()}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5" />Puntos de Venta</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Impresora</TableHead>
                  <TableHead>Fondo Inicial</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registers.map(reg => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium">{reg.name}</TableCell>
                    <TableCell>{reg.location}</TableCell>
                    <TableCell><Badge variant="outline">{reg.printer}</Badge></TableCell>
                    <TableCell className="font-medium">RD$ {reg.defaultAmount.toLocaleString()}</TableCell>
                    <TableCell><Badge variant={reg.active ? "default" : "secondary"}>{reg.active ? "Activa" : "Inactiva"}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(reg)}><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(reg.id)}><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editing ? "Editar Caja" : "Agregar Caja"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nombre *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Caja Principal" /></div>
              <div className="space-y-2"><Label>Ubicación</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Ej: Área principal" /></div>
              <div className="space-y-2"><Label>Impresora asignada</Label><Input value={form.printer} onChange={e => setForm({ ...form, printer: e.target.value })} placeholder="Ej: Impresora 1" /></div>
              <div className="space-y-2"><Label>Fondo inicial (RD$)</Label><Input type="number" value={form.defaultAmount} onChange={e => setForm({ ...form, defaultAmount: Number(e.target.value) })} /></div>
              <div className="flex items-center justify-between">
                <Label>Activa</Label>
                <Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>{editing ? "Guardar Cambios" : "Crear Caja"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
