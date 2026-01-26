import { useState } from "react";
import {
  Banknote,
  CreditCard,
  QrCode,
  Delete,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/types/pos";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  tableCode?: string;
  onConfirmPayment: (method: PaymentMethod, amountReceived: number) => void;
}

const paymentMethods = [
  { id: "efectivo" as PaymentMethod, label: "Efectivo", icon: Banknote },
  { id: "tarjeta" as PaymentMethod, label: "Tarjeta", icon: CreditCard },
  { id: "transferencia" as PaymentMethod, label: "Transferencia", icon: QrCode },
];

const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

export function PaymentModal({
  open,
  onClose,
  total,
  tableCode,
  onConfirmPayment,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("efectivo");
  const [amountReceived, setAmountReceived] = useState("");

  const formatCurrency = (amount: number) =>
    `RD$ ${amount.toLocaleString("es-DO")}`;

  const numericAmount = parseInt(amountReceived) || 0;
  const change = numericAmount - total;

  // For card/transfer, track if this is a partial payment
  const isPartialPayment = selectedMethod !== "efectivo" && numericAmount > 0 && numericAmount < total;
  const remainingAmount = total - numericAmount;

  const handleNumpadClick = (value: string) => {
    if (value === "clear") {
      setAmountReceived("");
    } else if (value === "backspace") {
      setAmountReceived((prev) => prev.slice(0, -1));
    } else {
      setAmountReceived((prev) => prev + value);
    }
  };

  const handleQuickAmount = (amount: number) => {
    setAmountReceived(amount.toString());
  };

  const handleExactAmount = () => {
    setAmountReceived(total.toString());
  };

  const handleConfirm = () => {
    const finalAmount = numericAmount > 0 ? numericAmount : total;
    onConfirmPayment(selectedMethod, finalAmount);
    setAmountReceived("");
    onClose();
  };

  // Can pay if: cash with enough amount, or card/transfer with any amount entered or exact
  const canPay =
    selectedMethod === "efectivo"
      ? numericAmount >= total
      : numericAmount === 0 || numericAmount <= total;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="text-xl">
            Pago {tableCode ? `- Mesa ${tableCode}` : ""}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Left - Payment Methods & Amount */}
          <div className="p-4 space-y-4 border-r border-border">
            {/* Payment Methods */}
            <div className="space-y-2">
              <h4 className="font-medium text-muted-foreground text-sm">
                Método de pago
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => {
                        setSelectedMethod(method.id);
                        setAmountReceived("");
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Amounts - Only for Cash */}
            {selectedMethod === "efectivo" && (
              <div className="space-y-2">
                <h4 className="font-medium text-muted-foreground text-sm">
                  Monto rápido
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => handleQuickAmount(amount)}
                      className={
                        numericAmount === amount
                          ? "border-primary bg-primary/10"
                          : ""
                      }
                    >
                      {formatCurrency(amount)}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleExactAmount}
                >
                  Monto exacto ({formatCurrency(total)})
                </Button>
              </div>
            )}

            {/* Numpad - Always visible now for partial payments */}
            <div className="space-y-2">
              <div className="bg-secondary/50 rounded-xl p-4 text-right">
                <p className="text-sm text-muted-foreground">
                  {selectedMethod === "efectivo"
                    ? "Monto recibido"
                    : "Monto a cobrar con " + (selectedMethod === "tarjeta" ? "tarjeta" : "transferencia")}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {amountReceived
                    ? formatCurrency(numericAmount)
                    : formatCurrency(selectedMethod === "efectivo" ? 0 : total)}
                </p>
                {selectedMethod !== "efectivo" && numericAmount === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Ingresa monto para pago parcial o confirma el total
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                  <Button
                    key={num}
                    variant="outline"
                    size="lg"
                    className="text-xl font-semibold h-14"
                    onClick={() => handleNumpadClick(num.toString())}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="lg"
                  className="text-xl h-14"
                  onClick={() => handleNumpadClick("00")}
                >
                  00
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14"
                  onClick={() => handleNumpadClick("backspace")}
                >
                  <Delete className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right - Summary */}
          <div className="p-4 flex flex-col">
            <div className="flex-1 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total a pagar</span>
                  <span className="text-xl font-bold">{formatCurrency(total)}</span>
                </div>

                {selectedMethod === "efectivo" ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Monto recibido
                      </span>
                      <span className="text-xl font-bold">
                        {formatCurrency(numericAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between pt-3 border-t border-border">
                      <span className="text-lg font-medium">Cambio</span>
                      <span
                        className={`text-2xl font-bold ${
                          change >= 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        {formatCurrency(Math.max(0, change))}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Cobrar con {selectedMethod === "tarjeta" ? "tarjeta" : "transferencia"}
                      </span>
                      <span className="text-xl font-bold">
                        {formatCurrency(numericAmount > 0 ? numericAmount : total)}
                      </span>
                    </div>

                    {isPartialPayment && (
                      <div className="flex justify-between pt-3 border-t border-border">
                        <span className="text-lg font-medium text-warning">
                          Pendiente por cobrar
                        </span>
                        <span className="text-2xl font-bold text-warning">
                          {formatCurrency(remainingAmount)}
                        </span>
                      </div>
                    )}

                    {isPartialPayment && (
                      <div className="p-3 bg-warning/10 rounded-lg">
                        <p className="text-sm text-warning">
                          Este es un pago parcial. El restante deberá cobrarse con otro método.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Confirm Button */}
            <div className="pt-4 space-y-2">
              <Button
                className="w-full h-14 text-lg bg-success hover:bg-success/90"
                onClick={handleConfirm}
                disabled={!canPay || (selectedMethod !== "efectivo" && numericAmount > total)}
              >
                <Check className="w-5 h-5 mr-2" />
                {isPartialPayment
                  ? `Cobrar ${formatCurrency(numericAmount)}`
                  : "Confirmar Pago"}
              </Button>
              <Button variant="outline" className="w-full" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
