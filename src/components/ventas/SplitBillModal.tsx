import { useState, useMemo } from "react";
import { Plus, Trash2, ArrowRight, Users, Divide } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { CartItem, SubAccount } from "@/types/pos";

interface SplitBillModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  onConfirmSplit: (subAccounts: SubAccount[]) => void;
}

const TAX_RATE = 0.18;

export function SplitBillModal({
  open,
  onClose,
  items,
  subtotal,
  tax,
  total,
  onConfirmSplit,
}: SplitBillModalProps) {
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [equalSplitCount, setEqualSplitCount] = useState<number>(2);
  const [showEqualSplit, setShowEqualSplit] = useState(false);

  // Track which items have been assigned
  const assignedItemIds = useMemo(() => {
    const ids = new Set<string>();
    subAccounts.forEach((sub) => {
      sub.items.forEach((item) => ids.add(item.id));
    });
    return ids;
  }, [subAccounts]);

  // Available items (not yet assigned)
  const availableItems = useMemo(() => {
    return items.filter((item) => !assignedItemIds.has(item.id));
  }, [items, assignedItemIds]);

  const formatCurrency = (amount: number) =>
    `RD$ ${amount.toLocaleString("es-DO")}`;

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const createSubAccount = () => {
    const newSubAccount: SubAccount = {
      id: `sub-${Date.now()}`,
      name: `Cuenta ${subAccounts.length + 1}`,
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      paid: false,
    };
    setSubAccounts((prev) => [...prev, newSubAccount]);
  };

  const assignItemsToSubAccount = (subAccountId: string) => {
    const itemsToAssign = availableItems.filter((item) =>
      selectedItems.has(item.id)
    );

    if (itemsToAssign.length === 0) return;

    setSubAccounts((prev) =>
      prev.map((sub) => {
        if (sub.id !== subAccountId) return sub;

        const newItems = [...sub.items, ...itemsToAssign];
        const newSubtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const newTax = Math.round(newSubtotal * TAX_RATE);

        return {
          ...sub,
          items: newItems,
          subtotal: newSubtotal,
          tax: newTax,
          total: newSubtotal + newTax,
        };
      })
    );

    setSelectedItems(new Set());
  };

  const removeItemFromSubAccount = (subAccountId: string, itemId: string) => {
    setSubAccounts((prev) =>
      prev.map((sub) => {
        if (sub.id !== subAccountId) return sub;

        const newItems = sub.items.filter((item) => item.id !== itemId);
        const newSubtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const newTax = Math.round(newSubtotal * TAX_RATE);

        return {
          ...sub,
          items: newItems,
          subtotal: newSubtotal,
          tax: newTax,
          total: newSubtotal + newTax,
        };
      })
    );
  };

  const deleteSubAccount = (subAccountId: string) => {
    setSubAccounts((prev) => prev.filter((sub) => sub.id !== subAccountId));
  };

  const splitEqually = () => {
    if (equalSplitCount < 2) return;

    const perPersonSubtotal = Math.floor(subtotal / equalSplitCount);
    const perPersonTax = Math.round(perPersonSubtotal * TAX_RATE);
    const perPersonTotal = perPersonSubtotal + perPersonTax;

    // Handle remainder
    const remainder = subtotal - perPersonSubtotal * equalSplitCount;

    const newSubAccounts: SubAccount[] = Array.from(
      { length: equalSplitCount },
      (_, i) => ({
        id: `sub-${Date.now()}-${i}`,
        name: `Persona ${i + 1}`,
        items: [],
        subtotal: perPersonSubtotal + (i === 0 ? remainder : 0),
        tax: perPersonTax + (i === 0 ? Math.round(remainder * TAX_RATE) : 0),
        total: perPersonTotal + (i === 0 ? remainder + Math.round(remainder * TAX_RATE) : 0),
        paid: false,
      })
    );

    setSubAccounts(newSubAccounts);
    setShowEqualSplit(false);
  };

  const handleConfirm = () => {
    onConfirmSplit(subAccounts);
    onClose();
  };

  const handleClose = () => {
    setSubAccounts([]);
    setSelectedItems(new Set());
    setShowEqualSplit(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">División de Cuenta</DialogTitle>
            <div className="text-lg font-bold text-primary">
              Total: {formatCurrency(total)}
            </div>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-0 h-[60vh]">
          {/* Left - Products */}
          <div className="border-r border-border flex flex-col">
            <div className="p-3 border-b border-border bg-secondary/30">
              <h4 className="font-semibold">Productos del Pedido</h4>
              <p className="text-sm text-muted-foreground">
                {availableItems.length} productos sin asignar
              </p>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                {availableItems.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Todos los productos han sido asignados
                  </p>
                ) : (
                  availableItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                        selectedItems.has(item.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => toggleItemSelection(item.id)}
                    >
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onCheckedChange={() => toggleItemSelection(item.id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          x{item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Assign Button */}
            {selectedItems.size > 0 && subAccounts.length > 0 && (
              <div className="p-3 border-t border-border space-y-2">
                <p className="text-sm font-medium">
                  Asignar {selectedItems.size} productos a:
                </p>
                <div className="flex flex-wrap gap-2">
                  {subAccounts.map((sub) => (
                    <Button
                      key={sub.id}
                      size="sm"
                      variant="outline"
                      onClick={() => assignItemsToSubAccount(sub.id)}
                    >
                      <ArrowRight className="w-4 h-4 mr-1" />
                      {sub.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right - Sub Accounts */}
          <div className="flex flex-col">
            <div className="p-3 border-b border-border bg-secondary/30 flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Subcuentas</h4>
                <p className="text-sm text-muted-foreground">
                  {subAccounts.length} subcuentas creadas
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowEqualSplit(!showEqualSplit)}
                >
                  <Divide className="w-4 h-4 mr-1" />
                  Partes iguales
                </Button>
                <Button size="sm" onClick={createSubAccount}>
                  <Plus className="w-4 h-4 mr-1" />
                  Nueva
                </Button>
              </div>
            </div>

            {/* Equal Split UI */}
            {showEqualSplit && (
              <div className="p-3 border-b border-border bg-warning/10">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-warning" />
                  <span className="text-sm">Número de personas:</span>
                  <Input
                    type="number"
                    min="2"
                    max="20"
                    value={equalSplitCount}
                    onChange={(e) =>
                      setEqualSplitCount(parseInt(e.target.value) || 2)
                    }
                    className="w-20"
                  />
                  <Button size="sm" onClick={splitEqually}>
                    Dividir
                  </Button>
                </div>
              </div>
            )}

            <ScrollArea className="flex-1">
              <div className="p-3 space-y-3">
                {subAccounts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Aún no has agregado subcuentas.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Crea una subcuenta para asignar productos
                    </p>
                  </div>
                ) : (
                  subAccounts.map((sub) => (
                    <div
                      key={sub.id}
                      className="border border-border rounded-xl overflow-hidden"
                    >
                      <div className="p-3 bg-secondary/30 flex items-center justify-between">
                        <span className="font-semibold">{sub.name}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => deleteSubAccount(sub.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="p-3 space-y-2">
                        {sub.items.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-2">
                            Sin productos asignados
                          </p>
                        ) : (
                          sub.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    removeItemFromSubAccount(sub.id, item.id)
                                  }
                                  className="text-destructive hover:text-destructive/80"
                                >
                                  ×
                                </button>
                                <span>
                                  {item.product.name} x{item.quantity}
                                </span>
                              </div>
                              <span>{formatCurrency(item.totalPrice)}</span>
                            </div>
                          ))
                        )}

                        <div className="pt-2 border-t border-border space-y-1 text-sm">
                          <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span>{formatCurrency(sub.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>ITBIS</span>
                            <span>{formatCurrency(sub.tax)}</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span className="text-primary">
                              {formatCurrency(sub.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancelar División
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={subAccounts.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            Aplicar División
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
