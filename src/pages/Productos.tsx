import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  Search, 
  Plus, 
  MoreHorizontal,
  Package,
  Tag,
  DollarSign,
  Pencil,
  Trash2
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductFormModal } from "@/components/productos/ProductFormModal";
import { useProducts } from "@/contexts/ProductsContext";
import { Product } from "@/types/pos";
import { toast } from "sonner";

const Productos = () => {
  const { products, categories, menus, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Sin categoría";
  };

  const getMenuName = (menuId: string) => {
    return menus.find((m) => m.id === menuId)?.name || "Sin menú";
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || getCategoryName(product.categoryId) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryOptions = ["Todos", ...categories.map((c) => c.name)];

  const averagePrice = products.length > 0
    ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
    : 0;

  const unavailableCount = products.filter((p) => !p.available).length;

  const handleSaveProduct = (productData: Omit<Product, "id"> | (Partial<Product> & { id: string })) => {
    if ("id" in productData && productData.id) {
      updateProduct(productData.id, productData);
      toast.success("Producto actualizado correctamente");
    } else {
      addProduct(productData as Omit<Product, "id">);
      toast.success("Producto agregado correctamente");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeleteConfirm(product);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteProduct(deleteConfirm.id);
      toast.success("Producto eliminado correctamente");
      setDeleteConfirm(null);
    }
  };

  const handleToggleAvailable = (product: Product) => {
    updateProduct(product.id, { available: !product.available });
    toast.success(product.available ? "Producto marcado como no disponible" : "Producto marcado como disponible");
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Productos</h1>
            <p className="text-muted-foreground">Gestión del menú y productos</p>
          </div>
          <Button className="btn-mango gap-2" onClick={handleNewProduct}>
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
            <p className="text-2xl font-bold text-success">{categories.length}</p>
            <p className="text-sm text-muted-foreground">Categorías</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-info" />
              </div>
            </div>
            <p className="text-2xl font-bold text-info">RD$ {averagePrice.toLocaleString("es-DO")}</p>
            <p className="text-sm text-muted-foreground">Precio Promedio</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-warning">{unavailableCount}</p>
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
              {categoryOptions.map((category) => (
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
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-foreground">{product.name}</span>
                          {product.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="badge-info">{getCategoryName(product.categoryId)}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{getMenuName(product.menuId)}</TableCell>
                    <TableCell className="text-right font-bold text-foreground">
                      RD$ {product.price.toLocaleString("es-DO")}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={product.available}
                        onCheckedChange={() => handleToggleAvailable(product)}
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background">
                          <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteProduct(product)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No se encontraron productos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <ProductFormModal
        open={showProductModal}
        onOpenChange={setShowProductModal}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto "{deleteConfirm?.name}" será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Productos;
