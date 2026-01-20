import { useState, useMemo } from "react";
import { Plus, Trash2, X, Check, Users, ExternalLink, Receipt, Info, Divide } from "lucide-react";
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
import { cn } from "@/lib/utils";

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

type ViewTab = "todas" | string;

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
  const [activeTab, setActiveTab] = useState<ViewTab>("todas");
  const [byPosition, setByPosition] = useState(false);

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

  // Items to display based on active tab
  const displayedItems = useMemo(() => {
    if (activeTab === "todas") {
      return items;
    }
    const subAccount = subAccounts.find((s) => s.id === activeTab);
    return subAccount?.items || [];
  }, [activeTab, items, subAccounts]);

  const formatCurrency = (amount: number) =>
    `RD$${amount.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`;

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
    const nextNumber = subAccounts.length + 1;
    const newSubAccount: SubAccount = {
      id: `sub-${Date.now()}`,
      name: `C${nextNumber}`,
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
    if (activeTab === subAccountId) {
      setActiveTab("todas");
    }
  };

  const splitEqually = () => {
    if (equalSplitCount < 2) return;

    const perPersonSubtotal = Math.floor(subtotal / equalSplitCount);
    const perPersonTax = Math.round(perPersonSubtotal * TAX_RATE);
    const perPersonTotal = perPersonSubtotal + perPersonTax;

    const remainder = subtotal - perPersonSubtotal * equalSplitCount;

    const newSubAccounts: SubAccount[] = Array.from(
      { length: equalSplitCount },
      (_, i) => ({
        id: `sub-${Date.now()}-${i}`,
        name: `C${i + 1}`,
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
    setActiveTab("todas");
    onClose();
  };

  const getSubAccountItemCount = (subAccountId: string) => {
    const sub = subAccounts.find((s) => s.id === subAccountId);
    return sub?.items.length || 0;
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 pb-3 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Divide className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-semibold">División de cuentas</DialogTitle>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-0" style={{ height: "calc(90vh - 140px)" }}>
          {/* Left Column - Productos pedidos */}
          <div className="border-r border-border flex flex-col bg-slate-50/50">
            {/* Info banner */}
            <div className="px-4 py-3 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">
                    Selecciona las subcuentas que deseas pagar.
                  </p>
                  <p className="text-xs text-blue-500">
                    Los descuentos ahora son idependientes.
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <Checkbox 
                  checked={byPosition} 
                  onCheckedChange={(checked) => setByPosition(!!checked)}
                />
                Por posición
              </label>
            </div>

            {/* Tabs for TODAS and subcuentas */}
            <div className="p-3 border-b border-border flex items-center gap-2 overflow-x-auto">
              {/* Tab TODAS */}
              <button
                onClick={() => setActiveTab("todas")}
                className={cn(
                  "flex flex-col items-center justify-center px-4 py-2 rounded-xl border-2 transition-all min-w-[80px]",
                  activeTab === "todas"
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                <div className="flex gap-0.5 mb-1">
                  <div className="w-5 h-5 border rounded bg-primary/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold">$</span>
                  </div>
                  <div className="w-5 h-5 border rounded bg-primary/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold">$</span>
                  </div>
                  <div className="w-5 h-5 border rounded bg-primary/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold">$</span>
                  </div>
                </div>
                <span className="text-xs font-semibold">TODAS</span>
                <span className="text-[10px]">{items.length} 🛒</span>
              </button>

              {/* SubAccount tabs */}
              {subAccounts.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveTab(sub.id)}
                  className={cn(
                    "flex flex-col items-center justify-center px-4 py-2 rounded-xl border-2 transition-all min-w-[70px]",
                    activeTab === sub.id
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  <div className="w-6 h-6 border rounded bg-primary/20 flex items-center justify-center mb-1">
                    <span className="text-[10px] font-bold">$</span>
                  </div>
                  <span className="text-xs font-semibold">{sub.name}</span>
                  <span className="text-[10px]">{sub.items.length} 🛒</span>
                </button>
              ))}
            </div>

            {/* Customer selector */}
            <div className="px-4 py-2 bg-blue-50/50 border-b border-border flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Selecciona un cliente</span>
            </div>

            {/* Items list header */}
            <div className="px-4 py-2 border-b border-border grid grid-cols-[60px_1fr_100px] text-xs font-medium text-muted-foreground">
              <span>Cant.</span>
              <span>Producto</span>
              <span className="text-right">Precio</span>
            </div>

            {/* Items list */}
            <ScrollArea className="flex-1">
              <div className="divide-y divide-border">
                {displayedItems.map((item) => {
                  const isAssigned = assignedItemIds.has(item.id);
                  const isSelected = selectedItems.has(item.id);
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => !isAssigned && activeTab === "todas" && toggleItemSelection(item.id)}
                      className={cn(
                        "px-4 py-3 grid grid-cols-[60px_1fr_100px] items-center transition-colors",
                        activeTab === "todas" && !isAssigned && "cursor-pointer hover:bg-primary/5",
                        isSelected && "bg-primary/10",
                        isAssigned && activeTab === "todas" && "opacity-50"
                      )}
                    >
                      <span className="text-lg font-semibold text-foreground">
                        {item.quantity}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-orange-100 text-orange-500 text-xs font-bold">
                          S
                        </span>
                        <div>
                          <span className="text-sm font-medium">
                            {item.product.name}
                            {item.selectedModifiers.length > 0 && (
                              <span className="text-muted-foreground">
                                {" : "}
                                {item.selectedModifiers.map((m) => m.modifierName).join(", ")}
                              </span>
                            )}
                          </span>
                          {item.notes && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <span>📦</span>
                              <span>{item.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-right font-semibold text-primary">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Assign to subcuenta section */}
            {selectedItems.size > 0 && subAccounts.length > 0 && (
              <div className="p-3 border-t border-border bg-white">
                <p className="text-sm font-medium mb-2 text-muted-foreground">
                  Asignar {selectedItems.size} producto(s) a:
                </p>
                <div className="flex flex-wrap gap-2">
                  {subAccounts.map((sub) => (
                    <Button
                      key={sub.id}
                      size="sm"
                      onClick={() => assignItemsToSubAccount(sub.id)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {sub.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Send button - only show when viewing a subcuenta */}
            {activeTab !== "todas" && (
              <div className="p-3 border-t border-border">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <span className="mr-2">▷</span>
                  Enviar
                </Button>
              </div>
            )}
          </div>

          {/* Right Column - Subcuentas creadas */}
          <div className="flex flex-col bg-white">
            {/* Header with actions */}
            <div className="p-4 border-b border-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>Crea varias subcuentas o divide tu cuenta en partes iguales.</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" onClick={createSubAccount} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-1" />
                  Nueva subcuenta
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowEqualSplit(!showEqualSplit)}
                  className="text-primary border-primary/30 hover:bg-primary/5"
                >
                  <Divide className="w-4 h-4 mr-1" />
                  Dividir en partes iguales
                </Button>
              </div>
            </div>

            {/* Equal Split UI */}
            {showEqualSplit && (
              <div className="p-3 border-b border-border bg-blue-50/50 flex items-center gap-4">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm">Número de personas:</span>
                <Input
                  type="number"
                  min="2"
                  max="20"
                  value={equalSplitCount}
                  onChange={(e) => setEqualSplitCount(parseInt(e.target.value) || 2)}
                  className="w-20"
                />
                <Button size="sm" onClick={splitEqually} className="bg-primary hover:bg-primary/90">
                  Dividir
                </Button>
              </div>
            )}

            {/* Subcuentas list */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {subAccounts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
                      <Receipt className="w-8 h-8 text-muted-foreground" />
                    </div>
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
                      className="border border-border rounded-xl overflow-hidden bg-white shadow-sm"
                    >
                      {/* Subcuenta header */}
                      <div className="px-4 py-3 bg-slate-50 flex items-center justify-between border-b border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">{sub.name}</span>
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-lg font-bold">
                          TOTAL: {formatCurrency(sub.total)}
                        </span>
                      </div>

                      {/* Subcuenta items table */}
                      <div className="divide-y divide-border">
                        {/* Table header */}
                        <div className="px-4 py-2 grid grid-cols-[60px_1fr_100px_50px] text-xs font-medium text-muted-foreground bg-slate-50/50">
                          <span>Cant.</span>
                          <span>Plato</span>
                          <span className="text-right">Precio</span>
                          <span className="text-right">Más</span>
                        </div>

                        {/* Items */}
                        {sub.items.length === 0 ? (
                          <div className="px-4 py-4 text-center text-sm text-muted-foreground">
                            Sin productos asignados
                          </div>
                        ) : (
                          sub.items.map((item) => (
                            <div
                              key={item.id}
                              className="px-4 py-2 grid grid-cols-[60px_1fr_100px_50px] items-center"
                            >
                              <span className="font-medium">{item.quantity}</span>
                              <span className="text-sm">
                                {item.product.name}
                                {item.selectedModifiers.length > 0 && (
                                  <span className="text-muted-foreground">
                                    {" : "}
                                    {item.selectedModifiers.map((m) => m.modifierName).join(", ")}
                                  </span>
                                )}
                              </span>
                              <span className="text-right font-semibold text-primary">
                                {formatCurrency(item.totalPrice)}
                              </span>
                              <div className="flex justify-end">
                                <button
                                  onClick={() => removeItemFromSubAccount(sub.id, item.id)}
                                  className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Subcuenta actions */}
                      <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-slate-50/50">
                        <button
                          onClick={() => deleteSubAccount(sub.id)}
                          className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar subcuenta
                        </button>
                        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm">
                          <Receipt className="w-4 h-4" />
                          Precuenta
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-slate-50">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar división
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={subAccounts.length === 0}
            className="bg-primary hover:bg-primary/90 px-8"
          >
            <Check className="w-4 h-4 mr-2" />
            Aplicar división
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
