import {
  Printer,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/types/pos";

interface PreBillModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip?: number;
  total: number;
  tableCode?: string;
  onPrint?: () => void;
}

export function PreBillModal({
  open,
  onClose,
  items,
  subtotal,
  tax,
  tip,
  total,
  tableCode,
  onPrint,
}: PreBillModalProps) {
  const formatCurrency = (amount: number) =>
    `RD$ ${amount.toLocaleString("es-DO")}`;

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = currentDate.toLocaleTimeString("es-DO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 bg-white dark:bg-card">
        <DialogHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              Pre-Cuenta
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Receipt Content */}
        <div className="p-6">
          {/* Header - Business Info */}
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-foreground">MangoPOS Restaurant</h2>
            <p className="text-sm text-muted-foreground">RNC: 131-12345-6</p>
            <p className="text-sm text-muted-foreground">Tel: (809) 555-0123</p>
          </div>

          <Separator className="my-3" />

          {/* Order Info */}
          <div className="flex justify-between text-sm mb-3">
            <div>
              <p className="text-muted-foreground">
                Mesa: <span className="font-semibold text-foreground">{tableCode || "N/A"}</span>
              </p>
              <p className="text-muted-foreground">
                Fecha: <span className="text-foreground">{formattedDate}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">
                Hora: <span className="text-foreground">{formattedTime}</span>
              </p>
              <p className="text-muted-foreground">
                Mesero: <span className="text-foreground">Admin</span>
              </p>
            </div>
          </div>

          <Separator className="my-3" />

          {/* Items */}
          <ScrollArea className="max-h-[280px]">
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-xs font-semibold text-muted-foreground uppercase">
                <span className="col-span-1">Qty</span>
                <span className="col-span-7">Descripción</span>
                <span className="col-span-4 text-right">Precio</span>
              </div>
              
              {items.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="grid grid-cols-12 text-sm">
                    <span className="col-span-1 font-medium">{item.quantity}</span>
                    <span className="col-span-7 text-foreground">{item.product.name}</span>
                    <span className="col-span-4 text-right font-medium">{formatCurrency(item.totalPrice)}</span>
                  </div>
                  {item.selectedModifiers.length > 0 && (
                    <div className="ml-4 space-y-0.5">
                      {item.selectedModifiers.map((mod, idx) => (
                        <div key={idx} className="grid grid-cols-12 text-xs text-muted-foreground">
                          <span className="col-span-1"></span>
                          <span className="col-span-7">+ {mod.modifierName}</span>
                          <span className="col-span-4 text-right">
                            {mod.price > 0 ? formatCurrency(mod.price) : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.notes && (
                    <p className="ml-4 text-xs italic text-muted-foreground">
                      Nota: {item.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator className="my-4" />

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
                <span className="text-muted-foreground">Propina Ley (10%)</span>
                <span className="text-foreground">{formatCurrency(tip)}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>TOTAL</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground italic">
              * Este documento no tiene validez fiscal *
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Gracias por su preferencia
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cerrar
          </Button>
          <Button className="flex-1" onClick={onPrint}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
