import {
  Printer,
  Check,
  Download,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CartItem, PaymentMethod } from "@/types/pos";

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip?: number;
  total: number;
  tableCode?: string;
  paymentMethod: PaymentMethod;
  amountReceived: number;
  change: number;
  invoiceNumber?: string;
  ncf?: string;
  onPrint?: () => void;
  onNewSale?: () => void;
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta de Crédito/Débito",
  transferencia: "Transferencia Bancaria",
};

export function InvoiceModal({
  open,
  onClose,
  items,
  subtotal,
  tax,
  tip,
  total,
  tableCode,
  paymentMethod,
  amountReceived,
  change,
  invoiceNumber = "FAC-001234",
  ncf = "B0100000001",
  onPrint,
  onNewSale,
}: InvoiceModalProps) {
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
    second: "2-digit",
  });

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 bg-white dark:bg-card overflow-hidden">
        {/* Success Header */}
        <div className="bg-success/10 p-6 text-center border-b border-success/20">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-success">¡Pago Completado!</h2>
          <p className="text-sm text-muted-foreground mt-1">
            La transacción se ha procesado exitosamente
          </p>
        </div>

        {/* Invoice Content */}
        <ScrollArea className="max-h-[400px]">
          <div className="p-6">
            {/* Header - Business Info */}
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-foreground">MangoPOS Restaurant</h2>
              <p className="text-sm text-muted-foreground">RNC: 131-12345-6</p>
              <p className="text-sm text-muted-foreground">
                Av. Winston Churchill #123, Santo Domingo
              </p>
              <p className="text-sm text-muted-foreground">Tel: (809) 555-0123</p>
            </div>

            <Separator className="my-3" />

            {/* Invoice Info */}
            <div className="bg-secondary/50 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">No. Factura</p>
                  <p className="font-semibold text-foreground">{invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">NCF</p>
                  <p className="font-semibold text-foreground">{ncf}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fecha</p>
                  <p className="text-foreground">{formattedDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Hora</p>
                  <p className="text-foreground">{formattedTime}</p>
                </div>
                {tableCode && (
                  <>
                    <div>
                      <p className="text-muted-foreground">Mesa</p>
                      <p className="font-semibold text-foreground">{tableCode}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Atendido por</p>
                      <p className="text-foreground">Admin</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
              <div className="grid grid-cols-12 text-xs font-semibold text-muted-foreground uppercase pb-2 border-b border-border">
                <span className="col-span-1">Qty</span>
                <span className="col-span-7">Descripción</span>
                <span className="col-span-4 text-right">Importe</span>
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
                </div>
              ))}
            </div>

            <Separator className="my-3" />

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
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>TOTAL</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Payment Info */}
            <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Método de Pago</span>
                <Badge variant="secondary" className="font-medium">
                  {paymentMethodLabels[paymentMethod]}
                </Badge>
              </div>
              {paymentMethod === "efectivo" && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Recibido</span>
                    <span className="font-medium text-foreground">{formatCurrency(amountReceived)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cambio</span>
                    <span className="font-bold text-success">{formatCurrency(change)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 text-center space-y-1">
              <p className="text-xs text-muted-foreground">
                Válido como comprobante fiscal
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                ¡Gracias por su preferencia!
              </p>
              <p className="text-xs text-muted-foreground">
                Visítenos en: www.mangopos.do
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="p-4 border-t border-border">
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" onClick={onPrint}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
            <Button onClick={onNewSale} className="bg-primary hover:bg-primary/90">
              Nueva Venta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
