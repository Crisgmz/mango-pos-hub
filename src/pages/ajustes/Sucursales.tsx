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
import { ArrowLeft, Plus, Store, MoreHorizontal, Pencil, Trash2, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  active: boolean;
  isMain: boolean;
}

const initialBranches: Branch[] = [
  { id: "1", name: "Sucursal Principal", address: "Av. Principal #123, Santo Domingo", phone: "809-555-0123", manager: "Carlos García", active: true, isMain: true },
  { id: "2", name: "Sucursal Zona Colonial", address: "Calle El Conde #45, Zona Colonial", phone: "809-555-0456", manager: "María López", active: true, isMain: false },
  { id: "3", name: "Sucursal Piantini", address: "Av. Abraham Lincoln #200, Piantini", phone: "809-555-0789", manager: "Pedro Martínez", active: false, isMain: false },
];

export default function Sucursales() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [form, setForm] = useState({ name: "", address: "", phone: "", manager: "", active: true, isMain: false });

  const resetForm = () => { setForm({ name: "", address: "", phone: "", manager: "", active: true, isMain: false }); setEditing(null); };
  const openAdd = () => { resetForm(); setIsModalOpen(true); };
  const openEdit = (b: Branch) => {
    setEditing(b);
    setForm({ name: b.name, address: b.address, phone: b.phone, manager: b.manager, active: b.active, isMain: b.isMain });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("El nombre es requerido"); return; }
    if (editing) {
      setBranches(prev => prev.map(b => b.id === editing.id ? { ...b, ...form } : b));
      toast.success("Sucursal actualizada");
    } else {
      setBranches(prev => [...prev, { ...form, id: Date.now().toString() }]);
      toast.success("Sucursal creada");
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => { setBranches(prev => prev.filter(b => b.id !== id)); toast.success("Sucursal eliminada"); };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Sucursales</h1>
            <p className="text-muted-foreground">Gestión de múltiples locales</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Agregar Sucursal</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Sucursales</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{branches.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Activas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-success">{branches.filter(b => b.active).length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Inactivas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{branches.filter(b => !b.active).length}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Store className="h-5 w-5" />Sucursales</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Encargado</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map(branch => (
                  <TableRow key={branch.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{branch.name}</span>
                        {branch.isMain && <Badge variant="secondary" className="text-xs">Principal</Badge>}
                      </div>
                    </TableCell>
                    <TableCell><div className="flex items-center gap-1 text-sm"><MapPin className="h-3 w-3 text-muted-foreground" />{branch.address}</div></TableCell>
                    <TableCell><div className="flex items-center gap-1 text-sm"><Phone className="h-3 w-3 text-muted-foreground" />{branch.phone}</div></TableCell>
                    <TableCell className="text-sm">{branch.manager}</TableCell>
                    <TableCell><Badge variant={branch.active ? "default" : "secondary"}>{branch.active ? "Activa" : "Inactiva"}</Badge></TableCell>
                    <TableCell>
                      {!branch.isMain && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(branch)}><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(branch.id)}><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editing ? "Editar Sucursal" : "Agregar Sucursal"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nombre *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Sucursal Piantini" /></div>
              <div className="space-y-2"><Label>Dirección</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Dirección completa" /></div>
              <div className="space-y-2"><Label>Teléfono</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="809-555-0000" /></div>
              <div className="space-y-2"><Label>Encargado</Label><Input value={form.manager} onChange={e => setForm({ ...form, manager: e.target.value })} placeholder="Nombre del encargado" /></div>
              <div className="flex items-center justify-between"><Label>Activa</Label><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>{editing ? "Guardar Cambios" : "Crear Sucursal"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
