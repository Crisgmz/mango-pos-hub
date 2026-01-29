import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { DEFAULT_ROLES, ALL_PERMISSIONS } from "@/types/users";

type RoleName = "Administrador" | "Supervisor" | "Cajero" | "Mesero" | "Cocina" | "Delivery";

interface PermissionsContextType {
  currentRole: RoleName;
  setCurrentRole: (role: RoleName) => void;
  hasPermission: (permissionCode: string) => boolean;
  hasAnyPermission: (permissionCodes: string[]) => boolean;
  hasAllPermissions: (permissionCodes: string[]) => boolean;
  rolePermissions: string[];
  roleName: string;
  roleDescription: string;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<RoleName>("Administrador");

  const currentRoleData = DEFAULT_ROLES.find((r) => r.name === currentRole);
  const rolePermissions = currentRoleData?.permissions || [];
  const roleDescription = currentRoleData?.description || "";

  const hasPermission = useCallback(
    (permissionCode: string) => {
      // Admin has all permissions
      if (currentRole === "Administrador") return true;
      return rolePermissions.includes(permissionCode);
    },
    [currentRole, rolePermissions]
  );

  const hasAnyPermission = useCallback(
    (permissionCodes: string[]) => {
      if (currentRole === "Administrador") return true;
      return permissionCodes.some((code) => rolePermissions.includes(code));
    },
    [currentRole, rolePermissions]
  );

  const hasAllPermissions = useCallback(
    (permissionCodes: string[]) => {
      if (currentRole === "Administrador") return true;
      return permissionCodes.every((code) => rolePermissions.includes(code));
    },
    [currentRole, rolePermissions]
  );

  return (
    <PermissionsContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        rolePermissions,
        roleName: currentRole,
        roleDescription,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
}

// Helper hook for checking specific module access
export function useModuleAccess() {
  const { hasPermission, hasAnyPermission } = usePermissions();

  return {
    canAccessVentas: hasPermission("ventas.mesas.acceso"),
    canAccessVentaRapida: hasPermission("ventas_rapida.acceso"),
    canAccessCaja: hasAnyPermission(["caja.apertura", "caja.cierre", "caja.arqueo_ver"]),
    canAccessCocina: hasPermission("kds.acceso"),
    canAccessReportes: hasAnyPermission([
      "reportes.ventas",
      "reportes.productos",
      "reportes.mesas",
      "reportes.caja",
    ]),
    canAccessAjustes: hasAnyPermission([
      "settings.usuarios.acceso",
      "settings.roles.acceso",
      "settings.impresoras.gestionar",
    ]),
    canAccessPagos: hasPermission("pagos.acceso"),
    canProcessPayments: hasAnyPermission([
      "pagos.cobrar_efectivo",
      "pagos.cobrar_tarjeta",
      "pagos.cobrar_transferencia",
    ]),
    canSendToKitchen: hasPermission("ventas.orden.enviar_cocina"),
    canVoidOrders: hasPermission("ventas.orden.anular"),
    canApplyDiscounts: hasPermission("ventas.orden.descuento_aplicar"),
    canSplitBill: hasAnyPermission(["ventas.cuenta.split_manual", "ventas.cuenta.split_equiv"]),
  };
}
