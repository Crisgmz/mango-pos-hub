import { Minus, Plus, Trash2, X, ChefHat, CreditCard, Split, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "@/types/pos";

interface CartProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip?: number;
  total: number;
  tableCode?: string;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onSendToKitchen?: () => void;
  onSplitBill?: () => void;
  onPay: () => void;
  onPreBill?: () => void;
  orderSent?: boolean;
  isQuickSale?: boolean;
  isManualSale?: boolean;
}

export function Cart({
  items,
  subtotal,
  tax,
  tip,
  total,
  tableCode,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSendToKitchen,
  onSplitBill,
  onPay,
  onPreBill,
  orderSent = false,
  isQuickSale = false,
  isManualSale = false,
}: CartProps) {
  const formatCurrency = (amount: number) =>
    `RD$ ${amount.toLocaleString("es-DO")}`;

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {tableCode ? `Mesa ${tableCode}` : "Venta Rápida"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "producto" : "productos"}
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearCart}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Items List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No hay productos en el carrito
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Selecciona productos del menú
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-secondary/50 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">
                      {item.product.name}
                    </h4>
                    {item.selectedModifiers.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {item.selectedModifiers.map((mod, idx) => (
                          <p
                            key={idx}
                            className="text-xs text-muted-foreground"
                          >
                            + {mod.modifierName}
                            {mod.price > 0 && (
                              <span className="text-primary ml-1">
                                +{formatCurrency(mod.price)}
                              </span>
                            )}
                          </p>
                        ))}
                      </div>
                    )}
                    {item.notes && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="font-semibold text-foreground">
                    {formatCurrency(item.totalPrice)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Totals & Actions */}
      <div className="p-4 border-t border-border space-y-4">
        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">ITBIS (18%)</span>
            <span className="text-foreground">{formatCurrency(tax)}</span>
          </div>
          {tip !== undefined && tip > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Propina (10%)</span>
              <span className="text-foreground">{formatCurrency(tip)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Quick Sale - Just pay button */}
          {isQuickSale && (
            <Button
              className="w-full bg-success hover:bg-success/90"
              size="lg"
              onClick={onPay}
              disabled={items.length === 0}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Pagar {formatCurrency(total)}
            </Button>
          )}

          {/* Manual/Table Sale - Full flow */}
          {!isQuickSale && (
            <>
              {tableCode && !orderSent && onSendToKitchen && (
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  onClick={onSendToKitchen}
                  disabled={items.length === 0}
                >
                  <ChefHat className="w-5 h-5 mr-2" />
                  Enviar a Cocina
                </Button>
              )}

              {tableCode && orderSent && (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={onPreBill}
                    disabled={items.length === 0}
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Pre-Cuenta
                  </Button>
                  {onSplitBill && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={onSplitBill}
                      disabled={items.length === 0}
                    >
                      <Split className="w-5 h-5 mr-2" />
                      Dividir
                    </Button>
                  )}
                </div>
              )}

              <Button
                className="w-full bg-success hover:bg-success/90"
                size="lg"
                onClick={onPay}
                disabled={items.length === 0}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Pagar {formatCurrency(total)}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
