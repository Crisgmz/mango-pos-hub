import { MainLayout } from "@/components/layout/MainLayout";
import { 
  DollarSign, 
  Lock, 
  History, 
  ArrowDownCircle, 
  ArrowUpCircle,
  ClipboardList,
  LayoutGrid,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const cajaModules = [
  { 
    icon: DollarSign, 
    title: "Apertura de Caja", 
    description: "Iniciar turno con monto inicial",
    color: "bg-success/10 text-success",
    action: "Aperturar"
  },
  { 
    icon: Lock, 
    title: "Cierre de Caja", 
    description: "Finalizar turno y cuadrar",
    color: "bg-destructive/10 text-destructive",
    action: "Cerrar"
  },
  { 
    icon: History, 
    title: "Historial de Caja", 
    description: "Ver movimientos anteriores",
    color: "bg-info/10 text-info",
    action: "Ver"
  },
  { 
    icon: ClipboardList, 
    title: "Gestión de Cierres", 
    description: "Revisar y aprobar cierres",
    color: "bg-warning/10 text-warning",
    action: "Gestionar"
  },
];

const movements = [
  { type: "ingreso", concept: "Venta Mesa SP02", amount: 2850, time: "14:32" },
  { type: "ingreso", concept: "Venta Mesa TR01", amount: 1200, time: "14:15" },
  { type: "egreso", concept: "Compra suministros", amount: -500, time: "13:45" },
  { type: "ingreso", concept: "Venta Delivery", amount: 950, time: "13:20" },
  { type: "ingreso", concept: "Venta Mesa SP05", amount: 3200, time: "12:55" },
];

const Caja = () => {
  return (
    <MainLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Caja</h1>
            <p className="text-muted-foreground">Gestión de efectivo y movimientos</p>
          </div>
          <Link to="/ventas">
            <Button variant="outline" className="gap-2">
              <LayoutGrid className="w-4 h-4" />
              Ir a Mesas
            </Button>
          </Link>
        </div>

        {/* Current Status */}
        <div className="card-elevated p-6 bg-gradient-to-br from-primary/5 to-card">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-warning animate-pulse" />
                <span className="text-sm font-medium text-warning">Caja Cerrada</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Caja #001</h2>
              <p className="text-muted-foreground">Último cierre: Ayer, 11:45 PM</p>
            </div>
            <Button className="btn-mango">
              <DollarSign className="w-4 h-4 mr-2" />
              Aperturar Caja
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Ingresos Hoy</span>
            </div>
            <p className="text-2xl font-bold text-success">RD$ 45,200</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
              <span className="text-sm text-muted-foreground">Egresos Hoy</span>
            </div>
            <p className="text-2xl font-bold text-destructive">RD$ 2,500</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-info" />
              </div>
              <span className="text-sm text-muted-foreground">Balance</span>
            </div>
            <p className="text-2xl font-bold text-info">RD$ 42,700</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Transacciones</span>
            </div>
            <p className="text-2xl font-bold text-primary">28</p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cajaModules.map((module) => {
            const Icon = module.icon;
            return (
              <div key={module.title} className="card-interactive p-5">
                <div className={`w-12 h-12 rounded-xl ${module.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{module.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  {module.action}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Recent Movements */}
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">Movimientos Recientes</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowDownCircle className="w-4 h-4 text-success" />
                Ingreso
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpCircle className="w-4 h-4 text-destructive" />
                Egreso
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {movements.map((mov, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    mov.type === "ingreso" ? "bg-success/10" : "bg-destructive/10"
                  }`}>
                    {mov.type === "ingreso" ? (
                      <ArrowDownCircle className="w-5 h-5 text-success" />
                    ) : (
                      <ArrowUpCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{mov.concept}</p>
                    <p className="text-sm text-muted-foreground">{mov.time}</p>
                  </div>
                </div>
                <p className={`font-bold ${
                  mov.type === "ingreso" ? "text-success" : "text-destructive"
                }`}>
                  {mov.type === "ingreso" ? "+" : ""}RD$ {Math.abs(mov.amount).toLocaleString("es-DO")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Caja;
