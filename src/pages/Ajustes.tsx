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
  Shield,
  Users,
  Receipt,
  Package,
  DollarSign,
  Store,
  Globe,
  Smartphone,
  GitBranch,
  Truck,
  Gift,
  Target,
  Percent,
  UserCheck,
  Coins,
  BarChart3,
  ClipboardCheck,
  ReceiptText,
  Layers
} from "lucide-react";
import { Link } from "react-router-dom";

const settingsSections = [
  {
    title: "Punto de Venta",
    items: [
      {
        id: "venta-rapida",
        title: "Venta Rápida",
        description: "Modo de venta ágil sin mesas",
        icon: ShoppingCart,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/venta-rapida",
      },
      {
        id: "venta-manual",
        title: "Venta Manual",
        description: "Ingreso manual de productos y precios",
        icon: ClipboardList,
        color: "bg-info/10 text-info",
        href: "/ajustes/venta-manual",
      },
      {
        id: "delivery",
        title: "Delivery",
        description: "Configuración de entregas a domicilio",
        icon: Truck,
        color: "bg-warning/10 text-warning",
        href: "/ajustes/delivery",
      },
      {
        id: "self-service",
        title: "Self Service",
        description: "Modo autoservicio para clientes",
        icon: Smartphone,
        color: "bg-success/10 text-success",
        href: "/ajustes/self-service",
      },
      {
        id: "salones-mesas",
        title: "Salones y Mesas",
        description: "Gestión de zonas y mesas del local",
        icon: Layers,
        color: "bg-muted-foreground/10 text-muted-foreground",
        href: "/ajustes/salones-mesas",
      },
    ],
  },
  {
    title: "Caja",
    items: [
      {
        id: "apertura-cierre",
        title: "Apertura y Cierre",
        description: "Flujos de apertura y cierre de caja",
        icon: Wallet,
        color: "bg-success/10 text-success",
        href: "/ajustes/apertura-cierre",
      },
      {
        id: "historial-venta",
        title: "Historial de Venta",
        description: "Consulta de ventas realizadas",
        icon: Receipt,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/historial-venta",
      },
      {
        id: "ingresos-egresos",
        title: "Registro de Ingresos y Egresos",
        description: "Movimientos de efectivo en caja",
        icon: DollarSign,
        color: "bg-info/10 text-info",
        href: "/ajustes/ingresos-egresos",
      },
      {
        id: "gestion-cierres",
        title: "Gestión de Cierres de Caja",
        description: "Administración de cierres y cuadres",
        icon: ClipboardCheck,
        color: "bg-warning/10 text-warning",
        href: "/ajustes/gestion-cierres",
      },
      {
        id: "notas-credito",
        title: "Gestión de Notas de Crédito",
        description: "Anulaciones y devoluciones",
        icon: ReceiptText,
        color: "bg-destructive/10 text-destructive",
        href: "/ajustes/notas-credito",
      },
      {
        id: "monitor-ventas",
        title: "Monitor de Ventas",
        description: "Visualización en tiempo real",
        icon: BarChart3,
        color: "bg-muted-foreground/10 text-muted-foreground",
        href: "/ajustes/monitor-ventas",
      },
    ],
  },
  {
    title: "Gestión de Productos",
    items: [
      {
        id: "productos-categorias",
        title: "Productos y Categorías",
        description: "Catálogo de productos",
        icon: Package,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/productos-categorias",
      },
      {
        id: "modificadores",
        title: "Modificadores",
        description: "Extras y variantes de productos",
        icon: Settings,
        color: "bg-info/10 text-info",
        href: "/ajustes/modificadores",
      },
      {
        id: "combos",
        title: "Combos",
        description: "Paquetes y ofertas especiales",
        icon: Layers,
        color: "bg-success/10 text-success",
        href: "/ajustes/combos",
      },
      {
        id: "menu",
        title: "Menú",
        description: "Configuración de menús",
        icon: ClipboardList,
        color: "bg-warning/10 text-warning",
        href: "/ajustes/menu",
      },
      {
        id: "recetas",
        title: "Recetas",
        description: "Ingredientes y costos de recetas",
        icon: FileText,
        color: "bg-muted-foreground/10 text-muted-foreground",
        href: "/ajustes/recetas",
      },
      {
        id: "insumos",
        title: "Insumos",
        description: "Materias primas e ingredientes",
        icon: Package,
        color: "bg-destructive/10 text-destructive",
        href: "/ajustes/insumos",
      },
    ],
  },
  {
    title: "Comandas y Precuentas",
    items: [
      {
        id: "config-comandas",
        title: "Configuración de Comandas",
        description: "Formato y comportamiento de comandas",
        icon: ClipboardList,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/config-comandas",
      },
      {
        id: "config-precuentas",
        title: "Configuración de Precuentas",
        description: "Formato de precuentas",
        icon: Receipt,
        color: "bg-info/10 text-info",
        href: "/ajustes/config-precuentas",
      },
      {
        id: "turnos",
        title: "Turnos",
        description: "Gestión de turnos de trabajo",
        icon: Users,
        color: "bg-success/10 text-success",
        href: "/ajustes/turnos",
      },
    ],
  },
  {
    title: "Ajustes Generales",
    items: [
      {
        id: "usuarios",
        title: "Usuarios",
        description: "Gestión de usuarios del sistema",
        icon: Users,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/usuarios",
      },
      {
        id: "clientes",
        title: "Clientes",
        description: "Gestión de clientes y contactos",
        icon: Users,
        color: "bg-info/10 text-info",
        href: "/clientes",
      },
      {
        id: "cajas",
        title: "Cajas",
        description: "Configuración de puntos de venta",
        icon: Wallet,
        color: "bg-success/10 text-success",
        href: "/ajustes/cajas",
      },
      {
        id: "impuestos",
        title: "Impuestos",
        description: "ITBIS y configuración fiscal",
        icon: Receipt,
        color: "bg-warning/10 text-warning",
        href: "/ajustes/impuestos",
      },
      {
        id: "monedas",
        title: "Monedas",
        description: "Configuración de divisas",
        icon: Coins,
        color: "bg-info/10 text-info",
        href: "/ajustes/monedas",
      },
      {
        id: "config-regionales",
        title: "Configuraciones Regionales",
        description: "Idioma, zona horaria y formato",
        icon: Globe,
        color: "bg-muted-foreground/10 text-muted-foreground",
        href: "/ajustes/config-regionales",
      },
      {
        id: "sucursales",
        title: "Sucursales",
        description: "Gestión de múltiples locales",
        icon: Store,
        color: "bg-destructive/10 text-destructive",
        href: "/ajustes/sucursales",
      },
    ],
  },
  {
    title: "Almacenes e Inventario",
    items: [
      {
        id: "kardex",
        title: "Kardex por Sucursal",
        description: "Control de inventario por ubicación",
        icon: Warehouse,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/kardex",
      },
      {
        id: "salida-inventario",
        title: "Registro de Salida de Inventario",
        description: "Control de salidas de stock",
        icon: Package,
        color: "bg-warning/10 text-warning",
        href: "/ajustes/salida-inventario",
      },
      {
        id: "mover-inventario",
        title: "Mover Inventario entre Almacenes",
        description: "Transferencias entre bodegas",
        icon: GitBranch,
        color: "bg-info/10 text-info",
        href: "/ajustes/mover-inventario",
      },
      {
        id: "cuadre-stock",
        title: "Cuadre de Stock",
        description: "Ajustes de inventario",
        icon: ClipboardCheck,
        color: "bg-success/10 text-success",
        href: "/ajustes/cuadre-stock",
      },
      {
        id: "mermas",
        title: "Mermas o Perecederos",
        description: "Registro de pérdidas",
        icon: Package,
        color: "bg-destructive/10 text-destructive",
        href: "/ajustes/mermas",
      },
      {
        id: "requerimientos",
        title: "Requerimientos",
        description: "Solicitudes de stock",
        icon: FileText,
        color: "bg-muted-foreground/10 text-muted-foreground",
        href: "/ajustes/requerimientos",
      },
    ],
  },
  {
    title: "Compras",
    items: [
      {
        id: "lista-compras",
        title: "Lista de Compras",
        description: "Gestión de pedidos a proveedores",
        icon: ClipboardList,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/lista-compras",
      },
      {
        id: "registro-compras",
        title: "Registro de Compras",
        description: "Historial de compras realizadas",
        icon: Receipt,
        color: "bg-info/10 text-info",
        href: "/ajustes/registro-compras",
      },
      {
        id: "gestion-proveedores",
        title: "Gestión de Proveedores",
        description: "Catálogo de proveedores",
        icon: Truck,
        color: "bg-success/10 text-success",
        href: "/ajustes/gestion-proveedores",
      },
      {
        id: "credito-proveedores",
        title: "Crédito de Compras a Proveedores",
        description: "Cuentas por pagar",
        icon: CreditCard,
        color: "bg-warning/10 text-warning",
        href: "/ajustes/credito-proveedores",
      },
    ],
  },
  {
    title: "Gestión de Impresión",
    items: [
      {
       id: "impresoras",
       title: "Impresoras",
       description: "Configuración de impresoras",
        icon: Printer,
        color: "bg-primary/10 text-primary",
       href: "/ajustes/impresoras",
      },
      {
        id: "impresion-productos",
       title: "Asignar Impresión de Productos",
        description: "Productos por impresora",
        icon: Package,
       color: "bg-warning/10 text-warning",
        href: "/ajustes/impresion-productos",
      },
      {
        id: "impresion-comprobantes",
       title: "Asignar Impresión de Comprobantes",
        description: "Comprobantes por impresora",
        icon: Receipt,
        color: "bg-success/10 text-success",
        href: "/ajustes/impresion-comprobantes",
      },
      {
        id: "impresion-comandas",
       title: "Asignar Impresión de Comandas",
       description: "Comandas por impresora",
        icon: ClipboardList,
       color: "bg-info/10 text-info",
        href: "/ajustes/impresion-comandas",
      },
    ],
  },
  {
    title: "Pagos del Sistema",
    items: [
      {
        id: "tarjeta",
        title: "Tarjeta",
        description: "Configuración de pagos con tarjeta",
        icon: CreditCard,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/tarjeta",
      },
      {
        id: "transferencias",
        title: "Transferencias",
        description: "Pagos por transferencia bancaria",
        icon: GitBranch,
        color: "bg-info/10 text-info",
        href: "/ajustes/transferencias",
      },
      {
        id: "historial-pagos",
        title: "Información Histórica de Pagos",
        description: "Historial de transacciones",
        icon: Receipt,
        color: "bg-success/10 text-success",
        href: "/ajustes/historial-pagos",
      },
    ],
  },
  {
    title: "Crédito",
    items: [
      {
        id: "venta-credito",
        title: "Venta a Crédito",
        description: "Configuración de ventas a crédito",
        icon: BadgeDollarSign,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/venta-credito",
      },
      {
        id: "gestion-creditos",
        title: "Gestión de Créditos",
        description: "Administración de cuentas por cobrar",
        icon: CreditCard,
        color: "bg-info/10 text-info",
        href: "/ajustes/gestion-creditos",
      },
      {
        id: "creditos-clientes",
        title: "Créditos de Clientes",
        description: "Créditos otorgados a clientes",
        icon: Users,
        color: "bg-success/10 text-success",
        href: "/ajustes/creditos-clientes",
      },
    ],
  },
  {
    title: "Finanzas",
    items: [
      {
        id: "gestion-costos",
        title: "Gestión de Costos",
        description: "Control de costos y márgenes",
        icon: TrendingUp,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/gestion-costos",
      },
      {
        id: "gestion-metas",
        title: "Gestión de Metas",
        description: "Objetivos de ventas",
        icon: Target,
        color: "bg-success/10 text-success",
        href: "/ajustes/gestion-metas",
      },
    ],
  },
  {
    title: "Fidelización",
    items: [
      {
        id: "tarjeta-fidelidad",
        title: "Tarjeta de Fidelidad",
        description: "Programa de puntos y recompensas",
        icon: Award,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/tarjeta-fidelidad",
      },
      {
        id: "niveles-membresias",
        title: "Niveles de Membresías",
        description: "Categorías de clientes VIP",
        icon: UserCheck,
        color: "bg-info/10 text-info",
        href: "/ajustes/niveles-membresias",
      },
      {
        id: "promociones",
        title: "Promociones y Descuentos",
        description: "Ofertas y promociones activas",
        icon: Percent,
        color: "bg-success/10 text-success",
        href: "/ajustes/promociones",
      },
      {
        id: "cupones",
        title: "Gestión de Cupones",
        description: "Códigos promocionales",
        icon: Receipt,
        color: "bg-warning/10 text-warning",
        href: "/ajustes/cupones",
      },
      {
        id: "gift-cards",
        title: "Gift Cards y Bonos",
        description: "Tarjetas de regalo",
        icon: Gift,
        color: "bg-destructive/10 text-destructive",
        href: "/ajustes/gift-cards",
      },
      {
        id: "puntos-recompensa",
        title: "Puntos de Recompensa",
        description: "Sistema de puntos acumulables",
        icon: Award,
        color: "bg-muted-foreground/10 text-muted-foreground",
        href: "/ajustes/puntos-recompensa",
      },
      {
        id: "historial-fidelidad",
        title: "Historial de Fidelidad",
        description: "Registro de actividad de clientes",
        icon: BarChart3,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/historial-fidelidad",
      },
    ],
  },
  {
    title: "Sistema",
    items: [
      {
        id: "opciones-sistema",
        title: "Opciones del Sistema",
        description: "Configuración general del sistema",
        icon: Cog,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/opciones-sistema",
      },
      {
        id: "opciones-app",
        title: "Opciones de APP MangoPOS",
        description: "Configuración de la aplicación móvil",
        icon: Smartphone,
        color: "bg-info/10 text-info",
        href: "/ajustes/opciones-app",
      },
      {
        id: "info-restaurante",
        title: "Información del Restaurante",
        description: "Datos del negocio",
        icon: Building,
        color: "bg-success/10 text-success",
        href: "/ajustes/info-restaurante",
      },
      {
        id: "gestion-sucursales",
        title: "Gestión de Sucursales",
        description: "Administración multi-sucursal",
        icon: Store,
        color: "bg-warning/10 text-warning",
        href: "/ajustes/gestion-sucursales",
      },
      {
        id: "actualizaciones",
        title: "Actualizaciones",
        description: "Versiones y actualizaciones",
        icon: Settings,
        color: "bg-muted-foreground/10 text-muted-foreground",
        href: "/ajustes/actualizaciones",
      },
      {
        id: "integracion-marketing",
        title: "Integración con Marketing",
        description: "Conexión con herramientas de marketing",
        icon: Target,
        color: "bg-destructive/10 text-destructive",
        href: "/ajustes/integracion-marketing",
      },
    ],
  },
  {
    title: "Comprobantes de Ventas",
    items: [
      {
        id: "config-credito-fiscal",
        title: "Configuración de Crédito Fiscal",
        description: "NCF y comprobantes fiscales DGII",
        icon: FileText,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/config-credito-fiscal",
      },
    ],
  },
  {
    title: "Informes",
    items: [
      {
        id: "informe-ventas",
        title: "Informe de Ventas",
        description: "Reportes de ventas detallados",
        icon: BarChart3,
        color: "bg-primary/10 text-primary",
        href: "/ajustes/informe-ventas",
      },
      {
        id: "informe-compras",
        title: "Informe de Compras",
        description: "Reportes de compras",
        icon: Receipt,
        color: "bg-info/10 text-info",
        href: "/ajustes/informe-compras",
      },
      {
        id: "informe-finanzas",
        title: "Informe de Finanzas",
        description: "Reportes financieros",
        icon: TrendingUp,
        color: "bg-success/10 text-success",
        href: "/ajustes/informe-finanzas",
      },
      {
        id: "informe-inventario",
        title: "Informe de Inventario",
        description: "Reportes de stock",
        icon: Warehouse,
        color: "bg-warning/10 text-warning",
        href: "/ajustes/informe-inventario",
      },
      {
        id: "informe-asistencia",
        title: "Informe de Asistencia",
        description: "Reportes de personal",
        icon: Users,
        color: "bg-muted-foreground/10 text-muted-foreground",
        href: "/ajustes/informe-asistencia",
      },
      {
        id: "indicadores",
        title: "Indicadores Gráficos",
        description: "Dashboard de indicadores",
        icon: BarChart3,
        color: "bg-destructive/10 text-destructive",
        href: "/ajustes/indicadores",
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
            <p className="text-muted-foreground">Configuración completa del sistema MangoPOS</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className="card-interactive p-4 flex items-start gap-3"
                  >
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm mb-0.5">{item.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
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