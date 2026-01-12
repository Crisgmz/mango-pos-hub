// ================================================================================
// TIPOS DE USUARIOS, ROLES Y PERMISOS - MANGOPOS
// ================================================================================

// ================================================================================
// ENUMS
// ================================================================================

export type UserStatus = "active" | "inactive" | "suspended";
export type ContractType = "full_time" | "part_time" | "contractor" | "temporary";
export type PayrollFrequency = "weekly" | "biweekly" | "monthly";
export type RoleLevel = "admin" | "supervisor" | "operator";
export type PermissionAction = "access" | "view" | "create" | "edit" | "delete" | "void" | "reprint";

// ================================================================================
// PERMISOS
// ================================================================================

export interface Permission {
  id: string;
  code: string; // Ej: "ventas.orden.anular"
  name: string;
  description: string;
  module: PermissionModule;
  action: PermissionAction;
}

export type PermissionModule =
  | "settings"
  | "ventas"
  | "ventas_rapida"
  | "pagos"
  | "caja"
  | "kds"
  | "reportes"
  | "clientes"
  | "delivery"
  | "inventario"
  | "compras";

// Permisos agrupados por módulo para la UI
export interface PermissionGroup {
  module: PermissionModule;
  moduleName: string;
  permissions: Permission[];
}

// ================================================================================
// ROLES
// ================================================================================

export interface Role {
  id: string;
  businessId: string;
  name: string;
  description: string;
  level: RoleLevel;
  isSystemRole: boolean; // Roles del sistema no se pueden eliminar
  permissions: string[]; // Array de permission codes
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  allow: boolean;
}

// ================================================================================
// INFORMACIÓN LABORAL DEL EMPLEADO
// ================================================================================

export interface EmploymentInfo {
  // Datos del contrato
  hireDate: Date;
  contractType: ContractType;
  department: string;
  position: string;
  workSchedule: string; // Ej: "Lun-Vie 8:00-17:00"
  
  // Compensación
  baseSalary: number;
  currency: string;
  payrollFrequency: PayrollFrequency;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountType?: "checking" | "savings";
  
  // Deducciones Dominicanas
  afpEnabled: boolean;
  afpProvider?: string; // AFP Popular, Siembra, etc.
  afpEmployeeRate: number; // Generalmente 2.87%
  afpEmployerRate: number; // Generalmente 7.10%
  
  arsEnabled: boolean; // Seguro de Salud (ARS)
  arsProvider?: string; // Humano, Senasa, ARS Palic, etc.
  arsEmployeeRate: number; // Generalmente 3.04%
  arsEmployerRate: number; // Generalmente 7.09%
  
  isrEnabled: boolean; // Impuesto sobre la Renta
  isrRate: number;
  
  // Otros
  hasTransportAllowance: boolean;
  transportAllowance: number;
  hasFoodAllowance: boolean;
  foodAllowance: number;
  
  // Vacaciones y licencias
  vacationDaysPerYear: number;
  vacationDaysUsed: number;
  vacationDaysRemaining: number;
  
  // Supervisor
  supervisorId?: string;
  supervisorName?: string;
}

// ================================================================================
// CONTACTO DE EMERGENCIA
// ================================================================================

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
}

// ================================================================================
// DOCUMENTOS DEL EMPLEADO
// ================================================================================

export interface EmployeeDocument {
  id: string;
  type: "cedula" | "passport" | "contract" | "license" | "certificate" | "other";
  name: string;
  fileUrl?: string;
  expirationDate?: Date;
  notes?: string;
  uploadedAt: Date;
}

// ================================================================================
// USUARIO COMPLETO
// ================================================================================

export interface User {
  id: string;
  businessId: string;
  
  // Credenciales
  email: string;
  pin?: string; // PIN de 4-6 dígitos para operaciones rápidas
  mustChangePassword: boolean;
  lastLogin?: Date;
  
  // Información personal
  firstName: string;
  lastName: string;
  fullName: string;
  cedula?: string; // Cédula Dominicana
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  phone: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  photoUrl?: string;
  
  // Estado
  status: UserStatus;
  
  // Roles (multi-rol permitido)
  roles: string[]; // Array de role IDs
  roleNames: string[]; // Para display
  
