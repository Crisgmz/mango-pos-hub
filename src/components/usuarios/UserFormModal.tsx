import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  UserFormData,
  DEFAULT_ROLES,
  DEPARTMENTS,
  POSITIONS,
  AFP_PROVIDERS,
  ARS_PROVIDERS,
  BANKS_RD,
  RD_DEDUCTION_RATES,
} from "@/types/users";
import { User as UserIcon, Briefcase, DollarSign, Shield, Heart } from "lucide-react";

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (data: Partial<User>) => void;
}

const initialFormData: UserFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  alternatePhone: "",
  cedula: "",
  dateOfBirth: "",
  gender: undefined,
  address: "",
  city: "",
  password: "",
  confirmPassword: "",
  pin: "",
  mustChangePassword: true,
  roles: [],
  status: "active",
  hireDate: "",
  contractType: "full_time",
  department: "",
  position: "",
  workSchedule: "",
  supervisorId: "",
  baseSalary: 0,
  currency: "DOP",
  payrollFrequency: "biweekly",
  bankName: "",
  bankAccountNumber: "",
  bankAccountType: "savings",
  afpEnabled: true,
  afpProvider: "AFP Popular",
  arsEnabled: true,
  arsProvider: "ARS Humano",
  isrEnabled: false,
  hasTransportAllowance: false,
  transportAllowance: 0,
  hasFoodAllowance: false,
  foodAllowance: 0,
  vacationDaysPerYear: 14,
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
};

