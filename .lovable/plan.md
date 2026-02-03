
# Plan: Modal de Producto con Creacion de Categorias

## Resumen
Implementar un modal completo para agregar/editar productos del menu, incluyendo la capacidad de crear categorias nuevas directamente desde el selector de categoria sin salir del formulario.

## Cambios a Realizar

### 1. Actualizar Tipos de Producto
**Archivo:** `src/types/pos.ts`

Agregar campos adicionales a la interfaz `Product`:
- `description`: descripcion opcional
- `productType`: tipo de producto (Plato, Bebida, Postre, etc.)
- `menuId`: referencia al menu
- `cost`: costo del producto (opcional)
- `sku`: referencia/SKU (opcional)
- `barcode`: codigo de barras (opcional)
- `hasVariations`: si tiene variaciones
- `available`: disponibilidad
- `taxIncluded`: si incluye impuestos

Crear interfaz `Menu`:
- `id`, `name`

### 2. Crear Modal de Producto
**Archivo nuevo:** `src/components/productos/ProductFormModal.tsx`

Formulario completo con:
- Nombre del articulo (requerido)
- Descripcion (opcional)
- Tipo de Producto (dropdown)
- Elegir Menu (dropdown)
- Categoria (dropdown con boton "+" para crear nueva)
- Precio (requerido)
- Costo (opcional)
- Referencia/SKU (opcional)
- Codigo de barras (opcional)
- Switch "Tiene variaciones"
- Switch "Disponible"
- Selector de imagen
- Seccion de Impuestos con slider

### 3. Crear Modal de Categoria
**Archivo nuevo:** `src/components/productos/CategoryFormModal.tsx`

Modal simple para crear categoria:
- Nombre de la categoria (requerido)
- Icono opcional
- Boton guardar que retorna la nueva categoria al formulario de producto

### 4. Crear Contexto de Productos
**Archivo nuevo:** `src/contexts/ProductsContext.tsx`

Estado global para:
- Lista de productos (dinamica)
- Lista de categorias (dinamica)
- Lista de menus
- Funciones CRUD: `addProduct`, `updateProduct`, `deleteProduct`
- Funciones CRUD: `addCategory`, `updateCategory`, `deleteCategory`

### 5. Actualizar Pagina de Productos
**Archivo:** `src/pages/Productos.tsx`

- Usar el nuevo contexto de productos
- Conectar boton "Agregar Elemento de Menu" al modal
- Agregar funcionalidad de editar producto (click en fila o menu de acciones)
- Agregar funcionalidad de eliminar producto
- Actualizar estadisticas dinamicamente

### 6. Integrar en App
**Archivo:** `src/App.tsx`

- Envolver la aplicacion con `ProductsProvider`

## Flujo de Usuario

```text
Usuario hace click en "Agregar Elemento de Menu"
            |
            v
    Se abre ProductFormModal
            |
            v
Usuario llena campos y al llegar a Categoria
            |
    +-------+-------+
    |               |
    v               v
Selecciona      Click en "+"
existente       (crear nueva)
    |               |
    |               v
    |       Se abre CategoryFormModal
    |               |
    |               v
    |       Usuario crea categoria
    |               |
    |               v
    |       Categoria se agrega al dropdown
    |       y se selecciona automaticamente
    |               |
    +-------+-------+
            |
            v
    Usuario completa formulario
            |
            v
    Click en "Guardar"
            |
            v
    Producto agregado a la lista
```

## Detalles Tecnicos

### Componentes UI a utilizar
- Dialog (modal principal)
- Form con react-hook-form + zod para validacion
- Select para dropdowns
- Input para campos de texto
- Textarea para descripcion
- Switch para toggles
- Slider para impuestos
- Button con variantes

### Validaciones
- Nombre: requerido, minimo 2 caracteres
- Precio: requerido, numero mayor a 0
- Categoria: requerida
- Menu: requerido

### Estados del Modal
- Modo "crear": formulario vacio
- Modo "editar": formulario precargado con datos del producto

## Archivos Afectados
| Archivo | Accion |
|---------|--------|
| `src/types/pos.ts` | Modificar |
| `src/components/productos/ProductFormModal.tsx` | Crear |
| `src/components/productos/CategoryFormModal.tsx` | Crear |
| `src/contexts/ProductsContext.tsx` | Crear |
| `src/pages/Productos.tsx` | Modificar |
| `src/App.tsx` | Modificar |