  // Overrides de permisos específicos del usuario
  permissionOverrides?: {
    permissionCode: string;
    allow: boolean;
  }[];
  
  // Información laboral
  employment?: EmploymentInfo;
  
  // Contacto de emergencia
  emergencyContact?: EmergencyContact;
  
  // Documentos
  documents?: EmployeeDocument[];
  
  // Metadatos
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

// ================================================================================
// FORMULARIOS
// ================================================================================

export interface UserFormData {
  // Paso 1: Información Personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  cedula?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  city?: string;
  
  // Paso 2: Credenciales y Roles
  password?: string;
  confirmPassword?: string;
  pin?: string;
  mustChangePassword: boolean;
  roles: string[];
  status: UserStatus;
  
  // Paso 3: Información Laboral
  hireDate?: string;
  contractType: ContractType;
  department: string;
  position: string;
  workSchedule?: string;
  supervisorId?: string;
  
  // Paso 4: Compensación
  baseSalary: number;
  currency: string;
  payrollFrequency: PayrollFrequency;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountType?: "checking" | "savings";
  
  // Paso 5: Deducciones
  afpEnabled: boolean;
  afpProvider?: string;
  arsEnabled: boolean;
  arsProvider?: string;
  isrEnabled: boolean;
  
  // Paso 6: Beneficios
  hasTransportAllowance: boolean;
  transportAllowance: number;
  hasFoodAllowance: boolean;
  foodAllowance: number;
  vacationDaysPerYear: number;
  
