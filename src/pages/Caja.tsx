import { useState } from "react";
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
import { BlindCashCloseModal } from "@/components/caja/BlindCashCloseModal";

const movements = [
  { type: "ingreso", concept: "Venta Mesa SP02", amount: 2850, time: "14:32" },
  { type: "ingreso", concept: "Venta Mesa TR01", amount: 1200, time: "14:15" },
  { type: "egreso", concept: "Compra suministros", amount: -500, time: "13:45" },
  { type: "ingreso", concept: "Venta Delivery", amount: 950, time: "13:20" },
  { type: "ingreso", concept: "Venta Mesa SP05", amount: 3200, time: "12:55" },
];

const Caja = () => {
  const [showBlindClose, setShowBlindClose] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Mock data for cash register
  const mockExpectedCash = 28500;
  const mockExpectedCard = 12500;
  const mockExpectedTransfer = 4200;
  const mockTotalSales = 45200;
  const mockTransactionCount = 28;

  const handleOpenRegister = () => {
    setIsOpen(true);
  };

  const handleCloseRegister = () => {
    setShowBlindClose(true);
  };

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
                <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-success' : 'bg-warning'} animate-pulse`} />
                <span className={`text-sm font-medium ${isOpen ? 'text-success' : 'text-warning'}`}>
                  {isOpen ? 'Caja Abierta' : 'Caja Cerrada'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Caja #001</h2>
              <p className="text-muted-foreground">
                {isOpen ? 'Turno iniciado: Hoy, 8:00 AM' : 'Último cierre: Ayer, 11:45 PM'}
              </p>
            </div>
            {!isOpen ? (
              <Button className="btn-mango" onClick={handleOpenRegister}>
                <DollarSign className="w-4 h-4 mr-2" />
                Aperturar Caja
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                onClick={handleCloseRegister}
              >
                <Lock className="w-4 h-4 mr-2" />
                Cerrar Caja
              </Button>
            )}
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
          <div className="card-interactive p-5">
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Apertura de Caja</h3>
            <p className="text-sm text-muted-foreground mb-4">Iniciar turno con monto inicial</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleOpenRegister}
              disabled={isOpen}
            >
              Aperturar
            </Button>
          </div>
          <div className="card-interactive p-5">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Cierre de Caja</h3>
            <p className="text-sm text-muted-foreground mb-4">Cierre a ciegas y cuadrar</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleCloseRegister}
              disabled={!isOpen}
            >
              Cerrar
            </Button>
          </div>
          <div className="card-interactive p-5">
            <div className="w-12 h-12 rounded-xl bg-info/10 text-info flex items-center justify-center mb-4">
              <History className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Historial de Caja</h3>
            <p className="text-sm text-muted-foreground mb-4">Ver movimientos anteriores</p>
            <Button variant="outline" size="sm" className="w-full">
              Ver
            </Button>
          </div>
          <div className="card-interactive p-5">
            <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center mb-4">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Gestión de Cierres</h3>
            <p className="text-sm text-muted-foreground mb-4">Revisar y aprobar cierres</p>
            <Button variant="outline" size="sm" className="w-full">
              Gestionar
            </Button>
          </div>
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

      {/* Blind Cash Close Modal */}
      <BlindCashCloseModal
        open={showBlindClose}
        onClose={() => setShowBlindClose(false)}
        expectedCash={mockExpectedCash}
        expectedCard={mockExpectedCard}
        expectedTransfer={mockExpectedTransfer}
        totalSales={mockTotalSales}
        transactionCount={mockTransactionCount}
      />
    </MainLayout>
  );
};

export default Caja;
