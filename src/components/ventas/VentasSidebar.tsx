import { Link, useLocation, useSearchParams } from "react-router-dom";
import { 
  LayoutGrid, 
  FileText, 
  Zap, 
  Truck, 
  Smartphone 
} from "lucide-react";

const menuItems = [
  { id: "zona", label: "Por Zona", icon: LayoutGrid, href: "/ventas" },
  { id: "manual", label: "Venta Manual", icon: FileText, href: "/ventas?mode=manual" },
  { id: "rapida", label: "Venta Rápida", icon: Zap, href: "/ventas?mode=rapida" },
  { id: "delivery", label: "Delivery", icon: Truck, href: "/ventas?mode=delivery" },
  { id: "selfservice", label: "Self Service", icon: Smartphone, href: "/ventas?mode=selfservice" },
];

export function VentasSidebar() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const currentMode = searchParams.get("mode") || "zona";

  return (
    <aside className="sidebar-module p-4 space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
        Modo de Venta
      </h3>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = 
          (item.id === "zona" && !searchParams.get("mode")) ||
          currentMode === item.id;

        return (
          <Link
            key={item.id}
            to={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
