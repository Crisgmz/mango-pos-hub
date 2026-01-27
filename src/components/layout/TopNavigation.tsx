import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  ShoppingCart, 
  Wallet, 
  ChefHat, 
  Users, 
  Package, 
  BarChart3, 
  Settings,
  Bell,
  User
} from "lucide-react";
import logoMangopos from "@/assets/logo-mangopos.png";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/ventas", label: "Ventas", icon: ShoppingCart },
  { path: "/caja", label: "Caja", icon: Wallet },
  { path: "/cocina", label: "Cocina", icon: ChefHat },
  { path: "/productos", label: "Productos", icon: Package },
  { path: "/reportes", label: "Reportes", icon: BarChart3 },
  { path: "/ajustes", label: "Más Ajustes", icon: Settings },
];

export function TopNavigation() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft">
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 h-16 max-w-[1920px] mx-auto">
        {/* Logo - Fixed width to maintain consistent spacing */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-[140px] sm:min-w-[180px]">
          <img src={logoMangopos} alt="MangoPOS Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
          <span className="text-lg sm:text-xl font-bold text-gradient-mango hidden xs:inline">MangoPOS</span>
        </Link>

        {/* Navigation - Centered with proper spacing */}
        <nav className="flex items-center justify-center gap-0.5 sm:gap-1 md:gap-2 flex-1 overflow-x-auto scrollbar-hide mx-2 sm:mx-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link flex-shrink-0 px-2 sm:px-3 md:px-4 py-2 ${isActive ? "active" : ""}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions - Fixed width to maintain consistent spacing */}
        <div className="flex items-center gap-2 flex-shrink-0 min-w-[50px] sm:min-w-[160px] justify-end">
          <button className="p-2 sm:p-2.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-border">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-medium text-foreground">Admin</p>
              <p className="text-xs text-muted-foreground">Caja #001</p>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-mango rounded-full flex items-center justify-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}