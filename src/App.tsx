import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PermissionsProvider, usePermissions } from "@/contexts/PermissionsContext";
import { PinLogin } from "@/components/auth/PinLogin";
import Index from "./pages/Index";
import Ventas from "./pages/Ventas";
import Caja from "./pages/Caja";
import Cocina from "./pages/Cocina";
import Clientes from "./pages/Clientes";
import Productos from "./pages/Productos";
import Reportes from "./pages/Reportes";
import Ajustes from "./pages/Ajustes";
import Usuarios from "./pages/ajustes/Usuarios";
import Mozos from "./pages/ajustes/Mozos";
import ImpresionProductos from "./pages/ajustes/ImpresionProductos";
import NotFound from "./pages/NotFound";
import { toast } from "sonner";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, login, currentUser } = usePermissions();

  const handleLogin = (pin: string, user: { id: string; name: string; role: string; pin: string }) => {
    login({
      id: user.id,
      name: user.name,
      role: user.role as "Administrador" | "Supervisor" | "Cajero" | "Mesero" | "Cocina" | "Delivery",
      pin: user.pin,
    });
    toast.success(`¡Bienvenido, ${user.name}!`, {
      description: `Sesión iniciada como ${user.role}`,
    });
  };

  if (!isAuthenticated) {
    return <PinLogin onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/caja" element={<Caja />} />
        <Route path="/cocina" element={<Cocina />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/ajustes" element={<Ajustes />} />
        <Route path="/ajustes/usuarios" element={<Usuarios />} />
        <Route path="/ajustes/mozos" element={<Mozos />} />
        <Route path="/ajustes/impresion-productos" element={<ImpresionProductos />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PermissionsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </PermissionsProvider>
  </QueryClientProvider>
);

export default App;
