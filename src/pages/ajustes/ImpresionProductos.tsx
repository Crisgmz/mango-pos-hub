import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Printer,
  Plus,
  ArrowLeft,
  Search,
  Globe,
  Usb,
  Wifi,
  Edit,
  Trash2,
  Power,
  ChefHat,
  Receipt,
  Package,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

// Tipos
interface Kitchen {
  id: string;
  name: string;
}

interface POSTerminal {
  id: string;
  name: string;
}

type PrintType = "window" | "usb" | "network";

interface PrinterConfig {
  id: string;
  name: string;
  active: boolean;
  printType: PrintType;
  kitchens: string[];
  terminals: string[];
  ipAddress?: string;
  port?: number;
  usbPort?: string;
  paperWidth: "58mm" | "80mm";
  autoCut: boolean;
  openCashDrawer: boolean;
}

type SectionType = "main" | "impresoras" | "productos" | "comprobantes" | "comandas";

// Datos mock
const mockKitchens: Kitchen[] = [
  { id: "k1", name: "Cocina Principal" },
  { id: "k2", name: "Cocina Fría" },
  { id: "k3", name: "Bar" },
  { id: "k4", name: "Parrilla" },
];

const mockTerminals: POSTerminal[] = [
  { id: "t1", name: "Caja Principal" },
  { id: "t2", name: "Caja Secundaria" },
  { id: "t3", name: "Terminal Meseros" },
];

const initialPrinters: PrinterConfig[] = [
  {
    id: "1",
    name: "Default Thermal Printer",
    active: true,
    printType: "window",
    kitchens: ["k1"],
    terminals: ["t1"],
    paperWidth: "80mm",
    autoCut: true,
    openCashDrawer: false,
  },
  {
    id: "2",
    name: "Impresora Cocina",
    active: true,
    printType: "network",
    kitchens: ["k1", "k4"],
    terminals: [],
    ipAddress: "192.168.1.100",
    port: 9100,
    paperWidth: "80mm",
    autoCut: true,
    openCashDrawer: false,
  },
  {
    id: "3",
    name: "Impresora Bar",
    active: true,
    printType: "usb",
    kitchens: ["k3"],
    terminals: [],
    usbPort: "USB001",
    paperWidth: "58mm",
    autoCut: true,
    openCashDrawer: false,
  },
  {
    id: "4",
    name: "Impresora Comprobantes",
    active: false,
    printType: "network",
    kitchens: [],
    terminals: ["t1", "t2"],
    ipAddress: "192.168.1.101",
    port: 9100,
    paperWidth: "80mm",
    autoCut: true,
    openCashDrawer: true,
  },
];

const printTypeLabels: Record<PrintType, { label: string; icon: typeof Globe }> = {
  window: { label: "Impresión por Ventana", icon: Globe },
  usb: { label: "USB Directo", icon: Usb },
  network: { label: "Red/IP", icon: Wifi },
};

