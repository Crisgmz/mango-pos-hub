import { useState, useCallback, useMemo } from "react";
import { CartItem, Product, SelectedModifier } from "@/types/pos";

const TAX_RATE = 0.18; // ITBIS 18%

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback(
    (product: Product, quantity: number, modifiers: SelectedModifier[], notes: string) => {
      const modifiersTotal = modifiers.reduce((sum, m) => sum + m.price, 0);
      const unitPrice = product.price + modifiersTotal;
      const totalPrice = unitPrice * quantity;

      const newItem: CartItem = {
        id: generateId(),
        productId: product.id,
        product,
        quantity,
        selectedModifiers: modifiers,
        notes,
        unitPrice,
        totalPrice,
      };

      setItems((prev) => [...prev, newItem]);
    },
    []
  );

  const updateItemQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
            : item
        )
      );
    }
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [items]);

  const tax = useMemo(() => {
    return Math.round(subtotal * TAX_RATE);
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + tax;
  }, [subtotal, tax]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return {
    items,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    subtotal,
    tax,
    total,
    itemCount,
    setItems,
  };
}
