import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { products as allProducts } from "@/data/mock-products";

interface StockOutProduct {
  productId: string;
  productName: string;
  markedAt: Date;
  markedBy: string;
}

interface ProductAvailabilityContextType {
  stockOutProducts: StockOutProduct[];
  isProductAvailable: (productId: string) => boolean;
  markAsStockOut: (productId: string, productName: string, userId: string) => void;
  markAsAvailable: (productId: string) => void;
  getStockOutCount: () => number;
}

const ProductAvailabilityContext = createContext<ProductAvailabilityContextType | undefined>(undefined);

export function ProductAvailabilityProvider({ children }: { children: ReactNode }) {
  const [stockOutProducts, setStockOutProducts] = useState<StockOutProduct[]>([]);

  const isProductAvailable = useCallback(
    (productId: string) => {
      return !stockOutProducts.some((p) => p.productId === productId);
    },
    [stockOutProducts]
  );

  const markAsStockOut = useCallback(
    (productId: string, productName: string, userId: string) => {
      setStockOutProducts((prev) => {
        // Check if already stock out
        if (prev.some((p) => p.productId === productId)) {
          return prev;
        }
        return [
          ...prev,
          {
            productId,
            productName,
            markedAt: new Date(),
            markedBy: userId,
          },
        ];
      });
    },
    []
  );

  const markAsAvailable = useCallback((productId: string) => {
    setStockOutProducts((prev) => prev.filter((p) => p.productId !== productId));
  }, []);

  const getStockOutCount = useCallback(() => {
    return stockOutProducts.length;
  }, [stockOutProducts]);

  return (
    <ProductAvailabilityContext.Provider
      value={{
        stockOutProducts,
        isProductAvailable,
        markAsStockOut,
        markAsAvailable,
        getStockOutCount,
      }}
    >
      {children}
    </ProductAvailabilityContext.Provider>
  );
}

export function useProductAvailability() {
  const context = useContext(ProductAvailabilityContext);
  if (context === undefined) {
    throw new Error("useProductAvailability must be used within a ProductAvailabilityProvider");
  }
  return context;
}
