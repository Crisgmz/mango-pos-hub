import { useState } from "react";
import { Printer, Calculator, Check, AlertCircle, X, Delete } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface BlindCashCloseModalProps {
  open: boolean;
  onClose: () => void;
  expectedCash: number;
  expectedCard: number;
  expectedTransfer: number;
  totalSales: number;
  transactionCount: number;
}

interface DenominationCount {
  value: number;
  label: string;
  count: number;
}

const cashDenominations: Omit<DenominationCount, "count">[] = [
  { value: 2000, label: "RD$ 2,000" },
  { value: 1000, label: "RD$ 1,000" },
  { value: 500, label: "RD$ 500" },
  { value: 200, label: "RD$ 200" },
  { value: 100, label: "RD$ 100" },
  { value: 50, label: "RD$ 50" },
  { value: 25, label: "RD$ 25" },
  { value: 10, label: "RD$ 10" },
  { value: 5, label: "RD$ 5" },
  { value: 1, label: "RD$ 1" },
];

export function BlindCashCloseModal({
  open,
  onClose,
  expectedCash,
  expectedCard,
  expectedTransfer,
  totalSales,
  transactionCount,
}: BlindCashCloseModalProps) {
  const [step, setStep] = useState<"count" | "result">("count");
  const [denominations, setDenominations] = useState<DenominationCount[]>(
    cashDenominations.map((d) => ({ ...d, count: 0 }))
  );
  const [cardAmount, setCardAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [activeInput, setActiveInput] = useState<"card" | "transfer" | null>(null);

  const formatCurrency = (amount: number) =>
    `RD$ ${amount.toLocaleString("es-DO")}`;

  const totalCounted = denominations.reduce(
    (sum, d) => sum + d.value * d.count,
    0
  );

  const numericCard = parseInt(cardAmount) || 0;
  const numericTransfer = parseInt(transferAmount) || 0;
  const totalReported = totalCounted + numericCard + numericTransfer;

  const expectedTotal = expectedCash + expectedCard + expectedTransfer;
  const difference = totalReported - expectedTotal;

  const updateDenomination = (index: number, delta: number) => {
    setDenominations((prev) =>
      prev.map((d, i) =>
        i === index ? { ...d, count: Math.max(0, d.count + delta) } : d
      )
    );
  };

  const handleNumpadClick = (value: string) => {
    if (!activeInput) return;

    const setter = activeInput === "card" ? setCardAmount : setTransferAmount;
    
    if (value === "clear") {
      setter("");
    } else if (value === "backspace") {
      setter((prev) => prev.slice(0, -1));
    } else {
      setter((prev) => prev + value);
    }
  };

  const handleConfirmCount = () => {
    setStep("result");
  };

  const handlePrint = () => {
    toast.success("Imprimiendo cierre de caja...");
  };

  const handleClose = () => {
    setStep("count");
    setDenominations(cashDenominations.map((d) => ({ ...d, count: 0 })));
    setCardAmount("");
    setTransferAmount("");
    setActiveInput(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="text-xl flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Cierre de Caja a Ciegas
          </DialogTitle>
        </DialogHeader>

        {step === "count" ? (
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left - Cash Counting */}
            <div className="p-4 space-y-4 border-r border-border overflow-y-auto max-h-[60vh]">
              <div>
                <h4 className="font-medium text-muted-foreground text-sm mb-3">
                  Conteo de Efectivo por Denominación
                </h4>
                <div className="space-y-2">
                  {denominations.map((denom, index) => (
                    <div
                      key={denom.value}
                      className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg"
                    >
                      <span className="font-medium text-sm">{denom.label}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateDenomination(index, -1)}
                        >
                          <span className="text-lg">-</span>
                        </Button>
                        <span className="w-10 text-center font-bold">
                          {denom.count}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateDenomination(index, 1)}
                        >
                          <span className="text-lg">+</span>
                        </Button>
                        <span className="w-24 text-right text-sm text-muted-foreground">
                          = {formatCurrency(denom.value * denom.count)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg flex justify-between items-center">
                  <span className="font-semibold">Total Efectivo</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(totalCounted)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right - Card/Transfer & Numpad */}
            <div className="p-4 space-y-4">
              {/* Card Amount */}
              <div
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  activeInput === "card"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setActiveInput("card")}
              >
                <p className="text-sm text-muted-foreground">Total Tarjetas</p>
                <p className="text-2xl font-bold">
                  {cardAmount ? formatCurrency(numericCard) : formatCurrency(0)}
                </p>
              </div>

              {/* Transfer Amount */}
              <div
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  activeInput === "transfer"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setActiveInput("transfer")}
              >
                <p className="text-sm text-muted-foreground">
                  Total Transferencias
                </p>
                <p className="text-2xl font-bold">
                  {transferAmount
                    ? formatCurrency(numericTransfer)
                    : formatCurrency(0)}
                </p>
              </div>

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                  <Button
                    key={num}
                    variant="outline"
                    size="lg"
                    className="text-xl font-semibold h-12"
                    onClick={() => handleNumpadClick(num.toString())}
                    disabled={!activeInput}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="lg"
                  className="text-xl h-12"
                  onClick={() => handleNumpadClick("00")}
                  disabled={!activeInput}
                >
                  00
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12"
                  onClick={() => handleNumpadClick("backspace")}
                  disabled={!activeInput}
                >
                  <Delete className="w-5 h-5" />
                </Button>
              </div>

              {/* Total Summary */}
              <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Efectivo</span>
                  <span>{formatCurrency(totalCounted)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tarjetas</span>
                  <span>{formatCurrency(numericCard)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transferencias</span>
                  <span>{formatCurrency(numericTransfer)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total Reportado</span>
                  <span className="text-primary">
                    {formatCurrency(totalReported)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full h-12 bg-primary hover:bg-primary/90"
                onClick={handleConfirmCount}
              >
                <Check className="w-5 h-5 mr-2" />
                Confirmar Conteo
              </Button>
            </div>
          </div>
        ) : (
          /* Result Step */
          <div className="p-6 space-y-6">
            {/* Comparison Table */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Resumen de Cierre</h4>

              <div className="bg-secondary/30 rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-3 bg-secondary/50 font-semibold text-sm">
                  <span>Concepto</span>
                  <span className="text-right">Esperado</span>
                  <span className="text-right">Reportado</span>
                  <span className="text-right">Diferencia</span>
                </div>

                <div className="grid grid-cols-4 gap-4 p-3 border-b border-border">
                  <span className="text-muted-foreground">Efectivo</span>
                  <span className="text-right">{formatCurrency(expectedCash)}</span>
                  <span className="text-right">{formatCurrency(totalCounted)}</span>
                  <span
                    className={`text-right font-medium ${
                      totalCounted - expectedCash >= 0
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    {totalCounted - expectedCash >= 0 ? "+" : ""}
                    {formatCurrency(totalCounted - expectedCash)}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 p-3 border-b border-border">
                  <span className="text-muted-foreground">Tarjetas</span>
                  <span className="text-right">{formatCurrency(expectedCard)}</span>
                  <span className="text-right">{formatCurrency(numericCard)}</span>
                  <span
                    className={`text-right font-medium ${
                      numericCard - expectedCard >= 0
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    {numericCard - expectedCard >= 0 ? "+" : ""}
                    {formatCurrency(numericCard - expectedCard)}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 p-3 border-b border-border">
                  <span className="text-muted-foreground">Transferencias</span>
                  <span className="text-right">
                    {formatCurrency(expectedTransfer)}
                  </span>
                  <span className="text-right">
                    {formatCurrency(numericTransfer)}
                  </span>
                  <span
                    className={`text-right font-medium ${
                      numericTransfer - expectedTransfer >= 0
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    {numericTransfer - expectedTransfer >= 0 ? "+" : ""}
                    {formatCurrency(numericTransfer - expectedTransfer)}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 p-3 bg-secondary/50 font-bold">
                  <span>TOTAL</span>
                  <span className="text-right">{formatCurrency(expectedTotal)}</span>
                  <span className="text-right">{formatCurrency(totalReported)}</span>
                  <span
                    className={`text-right ${
                      difference >= 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {difference >= 0 ? "+" : ""}
                    {formatCurrency(difference)}
                  </span>
                </div>
              </div>

              {/* Difference Alert */}
              {difference !== 0 && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg ${
                    difference > 0
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">
                      {difference > 0 ? "Sobrante" : "Faltante"} detectado
                    </p>
                    <p className="text-sm opacity-80">
                      Hay una diferencia de {formatCurrency(Math.abs(difference))}{" "}
                      {difference > 0 ? "a favor" : "en contra"}.
                    </p>
                  </div>
                </div>
              )}

              {difference === 0 && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 text-success">
                  <Check className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">Caja cuadrada</p>
                    <p className="text-sm opacity-80">
                      El conteo coincide con el esperado.
                    </p>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Total Ventas del Turno
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(totalSales)}
                  </p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Transacciones</p>
                  <p className="text-2xl font-bold text-primary">
                    {transactionCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("count")}
              >
                Volver a Contar
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handlePrint}>
                <Printer className="w-5 h-5 mr-2" />
                Imprimir Cierre
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
