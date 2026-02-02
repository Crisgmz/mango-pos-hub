import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  RefreshCw, 
  ChevronUp, 
  ChevronDown, 
  Clock, 
  CheckCircle2,
  Timer,
  Utensils,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { StockOutPanel } from "@/components/cocina/StockOutPanel";
import { useProductAvailability } from "@/contexts/ProductAvailabilityContext";

interface Order {
  id: string;
  table: string;
  items: { name: string; qty: number; notes?: string }[];
  time: string;
  status: "waiting" | "preparing";
}

const orders: Order[] = [
  {
    id: "ORD001",
    table: "SP02",
    items: [
      { name: "Pollo al Horno", qty: 2 },
      { name: "Arroz con Habichuelas", qty: 2 },
      { name: "Ensalada César", qty: 1, notes: "Sin crutones" },
    ],
    time: "5:32",
    status: "waiting",
  },
  {
    id: "ORD002",
    table: "TR01",
    items: [
      { name: "Mofongo con Camarones", qty: 1 },
      { name: "Sancocho Dominicano", qty: 2 },
    ],
    time: "3:15",
    status: "waiting",
  },
  {
    id: "ORD003",
    table: "SP05",
    items: [
      { name: "Chuleta Ahumada", qty: 3 },
      { name: "Tostones", qty: 2 },
      { name: "Jugo de Chinola", qty: 3 },
    ],
    time: "8:45",
    status: "preparing",
  },
  {
    id: "ORD004",
    table: "VIP01",
    items: [
      { name: "Langosta Thermidor", qty: 2 },
      { name: "Vino Tinto", qty: 1 },
    ],
    time: "12:20",
    status: "preparing",
  },
];

const Cocina = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { stockOutProducts, getStockOutCount } = useProductAvailability();
  const waitingOrders = orders.filter((o) => o.status === "waiting");
  const preparingOrders = orders.filter((o) => o.status === "preparing");

  return (
    <MainLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="page-title flex items-center gap-3">
              <Utensils className="w-8 h-8 text-primary" />
              Cocina (KDS)
            </h1>
            <p className="text-muted-foreground">Sistema de visualización de comandas</p>
          </div>

          <div className="flex items-center gap-4">
            <StockOutPanel />
            <div className="flex items-center gap-3 px-4 py-2 bg-card rounded-lg border border-border">
              <span className="text-sm text-muted-foreground">Auto-refresh</span>
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </Button>
            <div className="flex gap-1">
              <Button variant="outline" size="icon">
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stock Out Alert */}
        {getStockOutCount() > 0 && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">
                {getStockOutCount()} producto(s) agotado(s)
              </p>
              <p className="text-sm text-muted-foreground">
                {stockOutProducts.map((p) => p.productName).join(", ")}
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{waitingOrders.length}</p>
              <p className="text-sm text-muted-foreground">En Espera</p>
            </div>
          </div>
          <div className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
              <Timer className="w-6 h-6 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-info">{preparingOrders.length}</p>
              <p className="text-sm text-muted-foreground">En Preparación</p>
            </div>
          </div>
          <div className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">15</p>
              <p className="text-sm text-muted-foreground">Completados Hoy</p>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Waiting Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-warning animate-pulse" />
              <h2 className="section-title mb-0">En Espera</h2>
              <span className="badge-warning">{waitingOrders.length}</span>
            </div>
            <div className="space-y-4">
              {waitingOrders.map((order) => (
                <div key={order.id} className="kds-card kds-waiting">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-warning">{order.table}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{order.id}</p>
                        <div className="flex items-center gap-1 text-sm text-warning">
                          <Clock className="w-3 h-3" />
                          <span>{order.time}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-info hover:bg-info/90 text-info-foreground">
                      Preparar
                    </Button>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-border">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-secondary rounded text-center text-sm font-medium">
                          {item.qty}
                        </span>
                        <div>
                          <p className="text-foreground">{item.name}</p>
                          {item.notes && (
                            <p className="text-xs text-warning">⚠️ {item.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preparing Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-info animate-pulse" />
              <h2 className="section-title mb-0">En Preparación</h2>
              <span className="badge-info">{preparingOrders.length}</span>
            </div>
            <div className="space-y-4">
              {preparingOrders.map((order) => (
                <div key={order.id} className="kds-card kds-preparing">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-info">{order.table}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{order.id}</p>
                        <div className="flex items-center gap-1 text-sm text-info">
                          <Timer className="w-3 h-3" />
                          <span>{order.time}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground">
                      Listo
                    </Button>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-border">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-secondary rounded text-center text-sm font-medium">
                          {item.qty}
                        </span>
                        <p className="text-foreground">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cocina;
