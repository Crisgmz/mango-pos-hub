import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PermissionsProvider, usePermissions } from "@/contexts/PermissionsContext";
import { ProductAvailabilityProvider } from "@/contexts/ProductAvailabilityContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
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
import Impresoras from "./pages/ajustes/Impresoras";
import NotasCredito from "./pages/ajustes/NotasCredito";
import MonitorVentas from "./pages/ajustes/MonitorVentas";
import Modificadores from "./pages/ajustes/Modificadores";
import Combos from "./pages/ajustes/Combos";
import MenuConfig from "./pages/ajustes/MenuConfig";
import Recetas from "./pages/ajustes/Recetas";
import Insumos from "./pages/ajustes/Insumos";
import ConfigComandas from "./pages/ajustes/ConfigComandas";
import ConfigPrecuentas from "./pages/ajustes/ConfigPrecuentas";
import Turnos from "./pages/ajustes/Turnos";
import Cajas from "./pages/ajustes/Cajas";
import Impuestos from "./pages/ajustes/Impuestos";
import Monedas from "./pages/ajustes/Monedas";
import ConfigRegionales from "./pages/ajustes/ConfigRegionales";
import Sucursales from "./pages/ajustes/Sucursales";
import Kardex from "./pages/ajustes/Kardex";
import SalidaInventario from "./pages/ajustes/SalidaInventario";
import MoverInventario from "./pages/ajustes/MoverInventario";
import CuadreStock from "./pages/ajustes/CuadreStock";
import Mermas from "./pages/ajustes/Mermas";
import Requerimientos from "./pages/ajustes/Requerimientos";
import ListaCompras from "./pages/ajustes/ListaCompras";
import RegistroCompras from "./pages/ajustes/RegistroCompras";
import GestionProveedores from "./pages/ajustes/GestionProveedores";
import CreditoProveedores from "./pages/ajustes/CreditoProveedores";
import Tarjeta from "./pages/ajustes/Tarjeta";
import Transferencias from "./pages/ajustes/Transferencias";
import HistorialPagos from "./pages/ajustes/HistorialPagos";
import VentaCredito from "./pages/ajustes/VentaCredito";
import GestionCreditos from "./pages/ajustes/GestionCreditos";
import CreditosClientes from "./pages/ajustes/CreditosClientes";
import GestionCostos from "./pages/ajustes/GestionCostos";
import GestionMetas from "./pages/ajustes/GestionMetas";
import TarjetaFidelidad from "./pages/ajustes/TarjetaFidelidad";
import NivelesMembresias from "./pages/ajustes/NivelesMembresias";
import Promociones from "./pages/ajustes/Promociones";
import Cupones from "./pages/ajustes/Cupones";
import GiftCards from "./pages/ajustes/GiftCards";
import PuntosRecompensa from "./pages/ajustes/PuntosRecompensa";
import HistorialFidelidad from "./pages/ajustes/HistorialFidelidad";
import OpcionesSistema from "./pages/ajustes/OpcionesSistema";
import OpcionesApp from "./pages/ajustes/OpcionesApp";
import InfoRestaurante from "./pages/ajustes/InfoRestaurante";
import GestionSucursales from "./pages/ajustes/GestionSucursales";
import Actualizaciones from "./pages/ajustes/Actualizaciones";
import IntegracionMarketing from "./pages/ajustes/IntegracionMarketing";
import ConfigCreditoFiscal from "./pages/ajustes/ConfigCreditoFiscal";
import InformeVentas from "./pages/ajustes/InformeVentas";
import InformeCompras from "./pages/ajustes/InformeCompras";
import InformeFinanzas from "./pages/ajustes/InformeFinanzas";
import InformeInventario from "./pages/ajustes/InformeInventario";
import InformeAsistencia from "./pages/ajustes/InformeAsistencia";
import Indicadores from "./pages/ajustes/Indicadores";
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
        <Route path="/ajustes/impresoras" element={<Impresoras />} />
        <Route path="/ajustes/notas-credito" element={<NotasCredito />} />
        <Route path="/ajustes/monitor-ventas" element={<MonitorVentas />} />
        <Route path="/ajustes/modificadores" element={<Modificadores />} />
        <Route path="/ajustes/combos" element={<Combos />} />
        <Route path="/ajustes/menu" element={<MenuConfig />} />
        <Route path="/ajustes/recetas" element={<Recetas />} />
        <Route path="/ajustes/insumos" element={<Insumos />} />
        <Route path="/ajustes/config-comandas" element={<ConfigComandas />} />
        <Route path="/ajustes/config-precuentas" element={<ConfigPrecuentas />} />
        <Route path="/ajustes/turnos" element={<Turnos />} />
        <Route path="/ajustes/cajas" element={<Cajas />} />
        <Route path="/ajustes/impuestos" element={<Impuestos />} />
        <Route path="/ajustes/monedas" element={<Monedas />} />
        <Route path="/ajustes/config-regionales" element={<ConfigRegionales />} />
        <Route path="/ajustes/sucursales" element={<Sucursales />} />
        <Route path="/ajustes/kardex" element={<Kardex />} />
        <Route path="/ajustes/salida-inventario" element={<SalidaInventario />} />
        <Route path="/ajustes/mover-inventario" element={<MoverInventario />} />
        <Route path="/ajustes/cuadre-stock" element={<CuadreStock />} />
        <Route path="/ajustes/mermas" element={<Mermas />} />
        <Route path="/ajustes/requerimientos" element={<Requerimientos />} />
        <Route path="/ajustes/lista-compras" element={<ListaCompras />} />
        <Route path="/ajustes/registro-compras" element={<RegistroCompras />} />
        <Route path="/ajustes/gestion-proveedores" element={<GestionProveedores />} />
        <Route path="/ajustes/credito-proveedores" element={<CreditoProveedores />} />
        <Route path="/ajustes/impresion-comprobantes" element={<ImpresionProductos />} />
        <Route path="/ajustes/impresion-comandas" element={<ImpresionProductos />} />
        <Route path="/ajustes/tarjeta" element={<Tarjeta />} />
        <Route path="/ajustes/transferencias" element={<Transferencias />} />
        <Route path="/ajustes/historial-pagos" element={<HistorialPagos />} />
        <Route path="/ajustes/venta-credito" element={<VentaCredito />} />
        <Route path="/ajustes/gestion-creditos" element={<GestionCreditos />} />
        <Route path="/ajustes/creditos-clientes" element={<CreditosClientes />} />
        <Route path="/ajustes/gestion-costos" element={<GestionCostos />} />
        <Route path="/ajustes/gestion-metas" element={<GestionMetas />} />
        <Route path="/ajustes/tarjeta-fidelidad" element={<TarjetaFidelidad />} />
        <Route path="/ajustes/niveles-membresias" element={<NivelesMembresias />} />
        <Route path="/ajustes/promociones" element={<Promociones />} />
        <Route path="/ajustes/cupones" element={<Cupones />} />
        <Route path="/ajustes/gift-cards" element={<GiftCards />} />
        <Route path="/ajustes/puntos-recompensa" element={<PuntosRecompensa />} />
        <Route path="/ajustes/historial-fidelidad" element={<HistorialFidelidad />} />
        <Route path="/ajustes/opciones-sistema" element={<OpcionesSistema />} />
        <Route path="/ajustes/opciones-app" element={<OpcionesApp />} />
        <Route path="/ajustes/info-restaurante" element={<InfoRestaurante />} />
        <Route path="/ajustes/gestion-sucursales" element={<GestionSucursales />} />
        <Route path="/ajustes/actualizaciones" element={<Actualizaciones />} />
        <Route path="/ajustes/integracion-marketing" element={<IntegracionMarketing />} />
        <Route path="/ajustes/config-credito-fiscal" element={<ConfigCreditoFiscal />} />
        <Route path="/ajustes/informe-ventas" element={<InformeVentas />} />
        <Route path="/ajustes/informe-compras" element={<InformeCompras />} />
        <Route path="/ajustes/informe-finanzas" element={<InformeFinanzas />} />
        <Route path="/ajustes/informe-inventario" element={<InformeInventario />} />
        <Route path="/ajustes/informe-asistencia" element={<InformeAsistencia />} />
        <Route path="/ajustes/indicadores" element={<Indicadores />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PermissionsProvider>
      <ProductAvailabilityProvider>
        <ProductsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </ProductsProvider>
      </ProductAvailabilityProvider>
    </PermissionsProvider>
  </QueryClientProvider>
);

export default App;