// Secciones del menú principal
const menuSections = [
  {
    id: "impresoras" as SectionType,
    title: "Impresoras",
    description: "Configuración de impresoras",
    icon: Printer,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    id: "productos" as SectionType,
    title: "Asignar Impresión de Productos",
    description: "Productos por impresora",
    icon: Package,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  {
    id: "comprobantes" as SectionType,
    title: "Asignar Impresión de Comprobantes",
    description: "Comprobantes por impresora",
    icon: FileText,
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    id: "comandas" as SectionType,
    title: "Asignar Impresión de Comandas",
    description: "Comandas por impresora de cocina",
    icon: ChefHat,
    iconBg: "bg-info/10",
    iconColor: "text-info",
  },
];

export default function ImpresionProductos() {
  const [currentSection, setCurrentSection] = useState<SectionType>("main");
  const [printers, setPrinters] = useState<PrinterConfig[]>(initialPrinters);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<PrinterConfig | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<PrinterConfig>>({
    name: "",
    active: true,
    printType: "window",
    kitchens: [],
    terminals: [],
    paperWidth: "80mm",
    autoCut: true,
    openCashDrawer: false,
  });

  const filteredPrinters = printers.filter(
    (printer) =>
      printer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (printer?: PrinterConfig) => {
    if (printer) {
      setEditingPrinter(printer);
      setFormData({ ...printer });
    } else {
      setEditingPrinter(null);
      setFormData({
        name: "",
        active: true,
        printType: "window",
        kitchens: [],
        terminals: [],
        paperWidth: "80mm",
        autoCut: true,
        openCashDrawer: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name?.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    if (editingPrinter) {
      setPrinters((prev) =>
        prev.map((p) =>
          p.id === editingPrinter.id
            ? { ...p, ...formData } as PrinterConfig
            : p
        )
      );
      toast.success("Impresora actualizada correctamente");
    } else {
      const newPrinter: PrinterConfig = {
        id: Date.now().toString(),
        name: formData.name,
        active: formData.active ?? true,
        printType: formData.printType ?? "window",
        kitchens: formData.kitchens ?? [],
        terminals: formData.terminals ?? [],
        paperWidth: formData.paperWidth ?? "80mm",
        autoCut: formData.autoCut ?? true,
        openCashDrawer: formData.openCashDrawer ?? false,
        ipAddress: formData.ipAddress,
        port: formData.port,
        usbPort: formData.usbPort,
      };
      setPrinters((prev) => [...prev, newPrinter]);
      toast.success("Impresora creada correctamente");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setPrinters((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
    toast.success("Impresora eliminada");
  };

  const handleToggleActive = (id: string) => {
    setPrinters((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, active: !p.active } : p
      )
    );
    const printer = printers.find((p) => p.id === id);
    toast.success(
      printer?.active ? "Impresora desactivada" : "Impresora activada"
    );
  };

  const toggleKitchen = (kitchenId: string) => {
    setFormData((prev) => ({
      ...prev,
      kitchens: prev.kitchens?.includes(kitchenId)
        ? prev.kitchens.filter((k) => k !== kitchenId)
        : [...(prev.kitchens ?? []), kitchenId],
    }));
  };

  const toggleTerminal = (terminalId: string) => {
    setFormData((prev) => ({
      ...prev,
      terminals: prev.terminals?.includes(terminalId)
        ? prev.terminals.filter((t) => t !== terminalId)
        : [...(prev.terminals ?? []), terminalId],
    }));
  };

  const getKitchenNames = (kitchenIds: string[]) => {
    return kitchenIds
      .map((id) => mockKitchens.find((k) => k.id === id)?.name)
      .filter(Boolean);
  };

  const getTerminalNames = (terminalIds: string[]) => {
    return terminalIds
      .map((id) => mockTerminals.find((t) => t.id === id)?.name)
      .filter(Boolean);
  };

  const handleBackToMain = () => {
    setCurrentSection("main");
    setSearchTerm("");
  };

  const getSectionTitle = () => {
    const section = menuSections.find(s => s.id === currentSection);
    return section?.title || "Gestión de Impresión";
  };

  // Render main menu with navigation cards
  const renderMainMenu = () => (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/ajustes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Gestión de Impresión
          </h1>
          <p className="text-muted-foreground">
            Configura impresoras y asigna qué se imprime en cada una
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {menuSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.id}
              className="bg-card border-border cursor-pointer hover:shadow-lg transition-all hover:border-primary/30 group"
              onClick={() => setCurrentSection(section.id)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-lg ${section.iconBg}`}>
                  <Icon className={`h-5 w-5 ${section.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {section.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {section.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );

  // Render impresoras section
  const renderImpresorasSection = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBackToMain}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Impresoras
            </h1>
            <p className="text-muted-foreground">
              Agrega y configura las impresoras del sistema
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Impresora
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar impresoras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Printer className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{printers.length}</p>
              <p className="text-sm text-muted-foreground">Total Impresoras</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-success/10">
              <ChefHat className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {printers.filter((p) => p.kitchens.length > 0).length}
              </p>
              <p className="text-sm text-muted-foreground">Para Cocina</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-info/10">
              <Receipt className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {printers.filter((p) => p.terminals.length > 0).length}
              </p>
              <p className="text-sm text-muted-foreground">Para Comprobantes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Printers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrinters.map((printer, index) => {
          const PrintTypeIcon = printTypeLabels[printer.printType].icon;
          const kitchenNames = getKitchenNames(printer.kitchens);
          const terminalNames = getTerminalNames(printer.terminals);

          return (
            <Card
              key={printer.id}
              className={`bg-card border-border relative overflow-hidden transition-all hover:shadow-lg ${
                !printer.active ? "opacity-60" : ""
              }`}
            >
              {/* Number indicator */}
              <div className="absolute top-0 left-0 w-8 h-8 bg-muted rounded-br-xl flex items-center justify-center">
                <span className="text-sm font-semibold text-muted-foreground">
                  {index + 1}
                </span>
              </div>

              <CardContent className="p-5 pt-6">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <Printer className="h-6 w-6 text-foreground mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground">
                      {printer.name}
                    </h3>
                    <Badge
                      variant={printer.active ? "default" : "secondary"}
                      className={
                        printer.active
                          ? "bg-success/20 text-success border-success/30 mt-1"
                          : "bg-muted text-muted-foreground mt-1"
                      }
                    >
                      {printer.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>

                {/* Kitchens */}
                {kitchenNames.length > 0 && (
                  <div className="mb-2">
                    <p className="font-semibold text-sm text-foreground">
                      Cocinas ({kitchenNames.length}):
                    </p>
                    <ul className="mt-1">
                      {kitchenNames.map((name) => (
                        <li
                          key={name}
                          className="flex items-center gap-2 text-sm text-info"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-info" />
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Terminals */}
                {terminalNames.length > 0 && (
                  <div className="mb-2">
                    <p className="font-semibold text-sm text-foreground">
                      Pedidos ({terminalNames.length}):
                    </p>
                    <ul className="mt-1">
                      {terminalNames.map((name) => (
                        <li
                          key={name}
                          className="flex items-center gap-2 text-sm text-info"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-info" />
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Print Type */}
                <div className="flex items-center gap-2 mt-3 mb-4">
                  <span className="text-sm font-medium text-foreground">
                    Tipo de Impresión:
                  </span>
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-border text-muted-foreground"
                  >
                    <PrintTypeIcon className="h-3.5 w-3.5" />
                    {printTypeLabels[printer.printType].label}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => handleOpenModal(printer)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteConfirm(printer.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(printer.id)}
                  >
                    <Power className="h-4 w-4 mr-1" />
                    {printer.active ? "Desactivar" : "Activar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPrinters.length === 0 && (
        <div className="text-center py-12">
          <Printer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No se encontraron impresoras
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Intenta con otro término de búsqueda"
              : "Agrega tu primera impresora para comenzar"}
          </p>
          {!searchTerm && (
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Impresora
            </Button>
          )}
        </div>
      )}
    </>
  );

  // Render productos section
  const renderProductosSection = () => (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={handleBackToMain}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Asignar Impresión de Productos
          </h1>
          <p className="text-muted-foreground">
            Selecciona qué productos se imprimen en cada impresora
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {printers.filter(p => p.active).map((printer) => (
          <Card key={printer.id} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Printer className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{printer.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {printTypeLabels[printer.printType].label}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Categorías de productos asignadas:</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-muted/50">Bebidas</Badge>
                  <Badge variant="outline" className="bg-muted/50">Postres</Badge>
                  <Button variant="outline" size="sm" className="h-6 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Agregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {printers.filter(p => p.active).length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No hay impresoras activas
          </h3>
          <p className="text-muted-foreground">
            Primero agrega y activa impresoras en la sección de Impresoras
          </p>
        </div>
      )}
    </>
  );

  // Render comprobantes section
  const renderComprobantesSection = () => (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={handleBackToMain}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Asignar Impresión de Comprobantes
          </h1>
          <p className="text-muted-foreground">
            Configura qué impresora emite cada tipo de comprobante fiscal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comprobantes tipos */}
        {[
          { code: "B01", name: "Crédito Fiscal", description: "Para clientes con RNC" },
          { code: "B02", name: "Consumidor Final", description: "Para consumidores sin RNC" },
          { code: "B14", name: "Gubernamental", description: "Para entidades gubernamentales" },
          { code: "B15", name: "Regímenes Especiales", description: "Para zonas francas y otros" },
        ].map((tipo) => (
          <Card key={tipo.code} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <FileText className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{tipo.code} - {tipo.name}</h3>
                    <p className="text-sm text-muted-foreground">{tipo.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Impresora asignada:</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar impresora" />
                  </SelectTrigger>
                  <SelectContent>
                    {printers.filter(p => p.active).map((printer) => (
                      <SelectItem key={printer.id} value={printer.id}>
                        {printer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );

  // Render comandas section
  const renderComandasSection = () => (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={handleBackToMain}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Asignar Impresión de Comandas
          </h1>
          <p className="text-muted-foreground">
            Configura qué cocinas envían comandas a cada impresora
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockKitchens.map((kitchen) => (
          <Card key={kitchen.id} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <ChefHat className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{kitchen.name}</h3>
                    <p className="text-sm text-muted-foreground">Área de preparación</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Impresora asignada:</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar impresora" />
                  </SelectTrigger>
                  <SelectContent>
                    {printers.filter(p => p.active).map((printer) => (
                      <SelectItem key={printer.id} value={printer.id}>
                        {printer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );

  // Render content based on current section
  const renderContent = () => {
    switch (currentSection) {
      case "impresoras":
        return renderImpresorasSection();
      case "productos":
        return renderProductosSection();
      case "comprobantes":
        return renderComprobantesSection();
      case "comandas":
        return renderComandasSection();
      default:
        return renderMainMenu();
    }
  };

  return (
    <MainLayout>
      <div className="pt-20 pb-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {renderContent()}

        {/* Modal de creación/edición de impresora */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPrinter ? "Editar Impresora" : "Nueva Impresora"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label>Nombre de la Impresora *</Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ej: Impresora Cocina Principal"
                />
              </div>

              {/* Tipo de impresión */}
              <div className="space-y-2">
                <Label>Tipo de Impresión</Label>
                <Select
                  value={formData.printType}
                  onValueChange={(value: PrintType) =>
                    setFormData((prev) => ({ ...prev, printType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="window">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Impresión por Ventana
                      </div>
                    </SelectItem>
                    <SelectItem value="usb">
                      <div className="flex items-center gap-2">
                        <Usb className="h-4 w-4" />
                        USB Directo
                      </div>
                    </SelectItem>
                    <SelectItem value="network">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4" />
                        Red/IP
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Configuración de red */}
              {formData.printType === "network" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Dirección IP</Label>
                    <Input
                      value={formData.ipAddress || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          ipAddress: e.target.value,
                        }))
                      }
                      placeholder="192.168.1.100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Puerto</Label>
                    <Input
                      type="number"
                      value={formData.port || 9100}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          port: parseInt(e.target.value),
                        }))
                      }
                      placeholder="9100"
                    />
                  </div>
                </div>
              )}

              {/* Configuración USB */}
              {formData.printType === "usb" && (
                <div className="space-y-2">
                  <Label>Puerto USB</Label>
                  <Input
                    value={formData.usbPort || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        usbPort: e.target.value,
                      }))
                    }
                    placeholder="USB001"
                  />
                </div>
              )}

              {/* Ancho de papel */}
              <div className="space-y-2">
                <Label>Ancho de Papel</Label>
                <Select
                  value={formData.paperWidth}
                  onValueChange={(value: "58mm" | "80mm") =>
                    setFormData((prev) => ({ ...prev, paperWidth: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ancho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="58mm">58mm (2.25")</SelectItem>
                    <SelectItem value="80mm">80mm (3.15")</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cocinas asignadas */}
              <div className="space-y-2">
                <Label>Cocinas Asignadas (para comandas)</Label>
                <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg bg-muted/30">
                  {mockKitchens.map((kitchen) => (
                    <div
                      key={kitchen.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`kitchen-${kitchen.id}`}
                        checked={formData.kitchens?.includes(kitchen.id)}
                        onCheckedChange={() => toggleKitchen(kitchen.id)}
                      />
                      <Label
                        htmlFor={`kitchen-${kitchen.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {kitchen.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminales asignadas */}
              <div className="space-y-2">
                <Label>Terminales Asignadas (para comprobantes)</Label>
                <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg bg-muted/30">
                  {mockTerminals.map((terminal) => (
                    <div
                      key={terminal.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`terminal-${terminal.id}`}
                        checked={formData.terminals?.includes(terminal.id)}
                        onCheckedChange={() => toggleTerminal(terminal.id)}
                      />
                      <Label
                        htmlFor={`terminal-${terminal.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {terminal.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opciones adicionales */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Corte Automático</Label>
                    <p className="text-sm text-muted-foreground">
                      Cortar papel después de imprimir
                    </p>
                  </div>
                  <Switch
                    checked={formData.autoCut}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, autoCut: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Abrir Gaveta</Label>
                    <p className="text-sm text-muted-foreground">
                      Abrir gaveta de dinero al imprimir
                    </p>
                  </div>
                  <Switch
                    checked={formData.openCashDrawer}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        openCashDrawer: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Estado</Label>
                    <p className="text-sm text-muted-foreground">
                      Impresora activa o inactiva
                    </p>
                  </div>
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, active: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingPrinter ? "Guardar Cambios" : "Crear Impresora"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmar eliminación */}
        <AlertDialog
          open={!!deleteConfirm}
          onOpenChange={() => setDeleteConfirm(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar impresora?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. La impresora será eliminada
                permanentemente del sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
