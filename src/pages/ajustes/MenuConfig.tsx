import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, Plus, ClipboardList, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Menu {
  id: string;
  name: string;
  description: string;
  schedule: string;
  active: boolean;
  productCount: number;
}

const initialMenus: Menu[] = [
  { id: "1", name: "Menú Principal", description: "Carta completa del restaurante", schedule: "Todo el día", active: true, productCount: 45 },
  { id: "2", name: "Menú Almuerzo", description: "Opciones de almuerzo ejecutivo", schedule: "11:00 AM - 3:00 PM", active: true, productCount: 12 },
  { id: "3", name: "Menú Desayuno", description: "Desayunos y brunch", schedule: "7:00 AM - 11:00 AM", active: true, productCount: 18 },
  { id: "4", name: "Menú Happy Hour", description: "Bebidas y aperitivos especiales", schedule: "4:00 PM - 7:00 PM", active: false, productCount: 8 },
];

export default function MenuConfig() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Menu | null>(null);
  const [form, setForm] = useState({ name: "", description: "", schedule: "", active: true });

  const resetForm = () => { setForm({ name: "", description: "", schedule: "", active: true }); setEditing(null); };
  const openAdd = () => { resetForm(); setIsModalOpen(true); };
  const openEdit = (m: Menu) => {
    setEditing(m);
    setForm({ name: m.name, description: m.description, schedule: m.schedule, active: m.active });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("El nombre es requerido"); return; }
    if (editing) {
      setMenus(prev => prev.map(m => m.id === editing.id ? { ...editing, ...form } : m));
      toast.success("Menú actualizado");
    } else {
      setMenus(prev => [...prev, { ...form, id: Date.now().toString(), productCount: 0 }]);
      toast.success("Menú creado");
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => { setMenus(prev => prev.filter(m => m.id !== id)); toast.success("Menú eliminado"); };
  const toggleActive = (id: string) => { setMenus(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m)); };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Menú</h1>
            <p className="text-muted-foreground">Configuración de menús</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Agregar Menú</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Menús</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{menus.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Activos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-success">{menus.filter(m => m.active).length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Productos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-info">{menus.reduce((s, m) => s + m.productCount, 0)}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" />Lista de Menús</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menus.map((menu) => (
                  <TableRow key={menu.id}>
                    <TableCell className="font-medium">{menu.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{menu.description}</TableCell>
                    <TableCell><Badge variant="outline">{menu.schedule}</Badge></TableCell>
                    <TableCell><Badge variant="secondary">{menu.productCount}</Badge></TableCell>
                    <TableCell><Switch checked={menu.active} onCheckedChange={() => toggleActive(menu.id)} /></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(menu)}><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(menu.id)}><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {menus.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No hay menús configurados</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editing ? "Editar Menú" : "Agregar Menú"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nombre *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Menú Principal" /></div>
              <div className="space-y-2"><Label>Descripción</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descripción del menú" /></div>
              <div className="space-y-2"><Label>Horario</Label><Input value={form.schedule} onChange={e => setForm({ ...form, schedule: e.target.value })} placeholder="Ej: 11:00 AM - 3:00 PM" /></div>
              <div className="flex items-center justify-between"><Label>Activo</Label><Switch checked={form.active} onCheckedChange={c => setForm({ ...form, active: c })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>{editing ? "Guardar Cambios" : "Crear Menú"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
