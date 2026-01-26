// Tipos centrales del POS

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  categoryId: string;
  hasModifiers: boolean;
  modifierGroups?: ModifierGroup[];
  defaultNotes?: string[]; // Notas predefinidas para este producto
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  minSelection: number;
  maxSelection: number;
  modifiers: Modifier[];
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedModifiers: SelectedModifier[];
  notes: string;
  unitPrice: number;
  totalPrice: number;
}

export interface SelectedModifier {
  groupId: string;
  groupName: string;
  modifierId: string;
  modifierName: string;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
  icon?: string;
}

export interface Table {
  id: string;
  code: string;
  status: "disponible" | "ocupado" | "pagando";
  guests?: number;
  time?: string;
  total?: number;
  zone: string;
  orderId?: string;
}

export interface Order {
  id: string;
  tableId?: string;
  tableCode?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "sent" | "paid";
  createdAt: Date;
  customerId?: string;
  customerName?: string;
}

export interface SubAccount {
  id: string;
  name: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paid: boolean;
}

export type PaymentMethod = "efectivo" | "tarjeta" | "transferencia";

export interface Payment {
  method: PaymentMethod;
  amount: number;
  reference?: string;
}
