import { MainLayout } from "@/components/layout/MainLayout";
import { 
  BarChart3, 
  ShoppingCart, 
  Wallet, 
  Package,
  Calendar,
  Download,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const reportTypes = [
  {
    id: "ventas",
    title: "Informe de Ventas",
    description: "Análisis detallado de ventas por período, producto y categoría",
    icon: ShoppingCart,
    color: "bg-primary/10 text-primary",
    href: "/reportes/ventas",
    stats: { label: "Ventas Hoy", value: "RD$ 45,200" },
  },
  {
    id: "compras",
    title: "Informe de Compras",
    description: "Registro de compras a proveedores y costos",
    icon: Package,
    color: "bg-info/10 text-info",
    href: "/reportes/compras",
    stats: { label: "Compras Mes", value: "RD$ 125,000" },
  },
  {
    id: "financiero",
    title: "Informe Financiero",
    description: "Balance general, ingresos vs gastos, márgenes",
    icon: Wallet,
    color: "bg-success/10 text-success",
    href: "/reportes/financiero",
    stats: { label: "Utilidad Mes", value: "RD$ 280,000" },
  },
  {
    id: "inventario",
    title: "Informe de Inventario",
    description: "Stock actual, movimientos y alertas de reposición",
    icon: BarChart3,
    color: "bg-warning/10 text-warning",
    href: "/reportes/inventario",
    stats: { label: "Items Bajo Stock", value: "12" },
  },
];

const Reportes = () => {
  return (
    <MainLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Reportes</h1>
            <p className="text-muted-foreground">Análisis y estadísticas del negocio</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Seleccionar Período
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar Todo
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card-elevated p-6 bg-gradient-to-br from-primary/5 to-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-mango flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Resumen del Mes</h2>
              <p className="text-muted-foreground">Enero 2024</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">Ventas Totales</p>
              <p className="text-2xl font-bold text-success">RD$ 1,250,000</p>
              <p className="text-xs text-success mt-1">+15% vs mes anterior</p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">Transacciones</p>
              <p className="text-2xl font-bold text-info">842</p>
              <p className="text-xs text-info mt-1">+8% vs mes anterior</p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">Ticket Promedio</p>
              <p className="text-2xl font-bold text-primary">RD$ 1,485</p>
              <p className="text-xs text-primary mt-1">+6% vs mes anterior</p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">Clientes Nuevos</p>
              <p className="text-2xl font-bold text-warning">56</p>
              <p className="text-xs text-warning mt-1">+22% vs mes anterior</p>
            </div>
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <Link key={report.id} to={report.href} className="card-interactive p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl ${report.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">{report.stats.label}</p>
                        <p className="text-lg font-bold text-foreground">{report.stats.value}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver Reporte
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Fiscal Reports Section */}
        <div className="card-elevated p-6">
          <h2 className="section-title">Reportes Fiscales (DGII)</h2>
          <p className="text-muted-foreground mb-6">
            Informes requeridos por la Dirección General de Impuestos Internos
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-secondary/50 rounded-xl border border-border">
              <h3 className="font-semibold text-foreground mb-2">Comprobantes Fiscales</h3>
              <p className="text-sm text-muted-foreground mb-3">NCF emitidos y disponibles</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">B01, B02, B14, B15</span>
                <Button variant="outline" size="sm">Ver</Button>
              </div>
            </div>
            <div className="p-4 bg-secondary/50 rounded-xl border border-border">
              <h3 className="font-semibold text-foreground mb-2">ITBIS Cobrado</h3>
              <p className="text-sm text-muted-foreground mb-3">Resumen de impuestos</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">RD$ 225,000</span>
                <Button variant="outline" size="sm">Ver</Button>
              </div>
            </div>
            <div className="p-4 bg-secondary/50 rounded-xl border border-border">
              <h3 className="font-semibold text-foreground mb-2">Formato 606/607</h3>
              <p className="text-sm text-muted-foreground mb-3">Compras y ventas para DGII</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Generación automática</span>
                <Button variant="outline" size="sm">Exportar</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reportes;
