import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  ShoppingCart, 
  Wallet, 
  ChefHat, 
  Package, 
  BarChart3, 
  Settings,
  Bell,
  User,
  ChevronDown,
  Shield,
  Lock
} from "lucide-react";
import logoMangopos from "@/assets/logo-mangopos.png";
import { usePermissions, useModuleAccess } from "@/contexts/PermissionsContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const roleColors: Record<string, string> = {
  Administrador: "bg-primary text-primary-foreground",
  Supervisor: "bg-info text-info-foreground",
  Cajero: "bg-success text-success-foreground",
  Mesero: "bg-warning text-warning-foreground",
  Cocina: "bg-destructive text-destructive-foreground",
  Delivery: "bg-secondary text-secondary-foreground",
};

const allRoles = ["Administrador", "Supervisor", "Cajero", "Mesero", "Cocina", "Delivery"] as const;

export function TopNavigation() {
  const location = useLocation();
  const { currentRole, setCurrentRole, roleDescription } = usePermissions();
  const { 
    canAccessVentas, 
    canAccessVentaRapida, 
    canAccessCaja, 
    canAccessCocina, 
    canAccessReportes, 
    canAccessAjustes 
  } = useModuleAccess();

  // Navigation items with permission checks
  const navItems = [
    { path: "/", label: "Home", icon: Home, hasAccess: true },
    { path: "/ventas", label: "Ventas", icon: ShoppingCart, hasAccess: canAccessVentas },
    { path: "/caja", label: "Caja", icon: Wallet, hasAccess: canAccessCaja },
    { path: "/cocina", label: "Cocina", icon: ChefHat, hasAccess: canAccessCocina },
    { path: "/productos", label: "Productos", icon: Package, hasAccess: true },
    { path: "/reportes", label: "Reportes", icon: BarChart3, hasAccess: canAccessReportes },
    { path: "/ajustes", label: "Más Ajustes", icon: Settings, hasAccess: canAccessAjustes },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logoMangopos} alt="MangoPOS Logo" className="w-10 h-10 object-contain" />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            if (!item.hasAccess) {
              return (
                <div
                  key={item.path}
                  className="nav-link opacity-40 cursor-not-allowed"
                  title={`Sin acceso: ${item.label}`}
                >
                  <Lock className="w-3 h-3 absolute -top-1 -right-1 text-destructive" />
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </div>
              );
            }
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          {/* Role Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{currentRole}</p>
                  <p className="text-[10px] text-muted-foreground truncate max-w-[100px]">Demo Mode</p>
                </div>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", roleColors[currentRole])}>
                  <Shield className="w-4 h-4" />
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Cambiar Rol (Demo)
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allRoles.map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => setCurrentRole(role)}
                  className={cn(
                    "flex items-center justify-between cursor-pointer",
                    currentRole === role && "bg-accent"
                  )}
                >
                  <span>{role}</span>
                  {currentRole === role && (
                    <Badge variant="secondary" className="text-[10px]">Activo</Badge>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <div className="px-2 py-2 text-xs text-muted-foreground">
                <p className="font-medium mb-1">Permisos actuales:</p>
                <p className="line-clamp-2">{roleDescription}</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}