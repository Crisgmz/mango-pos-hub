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
import { ArrowLeft, Plus, Receipt, MoreHorizontal, Pencil, Trash2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Tax {
  id: string;
  name: string;
  percentage: number;
  appliesTo: string;
  active: boolean;
  isDefault: boolean;
}

const initialTaxes: Tax[] = [
  { id: "1", name: "ITBIS", percentage: 18, appliesTo: "Todos los productos", active: true, isDefault: true },
  { id: "2", name: "Propina Legal (10%)", percentage: 10, appliesTo: "Consumo en local", active: true, isDefault: false },
  { id: "3", name: "Exento", percentage: 0, appliesTo: "Productos exentos", active: true, isDefault: false },
];

export default function Impuestos() {
  const navigate = useNavigate();
  const [taxes, setTaxes] = useState<Tax[]>(initialTaxes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tax | null>(null);
  const [form, setForm] = useState({ name: "", percentage: 0, appliesTo: "", active: true, isDefault: false });

  const resetForm = () => { setForm({ name: "", percentage: 0, appliesTo: "", active: true, isDefault: false }); setEditing(null); };
  const openAdd = () => { resetForm(); setIsModalOpen(true); };
  const openEdit = (t: Tax) => {
    setEditing(t);
    setForm({ name: t.name, percentage: t.percentage, appliesTo: t.appliesTo, active: t.active, isDefault: t.isDefault });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("El nombre es requerido"); return; }
    if (editing) {
      setTaxes(prev => prev.map(t => t.id === editing.id ? { ...t, ...form } : t));
      toast.success("Impuesto actualizado");
    } else {
      setTaxes(prev => [...prev, { ...form, id: Date.now().toString() }]);
      toast.success("Impuesto creado");
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => { setTaxes(prev => prev.filter(t => t.id !== id)); toast.success("Impuesto eliminado"); };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Impuestos</h1>
            <p className="text-muted-foreground">ITBIS y configuración fiscal (DGII)</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Agregar Impuesto</Button>
        </div>

        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Receipt className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <p className="font-medium text-sm">Configuración Fiscal - República Dominicana</p>
                <p className="text-xs text-muted-foreground">El ITBIS estándar es del 18% según la DGII. La propina legal del 10% aplica para consumo en establecimiento.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" />Impuestos Configurados</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Porcentaje</TableHead>
                  <TableHead>Aplica a</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxes.map(tax => (
                  <TableRow key={tax.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tax.name}</span>
                        {tax.isDefault && <Badge variant="secondary" className="text-xs">Por defecto</Badge>}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="font-mono">{tax.percentage}%</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{tax.appliesTo}</TableCell>
                    <TableCell><Badge variant={tax.active ? "default" : "secondary"}>{tax.active ? "Activo" : "Inactivo"}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(tax)}><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                          {!tax.isDefault && <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(tax.id)}><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>}
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
            <DialogHeader><DialogTitle>{editing ? "Editar Impuesto" : "Agregar Impuesto"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nombre *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: ITBIS" /></div>
              <div className="space-y-2"><Label>Porcentaje (%)</Label><Input type="number" min={0} max={100} value={form.percentage} onChange={e => setForm({ ...form, percentage: Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label>Aplica a</Label><Input value={form.appliesTo} onChange={e => setForm({ ...form, appliesTo: e.target.value })} placeholder="Ej: Todos los productos" /></div>
              <div className="flex items-center justify-between"><Label>Activo</Label><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /></div>
              <div className="flex items-center justify-between"><Label>Impuesto por defecto</Label><Switch checked={form.isDefault} onCheckedChange={v => setForm({ ...form, isDefault: v })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>{editing ? "Guardar Cambios" : "Crear Impuesto"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
