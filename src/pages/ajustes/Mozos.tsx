import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  UserCheck,
  UserX,
  Key,
  ArrowLeft,
  Users,
  Clock,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Waiter {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  pin: string;
  status: "active" | "inactive";
  zone: string;
  shift: string;
  tablesAssigned: number;
  salesTotal: number;
  photoUrl?: string;
  hireDate: Date;
}

const ZONES = ["Salón Principal", "Terraza", "VIP", "Barra", "Todas"];
const SHIFTS = ["Mañana (7:00-15:00)", "Tarde (15:00-23:00)", "Noche (19:00-03:00)", "Rotativo"];

const MOCK_WAITERS: Waiter[] = [
  {
    id: "w1",
    firstName: "Ana",
    lastName: "Pérez",
    fullName: "Ana Pérez",
    phone: "809-555-0104",
    pin: "1234",
    status: "active",
    zone: "Salón Principal",
    shift: "Tarde (15:00-23:00)",
    tablesAssigned: 5,
    salesTotal: 45000,
    hireDate: new Date("2024-04-05"),
  },
  {
    id: "w2",
    firstName: "Luis",
    lastName: "García",
    fullName: "Luis García",
    phone: "809-555-0201",
    pin: "5678",
    status: "active",
    zone: "Terraza",
    shift: "Mañana (7:00-15:00)",
    tablesAssigned: 4,
    salesTotal: 38500,
    hireDate: new Date("2024-02-15"),
  },
  {
    id: "w3",
    firstName: "Carmen",
    lastName: "Rodríguez",
    fullName: "Carmen Rodríguez",
    phone: "809-555-0302",
    pin: "9012",
    status: "active",
    zone: "VIP",
    shift: "Noche (19:00-03:00)",
    tablesAssigned: 3,
    salesTotal: 72000,
    hireDate: new Date("2023-11-20"),
  },
  {
    id: "w4",
    firstName: "Miguel",
    lastName: "Santos",
    fullName: "Miguel Santos",
    phone: "809-555-0403",
    pin: "3456",
    status: "inactive",
    zone: "Barra",
    shift: "Rotativo",
    tablesAssigned: 0,
    salesTotal: 0,
    hireDate: new Date("2024-06-01"),
  },
];

interface WaiterFormData {
  firstName: string;
  lastName: string;
  phone: string;
  pin: string;
  zone: string;
  shift: string;
}

const initialFormData: WaiterFormData = {
  firstName: "",
  lastName: "",
  phone: "",
  pin: "",
  zone: "",
  shift: "",
};

export default function Mozos() {
  const [waiters, setWaiters] = useState<Waiter[]>(MOCK_WAITERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWaiter, setSelectedWaiter] = useState<Waiter | null>(null);
  const [formData, setFormData] = useState<WaiterFormData>(initialFormData);

  const filteredWaiters = waiters.filter((waiter) =>
    waiter.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    waiter.phone.includes(searchQuery)
  );

  const handleCreateWaiter = () => {
    setSelectedWaiter(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const handleEditWaiter = (waiter: Waiter) => {
    setSelectedWaiter(waiter);
    setFormData({
      firstName: waiter.firstName,
      lastName: waiter.lastName,
      phone: waiter.phone,
      pin: waiter.pin,
      zone: waiter.zone,
      shift: waiter.shift,
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (waiter: Waiter) => {
    const newStatus = waiter.status === "active" ? "inactive" : "active";
    setWaiters(waiters.map((w) => 
      w.id === waiter.id ? { ...w, status: newStatus } : w
    ));
    toast.success(`${waiter.fullName} ${newStatus === "active" ? "activado" : "desactivado"}`);
  };

  const handleResetPin = (waiter: Waiter) => {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setWaiters(waiters.map((w) => 
      w.id === waiter.id ? { ...w, pin: newPin } : w
    ));
    toast.success(`Nuevo PIN para ${waiter.fullName}: ${newPin}`);
  };

  const handleSaveWaiter = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.pin) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    if (formData.pin.length !== 4) {
      toast.error("El PIN debe tener 4 dígitos");
      return;
    }

    if (selectedWaiter) {
      // Edit
      setWaiters(waiters.map((w) => 
        w.id === selectedWaiter.id 
          ? { 
              ...w, 
              ...formData, 
              fullName: `${formData.firstName} ${formData.lastName}` 
            } 
          : w
      ));
      toast.success("Mesero actualizado");
    } else {
      // Create
      const newWaiter: Waiter = {
        id: `w${Date.now()}`,
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`,
        status: "active",
        tablesAssigned: 0,
        salesTotal: 0,
        hireDate: new Date(),
      };
      setWaiters([...waiters, newWaiter]);
      toast.success("Mesero creado exitosamente");
    }
    setIsModalOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/ajustes">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Gestión de Mozos</h1>
              <p className="text-muted-foreground">
                Administra los meseros y sus asignaciones
              </p>
            </div>
          </div>
          <Button onClick={handleCreateWaiter} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Nuevo Mozo
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{waiters.length}</p>
                <p className="text-sm text-muted-foreground">Total Mozos</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-success/10">
                <UserCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {waiters.filter((w) => w.status === "active").length}
                </p>
                <p className="text-sm text-muted-foreground">Activos</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-info/10">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {waiters.reduce((sum, w) => sum + w.tablesAssigned, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Mesas Asignadas</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-warning/10">
                <DollarSign className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(waiters.reduce((sum, w) => sum + w.salesTotal, 0))}
                </p>
                <p className="text-sm text-muted-foreground">Ventas Hoy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="card-elevated p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 max-w-md"
            />
          </div>
        </div>

        {/* Table */}
        <div className="card-elevated overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[250px]">Mozo</TableHead>
                <TableHead>Zona</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead className="text-center">Mesas</TableHead>
                <TableHead className="text-right">Ventas Hoy</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWaiters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No se encontraron mozos
                  </TableCell>
                </TableRow>
              ) : (
                filteredWaiters.map((waiter) => (
                  <TableRow key={waiter.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={waiter.photoUrl} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {getInitials(waiter.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{waiter.fullName}</p>
                          <p className="text-sm text-muted-foreground">{waiter.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{waiter.zone}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{waiter.shift}</TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold">{waiter.tablesAssigned}</span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(waiter.salesTotal)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          waiter.status === "active"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-muted text-muted-foreground border-muted"
                        }
                      >
                        {waiter.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem onClick={() => handleEditWaiter(waiter)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPin(waiter)}>
                            <Key className="h-4 w-4 mr-2" />
                            Resetear PIN
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(waiter)}>
                            {waiter.status === "active" ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                Desactivar
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activar
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedWaiter ? "Editar Mozo" : "Nuevo Mozo"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="809-555-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin">PIN (4 dígitos) *</Label>
                <Input
                  id="pin"
                  type="password"
                  maxLength={4}
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, "") })}
                  placeholder="••••"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Zona Asignada</Label>
              <Select value={formData.zone} onValueChange={(v) => setFormData({ ...formData, zone: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar zona" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {ZONES.map((z) => (
                    <SelectItem key={z} value={z}>{z}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Turno</Label>
              <Select value={formData.shift} onValueChange={(v) => setFormData({ ...formData, shift: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar turno" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {SHIFTS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveWaiter}>
              {selectedWaiter ? "Guardar Cambios" : "Crear Mozo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
