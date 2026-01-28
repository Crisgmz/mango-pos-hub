import { useState } from "react";
import { ArrowLeft, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cart } from "./Cart";
import { ProductCatalog } from "./ProductCatalog";
import { ProductCustomizationModal } from "./ProductCustomizationModal";
import { PaymentModal } from "./PaymentModal";
import { InvoiceModal } from "./InvoiceModal";
import { useCart } from "@/hooks/use-cart";
import { Product, SelectedModifier, PaymentMethod, CartItem } from "@/types/pos";
import { toast } from "sonner";

interface QuickSaleScreenProps {
  onBack: () => void;
}

export function QuickSaleScreen({ onBack }: QuickSaleScreenProps) {
  const cart = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  // Payment result state for invoice
  const [paymentResult, setPaymentResult] = useState<{
    method: PaymentMethod;
    amountReceived: number;
    change: number;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
  } | null>(null);

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

  const handleConfirmPayment = (method: PaymentMethod, amountReceived: number) => {
    const change = amountReceived - cart.total;

    setPaymentResult({
      method,
      amountReceived,
      change: Math.max(0, change),
      items: [...cart.items],
      subtotal: cart.subtotal,
      tax: cart.tax,
      total: cart.total,
    });

    setShowPayment(false);
    setShowInvoice(true);
  };

  const handleInvoiceClose = () => {
    setShowInvoice(false);
    setPaymentResult(null);
    cart.clearCart();
    toast.success("Venta completada");
  };

  const handleNewSale = () => {
    setShowInvoice(false);
    setPaymentResult(null);
    cart.clearCart();
  };

  return (
    <div className="flex h-full bg-background">
      {/* Cart Sidebar - Left */}
      <div className="w-[380px] flex-shrink-0">
        <Cart
          items={cart.items}
          subtotal={cart.subtotal}
          tax={cart.tax}
          total={cart.total}
          onUpdateQuantity={cart.updateItemQuantity}
          onRemoveItem={cart.removeItem}
          onClearCart={cart.clearCart}
          onPay={() => setShowPayment(true)}
          orderSent={false}
          isQuickSale={true}
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
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Venta Rápida</h1>
                <p className="text-sm text-muted-foreground">
                  Solo ITBIS 18% • Sin mesa asignada
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
        total={cart.total}
        onConfirmPayment={handleConfirmPayment}
      />

      {paymentResult && (
        <InvoiceModal
          open={showInvoice}
          onClose={handleInvoiceClose}
          items={paymentResult.items}
          subtotal={paymentResult.subtotal}
          tax={paymentResult.tax}
          total={paymentResult.total}
          paymentMethod={paymentResult.method}
          amountReceived={paymentResult.amountReceived}
          change={paymentResult.change}
          onPrint={() => toast.success("Imprimiendo factura...")}
          onNewSale={handleNewSale}
        />
      )}
    </div>
  );
}
