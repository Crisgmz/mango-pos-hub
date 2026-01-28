import { useState } from "react";
import { ArrowLeft, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cart } from "./Cart";
import { ProductCatalog } from "./ProductCatalog";
import { ProductCustomizationModal } from "./ProductCustomizationModal";
import { PaymentModal } from "./PaymentModal";
import { PreBillModal } from "./PreBillModal";
import { InvoiceModal } from "./InvoiceModal";
import { TableSelectionModal } from "./TableSelectionModal";
import { useCart } from "@/hooks/use-cart";
import { Product, SelectedModifier, Table, PaymentMethod, CartItem } from "@/types/pos";
import { toast } from "sonner";

const TIP_RATE = 0.10; // 10% Ley de propina

interface ManualSaleScreenProps {
  onBack: () => void;
  tables: Table[];
  onTableAssigned: (tableId: string) => void;
}

export function ManualSaleScreen({ onBack, tables, onTableAssigned }: ManualSaleScreenProps) {
  const cart = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showPreBill, setShowPreBill] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showTableSelection, setShowTableSelection] = useState(true);
  const [assignedTable, setAssignedTable] = useState<Table | null>(null);
  const [orderSent, setOrderSent] = useState(false);

  // Calculate tip (10% of subtotal)
  const tip = Math.round(cart.subtotal * TIP_RATE);
  const totalWithTip = cart.total + tip;

  // Payment result state for invoice
  const [paymentResult, setPaymentResult] = useState<{
    method: PaymentMethod;
    amountReceived: number;
    change: number;
    items: CartItem[];
    subtotal: number;
    tax: number;
    tip: number;
    total: number;
  } | null>(null);

  const handleTableSelect = (table: Table) => {
    setAssignedTable(table);
    setShowTableSelection(false);
    onTableAssigned(table.id);
    toast.success(`Mesa ${table.code} asignada`, {
      description: "Cuenta abierta automáticamente",
    });
  };

  const handleProductSelect = (product: Product) => {
    if (product.hasModifiers) {
      setSelectedProduct(product);
    } else {
      cart.addItem(product, 1, [], "");
      toast.success(`${product.name} agregado`);
    }
  };

  const handleConfirmCustomization = (
    product: Product,
    quantity: number,
    modifiers: SelectedModifier[],
    notes: string
  ) => {
    cart.addItem(product, quantity, modifiers, notes);
    toast.success(`${product.name} agregado`);
  };

  const handleSendToKitchen = () => {
    setOrderSent(true);
    toast.success("Pedido enviado a cocina", {
      description: `Mesa ${assignedTable?.code} - ${cart.itemCount} productos`,
    });
  };

  const handleConfirmPayment = (method: PaymentMethod, amountReceived: number) => {
    const change = amountReceived - totalWithTip;

    setPaymentResult({
      method,
      amountReceived,
      change: Math.max(0, change),
      items: [...cart.items],
      subtotal: cart.subtotal,
      tax: cart.tax,
      tip,
      total: totalWithTip,
    });

    setShowPayment(false);
    setShowInvoice(true);
  };

  const handleInvoiceClose = () => {
    setShowInvoice(false);
    setPaymentResult(null);
    cart.clearCart();
    onBack();
  };

  const handlePrintPreBill = () => {
    toast.success("Imprimiendo precuenta...");
    setShowPreBill(false);
  };

  // Show table selection first
  if (showTableSelection) {
    return (
      <div className="flex h-full bg-background items-center justify-center">
        <TableSelectionModal
          open={showTableSelection}
          onClose={onBack}
          tables={tables}
          onSelectTable={handleTableSelect}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background">
      {/* Cart Sidebar - Left */}
      <div className="w-[380px] flex-shrink-0">
        <Cart
          items={cart.items}
          subtotal={cart.subtotal}
          tax={cart.tax}
          tip={tip}
          total={totalWithTip}
          tableCode={assignedTable?.code}
          onUpdateQuantity={cart.updateItemQuantity}
          onRemoveItem={cart.removeItem}
          onClearCart={cart.clearCart}
          onSendToKitchen={handleSendToKitchen}
          onPay={() => setShowPayment(true)}
          onPreBill={() => setShowPreBill(true)}
          orderSent={orderSent}
          isManualSale={true}
        />
      </div>

      {/* Main Content - Right */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-info" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Venta Manual • Mesa {assignedTable?.code}
                </h1>
                <p className="text-sm text-muted-foreground">
                  ITBIS 18% + Propina 10%
                </p>
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm">
            <User className="w-4 h-4 mr-2" />
            Asignar cliente
          </Button>
        </div>

        {/* Product Catalog */}
        <div className="flex-1 overflow-hidden">
          <ProductCatalog onSelectProduct={handleProductSelect} />
        </div>
      </div>

      {/* Modals */}
      <ProductCustomizationModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onConfirm={handleConfirmCustomization}
      />

      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        total={totalWithTip}
        tableCode={assignedTable?.code}
        onConfirmPayment={handleConfirmPayment}
      />

      <PreBillModal
        open={showPreBill}
        onClose={() => setShowPreBill(false)}
        items={cart.items}
        subtotal={cart.subtotal}
        tax={cart.tax}
        tip={tip}
        total={totalWithTip}
        tableCode={assignedTable?.code}
        onPrint={handlePrintPreBill}
      />

      {paymentResult && (
        <InvoiceModal
          open={showInvoice}
          onClose={handleInvoiceClose}
          items={paymentResult.items}
          subtotal={paymentResult.subtotal}
          tax={paymentResult.tax}
          tip={paymentResult.tip}
          total={paymentResult.total}
          tableCode={assignedTable?.code}
          paymentMethod={paymentResult.method}
          amountReceived={paymentResult.amountReceived}
          change={paymentResult.change}
          onPrint={() => toast.success("Imprimiendo factura...")}
          onNewSale={handleInvoiceClose}
        />
      )}
    </div>
  );
}
