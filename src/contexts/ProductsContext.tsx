import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product, Category, Menu, ProductType } from "@/types/pos";

interface ProductsContextType {
  products: Product[];
  categories: Category[];
  menus: Menu[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, "id" | "productCount">) => Category;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const initialMenus: Menu[] = [
  { id: "1", name: "Principal" },
  { id: "2", name: "Bebidas" },
  { id: "3", name: "Premium" },
];

const initialCategories: Category[] = [
  { id: "1", name: "Platos Fuertes", productCount: 3, icon: "🍽️" },
  { id: "2", name: "Sopas", productCount: 1, icon: "🍲" },
  { id: "3", name: "Ensaladas", productCount: 1, icon: "🥗" },
  { id: "4", name: "Acompañantes", productCount: 1, icon: "🍟" },
  { id: "5", name: "Bebidas", productCount: 1, icon: "🥤" },
  { id: "6", name: "Mariscos", productCount: 1, icon: "🦐" },
];

const initialProducts: Product[] = [
  { 
    id: "1", 
    name: "Pollo al Horno", 
    price: 450, 
    categoryId: "1", 
    menuId: "1",
    productType: "Plato",
    hasModifiers: false,
    hasVariations: false,
    available: true,
    taxIncluded: true,
    taxRate: 18,
  },
  { 
    id: "2", 
    name: "Mofongo con Camarones", 
    price: 650, 
    categoryId: "1", 
    menuId: "1",
    productType: "Plato",
    hasModifiers: true,
    hasVariations: false,
    available: true,
    taxIncluded: true,
    taxRate: 18,
  },
  { 
    id: "3", 
    name: "Sancocho Dominicano", 
    price: 350, 
    categoryId: "2", 
    menuId: "1",
    productType: "Plato",
    hasModifiers: false,
    hasVariations: false,
    available: true,
    taxIncluded: true,
    taxRate: 18,
  },
  { 
    id: "4", 
    name: "Ensalada César", 
    price: 250, 
    categoryId: "3", 
    menuId: "1",
    productType: "Entrada",
    hasModifiers: true,
    hasVariations: false,
    available: true,
    taxIncluded: true,
    taxRate: 18,
  },
  { 
    id: "5", 
    name: "Chuleta Ahumada", 
    price: 550, 
    categoryId: "1", 
    menuId: "1",
    productType: "Plato",
    hasModifiers: false,
    hasVariations: false,
    available: false,
    taxIncluded: true,
    taxRate: 18,
  },
  { 
    id: "6", 
    name: "Tostones", 
    price: 150, 
    categoryId: "4", 
    menuId: "1",
    productType: "Acompañante",
    hasModifiers: false,
    hasVariations: false,
    available: true,
    taxIncluded: true,
    taxRate: 18,
  },
  { 
    id: "7", 
    name: "Jugo de Chinola", 
    price: 100, 
    categoryId: "5", 
    menuId: "2",
    productType: "Bebida",
    hasModifiers: false,
    hasVariations: true,
    available: true,
    taxIncluded: true,
    taxRate: 18,
  },
  { 
    id: "8", 
    name: "Langosta Thermidor", 
    price: 1500, 
    categoryId: "6", 
    menuId: "3",
    productType: "Plato",
    hasModifiers: true,
    hasVariations: false,
    available: true,
    taxIncluded: true,
    taxRate: 18,
  },
];

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [menus] = useState<Menu[]>(initialMenus);

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts((prev) => [...prev, newProduct]);
    
    // Update category product count
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === product.categoryId
          ? { ...cat, productCount: cat.productCount + 1 }
          : cat
      )
    );
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const oldProduct = prev.find((p) => p.id === id);
      const newProducts = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      
      // If category changed, update counts
      if (oldProduct && updates.categoryId && oldProduct.categoryId !== updates.categoryId) {
        setCategories((cats) =>
          cats.map((cat) => {
            if (cat.id === oldProduct.categoryId) {
              return { ...cat, productCount: Math.max(0, cat.productCount - 1) };
            }
            if (cat.id === updates.categoryId) {
              return { ...cat, productCount: cat.productCount + 1 };
            }
            return cat;
          })
        );
      }
      
      return newProducts;
    });
  };

  const deleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === product.categoryId
            ? { ...cat, productCount: Math.max(0, cat.productCount - 1) }
            : cat
        )
      );
    }
  };

  const addCategory = (category: Omit<Category, "id" | "productCount">): Category => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      productCount: 0,
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    // Only delete if no products are using this category
    const hasProducts = products.some((p) => p.categoryId === id);
    if (!hasProducts) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        menus,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
