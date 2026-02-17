import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft, Plus, FileText, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  cost: number;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  portions: number;
  ingredients: Ingredient[];
  totalCost: number;
  preparationTime: string;
}

const initialRecipes: Recipe[] = [
  {
    id: "1", name: "Hamburguesa Clásica", description: "Hamburguesa con todos los ingredientes", portions: 1,
    ingredients: [
      { name: "Carne molida", quantity: "150", unit: "g", cost: 85 },
      { name: "Pan brioche", quantity: "1", unit: "unid", cost: 15 },
      { name: "Lechuga", quantity: "30", unit: "g", cost: 5 },
      { name: "Tomate", quantity: "2", unit: "rodajas", cost: 8 },
      { name: "Queso cheddar", quantity: "1", unit: "loncha", cost: 20 },
    ],
    totalCost: 133, preparationTime: "15 min",
  },
  {
    id: "2", name: "Ensalada César", description: "Ensalada fresca con aderezo césar", portions: 1,
    ingredients: [
      { name: "Lechuga romana", quantity: "200", unit: "g", cost: 25 },
      { name: "Parmesano", quantity: "30", unit: "g", cost: 35 },
      { name: "Crutones", quantity: "50", unit: "g", cost: 15 },
      { name: "Aderezo César", quantity: "40", unit: "ml", cost: 20 },
    ],
    totalCost: 95, preparationTime: "10 min",
  },
];

export default function Recetas() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [form, setForm] = useState({ name: "", description: "", portions: 1, ingredients: [] as Ingredient[], preparationTime: "" });
  const [newIng, setNewIng] = useState({ name: "", quantity: "", unit: "g", cost: 0 });

  const resetForm = () => { setForm({ name: "", description: "", portions: 1, ingredients: [], preparationTime: "" }); setEditing(null); };
  const openAdd = () => { resetForm(); setIsModalOpen(true); };
  const openEdit = (r: Recipe) => {
    setEditing(r);
    setForm({ name: r.name, description: r.description, portions: r.portions, ingredients: [...r.ingredients], preparationTime: r.preparationTime });
    setIsModalOpen(true);
  };

  const addIngredient = () => {
    if (!newIng.name.trim()) return;
    setForm(prev => ({ ...prev, ingredients: [...prev.ingredients, { ...newIng }] }));
    setNewIng({ name: "", quantity: "", unit: "g", cost: 0 });
  };

  const removeIngredient = (idx: number) => {
    setForm(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== idx) }));
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("El nombre es requerido"); return; }
    if (form.ingredients.length === 0) { toast.error("Agrega al menos un ingrediente"); return; }
    const totalCost = form.ingredients.reduce((s, i) => s + i.cost, 0);

    if (editing) {
      setRecipes(prev => prev.map(r => r.id === editing.id ? { ...form, id: editing.id, totalCost } : r));
      toast.success("Receta actualizada");
    } else {
      setRecipes(prev => [...prev, { ...form, id: Date.now().toString(), totalCost }]);
      toast.success("Receta creada");
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => { setRecipes(prev => prev.filter(r => r.id !== id)); toast.success("Receta eliminada"); };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Recetas</h1>
            <p className="text-muted-foreground">Ingredientes y costos de recetas</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Agregar Receta</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Recetas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{recipes.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Costo Promedio</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-warning">RD$ {recipes.length > 0 ? Math.round(recipes.reduce((s, r) => s + r.totalCost, 0) / recipes.length) : 0}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Ingredientes</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-info">{recipes.reduce((s, r) => s + r.ingredients.length, 0)}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Lista de Recetas</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Ingredientes</TableHead>
                  <TableHead>Porciones</TableHead>
                  <TableHead>Costo Total</TableHead>
                  <TableHead>Tiempo</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipes.map((recipe) => (
                  <TableRow key={recipe.id}>
                    <TableCell><div><span className="font-medium">{recipe.name}</span><p className="text-xs text-muted-foreground">{recipe.description}</p></div></TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {recipe.ingredients.slice(0, 3).map((ing, i) => <Badge key={i} variant="outline" className="text-xs">{ing.name}</Badge>)}
                        {recipe.ingredients.length > 3 && <Badge variant="outline" className="text-xs">+{recipe.ingredients.length - 3}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>{recipe.portions}</TableCell>
                    <TableCell className="font-medium text-warning">RD$ {recipe.totalCost}</TableCell>
                    <TableCell><Badge variant="secondary">{recipe.preparationTime}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(recipe)}><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(recipe.id)}><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {recipes.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No hay recetas configuradas</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Editar Receta" : "Agregar Receta"}</DialogTitle></DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-2"><Label>Nombre *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Hamburguesa Clásica" /></div>
              <div className="space-y-2"><Label>Descripción</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descripción de la receta" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Porciones</Label><Input type="number" min={1} value={form.portions} onChange={e => setForm({ ...form, portions: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Tiempo de preparación</Label><Input value={form.preparationTime} onChange={e => setForm({ ...form, preparationTime: e.target.value })} placeholder="Ej: 15 min" /></div>
              </div>
              <div className="space-y-2">
                <Label>Ingredientes</Label>
                {form.ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
                    <span className="flex-1 text-sm">{ing.quantity} {ing.unit} - {ing.name}</span>
                    <span className="text-sm text-muted-foreground">RD$ {ing.cost}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeIngredient(i)}><X className="h-3 w-3" /></Button>
                  </div>
                ))}
                <div className="grid grid-cols-4 gap-2">
                  <Input className="col-span-2" placeholder="Ingrediente" value={newIng.name} onChange={e => setNewIng({ ...newIng, name: e.target.value })} />
                  <Input placeholder="Cant." value={newIng.quantity} onChange={e => setNewIng({ ...newIng, quantity: e.target.value })} />
                  <Input placeholder="Costo" type="number" value={newIng.cost} onChange={e => setNewIng({ ...newIng, cost: Number(e.target.value) })} />
                </div>
                <div className="flex gap-2">
                  <select className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm" value={newIng.unit} onChange={e => setNewIng({ ...newIng, unit: e.target.value })}>
                    <option value="g">Gramos (g)</option>
                    <option value="kg">Kilos (kg)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="lt">Litros (lt)</option>
                    <option value="unid">Unidad</option>
                    <option value="rodajas">Rodajas</option>
                    <option value="loncha">Loncha</option>
                  </select>
                  <Button variant="outline" onClick={addIngredient}><Plus className="h-4 w-4 mr-2" />Agregar</Button>
                </div>
                {form.ingredients.length > 0 && (
                  <div className="text-sm font-medium text-right">Costo total: RD$ {form.ingredients.reduce((s, i) => s + i.cost, 0)}</div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>{editing ? "Guardar Cambios" : "Crear Receta"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
