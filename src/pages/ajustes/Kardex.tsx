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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, MoreHorizontal, Package, Plus, Search, Warehouse } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface KardexItem {
  id: string;
  product: string;
  category: string;
  warehouse: string;
  stock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  lastMovement: string;
}

const initialItems: KardexItem[] = [
  { id: "k1", product: "Arroz Premium 25lb", category: "Granos", warehouse: "Principal", stock: 45, minStock: 20, maxStock: 80, unitCost: 1150, lastMovement: "2026-02-16" },
  { id: "k2", product: "Aceite Vegetal 1L", category: "Aceites", warehouse: "Principal", stock: 12, minStock: 18, maxStock: 60, unitCost: 130, lastMovement: "2026-02-18" },
  { id: "k3", product: "Pechuga de Pollo", category: "Proteinas", warehouse: "Sucursal Norte", stock: 32, minStock: 25, maxStock: 70, unitCost: 210, lastMovement: "2026-02-19" },
  { id: "k4", product: "Queso Mozzarella", category: "Lacteos", warehouse: "Sucursal Este", stock: 8, minStock: 10, maxStock: 35, unitCost: 280, lastMovement: "2026-02-17" },
];

export default function Kardex() {
  const navigate = useNavigate();
  const [items, setItems] = useState<KardexItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("all");
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selected, setSelected] = useState<KardexItem | null>(null);

  const [adjustType, setAdjustType] = useState("entrada");
  const [adjustQty, setAdjustQty] = useState(1);

  const [newItem, setNewItem] = useState({
    product: "",
    category: "",
    warehouse: "Principal",
    stock: 0,
    minStock: 0,
    maxStock: 0,
    unitCost: 0,
  });

  const warehouses = useMemo(
    () => Array.from(new Set(items.map((item) => item.warehouse))),
    [items]
  );

  const filtered = items.filter((item) => {
    const byWarehouse = warehouseFilter === "all" || item.warehouse === warehouseFilter;
    const q = search.toLowerCase();
    const bySearch =
      item.product.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    return byWarehouse && bySearch;
  });

  const totalValue = filtered.reduce((sum, item) => sum + item.stock * item.unitCost, 0);
  const lowStockCount = filtered.filter((item) => item.stock < item.minStock).length;

  const openAdjust = (item: KardexItem) => {
    setSelected(item);
    setAdjustQty(1);
    setAdjustType("entrada");
    setIsAdjustOpen(true);
  };

  const applyAdjustment = () => {
    if (!selected) return;
    if (adjustQty <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== selected.id) return item;
        const nextStock =
          adjustType === "entrada"
            ? item.stock + adjustQty
            : adjustType === "salida"
              ? Math.max(0, item.stock - adjustQty)
              : adjustQty;
        return { ...item, stock: nextStock, lastMovement: "2026-02-19" };
      })
    );

    toast.success("Movimiento aplicado en kardex");
    setIsAdjustOpen(false);
  };

  const createItem = () => {
    if (!newItem.product.trim() || !newItem.category.trim()) {
      toast.error("Producto y categoria son requeridos");
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        id: `k${Date.now()}`,
        product: newItem.product,
        category: newItem.category,
        warehouse: newItem.warehouse,
        stock: Number(newItem.stock),
        minStock: Number(newItem.minStock),
        maxStock: Number(newItem.maxStock),
        unitCost: Number(newItem.unitCost),
        lastMovement: "2026-02-19",
      },
    ]);

    setNewItem({
      product: "",
      category: "",
      warehouse: "Principal",
      stock: 0,
      minStock: 0,
      maxStock: 0,
      unitCost: 0,
    });
    setIsCreateOpen(false);
    toast.success("Producto agregado al kardex");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Kardex por Sucursal</h1>
            <p className="text-muted-foreground">Control visual de inventario por ubicacion</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar producto
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Productos visibles</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{filtered.length}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Valor inventario</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">RD$ {totalValue.toLocaleString()}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Bajo minimo</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-destructive">{lowStockCount}</p></CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Buscar por producto o categoria" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                <SelectTrigger><SelectValue placeholder="Filtrar almacen" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los almacenes</SelectItem>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse} value={warehouse}>{warehouse}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Warehouse className="h-5 w-5" />Listado kardex</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Almacen</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Min/Max</TableHead>
                  <TableHead>Costo</TableHead>
                  <TableHead>Ult. movimiento</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.product}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.warehouse}</TableCell>
                    <TableCell>
                      <Badge variant={item.stock < item.minStock ? "destructive" : "secondary"}>{item.stock}</Badge>
                    </TableCell>
                    <TableCell>{item.minStock} / {item.maxStock}</TableCell>
                    <TableCell>RD$ {item.unitCost.toLocaleString()}</TableCell>
                    <TableCell>{item.lastMovement}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openAdjust(item)}>Ajustar stock</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Ajustar stock</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de movimiento</Label>
                <Select value={adjustType} onValueChange={setAdjustType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="salida">Salida</SelectItem>
                    <SelectItem value="ajuste">Ajuste directo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input type="number" min={1} value={adjustQty} onChange={(e) => setAdjustQty(Number(e.target.value))} />
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2"><Package className="h-4 w-4" />Producto: {selected?.product}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAdjustOpen(false)}>Cancelar</Button>
              <Button onClick={applyAdjustment}>Aplicar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Agregar producto a kardex</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 md:col-span-2"><Label>Producto</Label><Input value={newItem.product} onChange={(e) => setNewItem((prev) => ({ ...prev, product: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Categoria</Label><Input value={newItem.category} onChange={(e) => setNewItem((prev) => ({ ...prev, category: e.target.value }))} /></div>
              <div className="space-y-2">
                <Label>Almacen</Label>
                <Select value={newItem.warehouse} onValueChange={(value) => setNewItem((prev) => ({ ...prev, warehouse: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse} value={warehouse}>{warehouse}</SelectItem>
                    ))}
                    <SelectItem value="Nuevo Almacen">Nuevo Almacen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Stock inicial</Label><Input type="number" min={0} value={newItem.stock} onChange={(e) => setNewItem((prev) => ({ ...prev, stock: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Stock minimo</Label><Input type="number" min={0} value={newItem.minStock} onChange={(e) => setNewItem((prev) => ({ ...prev, minStock: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Stock maximo</Label><Input type="number" min={0} value={newItem.maxStock} onChange={(e) => setNewItem((prev) => ({ ...prev, maxStock: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Costo unitario</Label><Input type="number" min={0} value={newItem.unitCost} onChange={(e) => setNewItem((prev) => ({ ...prev, unitCost: Number(e.target.value) }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
              <Button onClick={createItem}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
