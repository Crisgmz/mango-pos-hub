import { Users, Printer, FileText, Megaphone, Plus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  { 
    icon: Users, 
    label: "Mozos", 
    description: "Gestionar meseros",
    href: "/ajustes/mozos",
    color: "bg-info/10 text-info" 
  },
  { 
    icon: Printer, 
    label: "Imprimir Productos", 
    description: "Etiquetas y códigos",
    href: "/productos",
    color: "bg-success/10 text-success" 
  },
  { 
    icon: FileText, 
    label: "Comprobantes", 
    description: "NCF y facturas",
    href: "/reportes",
    color: "bg-warning/10 text-warning" 
  },
  { 
    icon: Megaphone, 
    label: "Publicidad", 
    description: "Promociones activas",
    href: "/ajustes/publicidad",
    color: "bg-primary/10 text-primary" 
  },
];

export function QuickActions() {
  return (
    <div className="space-y-4">
      <h2 className="section-title">Acciones Rápidas</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.href}
              className="card-interactive p-4 group"
            >
              <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground">{action.label}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </Link>
          );
        })}
      </div>
      
      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <Link
          to="/ventas"
          className="card-elevated p-5 flex items-center gap-4 bg-gradient-mango text-primary-foreground hover:opacity-95 transition-opacity"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Nueva Venta</h3>
            <p className="text-primary-foreground/80 text-sm">Ir al punto de venta</p>
          </div>
        </Link>
        <Link
          to="/ventas?mode=delivery"
          className="card-interactive p-5 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-info" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Delivery</h3>
            <p className="text-muted-foreground text-sm">Pedidos para entrega</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
