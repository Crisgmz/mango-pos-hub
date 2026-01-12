import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Ventas from "./pages/Ventas";
import Caja from "./pages/Caja";
import Cocina from "./pages/Cocina";
import Clientes from "./pages/Clientes";
import Productos from "./pages/Productos";
import Reportes from "./pages/Reportes";
import Ajustes from "./pages/Ajustes";
import Usuarios from "./pages/ajustes/Usuarios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
