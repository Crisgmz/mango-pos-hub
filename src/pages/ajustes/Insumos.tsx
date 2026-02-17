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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, Plus, Package, MoreHorizontal, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type InsumoUnit = "kg" | "g" | "lt" | "ml" | "unid" | "lb";

interface Insumo {
  id: string;
  name: string;
  category: string;
  unit: InsumoUnit;
  currentStock: number;
  minStock: number;
  cost: number;
  supplier: string;
  active: boolean;
}

const initialInsumos: Insumo[] = [
  { id: "1", name: "Carne de Res Molida", category: "Carnes", unit: "kg", currentStock: 25, minStock: 10, cost: 280, supplier: "Carnes del Norte", active: true },
  { id: "2", name: "Pechuga de Pollo", category: "Carnes", unit: "kg", currentStock: 15, minStock: 8, cost: 195, supplier: "Carnes del Norte", active: true },
  { id: "3", name: "Lechuga Romana", category: "Vegetales", unit: "kg", currentStock: 5, minStock: 3, cost: 65, supplier: "Verduras Frescas", active: true },
  { id: "4", name: "Tomates", category: "Vegetales", unit: "kg", currentStock: 8, minStock: 5, cost: 45, supplier: "Verduras Frescas", active: true },
  { id: "5", name: "Queso Cheddar", category: "Lácteos", unit: "kg", currentStock: 3, minStock: 5, cost: 350, supplier: "Lácteos Premium", active: true },
  { id: "6", name: "Pan Brioche", category: "Panadería", unit: "unid", currentStock: 50, minStock: 20, cost: 15, supplier: "Panadería Central", active: true },
  { id: "7", name: "Aceite de Oliva", category: "Aceites", unit: "lt", currentStock: 2, minStock: 3, cost: 450, supplier: "Importadora ABC", active: true },
];

const categories = ["Carnes", "Vegetales", "Lácteos", "Panadería", "Aceites", "Condimentos", "Bebidas", "Otros"];

export default function Insumos() {
  const navigate = useNavigate();
  const [insumos, setInsumos] = useState<Insumo[]>(initialInsumos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Insumo | null>(null);
  const [form, setForm] = useState({ name: "", category: "Carnes", unit: "kg" as InsumoUnit, currentStock: 0, minStock: 0, cost: 0, supplier: "", active: true });
  const [filter, setFilter] = useState("all");

  const resetForm = () => { setForm({ name: "", category: "Carnes", unit: "kg", currentStock: 0, minStock: 0, cost: 0, supplier: "", active: true }); setEditing(null); };
  const openAdd = () => { resetForm(); setIsModalOpen(true); };
  const openEdit = (ins: Insumo) => {
    setEditing(ins);
    setForm({ name: ins.name, category: ins.category, unit: ins.unit, currentStock: ins.currentStock, minStock: ins.minStock, cost: ins.cost, supplier: ins.supplier, active: ins.active });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("El nombre es requerido"); return; }
    if (editing) {
      setInsumos(prev => prev.map(i => i.id === editing.id ? { ...form, id: editing.id } : i));
      toast.success("Insumo actualizado");
    } else {
      setInsumos(prev => [...prev, { ...form, id: Date.now().toString() }]);
      toast.success("Insumo creado");
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => { setInsumos(prev => prev.filter(i => i.id !== id)); toast.success("Insumo eliminado"); };

  const lowStock = insumos.filter(i => i.currentStock <= i.minStock);
  const filtered = filter === "all" ? insumos : filter === "low" ? lowStock : insumos.filter(i => i.category === filter);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Insumos</h1>
            <p className="text-muted-foreground">Materias primas e ingredientes</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Agregar Insumo</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Insumos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{insumos.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Categorías</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-info">{new Set(insumos.map(i => i.category)).size}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Stock Bajo</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{lowStock.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Valor Inventario</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-success">RD$ {insumos.reduce((s, i) => s + (i.cost * i.currentStock), 0).toLocaleString()}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />Lista de Insumos</CardTitle>
              <div className="flex gap-2">
                <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>Todos</Button>
                <Button variant={filter === "low" ? "destructive" : "outline"} size="sm" onClick={() => setFilter("low")}>
                  <AlertTriangle className="h-3 w-3 mr-1" />Stock Bajo ({lowStock.length})
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Mínimo</TableHead>
                  <TableHead>Costo Unit.</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((ins) => (
                  <TableRow key={ins.id} className={ins.currentStock <= ins.minStock ? "bg-destructive/5" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {ins.currentStock <= ins.minStock && <AlertTriangle className="h-4 w-4 text-destructive" />}
                        {ins.name}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{ins.category}</Badge></TableCell>
                    <TableCell className={ins.currentStock <= ins.minStock ? "text-destructive font-bold" : ""}>{ins.currentStock} {ins.unit}</TableCell>
                    <TableCell className="text-muted-foreground">{ins.minStock} {ins.unit}</TableCell>
                    <TableCell>RD$ {ins.cost}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{ins.supplier}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(ins)}><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(ins.id)}><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No hay insumos que mostrar</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editing ? "Editar Insumo" : "Agregar Insumo"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nombre *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Carne de Res Molida" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Unidad</Label>
                  <Select value={form.unit} onValueChange={(v: InsumoUnit) => setForm({ ...form, unit: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogramos</SelectItem>
                      <SelectItem value="g">Gramos</SelectItem>
                      <SelectItem value="lt">Litros</SelectItem>
                      <SelectItem value="ml">Mililitros</SelectItem>
                      <SelectItem value="unid">Unidades</SelectItem>
                      <SelectItem value="lb">Libras</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Stock Actual</Label><Input type="number" value={form.currentStock} onChange={e => setForm({ ...form, currentStock: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Stock Mínimo</Label><Input type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: Number(e.target.value) })} /></div>
              </div>
              <div className="space-y-2"><Label>Costo Unitario (RD$)</Label><Input type="number" value={form.cost} onChange={e => setForm({ ...form, cost: Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label>Proveedor</Label><Input value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} placeholder="Nombre del proveedor" /></div>
              <div className="flex items-center justify-between"><Label>Activo</Label><Switch checked={form.active} onCheckedChange={c => setForm({ ...form, active: c })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>{editing ? "Guardar Cambios" : "Crear Insumo"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
