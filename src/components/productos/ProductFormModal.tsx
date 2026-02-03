import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Plus, ImagePlus } from "lucide-react";
import { Product, ProductType, Category, Menu } from "@/types/pos";
import { CategoryFormModal } from "./CategoryFormModal";
import { useProducts } from "@/contexts/ProductsContext";

const productTypes: ProductType[] = ["Plato", "Bebida", "Postre", "Entrada", "Acompañante", "Otro"];

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  description: z.string().max(500).optional(),
  productType: z.enum(["Plato", "Bebida", "Postre", "Entrada", "Acompañante", "Otro"]),
  menuId: z.string().min(1, "Selecciona un menú"),
  categoryId: z.string().min(1, "Selecciona una categoría"),
  price: z.coerce.number().min(1, "El precio debe ser mayor a 0"),
  cost: z.coerce.number().min(0).optional(),
  sku: z.string().max(50).optional(),
  barcode: z.string().max(50).optional(),
  hasVariations: z.boolean(),
  available: z.boolean(),
  taxIncluded: z.boolean(),
  taxRate: z.number().min(0).max(100),
});

type FormData = z.infer<typeof formSchema>;

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSave: (product: Omit<Product, "id"> | (Partial<Product> & { id: string })) => void;
}

export function ProductFormModal({ open, onOpenChange, product, onSave }: ProductFormModalProps) {
  const { categories, menus, addCategory } = useProducts();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      productType: "Plato",
      menuId: "",
      categoryId: "",
      price: 0,
      cost: 0,
      sku: "",
      barcode: "",
      hasVariations: false,
      available: true,
      taxIncluded: true,
      taxRate: 18,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description || "",
        productType: product.productType,
        menuId: product.menuId,
        categoryId: product.categoryId,
        price: product.price,
        cost: product.cost || 0,
        sku: product.sku || "",
        barcode: product.barcode || "",
        hasVariations: product.hasVariations,
        available: product.available,
        taxIncluded: product.taxIncluded,
        taxRate: product.taxRate,
      });
      setImagePreview(product.image || null);
    } else {
      form.reset({
        name: "",
        description: "",
        productType: "Plato",
        menuId: menus[0]?.id || "",
        categoryId: "",
        price: 0,
        cost: 0,
        sku: "",
        barcode: "",
        hasVariations: false,
        available: true,
        taxIncluded: true,
        taxRate: 18,
      });
      setImagePreview(null);
    }
  }, [product, open, menus, form]);

  const handleSubmit = (data: FormData) => {
    const baseProductData = {
      name: data.name,
      description: data.description,
      productType: data.productType,
      menuId: data.menuId,
      categoryId: data.categoryId,
      price: data.price,
      cost: data.cost,
      sku: data.sku,
      barcode: data.barcode,
      hasVariations: data.hasVariations,
      available: data.available,
      taxIncluded: data.taxIncluded,
      taxRate: data.taxRate,
      hasModifiers: false,
      image: imagePreview || undefined,
      defaultNotes: [] as string[],
    };

    if (product) {
      onSave({ ...baseProductData, id: product.id });
    } else {
      onSave(baseProductData);
    }

    onOpenChange(false);
  };

  const handleCategorySave = (categoryData: Omit<Category, "id" | "productCount">) => {
    const newCategory = addCategory(categoryData);
    form.setValue("categoryId", newCategory.id);
    return newCategory;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {product ? "Editar Producto" : "Agregar Elemento de Menú"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Artículo *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Pollo al Horno" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descripción del producto..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Producto *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background">
                            {productTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="menuId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Menú *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar menú" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background">
                            {menus.map((menu) => (
                              <SelectItem key={menu.id} value={menu.id}>
                                {menu.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría *</FormLabel>
                        <div className="flex gap-2">
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Seleccionar categoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-background">
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.icon} {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setShowCategoryModal(true)}
                            title="Crear nueva categoría"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Costo</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Referencia/SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="SKU-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código de Barras</FormLabel>
                          <FormControl>
                            <Input placeholder="123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label>Imagen del Producto</Label>
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => document.getElementById("product-image")?.click()}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover mx-auto rounded-lg"
                        />
                      ) : (
                        <div className="py-4">
                          <ImagePlus className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click para subir imagen
                          </p>
                        </div>
                      )}
                      <input
                        id="product-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>

                  {/* Switches */}
                  <div className="space-y-4 pt-2">
                    <FormField
                      control={form.control}
                      name="hasVariations"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel className="mb-0">Tiene Variaciones</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="available"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel className="mb-0">Disponible</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="taxIncluded"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel className="mb-0">Impuesto Incluido</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Tax Slider */}
                  <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>Tasa de Impuesto</FormLabel>
                          <span className="text-sm font-medium">{field.value}%</span>
                        </div>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            onValueChange={([value]) => field.onChange(value)}
                            max={30}
                            step={1}
                            className="mt-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="btn-mango">
                  {product ? "Guardar Cambios" : "Agregar Producto"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <CategoryFormModal
        open={showCategoryModal}
        onOpenChange={setShowCategoryModal}
        onSave={handleCategorySave}
      />
    </>
  );
}
