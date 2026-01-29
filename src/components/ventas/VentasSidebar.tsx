import { Link, useSearchParams } from "react-router-dom";
import { 
  LayoutGrid, 
  FileText, 
  Zap, 
  Truck, 
  Smartphone,
  Lock 
} from "lucide-react";
import { useModuleAccess } from "@/contexts/PermissionsContext";
import { cn } from "@/lib/utils";

export function VentasSidebar() {
  const [searchParams] = useSearchParams();
  const currentMode = searchParams.get("mode") || "zona";
  const { canAccessVentas, canAccessVentaRapida } = useModuleAccess();

  const menuItems = [
    { id: "zona", label: "Por Zona", icon: LayoutGrid, href: "/ventas", hasAccess: canAccessVentas },
    { id: "manual", label: "Venta Manual", icon: FileText, href: "/ventas?mode=manual", hasAccess: canAccessVentas },
    { id: "rapida", label: "Venta Rápida", icon: Zap, href: "/ventas?mode=rapida", hasAccess: canAccessVentaRapida },
    { id: "delivery", label: "Delivery", icon: Truck, href: "/ventas?mode=delivery", hasAccess: true },
    { id: "selfservice", label: "Self Service", icon: Smartphone, href: "/ventas?mode=selfservice", hasAccess: true },
  ];

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

        if (!item.hasAccess) {
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground/50 cursor-not-allowed"
              title="Sin acceso"
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium flex-1">{item.label}</span>
              <Lock className="w-3.5 h-3.5" />
            </div>
          );
        }

        return (
          <Link
            key={item.id}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
