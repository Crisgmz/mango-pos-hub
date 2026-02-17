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
import { ArrowLeft, Plus, Layers, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProducts } from "@/contexts/ProductsContext";

interface ComboItem {
  productId: string;
  productName: string;
  quantity: number;
}

interface Combo {
  id: string;
  name: string;
  description: string;
  price: number;
  items: ComboItem[];
  discount: number;
  active: boolean;
}

const initialCombos: Combo[] = [
  {
    id: "1",
    name: "Combo Familiar",
    description: "Para compartir en familia",
    price: 899,
    items: [
      { productId: "1", productName: "Hamburguesa Clásica", quantity: 2 },
      { productId: "3", productName: "Papas Fritas", quantity: 2 },
      { productId: "5", productName: "Refresco Grande", quantity: 4 },
    ],
    discount: 15,
    active: true,
  },
  {
    id: "2",
    name: "Combo Ejecutivo",
    description: "Almuerzo rápido",
    price: 450,
    items: [
      { productId: "2", productName: "Pechuga a la Plancha", quantity: 1 },
      { productId: "4", productName: "Ensalada César", quantity: 1 },
      { productId: "6", productName: "Jugo Natural", quantity: 1 },
    ],
    discount: 10,
    active: true,
  },
];

export default function Combos() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [combos, setCombos] = useState<Combo[]>(initialCombos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Combo | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: 0, discount: 0, items: [] as ComboItem[], active: true });
  const [selectedProduct, setSelectedProduct] = useState("");
  const [itemQty, setItemQty] = useState(1);

  const resetForm = () => { setForm({ name: "", description: "", price: 0, discount: 0, items: [], active: true }); setEditing(null); };

  const openAdd = () => { resetForm(); setIsModalOpen(true); };
  const openEdit = (c: Combo) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description, price: c.price, discount: c.discount, items: [...c.items], active: c.active });
    setIsModalOpen(true);
  };

  const addItem = () => {
    if (!selectedProduct) return;
    const prod = products.find(p => p.id === selectedProduct);
    if (!prod) return;
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { productId: prod.id, productName: prod.name, quantity: itemQty }],
    }));
    setSelectedProduct("");
    setItemQty(1);
  };

  const removeItem = (idx: number) => {
    setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("El nombre es requerido"); return; }
    if (form.price <= 0) { toast.error("El precio debe ser mayor a 0"); return; }
    if (form.items.length < 2) { toast.error("Un combo debe tener al menos 2 productos"); return; }

    if (editing) {
      setCombos(prev => prev.map(c => c.id === editing.id ? { ...form, id: editing.id } : c));
      toast.success("Combo actualizado");
    } else {
      setCombos(prev => [...prev, { ...form, id: Date.now().toString() }]);
      toast.success("Combo creado");
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => { setCombos(prev => prev.filter(c => c.id !== id)); toast.success("Combo eliminado"); };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Combos</h1>
            <p className="text-muted-foreground">Paquetes y ofertas especiales</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Agregar Combo</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Combos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{combos.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Activos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-success">{combos.filter(c => c.active).length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Precio Promedio</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-info">RD$ {combos.length > 0 ? Math.round(combos.reduce((s, c) => s + c.price, 0) / combos.length) : 0}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5" />Lista de Combos</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {combos.map((combo) => (
                  <TableRow key={combo.id}>
                    <TableCell>
                      <div><span className="font-medium">{combo.name}</span><p className="text-xs text-muted-foreground">{combo.description}</p></div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {combo.items.map((item, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{item.quantity}x {item.productName}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">RD$ {combo.price.toLocaleString()}</TableCell>
                    <TableCell><Badge className="bg-success/10 text-success border-0">{combo.discount}%</Badge></TableCell>
                    <TableCell><Badge variant={combo.active ? "default" : "secondary"}>{combo.active ? "Activo" : "Inactivo"}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(combo)}><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(combo.id)}><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {combos.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No hay combos configurados</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Editar Combo" : "Agregar Combo"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nombre *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Combo Familiar" /></div>
              <div className="space-y-2"><Label>Descripción</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descripción del combo" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Precio *</Label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Descuento (%)</Label><Input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: Number(e.target.value) })} /></div>
              </div>
              <div className="space-y-2">
                <Label>Productos del Combo</Label>
                {form.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
                    <span className="flex-1 text-sm">{item.quantity}x {item.productName}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(i)}><X className="h-3 w-3" /></Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <select className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                    <option value="">Seleccionar producto...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <Input className="w-16" type="number" min={1} value={itemQty} onChange={e => setItemQty(Number(e.target.value))} />
                  <Button variant="outline" size="icon" onClick={addItem}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="flex items-center justify-between"><Label>Activo</Label><Switch checked={form.active} onCheckedChange={c => setForm({ ...form, active: c })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>{editing ? "Guardar Cambios" : "Crear Combo"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
