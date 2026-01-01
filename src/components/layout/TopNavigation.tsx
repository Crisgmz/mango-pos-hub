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

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/ventas", label: "Ventas", icon: ShoppingCart },
  { path: "/caja", label: "Caja", icon: Wallet },
  { path: "/cocina", label: "Cocina", icon: ChefHat },
  { path: "/clientes", label: "Clientes", icon: Users },
  { path: "/productos", label: "Productos", icon: Package },
  { path: "/reportes", label: "Reportes", icon: BarChart3 },
  { path: "/ajustes", label: "Más Ajustes", icon: Settings },
];

export function TopNavigation() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-mango rounded-xl flex items-center justify-center shadow-md">
            <span className="text-xl font-bold text-primary-foreground">🥭</span>
          </div>
          <span className="text-xl font-bold text-gradient-mango">MangoPOS</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
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
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">Admin</p>
              <p className="text-xs text-muted-foreground">Caja #001</p>
            </div>
            <div className="w-9 h-9 bg-gradient-mango rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
