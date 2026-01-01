import { MainLayout } from "@/components/layout/MainLayout";
import { 
  ShoppingCart, 
  Wallet, 
  ClipboardList, 
  Settings, 
  Warehouse, 
  Printer, 
  CreditCard, 
  BadgeDollarSign,
  TrendingUp,
  Award,
  Cog,
  ChevronRight,
  Building,
  FileText,
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";

const settingsSections = [
  {
    title: "Operaciones",
    items: [
      {
        id: "pos",
        title: "Punto de Venta",
        description: "Configuración de mesas, zonas y comportamiento del POS",
        icon: ShoppingCart,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/punto-de-venta",
      },
      {
        id: "caja",
        title: "Caja",
        description: "Métodos de pago, turnos y cuadre de caja",
        icon: Wallet,
        color: "bg-success/10 text-success",
        href: "/ajustes/caja",
      },
      {
        id: "comandas",
        title: "Comandas y Precuentas",
        description: "Formato de tickets y flujo de pedidos",
        icon: ClipboardList,
        color: "bg-info/10 text-info",
        href: "/ajustes/comandas",
      },
    ],
  },
  {
    title: "Inventario y Almacén",
    items: [
      {
        id: "almacenes",
        title: "Almacenes e Inventario",
        description: "Gestión de bodegas, stock y traspasos",
        icon: Warehouse,
        color: "bg-warning/10 text-warning",
        href: "/ajustes/almacenes",
      },
      {
        id: "impresion",
        title: "Gestión de Impresión",
        description: "Asignación de impresoras por zona y producto",
        icon: Printer,
        color: "bg-muted-foreground/10 text-muted-foreground",
        href: "/ajustes/impresion",
      },
    ],
  },
  {
    title: "Finanzas y Pagos",
    items: [
      {
        id: "pagos",
        title: "Pagos del Sistema",
        description: "Integración con pasarelas y terminales",
        icon: CreditCard,
        color: "bg-info/10 text-info",
        href: "/ajustes/pagos",
      },
      {
        id: "credito",
        title: "Crédito",
        description: "Configuración de crédito a clientes",
        icon: BadgeDollarSign,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/credito",
      },
      {
        id: "finanzas",
        title: "Finanzas",
        description: "Centros de costo, cuentas contables",
        icon: TrendingUp,
        color: "bg-success/10 text-success",
        href: "/ajustes/finanzas",
      },
    ],
  },
  {
    title: "Sistema",
    items: [
      {
        id: "fidelizacion",
        title: "Fidelización",
        description: "Puntos, promociones y programas de lealtad",
        icon: Award,
        color: "bg-warning/10 text-warning",
        href: "/ajustes/fidelizacion",
      },
      {
        id: "general",
        title: "Ajustes Generales",
        description: "Datos del negocio, horarios y preferencias",
        icon: Settings,
        color: "bg-muted-foreground/10 text-muted-foreground",
        href: "/ajustes/general",
      },
      {
        id: "sistema",
        title: "Sistema",
        description: "Usuarios, roles, permisos y seguridad",
        icon: Cog,
        color: "bg-destructive/10 text-destructive",
        href: "/ajustes/sistema",
      },
    ],
  },
];

const Ajustes = () => {
  return (
    <MainLayout>
      <div className="p-6 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Más Ajustes</h1>
            <p className="text-muted-foreground">Configuración avanzada del sistema</p>
          </div>
        </div>

        {/* Business Info Card */}
        <div className="card-elevated p-6 bg-gradient-to-br from-primary/5 to-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-mango flex items-center justify-center">
              <Building className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Restaurante Demo</h2>
              <p className="text-muted-foreground">RNC: 123-45678-9</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">NCF Disponibles</p>
                <p className="font-semibold text-foreground">2,450</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">e-CF</p>
                <p className="font-semibold text-warning">Pendiente</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Printer className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Impresoras</p>
                <p className="font-semibold text-success">3 activas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <div key={section.title}>
            <h2 className="section-title">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className="card-interactive p-5 flex items-start gap-4"
                  >
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Ajustes;
