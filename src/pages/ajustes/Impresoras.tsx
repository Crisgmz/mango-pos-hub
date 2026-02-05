 import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Switch } from "@/components/ui/switch";
 import { Badge } from "@/components/ui/badge";
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
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 import { ArrowLeft, Plus, Printer, MoreHorizontal, Pencil, Trash2, Wifi, Usb, Monitor } from "lucide-react";
 import { useNavigate } from "react-router-dom";
 import { toast } from "sonner";
 
 type PrinterType = "window" | "usb" | "network";
 type PaperSize = "80mm" | "58mm";
 
 interface PrinterConfig {
   id: string;
   name: string;
   type: PrinterType;
   ipAddress?: string;
   port?: number;
   paperSize: PaperSize;
   autoCut: boolean;
   openCashDrawer: boolean;
   active: boolean;
 }
 
 const initialPrinters: PrinterConfig[] = [
   {
     id: "1",
     name: "Impresora Caja Principal",
     type: "network",
     ipAddress: "192.168.1.100",
     port: 9100,
     paperSize: "80mm",
     autoCut: true,
     openCashDrawer: true,
     active: true,
   },
   {
     id: "2",
     name: "Impresora Cocina",
     type: "network",
     ipAddress: "192.168.1.101",
     port: 9100,
     paperSize: "80mm",
     autoCut: true,
     openCashDrawer: false,
     active: true,
   },
   {
     id: "3",
     name: "Impresora Barra",
     type: "usb",
     paperSize: "58mm",
     autoCut: true,
     openCashDrawer: false,
     active: false,
   },
 ];
 
 const printerTypeLabels: Record<PrinterType, string> = {
   window: "Window",
   usb: "USB",
   network: "Red",
 };
 
 const printerTypeIcons: Record<PrinterType, React.ReactNode> = {
   window: <Monitor className="h-4 w-4" />,
   usb: <Usb className="h-4 w-4" />,
   network: <Wifi className="h-4 w-4" />,
 };
 
 export default function Impresoras() {
   const navigate = useNavigate();
   const [printers, setPrinters] = useState<PrinterConfig[]>(initialPrinters);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingPrinter, setEditingPrinter] = useState<PrinterConfig | null>(null);
   
   const [formData, setFormData] = useState<Omit<PrinterConfig, "id">>({
     name: "",
     type: "network",
     ipAddress: "",
     port: 9100,
     paperSize: "80mm",
     autoCut: true,
     openCashDrawer: false,
     active: true,
   });
 
   const resetForm = () => {
     setFormData({
       name: "",
       type: "network",
       ipAddress: "",
       port: 9100,
       paperSize: "80mm",
       autoCut: true,
       openCashDrawer: false,
       active: true,
     });
     setEditingPrinter(null);
   };
 
   const openAddModal = () => {
     resetForm();
     setIsModalOpen(true);
   };
 
   const openEditModal = (printer: PrinterConfig) => {
     setEditingPrinter(printer);
     setFormData({
       name: printer.name,
       type: printer.type,
       ipAddress: printer.ipAddress || "",
       port: printer.port || 9100,
       paperSize: printer.paperSize,
       autoCut: printer.autoCut,
       openCashDrawer: printer.openCashDrawer,
       active: printer.active,
     });
     setIsModalOpen(true);
   };
 
   const handleSave = () => {
     if (!formData.name.trim()) {
       toast.error("El nombre de la impresora es requerido");
       return;
     }
 
     if (formData.type === "network" && !formData.ipAddress?.trim()) {
       toast.error("La dirección IP es requerida para impresoras de red");
       return;
     }
 
     if (editingPrinter) {
       setPrinters(prev =>
         prev.map(p =>
           p.id === editingPrinter.id
             ? { ...formData, id: editingPrinter.id }
             : p
         )
       );
       toast.success("Impresora actualizada correctamente");
     } else {
       const newPrinter: PrinterConfig = {
         ...formData,
         id: Date.now().toString(),
       };
       setPrinters(prev => [...prev, newPrinter]);
       toast.success("Impresora agregada correctamente");
     }
 
     setIsModalOpen(false);
     resetForm();
   };
 
   const handleDelete = (id: string) => {
     setPrinters(prev => prev.filter(p => p.id !== id));
     toast.success("Impresora eliminada");
   };
 
   const toggleActive = (id: string) => {
     setPrinters(prev =>
       prev.map(p =>
         p.id === id ? { ...p, active: !p.active } : p
       )
     );
   };
 
   const activePrinters = printers.filter(p => p.active).length;
 
   return (
     <MainLayout>
       <div className="p-6 space-y-6">
         {/* Header */}
         <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}>
             <ArrowLeft className="h-5 w-5" />
           </Button>
           <div className="flex-1">
             <h1 className="text-2xl font-bold">Impresoras</h1>
             <p className="text-muted-foreground">
               Configura las impresoras del sistema
             </p>
           </div>
           <Button onClick={openAddModal}>
             <Plus className="h-4 w-4 mr-2" />
             Agregar Impresora
           </Button>
         </div>
 
         {/* Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">
                 Total Impresoras
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{printers.length}</div>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">
                 Activas
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-success">{activePrinters}</div>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">
                 Inactivas
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-muted-foreground">
                 {printers.length - activePrinters}
               </div>
             </CardContent>
           </Card>
         </div>
 
         {/* Printers Table */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Printer className="h-5 w-5" />
               Lista de Impresoras
             </CardTitle>
           </CardHeader>
           <CardContent>
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Nombre</TableHead>
                   <TableHead>Tipo</TableHead>
                   <TableHead>Conexión</TableHead>
                   <TableHead>Papel</TableHead>
                   <TableHead>Auto-corte</TableHead>
                   <TableHead>Gaveta</TableHead>
                   <TableHead>Estado</TableHead>
                   <TableHead className="w-[50px]"></TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {printers.map((printer) => (
                   <TableRow key={printer.id}>
                     <TableCell className="font-medium">{printer.name}</TableCell>
                     <TableCell>
                       <div className="flex items-center gap-2">
                         {printerTypeIcons[printer.type]}
                         {printerTypeLabels[printer.type]}
                       </div>
                     </TableCell>
                     <TableCell>
                       {printer.type === "network" ? (
                         <span className="text-sm">
                           {printer.ipAddress}:{printer.port}
                         </span>
                       ) : (
                         <span className="text-muted-foreground">-</span>
                       )}
                     </TableCell>
                     <TableCell>{printer.paperSize}</TableCell>
                     <TableCell>
                       {printer.autoCut ? (
                         <Badge variant="secondary">Sí</Badge>
                       ) : (
                         <span className="text-muted-foreground">No</span>
                       )}
                     </TableCell>
                     <TableCell>
                       {printer.openCashDrawer ? (
                         <Badge variant="secondary">Sí</Badge>
                       ) : (
                         <span className="text-muted-foreground">No</span>
                       )}
                     </TableCell>
                     <TableCell>
                       <Switch
                         checked={printer.active}
                         onCheckedChange={() => toggleActive(printer.id)}
                       />
                     </TableCell>
                     <TableCell>
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon">
                             <MoreHorizontal className="h-4 w-4" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={() => openEditModal(printer)}>
                             <Pencil className="h-4 w-4 mr-2" />
                             Editar
                           </DropdownMenuItem>
                           <DropdownMenuItem
                             className="text-destructive"
                             onClick={() => handleDelete(printer.id)}
                           >
                             <Trash2 className="h-4 w-4 mr-2" />
                             Eliminar
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                     </TableCell>
                   </TableRow>
                 ))}
                 {printers.length === 0 && (
                   <TableRow>
                     <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                       No hay impresoras configuradas
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
           </CardContent>
         </Card>
 
         {/* Add/Edit Modal */}
         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
           <DialogContent className="max-w-md">
             <DialogHeader>
               <DialogTitle>
                 {editingPrinter ? "Editar Impresora" : "Agregar Impresora"}
               </DialogTitle>
             </DialogHeader>
 
             <div className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="name">Nombre de la Impresora *</Label>
                 <Input
                   id="name"
                   value={formData.name}
                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                   placeholder="Ej: Impresora Caja Principal"
                 />
               </div>
 
               <div className="space-y-2">
                 <Label>Tipo de Conexión *</Label>
                 <Select
                   value={formData.type}
                   onValueChange={(value: PrinterType) =>
                     setFormData({ ...formData, type: value })
                   }
                 >
                   <SelectTrigger>
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="window">
                       <div className="flex items-center gap-2">
                         <Monitor className="h-4 w-4" />
                         Window (Sistema)
                       </div>
                     </SelectItem>
                     <SelectItem value="usb">
                       <div className="flex items-center gap-2">
                         <Usb className="h-4 w-4" />
                         USB
                       </div>
                     </SelectItem>
                     <SelectItem value="network">
                       <div className="flex items-center gap-2">
                         <Wifi className="h-4 w-4" />
                         Red (TCP/IP)
                       </div>
                     </SelectItem>
                   </SelectContent>
                 </Select>
               </div>
 
               {formData.type === "network" && (
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="ip">Dirección IP *</Label>
                     <Input
                       id="ip"
                       value={formData.ipAddress}
                       onChange={(e) =>
                         setFormData({ ...formData, ipAddress: e.target.value })
                       }
                       placeholder="192.168.1.100"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="port">Puerto</Label>
                     <Input
                       id="port"
                       type="number"
                       value={formData.port}
                       onChange={(e) =>
                         setFormData({ ...formData, port: parseInt(e.target.value) || 9100 })
                       }
                       placeholder="9100"
                     />
                   </div>
                 </div>
               )}
 
               <div className="space-y-2">
                 <Label>Tamaño de Papel</Label>
                 <Select
                   value={formData.paperSize}
                   onValueChange={(value: PaperSize) =>
                     setFormData({ ...formData, paperSize: value })
                   }
                 >
                   <SelectTrigger>
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="80mm">80mm (Estándar)</SelectItem>
                     <SelectItem value="58mm">58mm (Compacto)</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
 
               <div className="flex items-center justify-between">
                 <Label htmlFor="autoCut">Auto-corte de papel</Label>
                 <Switch
                   id="autoCut"
                   checked={formData.autoCut}
                   onCheckedChange={(checked) =>
                     setFormData({ ...formData, autoCut: checked })
                   }
                 />
               </div>
 
               <div className="flex items-center justify-between">
                 <Label htmlFor="cashDrawer">Abrir gaveta de efectivo</Label>
                 <Switch
                   id="cashDrawer"
                   checked={formData.openCashDrawer}
                   onCheckedChange={(checked) =>
                     setFormData({ ...formData, openCashDrawer: checked })
                   }
                 />
               </div>
 
               <div className="flex items-center justify-between">
                 <Label htmlFor="active">Impresora activa</Label>
                 <Switch
                   id="active"
                   checked={formData.active}
                   onCheckedChange={(checked) =>
                     setFormData({ ...formData, active: checked })
                   }
                 />
               </div>
             </div>
 
             <DialogFooter>
               <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                 Cancelar
               </Button>
               <Button onClick={handleSave}>
                 {editingPrinter ? "Guardar Cambios" : "Agregar Impresora"}
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>
       </div>
     </MainLayout>
   );
 }