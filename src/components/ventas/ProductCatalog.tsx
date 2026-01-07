import { useState } from "react";
import { Search, Star, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category, Product } from "@/types/pos";
import { categories, products } from "@/data/mock-products";

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
}

export function ProductCatalog({ onSelectProduct }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("categorias");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.categoryId === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount: number) =>
    `RD$ ${amount.toLocaleString("es-DO")}`;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Search & Tabs */}
      <div className="p-4 border-b border-border space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="categorias" className="flex-1">
              <Grid3X3 className="w-4 h-4 mr-2" />
              Categorías
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex-1">
              <List className="w-4 h-4 mr-2" />
              Menú
            </TabsTrigger>
            <TabsTrigger value="favoritos" className="flex-1">
              <Star className="w-4 h-4 mr-2" />
              Favoritos
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Categories */}
      {!selectedCategory && activeTab === "categorias" && (
        <ScrollArea className="flex-1">
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="bg-card hover:bg-accent border border-border rounded-xl p-4 text-left transition-all hover:shadow-md"
              >
                <h3 className="font-semibold text-foreground">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {category.productCount} productos
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Products Grid */}
      {(selectedCategory || activeTab !== "categorias" || searchQuery) && (
        <div className="flex flex-col flex-1">
          {/* Category Header */}
          {selectedCategory && (
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                {categories.find((c) => c.id === selectedCategory)?.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Ver todas
              </Button>
            </div>
          )}

          <ScrollArea className="flex-1">
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-card hover:bg-accent border border-border rounded-xl p-4 text-left transition-all hover:shadow-md group"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h4>
                  </div>
                  <p className="text-lg font-bold text-primary mt-2">
                    {formatCurrency(product.price)}
                  </p>
                  {product.hasModifiers && (
                    <Badge
                      variant="secondary"
                      className="mt-2 text-xs bg-warning/10 text-warning border-warning/20"
                    >
                      Con modificadores
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
