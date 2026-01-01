import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  Search, 
  Plus, 
  Filter,
  MoreHorizontal,
  Package,
  Tag,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  menu: string;
  available: boolean;
  image?: string;
}

const products: Product[] = [
  { id: "1", name: "Pollo al Horno", price: 450, category: "Platos Fuertes", menu: "Principal", available: true },
  { id: "2", name: "Mofongo con Camarones", price: 650, category: "Platos Fuertes", menu: "Principal", available: true },
  { id: "3", name: "Sancocho Dominicano", price: 350, category: "Sopas", menu: "Principal", available: true },
  { id: "4", name: "Ensalada César", price: 250, category: "Ensaladas", menu: "Principal", available: true },
  { id: "5", name: "Chuleta Ahumada", price: 550, category: "Platos Fuertes", menu: "Principal", available: false },
  { id: "6", name: "Tostones", price: 150, category: "Acompañantes", menu: "Principal", available: true },
  { id: "7", name: "Jugo de Chinola", price: 100, category: "Bebidas", menu: "Bebidas", available: true },
  { id: "8", name: "Langosta Thermidor", price: 1500, category: "Mariscos", menu: "Premium", available: true },
];

const categories = ["Todos", "Platos Fuertes", "Sopas", "Ensaladas", "Acompañantes", "Bebidas", "Mariscos"];

const Productos = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Productos</h1>
            <p className="text-muted-foreground">Gestión del menú y productos</p>
          </div>
          <Button className="btn-mango gap-2">
            <Plus className="w-4 h-4" />
            Agregar Elemento de Menú
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{products.length}</p>
            <p className="text-sm text-muted-foreground">Total Productos</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Tag className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-success">{categories.length - 1}</p>
            <p className="text-sm text-muted-foreground">Categorías</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-info" />
              </div>
            </div>
            <p className="text-2xl font-bold text-info">RD$ 500</p>
            <p className="text-sm text-muted-foreground">Precio Promedio</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-warning">{products.filter(p => !p.available).length}</p>
            <p className="text-sm text-muted-foreground">No Disponibles</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card-elevated p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-search"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Menú</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-center">Disponible</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-secondary/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Package className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="badge-info">{product.category}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{product.menu}</TableCell>
                    <TableCell className="text-right font-bold text-foreground">
                      RD$ {product.price.toLocaleString("es-DO")}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch checked={product.available} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Productos;
