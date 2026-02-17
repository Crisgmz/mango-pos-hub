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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Settings, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

interface ModifierGroup {
  id: string;
  name: string;
  type: "single" | "multiple";
  required: boolean;
  minSelect: number;
  maxSelect: number;
  options: ModifierOption[];
  active: boolean;
}

const initialModifiers: ModifierGroup[] = [
  {
    id: "1",
    name: "Tamaño de Bebida",
    type: "single",
    required: true,
    minSelect: 1,
    maxSelect: 1,
    options: [
      { id: "1a", name: "Pequeño (12oz)", price: 0 },
      { id: "1b", name: "Mediano (16oz)", price: 25 },
      { id: "1c", name: "Grande (20oz)", price: 50 },
    ],
    active: true,
  },
  {
    id: "2",
    name: "Extras de Hamburguesa",
    type: "multiple",
    required: false,
    minSelect: 0,
    maxSelect: 5,
    options: [
      { id: "2a", name: "Queso extra", price: 35 },
      { id: "2b", name: "Tocino", price: 50 },
      { id: "2c", name: "Aguacate", price: 45 },
      { id: "2d", name: "Huevo frito", price: 30 },
    ],
    active: true,
  },
  {
    id: "3",
    name: "Punto de Cocción",
    type: "single",
    required: true,
    minSelect: 1,
    maxSelect: 1,
    options: [
      { id: "3a", name: "Término medio", price: 0 },
      { id: "3b", name: "Tres cuartos", price: 0 },
      { id: "3c", name: "Bien cocido", price: 0 },
    ],
    active: true,
  },
];

const emptyForm: Omit<ModifierGroup, "id"> = {
  name: "",
  type: "single",
  required: false,
  minSelect: 0,
  maxSelect: 1,
  options: [],
  active: true,
};

export default function Modificadores() {
  const navigate = useNavigate();
  const [modifiers, setModifiers] = useState<ModifierGroup[]>(initialModifiers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<ModifierGroup | null>(null);
  const [form, setForm] = useState<Omit<ModifierGroup, "id">>(emptyForm);
  const [newOptionName, setNewOptionName] = useState("");
  const [newOptionPrice, setNewOptionPrice] = useState(0);

  const resetForm = () => { setForm(emptyForm); setEditing(null); setNewOptionName(""); setNewOptionPrice(0); };

  const openAdd = () => { resetForm(); setIsModalOpen(true); };
  const openEdit = (m: ModifierGroup) => {
    setEditing(m);
    setForm({ name: m.name, type: m.type, required: m.required, minSelect: m.minSelect, maxSelect: m.maxSelect, options: [...m.options], active: m.active });
    setIsModalOpen(true);
  };

  const addOption = () => {
    if (!newOptionName.trim()) return;
    setForm(prev => ({
      ...prev,
      options: [...prev.options, { id: Date.now().toString(), name: newOptionName, price: newOptionPrice }],
    }));
    setNewOptionName("");
    setNewOptionPrice(0);
  };

  const removeOption = (optId: string) => {
    setForm(prev => ({ ...prev, options: prev.options.filter(o => o.id !== optId) }));
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("El nombre es requerido"); return; }
    if (form.options.length === 0) { toast.error("Agrega al menos una opción"); return; }

    if (editing) {
      setModifiers(prev => prev.map(m => m.id === editing.id ? { ...form, id: editing.id } : m));
      toast.success("Modificador actualizado");
    } else {
      setModifiers(prev => [...prev, { ...form, id: Date.now().toString() }]);
      toast.success("Modificador creado");
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setModifiers(prev => prev.filter(m => m.id !== id));
    toast.success("Modificador eliminado");
  };

  const toggleActive = (id: string) => {
    setModifiers(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  const totalOptions = modifiers.reduce((sum, m) => sum + m.options.length, 0);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Modificadores</h1>
            <p className="text-muted-foreground">Extras y variantes de productos</p>
          </div>
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Modificador
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Grupos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{modifiers.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Opciones</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-info">{totalOptions}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Activos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-success">{modifiers.filter(m => m.active).length}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />Lista de Modificadores</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Opciones</TableHead>
                  <TableHead>Requerido</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modifiers.map((mod) => (
                  <TableRow key={mod.id}>
                    <TableCell className="font-medium">{mod.name}</TableCell>
                    <TableCell><Badge variant="secondary">{mod.type === "single" ? "Selección única" : "Múltiple"}</Badge></TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {mod.options.slice(0, 3).map(o => (
                          <Badge key={o.id} variant="outline" className="text-xs">
                            {o.name}{o.price > 0 ? ` +$${o.price}` : ""}
                          </Badge>
                        ))}
                        {mod.options.length > 3 && <Badge variant="outline" className="text-xs">+{mod.options.length - 3}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>{mod.required ? <Badge className="bg-warning/10 text-warning border-0">Sí</Badge> : <span className="text-muted-foreground">No</span>}</TableCell>
                    <TableCell><Switch checked={mod.active} onCheckedChange={() => toggleActive(mod.id)} /></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(mod)}><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(mod.id)}><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {modifiers.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No hay modificadores configurados</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Modificador" : "Agregar Modificador"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre del Grupo *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Tamaño de Bebida" />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Selección</Label>
                <Select value={form.type} onValueChange={(v: "single" | "multiple") => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Selección Única</SelectItem>
                    <SelectItem value="multiple">Selección Múltiple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Requerido</Label>
                <Switch checked={form.required} onCheckedChange={c => setForm({ ...form, required: c })} />
              </div>

              <div className="space-y-2">
                <Label>Opciones</Label>
                <div className="space-y-2">
                  {form.options.map(opt => (
                    <div key={opt.id} className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
                      <span className="flex-1 text-sm">{opt.name}</span>
                      <span className="text-sm text-muted-foreground">+RD$ {opt.price}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeOption(opt.id)}><X className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input className="flex-1" placeholder="Nombre de opción" value={newOptionName} onChange={e => setNewOptionName(e.target.value)} />
                  <Input className="w-24" type="number" placeholder="Precio" value={newOptionPrice} onChange={e => setNewOptionPrice(Number(e.target.value))} />
                  <Button variant="outline" size="icon" onClick={addOption}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Activo</Label>
                <Switch checked={form.active} onCheckedChange={c => setForm({ ...form, active: c })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>{editing ? "Guardar Cambios" : "Crear Modificador"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
