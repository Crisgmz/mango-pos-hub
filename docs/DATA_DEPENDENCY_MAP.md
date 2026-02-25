# DATA_DEPENDENCY_MAP.md — Mapa de Dependencias de Datos

> Generado: 2026-02-25 | Auditor: Lovable AI

---

## LEYENDA

- **Mock inline**: Datos hardcodeados directamente en el componente/página
- **Mock file**: Datos importados de archivo mock (`src/data/`)
- **Context**: Datos del React Context (en memoria, sin persistencia)
- **Hook local**: Estado local con `useState` (se pierde al desmontar)
- **🔴 Backend**: Dato que debería venir del backend en producción

---

## PANTALLAS PRINCIPALES

### `/` — Dashboard (Index)

| Dato | Fuente actual | 🔴 Backend |
|------|--------------|------------|
| Nombre del usuario, rol | `PermissionsContext` (mock) | `auth.users` + `roles` |
| Resumen de ventas del día | `WelcomeCard` (hardcodeado) | `orders` agregados |
| Gráfico de ventas por hora | `SalesChart` (datos mock) | `orders` agrupados por hora |
| Mesas activas | `ActiveTablesWidget` (hardcodeado) | `tables` con estado actual |
| Acciones rápidas | `QuickActions` (estático) | N/A (UI estática) |

### `/ventas` — Punto de Venta

| Dato | Fuente actual | 🔴 Backend |
|------|--------------|------------|
| Lista de mesas con estado | `TablesGrid` → `initialTables` (mock inline) | `tables` |
| Mesero asignado a mesa | Mock inline en `initialTables` | `table_assignments` |
| Catálogo de productos | `src/data/mock-products.ts` (mock file) | `products` + `categories` + `modifier_groups` + `modifiers` |
| Disponibilidad de producto | `ProductAvailabilityContext` (context en memoria) | `product_availability` o flag en `products` |
| Items del carrito | `useCart` hook (hook local) | `order_items` (draft) |
| Subtotal, tax, total | Calculado en `useCart` (ITBIS 18% hardcoded) | Calculado con `tax_rates` configurables |
| Propina (venta manual) | Hardcodeado 10% en ManualSaleScreen | `tip_rate` en `settings` |
| Pago realizado | Solo UI (no se persiste) | `payments` |
| Factura generada | Renderizado en InvoiceModal (no se guarda) | `invoices` con NCF |
| División de cuenta | `SplitBillModal` estado local | `sub_accounts` + `payments` |

### `/caja` — Caja

| Dato | Fuente actual | 🔴 Backend |
|------|--------------|------------|
| Estado de caja (abierta/cerrada) | `useState(false)` local | `cash_registers` con status |
| Ingresos/egresos del día | Hardcodeado (RD$ 45,200 / RD$ 2,500) | `cash_movements` agregados |
| Balance | Hardcodeado (RD$ 42,700) | Calculado de `cash_movements` |
| Transacciones del día | Hardcodeado (28) | `count(payments)` del turno |
| Movimientos recientes | Array mock `movements` (5 items) | `cash_movements` recientes |
| Esperado vs contado (cierre) | Mock props en BlindCashCloseModal | Calculado de `payments` del turno |

### `/cocina` — KDS

| Dato | Fuente actual | 🔴 Backend |
|------|--------------|------------|
| Órdenes en espera | Array mock `orders` (4 items inline) | `orders` con status `sent` |
| Órdenes en preparación | Mismo array filtrado | `orders` con status `preparing` |
| Completados hoy | Hardcodeado (15) | `count(orders)` con status `completed` hoy |
| Productos agotados | `ProductAvailabilityContext` | `product_availability` |
| Tiempo transcurrido | Hardcodeado en mock | Calculado de `orders.created_at` |

### `/clientes` — Clientes

| Dato | Fuente actual | 🔴 Backend |
|------|--------------|------------|
| Lista de clientes | Array mock `clients` (5 items) | `customers` |
| Total pedidos por cliente | Hardcodeado | `count(orders)` por `customer_id` |
| Total gastado | Hardcodeado | `sum(orders.total)` por `customer_id` |
| Stats generales | Hardcodeado (145 pedidos, 89% con email) | Agregados de `customers` |

### `/productos` — Gestión de Productos

| Dato | Fuente actual | 🔴 Backend |
|------|--------------|------------|
| Lista de productos | `ProductsContext` (8 productos iniciales) | `products` |
| Categorías | `ProductsContext` (6 categorías) | `categories` |
| Menús | `ProductsContext` (3 menús) | `menus` |
| Precio promedio | Calculado en componente | Calculado de `products` |
| Count no disponibles | Calculado en componente | `count(products)` donde `available = false` |

