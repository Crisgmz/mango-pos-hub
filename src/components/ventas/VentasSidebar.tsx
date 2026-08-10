import { Link, useSearchParams } from "react-router-dom";
import { 
  LayoutGrid, 
  FileText, 
  Zap, 
  Truck, 
  Smartphone,
} from "lucide-react";
import { useModuleAccess } from "@/contexts/PermissionsContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function VentasSidebar() {
  const [searchParams] = useSearchParams();
  const currentMode = searchParams.get("mode") || "zona";
  const { canAccessVentas, canAccessVentaRapida, canAccessVentaManual } = useModuleAccess();

  const menuItems = [
    { id: "zona", label: "Por Zona", icon: LayoutGrid, href: "/ventas", hasAccess: canAccessVentas },
    { id: "manual", label: "Venta Manual", icon: FileText, href: "/ventas?mode=manual", hasAccess: canAccessVentaManual },
    { id: "rapida", label: "Venta Rápida", icon: Zap, href: "/ventas?mode=rapida", hasAccess: canAccessVentaRapida },
    { id: "delivery", label: "Delivery", icon: Truck, href: "/ventas?mode=delivery", hasAccess: true },
    { id: "selfservice", label: "Self Service", icon: Smartphone, href: "/ventas?mode=selfservice", hasAccess: true },
  ];

  return (
    <aside className="sidebar-module p-2 lg:p-4 space-y-1.5 lg:space-y-2">
      <h3 className="hidden lg:block text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
        Modo de Venta
      </h3>
      {menuItems.filter((item) => item.hasAccess).map((item) => {
        const Icon = item.icon;
        const isActive = 
          (item.id === "zona" && !searchParams.get("mode")) ||
          currentMode === item.id;

        return (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-3 py-3 lg:py-2.5 rounded-lg transition-all duration-200 min-h-[44px]",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="hidden lg:inline font-medium">{item.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="lg:hidden">{item.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </aside>
  );
}