export function UserFormModal({ open, onOpenChange, user, onSave }: UserFormModalProps) {
  const [formData, setFormData] = useState<UserFormData>(
    user
      ? {
          ...initialFormData,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          alternatePhone: user.alternatePhone || "",
          cedula: user.cedula || "",
          status: user.status,
          roles: user.roles,
          department: user.employment?.department || "",
          position: user.employment?.position || "",
          baseSalary: user.employment?.baseSalary || 0,
          payrollFrequency: user.employment?.payrollFrequency || "biweekly",
          contractType: user.employment?.contractType || "full_time",
          afpEnabled: user.employment?.afpEnabled ?? true,
          afpProvider: user.employment?.afpProvider || "AFP Popular",
          arsEnabled: user.employment?.arsEnabled ?? true,
          arsProvider: user.employment?.arsProvider || "ARS Humano",
          hasFoodAllowance: user.employment?.hasFoodAllowance ?? false,
          foodAllowance: user.employment?.foodAllowance || 0,
          hasTransportAllowance: user.employment?.hasTransportAllowance ?? false,
          transportAllowance: user.employment?.transportAllowance || 0,
        }
      : initialFormData
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      alternatePhone: formData.alternatePhone,
      cedula: formData.cedula,
      status: formData.status,
      roles: formData.roles,
      roleNames: formData.roles.map((r) => DEFAULT_ROLES.find((dr) => dr.name.toLowerCase() === r)?.name || r),
      mustChangePassword: formData.mustChangePassword,
      employment: {
        hireDate: formData.hireDate ? new Date(formData.hireDate) : new Date(),
        contractType: formData.contractType,
        department: formData.department,
        position: formData.position,
        workSchedule: formData.workSchedule || "",
        baseSalary: formData.baseSalary,
        currency: formData.currency,
        payrollFrequency: formData.payrollFrequency,
        bankName: formData.bankName,
        bankAccountNumber: formData.bankAccountNumber,
        bankAccountType: formData.bankAccountType,
        afpEnabled: formData.afpEnabled,
        afpProvider: formData.afpProvider,
        afpEmployeeRate: RD_DEDUCTION_RATES.afp.employee,
        afpEmployerRate: RD_DEDUCTION_RATES.afp.employer,
        arsEnabled: formData.arsEnabled,
        arsProvider: formData.arsProvider,
        arsEmployeeRate: RD_DEDUCTION_RATES.ars.employee,
        arsEmployerRate: RD_DEDUCTION_RATES.ars.employer,
        isrEnabled: formData.isrEnabled,
        isrRate: 0,
        hasTransportAllowance: formData.hasTransportAllowance,
        transportAllowance: formData.transportAllowance,
        hasFoodAllowance: formData.hasFoodAllowance,
        foodAllowance: formData.foodAllowance,
        vacationDaysPerYear: formData.vacationDaysPerYear,
        vacationDaysUsed: 0,
        vacationDaysRemaining: formData.vacationDaysPerYear,
      },
      emergencyContact: formData.emergencyContactName
        ? {
            name: formData.emergencyContactName,
            relationship: formData.emergencyContactRelationship || "",
            phone: formData.emergencyContactPhone || "",
          }
        : undefined,
    });
  };

  const updateField = <K extends keyof UserFormData>(field: K, value: UserFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{user ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-4">
              <TabsTrigger value="personal" className="gap-1.5 text-xs">
                <UserIcon className="h-3.5 w-3.5" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="trabajo" className="gap-1.5 text-xs">
                <Briefcase className="h-3.5 w-3.5" />
                Trabajo
              </TabsTrigger>
              <TabsTrigger value="salario" className="gap-1.5 text-xs">
                <DollarSign className="h-3.5 w-3.5" />
                Salario
              </TabsTrigger>
              <TabsTrigger value="roles" className="gap-1.5 text-xs">
                <Shield className="h-3.5 w-3.5" />
                Roles
              </TabsTrigger>
              <TabsTrigger value="emergencia" className="gap-1.5 text-xs">
                <Heart className="h-3.5 w-3.5" />
                Emergencia
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] pr-4">
              {/* Tab Personal */}
              <TabsContent value="personal" className="space-y-4 mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cedula">Cédula</Label>
                    <Input
                      id="cedula"
                      value={formData.cedula}
                      onChange={(e) => updateField("cedula", e.target.value)}
                      placeholder="000-0000000-0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Género</Label>
                    <Select value={formData.gender} onValueChange={(v) => updateField("gender", v as "male" | "female" | "other")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Femenino</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                  />
                </div>
                {!user && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        required={!user}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pin">PIN (4-6 dígitos)</Label>
                      <Input
                        id="pin"
                        value={formData.pin}
                        onChange={(e) => updateField("pin", e.target.value)}
                        maxLength={6}
                        placeholder="1234"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Tab Trabajo */}
              <TabsContent value="trabajo" className="space-y-4 mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Departamento *</Label>
                    <Select value={formData.department} onValueChange={(v) => updateField("department", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Posición *</Label>
                    <Select value={formData.position} onValueChange={(v) => updateField("position", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {POSITIONS.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Contrato</Label>
                    <Select value={formData.contractType} onValueChange={(v) => updateField("contractType", v as UserFormData["contractType"])}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_time">Tiempo Completo</SelectItem>
                        <SelectItem value="part_time">Medio Tiempo</SelectItem>
                        <SelectItem value="contractor">Contratista</SelectItem>
                        <SelectItem value="temporary">Temporal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hireDate">Fecha de Ingreso</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => updateField("hireDate", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workSchedule">Horario de Trabajo</Label>
                  <Input
                    id="workSchedule"
                    value={formData.workSchedule}
                    onChange={(e) => updateField("workSchedule", e.target.value)}
                    placeholder="Ej: Lun-Vie 8:00-17:00"
                  />
                </div>
              </TabsContent>

              {/* Tab Salario */}
              <TabsContent value="salario" className="space-y-4 mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseSalary">Salario Base (DOP) *</Label>
                    <Input
                      id="baseSalary"
                      type="number"
                      value={formData.baseSalary}
                      onChange={(e) => updateField("baseSalary", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Frecuencia de Pago</Label>
                    <Select value={formData.payrollFrequency} onValueChange={(v) => updateField("payrollFrequency", v as UserFormData["payrollFrequency"])}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="biweekly">Quincenal</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-medium">Deducciones</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <Checkbox
                        id="afpEnabled"
                        checked={formData.afpEnabled}
                        onCheckedChange={(c) => updateField("afpEnabled", !!c)}
                      />
                      <div className="flex-1">
                        <Label htmlFor="afpEnabled">AFP ({RD_DEDUCTION_RATES.afp.employee}%)</Label>
                        {formData.afpEnabled && (
                          <Select value={formData.afpProvider} onValueChange={(v) => updateField("afpProvider", v)}>
                            <SelectTrigger className="mt-2 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {AFP_PROVIDERS.map((p) => (
                                <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <Checkbox
                        id="arsEnabled"
                        checked={formData.arsEnabled}
                        onCheckedChange={(c) => updateField("arsEnabled", !!c)}
                      />
                      <div className="flex-1">
                        <Label htmlFor="arsEnabled">ARS ({RD_DEDUCTION_RATES.ars.employee}%)</Label>
                        {formData.arsEnabled && (
                          <Select value={formData.arsProvider} onValueChange={(v) => updateField("arsProvider", v)}>
                            <SelectTrigger className="mt-2 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ARS_PROVIDERS.map((p) => (
                                <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-medium">Beneficios</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <Checkbox
                        id="hasTransportAllowance"
                        checked={formData.hasTransportAllowance}
                        onCheckedChange={(c) => updateField("hasTransportAllowance", !!c)}
                      />
                      <div className="flex-1">
                        <Label htmlFor="hasTransportAllowance">Transporte</Label>
                        {formData.hasTransportAllowance && (
                          <Input
                            type="number"
                            className="mt-2 h-8"
                            value={formData.transportAllowance}
                            onChange={(e) => updateField("transportAllowance", Number(e.target.value))}
                            placeholder="Monto"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <Checkbox
                        id="hasFoodAllowance"
                        checked={formData.hasFoodAllowance}
                        onCheckedChange={(c) => updateField("hasFoodAllowance", !!c)}
                      />
                      <div className="flex-1">
                        <Label htmlFor="hasFoodAllowance">Alimentación</Label>
                        {formData.hasFoodAllowance && (
                          <Input
                            type="number"
                            className="mt-2 h-8"
                            value={formData.foodAllowance}
                            onChange={(e) => updateField("foodAllowance", Number(e.target.value))}
                            placeholder="Monto"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-medium">Cuenta Bancaria</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Banco</Label>
                      <Select value={formData.bankName} onValueChange={(v) => updateField("bankName", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {BANKS_RD.map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankAccountNumber">Número de Cuenta</Label>
                      <Input
                        id="bankAccountNumber"
                        value={formData.bankAccountNumber}
                        onChange={(e) => updateField("bankAccountNumber", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Tab Roles */}
              <TabsContent value="roles" className="space-y-4 mt-0">
                <p className="text-sm text-muted-foreground">Selecciona los roles que tendrá este usuario:</p>
                <div className="grid gap-3">
                  {DEFAULT_ROLES.map((role) => (
                    <div
                      key={role.name}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        formData.roles.includes(role.name.toLowerCase())
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => {
                        const roleId = role.name.toLowerCase();
                        const newRoles = formData.roles.includes(roleId)
                          ? formData.roles.filter((r) => r !== roleId)
                          : [...formData.roles, roleId];
                        updateField("roles", newRoles);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={formData.roles.includes(role.name.toLowerCase())} />
                        <div>
                          <p className="font-medium">{role.name}</p>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Tab Emergencia */}
              <TabsContent value="emergencia" className="space-y-4 mt-0">
                <p className="text-sm text-muted-foreground">Información de contacto en caso de emergencia:</p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Nombre del Contacto</Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={(e) => updateField("emergencyContactName", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactRelationship">Relación</Label>
                      <Input
                        id="emergencyContactRelationship"
                        value={formData.emergencyContactRelationship}
                        onChange={(e) => updateField("emergencyContactRelationship", e.target.value)}
                        placeholder="Ej: Esposo/a, Padre, Madre"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactPhone">Teléfono</Label>
                      <Input
                        id="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => updateField("emergencyContactPhone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {user ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