  // Contacto de emergencia
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
}

export interface RoleFormData {
  name: string;
  description: string;
  level: RoleLevel;
  permissions: string[];
}

// ================================================================================
// CONSTANTES DE PERMISOS
// ================================================================================

export const PERMISSION_MODULES: Record<PermissionModule, string> = {
  settings: "Configuración",
  ventas: "Ventas por Salón",
  ventas_rapida: "Venta Rápida",
  pagos: "Pagos",
  caja: "Caja",
  kds: "Cocina/KDS",
  reportes: "Reportes",
  clientes: "Clientes",
  delivery: "Delivery",
  inventario: "Inventario",
  compras: "Compras"
};

export const ALL_PERMISSIONS: Permission[] = [
  // ============ CONFIGURACIÓN ============
  { id: "p001", code: "settings.usuarios.acceso", name: "Acceso a Usuarios", description: "Puede acceder al módulo de usuarios", module: "settings", action: "access" },
  { id: "p002", code: "settings.usuarios.ver", name: "Ver Usuarios", description: "Puede ver listado de usuarios", module: "settings", action: "view" },
  { id: "p003", code: "settings.usuarios.crear", name: "Crear Usuarios", description: "Puede crear nuevos usuarios", module: "settings", action: "create" },
  { id: "p004", code: "settings.usuarios.editar", name: "Editar Usuarios", description: "Puede editar usuarios existentes", module: "settings", action: "edit" },
  { id: "p005", code: "settings.usuarios.desactivar", name: "Desactivar Usuarios", description: "Puede desactivar usuarios", module: "settings", action: "delete" },
  { id: "p006", code: "settings.roles.acceso", name: "Acceso a Roles", description: "Puede acceder al módulo de roles", module: "settings", action: "access" },
  { id: "p007", code: "settings.roles.crear", name: "Crear Roles", description: "Puede crear nuevos roles", module: "settings", action: "create" },
  { id: "p008", code: "settings.roles.editar", name: "Editar Roles", description: "Puede editar roles existentes", module: "settings", action: "edit" },
  { id: "p009", code: "settings.roles.eliminar", name: "Eliminar Roles", description: "Puede eliminar roles", module: "settings", action: "delete" },
  { id: "p010", code: "settings.impresoras.gestionar", name: "Gestionar Impresoras", description: "Puede configurar impresoras", module: "settings", action: "edit" },
  { id: "p011", code: "settings.zonas_mesas.gestionar", name: "Gestionar Zonas/Mesas", description: "Puede configurar zonas y mesas", module: "settings", action: "edit" },
  { id: "p012", code: "settings.impuestos_fiscal.gestionar", name: "Gestionar Fiscal", description: "Puede configurar impuestos y NCF", module: "settings", action: "edit" },
  { id: "p013", code: "settings.metodos_pago.gestionar", name: "Gestionar Métodos de Pago", description: "Puede configurar métodos de pago", module: "settings", action: "edit" },
  { id: "p014", code: "settings.descuentos_propinas.gestionar", name: "Gestionar Descuentos", description: "Puede configurar descuentos y propinas", module: "settings", action: "edit" },
  { id: "p015", code: "settings.kds.gestionar", name: "Gestionar KDS", description: "Puede configurar sistema de cocina", module: "settings", action: "edit" },

  // ============ VENTAS POR SALÓN ============
  { id: "p020", code: "ventas.mesas.acceso", name: "Acceso a Mesas", description: "Puede acceder a ventas por salón", module: "ventas", action: "access" },
  { id: "p021", code: "ventas.mesas.ver_estado", name: "Ver Estado Mesas", description: "Puede ver el estado de las mesas", module: "ventas", action: "view" },
  { id: "p022", code: "ventas.mesas.abrir", name: "Abrir Mesa", description: "Puede abrir una mesa", module: "ventas", action: "create" },
  { id: "p023", code: "ventas.mesas.mover_unir", name: "Mover/Unir Mesas", description: "Puede mover y unir mesas", module: "ventas", action: "edit" },
  { id: "p024", code: "ventas.mesas.marcar_pagando", name: "Marcar Pagando", description: "Puede marcar mesa como pagando", module: "ventas", action: "edit" },
  { id: "p025", code: "ventas.mesas.liberar", name: "Liberar Mesa", description: "Puede liberar una mesa", module: "ventas", action: "edit" },
  { id: "p026", code: "ventas.orden.agregar_item", name: "Agregar Items", description: "Puede agregar productos a la orden", module: "ventas", action: "create" },
  { id: "p027", code: "ventas.orden.editar_item", name: "Editar Items", description: "Puede editar items de la orden", module: "ventas", action: "edit" },
  { id: "p028", code: "ventas.orden.eliminar_item", name: "Eliminar Items", description: "Puede eliminar items de la orden", module: "ventas", action: "delete" },
  { id: "p029", code: "ventas.orden.enviar_cocina", name: "Enviar a Cocina", description: "Puede enviar orden a cocina", module: "ventas", action: "create" },
  { id: "p030", code: "ventas.orden.reabrir", name: "Reabrir Orden", description: "Puede reabrir una orden enviada", module: "ventas", action: "edit" },
  { id: "p031", code: "ventas.orden.anular", name: "Anular Orden", description: "Puede anular una orden completa", module: "ventas", action: "void" },
  { id: "p032", code: "ventas.orden.descuento_aplicar", name: "Aplicar Descuento", description: "Puede aplicar descuentos", module: "ventas", action: "edit" },
  { id: "p033", code: "ventas.orden.ver_total", name: "Ver Total", description: "Puede ver el total de la orden", module: "ventas", action: "view" },
  { id: "p034", code: "ventas.cuenta.split_manual", name: "División Manual", description: "Puede dividir cuenta manualmente", module: "ventas", action: "edit" },
  { id: "p035", code: "ventas.cuenta.split_equiv", name: "División Equitativa", description: "Puede dividir cuenta equitativamente", module: "ventas", action: "edit" },

  // ============ VENTA RÁPIDA ============
  { id: "p040", code: "ventas_rapida.acceso", name: "Acceso Venta Rápida", description: "Puede acceder a venta rápida", module: "ventas_rapida", action: "access" },
  { id: "p041", code: "ventas_rapida.crear_orden", name: "Crear Orden Rápida", description: "Puede crear órdenes rápidas", module: "ventas_rapida", action: "create" },
  { id: "p042", code: "ventas_rapida.enviar_cocina", name: "Enviar a Cocina", description: "Puede enviar a cocina desde venta rápida", module: "ventas_rapida", action: "create" },
  { id: "p043", code: "ventas_rapida.cobrar_inmediato", name: "Cobrar Inmediato", description: "Puede cobrar inmediatamente", module: "ventas_rapida", action: "create" },

  // ============ PAGOS ============
  { id: "p050", code: "pagos.acceso", name: "Acceso a Pagos", description: "Puede acceder al módulo de pagos", module: "pagos", action: "access" },
  { id: "p051", code: "pagos.cobrar_efectivo", name: "Cobrar Efectivo", description: "Puede cobrar en efectivo", module: "pagos", action: "create" },
  { id: "p052", code: "pagos.cobrar_tarjeta", name: "Cobrar Tarjeta", description: "Puede cobrar con tarjeta", module: "pagos", action: "create" },
  { id: "p053", code: "pagos.cobrar_transferencia", name: "Cobrar Transferencia", description: "Puede cobrar por transferencia", module: "pagos", action: "create" },
  { id: "p054", code: "pagos.asignar_referencia", name: "Asignar Referencia", description: "Puede asignar referencias de pago", module: "pagos", action: "edit" },
  { id: "p055", code: "pagos.reimprimir_recibo", name: "Reimprimir Recibo", description: "Puede reimprimir recibos", module: "pagos", action: "reprint" },
  { id: "p056", code: "pagos.anular_pago", name: "Anular Pago", description: "Puede anular/reembolsar pagos", module: "pagos", action: "void" },

  // ============ CAJA ============
  { id: "p060", code: "caja.apertura", name: "Apertura de Caja", description: "Puede abrir caja", module: "caja", action: "create" },
  { id: "p061", code: "caja.cierre", name: "Cierre de Caja", description: "Puede cerrar caja", module: "caja", action: "create" },
  { id: "p062", code: "caja.arqueo_ver", name: "Ver Arqueo", description: "Puede ver arqueo de caja", module: "caja", action: "view" },
  { id: "p063", code: "caja.movimientos_ver", name: "Ver Movimientos", description: "Puede ver movimientos de caja", module: "caja", action: "view" },

  // ============ KDS/COCINA ============
  { id: "p070", code: "kds.acceso", name: "Acceso KDS", description: "Puede acceder a cocina/KDS", module: "kds", action: "access" },
  { id: "p071", code: "kds.ver_comandas", name: "Ver Comandas", description: "Puede ver comandas", module: "kds", action: "view" },
  { id: "p072", code: "kds.cambiar_estado", name: "Cambiar Estado", description: "Puede cambiar estado de comandas", module: "kds", action: "edit" },
  { id: "p073", code: "kds.reimprimir_comanda", name: "Reimprimir Comanda", description: "Puede reimprimir comandas", module: "kds", action: "reprint" },

  // ============ REPORTES ============
  { id: "p080", code: "reportes.ventas", name: "Reportes de Ventas", description: "Puede ver reportes de ventas", module: "reportes", action: "view" },
  { id: "p081", code: "reportes.productos", name: "Reportes de Productos", description: "Puede ver reportes de productos", module: "reportes", action: "view" },
  { id: "p082", code: "reportes.mesas", name: "Reportes de Mesas", description: "Puede ver reportes de mesas", module: "reportes", action: "view" },
  { id: "p083", code: "reportes.caja", name: "Reportes de Caja", description: "Puede ver reportes de caja", module: "reportes", action: "view" },
  { id: "p084", code: "reportes.fiscales", name: "Reportes Fiscales", description: "Puede ver reportes fiscales", module: "reportes", action: "view" },
  { id: "p085", code: "reportes.auditoria", name: "Reportes de Auditoría", description: "Puede ver logs de auditoría", module: "reportes", action: "view" },

  // ============ CLIENTES ============
  { id: "p090", code: "clientes.ver", name: "Ver Clientes", description: "Puede ver clientes", module: "clientes", action: "view" },
  { id: "p091", code: "clientes.crear_editar", name: "Crear/Editar Clientes", description: "Puede crear y editar clientes", module: "clientes", action: "edit" },
  { id: "p092", code: "clientes.asignar_a_mesa", name: "Asignar a Mesa", description: "Puede asignar cliente a mesa", module: "clientes", action: "edit" },

  // ============ DELIVERY ============
  { id: "p100", code: "delivery.crear_orden", name: "Crear Orden Delivery", description: "Puede crear órdenes de delivery", module: "delivery", action: "create" },
  { id: "p101", code: "delivery.asignar_repartidor", name: "Asignar Repartidor", description: "Puede asignar repartidor", module: "delivery", action: "edit" },
  { id: "p102", code: "delivery.marcar_entregado", name: "Marcar Entregado", description: "Puede marcar como entregado", module: "delivery", action: "edit" },

  // ============ INVENTARIO ============
  { id: "p110", code: "inventario.acceso", name: "Acceso Inventario", description: "Puede acceder a inventario", module: "inventario", action: "access" },
  { id: "p111", code: "inventario.productos.crear_editar", name: "Gestionar Productos", description: "Puede crear/editar productos", module: "inventario", action: "edit" },
  { id: "p112", code: "inventario.ajustes.crear", name: "Crear Ajustes", description: "Puede crear ajustes de inventario", module: "inventario", action: "create" },
  { id: "p113", code: "inventario.kardex.ver", name: "Ver Kardex", description: "Puede ver kardex", module: "inventario", action: "view" },

  // ============ COMPRAS ============
  { id: "p120", code: "compras.proveedores.crear_editar", name: "Gestionar Proveedores", description: "Puede gestionar proveedores", module: "compras", action: "edit" },
  { id: "p121", code: "compras.ordenes.crear", name: "Crear Órdenes", description: "Puede crear órdenes de compra", module: "compras", action: "create" },
  { id: "p122", code: "compras.ordenes.recibir", name: "Recibir Órdenes", description: "Puede recibir órdenes de compra", module: "compras", action: "edit" },
  { id: "p123", code: "compras.ordenes.anular", name: "Anular Órdenes", description: "Puede anular órdenes de compra", module: "compras", action: "void" },
];

// Agrupar permisos por módulo
export const PERMISSIONS_BY_MODULE: PermissionGroup[] = Object.entries(PERMISSION_MODULES).map(
  ([module, moduleName]) => ({
    module: module as PermissionModule,
    moduleName,
    permissions: ALL_PERMISSIONS.filter((p) => p.module === module),
  })
);

// ================================================================================
// ROLES PREDEFINIDOS
// ================================================================================

export const DEFAULT_ROLES: Omit<Role, "id" | "businessId" | "createdAt" | "updatedAt">[] = [
  {
    name: "Administrador",
    description: "Acceso completo a todas las funciones del sistema",
    level: "admin",
    isSystemRole: true,
    permissions: ALL_PERMISSIONS.map((p) => p.code),
  },
  {
    name: "Supervisor",
    description: "Gestión de ventas, caja, reportes y puede anular/reabrir",
    level: "supervisor",
    isSystemRole: true,
    permissions: [
      "ventas.mesas.acceso", "ventas.mesas.ver_estado", "ventas.mesas.abrir", "ventas.mesas.mover_unir",
      "ventas.mesas.marcar_pagando", "ventas.mesas.liberar", "ventas.orden.agregar_item", 
      "ventas.orden.editar_item", "ventas.orden.eliminar_item", "ventas.orden.enviar_cocina",
      "ventas.orden.reabrir", "ventas.orden.anular", "ventas.orden.descuento_aplicar",
      "ventas.orden.ver_total", "ventas.cuenta.split_manual", "ventas.cuenta.split_equiv",
      "ventas_rapida.acceso", "ventas_rapida.crear_orden", "ventas_rapida.enviar_cocina", "ventas_rapida.cobrar_inmediato",
      "pagos.acceso", "pagos.cobrar_efectivo", "pagos.cobrar_tarjeta", "pagos.cobrar_transferencia",
      "pagos.asignar_referencia", "pagos.reimprimir_recibo", "pagos.anular_pago",
      "caja.apertura", "caja.cierre", "caja.arqueo_ver", "caja.movimientos_ver",
      "kds.acceso", "kds.ver_comandas", "kds.cambiar_estado", "kds.reimprimir_comanda",
      "reportes.ventas", "reportes.productos", "reportes.mesas", "reportes.caja", "reportes.auditoria",
      "clientes.ver", "clientes.crear_editar", "clientes.asignar_a_mesa",
    ],
  },
  {
    name: "Cajero",
    description: "Venta, cobro y gestión de caja",
    level: "operator",
    isSystemRole: true,
    permissions: [
      "ventas.mesas.acceso", "ventas.mesas.ver_estado", "ventas.orden.agregar_item",
      "ventas.orden.enviar_cocina", "ventas.orden.ver_total",
      "ventas_rapida.acceso", "ventas_rapida.crear_orden", "ventas_rapida.cobrar_inmediato",
      "pagos.acceso", "pagos.cobrar_efectivo", "pagos.cobrar_tarjeta", "pagos.cobrar_transferencia",
      "pagos.reimprimir_recibo",
      "caja.apertura", "caja.cierre", "caja.arqueo_ver", "caja.movimientos_ver",
      "clientes.ver", "clientes.asignar_a_mesa",
    ],
  },
  {
    name: "Mesero",
    description: "Toma de pedidos y gestión de mesas",
    level: "operator",
    isSystemRole: true,
    permissions: [
      "ventas.mesas.acceso", "ventas.mesas.ver_estado", "ventas.mesas.abrir", "ventas.mesas.mover_unir",
      "ventas.orden.agregar_item", "ventas.orden.editar_item", "ventas.orden.eliminar_item",
      "ventas.orden.enviar_cocina", "ventas.cuenta.split_manual", "ventas.cuenta.split_equiv",
      "clientes.ver", "clientes.asignar_a_mesa",
    ],
  },
  {
    name: "Cocina",
    description: "Visualización y gestión de comandas en cocina",
    level: "operator",
    isSystemRole: true,
    permissions: [
      "kds.acceso", "kds.ver_comandas", "kds.cambiar_estado", "kds.reimprimir_comanda",
    ],
  },
  {
    name: "Delivery",
    description: "Gestión de entregas a domicilio",
    level: "operator",
    isSystemRole: false,
    permissions: [
      "delivery.crear_orden", "delivery.asignar_repartidor", "delivery.marcar_entregado",
      "clientes.ver",
    ],
  },
];

// ================================================================================
// PROVEEDORES AFP Y ARS DE REPÚBLICA DOMINICANA
// ================================================================================

export const AFP_PROVIDERS = [
  { id: "afp-popular", name: "AFP Popular" },
  { id: "afp-siembra", name: "AFP Siembra" },
  { id: "afp-reservas", name: "AFP Reservas" },
  { id: "afp-romana", name: "AFP Romana" },
  { id: "afp-crecer", name: "AFP Crecer" },
];

export const ARS_PROVIDERS = [
  { id: "ars-humano", name: "ARS Humano" },
  { id: "ars-senasa", name: "SeNaSa" },
  { id: "ars-palic", name: "ARS Palic Salud" },
  { id: "ars-universal", name: "ARS Universal" },
  { id: "ars-mapfre", name: "ARS Mapfre" },
  { id: "ars-futuro", name: "ARS Futuro" },
  { id: "ars-yunen", name: "ARS Yunen" },
  { id: "ars-monumental", name: "ARS Monumental" },
  { id: "ars-constitucion", name: "ARS Constitución" },
  { id: "ars-colonial", name: "ARS Colonial" },
];

// Tasas actuales de deducciones en RD
export const RD_DEDUCTION_RATES = {
  afp: {
    employee: 2.87,
    employer: 7.10,
  },
  ars: {
    employee: 3.04,
    employer: 7.09,
  },
  srl: { // Seguro de Riesgos Laborales (solo empleador)
    employer: 1.20, // Variable según categoría de riesgo
  },
};

export const DEPARTMENTS = [
  "Gerencia",
  "Administración",
  "Cocina",
  "Servicio/Salón",
  "Barra",
  "Caja",
  "Delivery",
  "Limpieza",
  "Seguridad",
  "Recursos Humanos",
  "Marketing",
];

export const POSITIONS = [
  "Gerente General",
  "Gerente de Turno",
  "Supervisor",
  "Chef Ejecutivo",
  "Sous Chef",
  "Cocinero",
  "Ayudante de Cocina",
  "Bartender",
  "Mesero",
  "Host/Hostess",
  "Cajero",
  "Repartidor",
  "Personal de Limpieza",
  "Seguridad",
  "Asistente Administrativo",
];

export const BANKS_RD = [
  "Banco Popular Dominicano",
  "Banco de Reservas",
  "Banreservas",
  "Banco BHD León",
  "Scotiabank",
  "Banco Santa Cruz",
  "Banco Promerica",
  "Banco Caribe",
  "Banco López de Haro",
  "Asociación Popular de Ahorros y Préstamos",
  "Asociación La Nacional",
  "Banco Vimenca",
];
