import { useState } from "react";
import { Search, Package, AlertTriangle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { products, categories } from "@/data/mock-products";
import { useProductAvailability } from "@/contexts/ProductAvailabilityContext";
import { usePermissions } from "@/contexts/PermissionsContext";
import { toast } from "sonner";

export function StockOutPanel() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { stockOutProducts, isProductAvailable, markAsStockOut, markAsAvailable } =
    useProductAvailability();
  const { currentUser } = usePermissions();

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.categoryId === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleToggleStock = (productId: string, productName: string) => {
    if (isProductAvailable(productId)) {
      markAsStockOut(productId, productName, currentUser?.id || "unknown");
      toast.warning(`${productName} marcado como agotado`, {
        icon: <AlertTriangle className="w-4 h-4" />,
      });
    } else {
      markAsAvailable(productId);
      toast.success(`${productName} disponible nuevamente`, {
        icon: <Check className="w-4 h-4" />,
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 relative">
          <Package className="w-4 h-4" />
          Productos Agotados
          {stockOutProducts.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {stockOutProducts.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Gestión de Disponibilidad
          </SheetTitle>
          <SheetDescription>
            Marca productos como agotados para que no puedan ser ordenados
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Todos
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Stock Out Summary */}
          {stockOutProducts.length > 0 && (
            <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="flex items-center gap-2 text-destructive font-medium mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{stockOutProducts.length} productos agotados</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {stockOutProducts.map((p) => (
                  <Badge
                    key={p.productId}
                    variant="outline"
                    className="text-destructive border-destructive/30 cursor-pointer hover:bg-destructive/10"
                    onClick={() => handleToggleStock(p.productId, p.productName)}
                  >
                    {p.productName}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Products List */}
          <ScrollArea className="h-[calc(100vh-350px)]">
            <div className="space-y-2 pr-4">
              {filteredProducts.map((product) => {
                const available = isProductAvailable(product.id);
                return (
                  <div
                    key={product.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      available
                        ? "bg-card border-border hover:border-primary/50"
                        : "bg-destructive/5 border-destructive/30"
                    }`}
                  >
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          available ? "text-foreground" : "text-destructive line-through"
                        }`}
                      >
                        {product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {categories.find((c) => c.id === product.categoryId)?.name}
                      </p>
                    </div>
                    <Button
                      variant={available ? "outline" : "destructive"}
                      size="sm"
                      onClick={() => handleToggleStock(product.id, product.name)}
                    >
                      {available ? (
                        <>
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Agotar
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Reponer
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
