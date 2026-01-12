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
  Trash2,
  UserCheck,
  UserX,
  Key,
  Shield,
  ArrowLeft,
  Users,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { User, UserStatus, DEFAULT_ROLES } from "@/types/users";
import { UserFormModal } from "@/components/usuarios/UserFormModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mock data para demostración
const MOCK_USERS: User[] = [
  {
    id: "1",
    businessId: "b1",
    email: "admin@mangopos.do",
    firstName: "Carlos",
    lastName: "Rodríguez",
    fullName: "Carlos Rodríguez",
    phone: "809-555-0101",
    status: "active",
    roles: ["r1"],
    roleNames: ["Administrador"],
    mustChangePassword: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    employment: {
      hireDate: new Date("2024-01-15"),
      contractType: "full_time",
      department: "Gerencia",
      position: "Gerente General",
      workSchedule: "Lun-Vie 8:00-17:00",
      baseSalary: 85000,
      currency: "DOP",
      payrollFrequency: "monthly",
      afpEnabled: true,
      afpProvider: "AFP Popular",
      afpEmployeeRate: 2.87,
      afpEmployerRate: 7.10,
      arsEnabled: true,
      arsProvider: "ARS Humano",
      arsEmployeeRate: 3.04,
      arsEmployerRate: 7.09,
      isrEnabled: true,
      isrRate: 15,
      hasTransportAllowance: false,
      transportAllowance: 0,
      hasFoodAllowance: true,
      foodAllowance: 3000,
      vacationDaysPerYear: 14,
      vacationDaysUsed: 3,
      vacationDaysRemaining: 11,
    },
  },
  {
    id: "2",
    businessId: "b1",
    email: "maria.supervisor@mangopos.do",
    firstName: "María",
    lastName: "González",
    fullName: "María González",
    phone: "809-555-0102",
    status: "active",
    roles: ["r2"],
    roleNames: ["Supervisor"],
    mustChangePassword: false,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    employment: {
      hireDate: new Date("2024-02-01"),
      contractType: "full_time",
      department: "Servicio/Salón",
      position: "Supervisor",
      workSchedule: "Lun-Sab 10:00-19:00",
      baseSalary: 45000,
      currency: "DOP",
      payrollFrequency: "biweekly",
      afpEnabled: true,
      afpProvider: "AFP Siembra",
      afpEmployeeRate: 2.87,
      afpEmployerRate: 7.10,
      arsEnabled: true,
      arsProvider: "SeNaSa",
      arsEmployeeRate: 3.04,
      arsEmployerRate: 7.09,
      isrEnabled: false,
      isrRate: 0,
      hasTransportAllowance: true,
      transportAllowance: 4000,
      hasFoodAllowance: true,
      foodAllowance: 2500,
      vacationDaysPerYear: 14,
      vacationDaysUsed: 0,
      vacationDaysRemaining: 14,
    },
  },
  {
    id: "3",
    businessId: "b1",
    email: "pedro.cajero@mangopos.do",
    firstName: "Pedro",
    lastName: "Martínez",
    fullName: "Pedro Martínez",
    phone: "809-555-0103",
    status: "active",
    roles: ["r3"],
    roleNames: ["Cajero"],
    mustChangePassword: true,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
    employment: {
      hireDate: new Date("2024-03-10"),
      contractType: "full_time",
      department: "Caja",
      position: "Cajero",
      workSchedule: "Mar-Dom 11:00-20:00",
      baseSalary: 28000,
      currency: "DOP",
      payrollFrequency: "biweekly",
      afpEnabled: true,
      afpProvider: "AFP Popular",
      afpEmployeeRate: 2.87,
      afpEmployerRate: 7.10,
      arsEnabled: true,
      arsProvider: "ARS Humano",
      arsEmployeeRate: 3.04,
      arsEmployerRate: 7.09,
      isrEnabled: false,
      isrRate: 0,
      hasTransportAllowance: true,
      transportAllowance: 3500,
      hasFoodAllowance: true,
      foodAllowance: 2000,
      vacationDaysPerYear: 14,
      vacationDaysUsed: 0,
      vacationDaysRemaining: 14,
    },
  },
  {
    id: "4",
    businessId: "b1",
    email: "ana.mesera@mangopos.do",
    firstName: "Ana",
    lastName: "Pérez",
    fullName: "Ana Pérez",
    phone: "809-555-0104",
    status: "active",
    roles: ["r4"],
    roleNames: ["Mesero"],
    mustChangePassword: false,
    createdAt: new Date("2024-04-05"),
    updatedAt: new Date("2024-04-05"),
    employment: {
      hireDate: new Date("2024-04-05"),
      contractType: "part_time",
      department: "Servicio/Salón",
      position: "Mesero",
      workSchedule: "Vie-Dom 18:00-23:00",
      baseSalary: 18000,
      currency: "DOP",
      payrollFrequency: "weekly",
      afpEnabled: true,
      afpProvider: "AFP Reservas",
      afpEmployeeRate: 2.87,
      afpEmployerRate: 7.10,
      arsEnabled: true,
      arsProvider: "SeNaSa",
      arsEmployeeRate: 3.04,
      arsEmployerRate: 7.09,
      isrEnabled: false,
      isrRate: 0,
      hasTransportAllowance: false,
      transportAllowance: 0,
      hasFoodAllowance: true,
      foodAllowance: 1500,
      vacationDaysPerYear: 14,
      vacationDaysUsed: 0,
      vacationDaysRemaining: 14,
    },
  },
  {
    id: "5",
    businessId: "b1",
    email: "jose.cocina@mangopos.do",
    firstName: "José",
    lastName: "Hernández",
    fullName: "José Hernández",
    phone: "809-555-0105",
    status: "inactive",
    roles: ["r5"],
    roleNames: ["Cocina"],
    mustChangePassword: false,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-06-15"),
    employment: {
      hireDate: new Date("2024-01-20"),
      contractType: "full_time",
      department: "Cocina",
      position: "Cocinero",
      workSchedule: "Lun-Sab 7:00-16:00",
      baseSalary: 32000,
      currency: "DOP",
      payrollFrequency: "biweekly",
      afpEnabled: true,
      afpProvider: "AFP Popular",
      afpEmployeeRate: 2.87,
      afpEmployerRate: 7.10,
      arsEnabled: true,
      arsProvider: "ARS Universal",
      arsEmployeeRate: 3.04,
      arsEmployerRate: 7.09,
      isrEnabled: false,
      isrRate: 0,
      hasTransportAllowance: true,
      transportAllowance: 4000,
      hasFoodAllowance: true,
      foodAllowance: 2500,
      vacationDaysPerYear: 14,
      vacationDaysUsed: 14,
      vacationDaysRemaining: 0,
    },
  },
];

