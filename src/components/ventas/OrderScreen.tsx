import { useState } from "react";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cart } from "./Cart";
import { ProductCatalog } from "./ProductCatalog";
import { ProductCustomizationModal } from "./ProductCustomizationModal";
import { PaymentModal } from "./PaymentModal";
import { SplitBillModal } from "./SplitBillModal";
import { useCart } from "@/hooks/use-cart";
import { Product, SelectedModifier, Table, PaymentMethod, SubAccount } from "@/types/pos";
import { toast } from "sonner";

interface OrderScreenProps {
  table?: Table;
  isQuickSale?: boolean;
  onBack: () => void;
  onOrderComplete: (tableId?: string) => void;
}

export function OrderScreen({
  table,
  isQuickSale = false,
  onBack,
  onOrderComplete,
}: OrderScreenProps) {
  const cart = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showSplitBill, setShowSplitBill] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);

  const handleProductSelect = (product: Product) => {
    if (product.hasModifiers) {
      setSelectedProduct(product);
    } else {
      // Add directly without customization
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
      description: `Mesa ${table?.code} - ${cart.itemCount} productos`,
    });
  };

  const handleConfirmPayment = (method: PaymentMethod, amountReceived: number) => {
    const change = amountReceived - cart.total;
    
    toast.success("Pago completado", {
      description: method === "efectivo" && change > 0 
        ? `Cambio: RD$ ${change.toLocaleString("es-DO")}`
        : `Método: ${method}`,
    });
    
    onOrderComplete(table?.id);
  };

  const handleConfirmSplit = (accounts: SubAccount[]) => {
    setSubAccounts(accounts);
    toast.success("Cuenta dividida", {
      description: `${accounts.length} subcuentas creadas`,
    });
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
          tableCode={table?.code}
          onUpdateQuantity={cart.updateItemQuantity}
          onRemoveItem={cart.removeItem}
          onClearCart={cart.clearCart}
          onSendToKitchen={handleSendToKitchen}
          onSplitBill={() => setShowSplitBill(true)}
          onPay={() => setShowPayment(true)}
          orderSent={orderSent}
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
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {isQuickSale ? "Venta Rápida" : `Mesa ${table?.code}`}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isQuickSale
                  ? "Venta sin mesa asignada"
                  : table?.status === "disponible"
                  ? "Nueva orden"
                  : `Pedido activo • ${table?.time}`}
              </p>
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
        tableCode={table?.code}
        onConfirmPayment={handleConfirmPayment}
      />

      <SplitBillModal
        open={showSplitBill}
        onClose={() => setShowSplitBill(false)}
        items={cart.items}
        subtotal={cart.subtotal}
        tax={cart.tax}
        total={cart.total}
        onConfirmSplit={handleConfirmSplit}
      />
    </div>
  );
}