### `/reportes` — Reportes

| Dato | Fuente actual | 🔴 Backend |
|------|--------------|------------|
| Ventas totales | Hardcodeado (RD$ 1,250,000) | `sum(orders.total)` |
| Transacciones | Hardcodeado (842) | `count(orders)` |
| Ticket promedio | Hardcodeado (RD$ 1,485) | `avg(orders.total)` |
| Clientes nuevos | Hardcodeado (56) | `count(customers)` nuevos |
| NCF disponibles | Hardcodeado (2,450) | `fiscal_sequences` |
| ITBIS cobrado | Hardcodeado (RD$ 225,000) | `sum(orders.tax)` |

---

## PANTALLAS DE AJUSTES (todas comparten el mismo patrón)

Cada pantalla de `/ajustes/*` tiene:

| Dato | Fuente actual | 🔴 Backend |
|------|--------------|------------|
| Lista de items | `useState([...initialData])` local | Tabla correspondiente |
| Formulario nuevo/editar | `useState({...formDefaults})` local | INSERT/UPDATE en tabla |
| Eliminación | `filter()` del array local | DELETE en tabla |

### Mapeo específico de tablas necesarias:

| Pantalla | Tabla backend necesaria |
|----------|----------------------|
| Usuarios | `users`, `roles`, `user_roles`, `employment_info` |
| Mozos | `waiters` (o `users` con rol Mesero) |
| Modificadores | `modifier_groups`, `modifiers` |
| Combos | `combos`, `combo_items` |
| Menú Config | `menus`, `menu_schedules` |
| Recetas | `recipes`, `recipe_ingredients` |
| Insumos | `supplies` (materias primas) |
| Config Comandas | `settings` (key-value) |
| Config Precuentas | `settings` (key-value) |
| Turnos | `shifts` |
| Cajas | `cash_registers` |
| Impuestos | `tax_rates` |
| Monedas | `currencies`, `exchange_rates` |
| Config Regionales | `settings` |
| Sucursales | `branches` |
| Kardex | `inventory_movements` |
| Salida Inventario | `inventory_movements` (type: salida) |
| Mover Inventario | `inventory_transfers` |
| Cuadre Stock | `stock_adjustments` |
| Mermas | `waste_records` |
| Requerimientos | `stock_requests` |
| Lista Compras | `purchase_orders` |
| Registro Compras | `purchases`, `purchase_items` |
| Proveedores | `suppliers` |
| Crédito Proveedores | `supplier_credits` |
| Impresoras | `printers` |
| Tarjeta | `payment_settings` |
| Transferencias | `payment_settings` |
| Historial Pagos | `payments` |
| Notas Crédito | `credit_notes` |
| Monitor Ventas | `orders` (real-time) |
| Venta Crédito | `credit_sales` |
| Gestión Créditos | `customer_credits` |
| Créditos Clientes | `customer_credits` |
| Gestión Costos | `product_costs` |
| Gestión Metas | `sales_goals` |
| Tarjeta Fidelidad | `loyalty_cards` |
| Niveles Membresías | `membership_levels` |
| Promociones | `promotions` |
| Cupones | `coupons` |
| Gift Cards | `gift_cards` |
| Puntos Recompensa | `reward_points` |
| Historial Fidelidad | `loyalty_history` |
| Opciones Sistema | `settings` |
| Info Restaurante | `business_info` |
| Config Crédito Fiscal | `fiscal_config`, `ncf_sequences` |
| Informes (todos) | Vistas agregadas de múltiples tablas |

---

## RELACIONES IMPLÍCITAS NO IMPLEMENTADAS

1. **Producto ↔ Categoría**: Existe via `categoryId`, pero `mock-products.ts` y `ProductsContext` usan IDs diferentes
2. **Producto ↔ Menú**: Relación via `menuId` pero no hay validación cruzada
3. **Mesa ↔ Orden**: `orderId` en Table type pero nunca se asigna
4. **Mesa ↔ Mesero**: `waiterId` se asigna al abrir mesa pero no persiste
5. **Orden ↔ Cliente**: `customerId` en Order type pero nunca se asigna ("Asignar cliente" es un botón sin acción)
6. **Orden ↔ Pago**: No hay relación, el pago solo dispara UI
7. **Receta ↔ Producto**: No hay relación entre recetas e insumos definidos en diferentes pantallas
8. **Combo ↔ Producto**: Combos seleccionan de ProductsContext pero no afectan el catálogo de ventas (mock-products)
9. **Impuestos ↔ Productos**: ITBIS 18% hardcodeado en `useCart`, no lee de config de impuestos
10. **Sucursal ↔ Todo**: Multi-sucursal UI existe pero no hay filtro por sucursal en ningún dato