const statusConfig: Record<UserStatus, { label: string; className: string }> = {
  active: { label: "Activo", className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Inactivo", className: "bg-muted text-muted-foreground border-muted" },
  suspended: { label: "Suspendido", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filtrar usuarios
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);

    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.roleNames.some((r) => r.toLowerCase().includes(roleFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (user: User) => {
    const newStatus: UserStatus = user.status === "active" ? "inactive" : "active";
    setUsers(users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.")) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (selectedUser) {
      // Editar
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, ...userData } as User : u)));
    } else {
      // Crear
      const newUser: User = {
        id: `u${Date.now()}`,
        businessId: "b1",
        ...userData,
        fullName: `${userData.firstName} ${userData.lastName}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
      setUsers([...users, newUser]);
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
              <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
              <p className="text-muted-foreground">
                Administra los usuarios del sistema y sus permisos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/ajustes/roles">
              <Button variant="outline" className="gap-2">
                <Shield className="h-4 w-4" />
                Gestionar Roles
              </Button>
            </Link>
            <Button onClick={handleCreateUser} className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total Usuarios</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-success/10">
                <UserCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</p>
                <p className="text-sm text-muted-foreground">Activos</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-muted">
                <UserX className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter((u) => u.status === "inactive").length}</p>
                <p className="text-sm text-muted-foreground">Inactivos</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-warning/10">
                <Key className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter((u) => u.mustChangePassword).length}</p>
                <p className="text-sm text-muted-foreground">Cambio de Clave</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card-elevated p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="suspended">Suspendidos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <Shield className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  {DEFAULT_ROLES.map((role) => (
                    <SelectItem key={role.name} value={role.name.toLowerCase()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card-elevated overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[300px]">Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Salario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.photoUrl} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {getInitials(user.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{user.fullName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roleNames.map((role) => (
                          <Badge key={role} variant="secondary" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.employment?.department || "-"}</p>
                        <p className="text-sm text-muted-foreground">{user.employment?.position || "-"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.employment?.baseSalary ? (
                        <div>
                          <p className="font-medium">{formatCurrency(user.employment.baseSalary)}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {user.employment.payrollFrequency === "monthly" ? "Mensual" : 
                             user.employment.payrollFrequency === "biweekly" ? "Quincenal" : "Semanal"}
                          </p>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-medium", statusConfig[user.status].className)}
                      >
                        {statusConfig[user.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Usuario
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Key className="h-4 w-4 mr-2" />
                            Resetear Contraseña
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Ver Permisos
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                            {user.status === "active" ? (
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
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
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

      {/* Modal de Usuario */}
      <UserFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </MainLayout>
  );
}
