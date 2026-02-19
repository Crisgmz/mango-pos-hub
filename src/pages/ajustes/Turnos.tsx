import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, Plus, Clock, MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  days: string[];
  active: boolean;
  employees: number;
}

const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const initialShifts: Shift[] = [
  { id: "1", name: "Turno Mañana", startTime: "06:00", endTime: "14:00", days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"], active: true, employees: 5 },
  { id: "2", name: "Turno Tarde", startTime: "14:00", endTime: "22:00", days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"], active: true, employees: 6 },
  { id: "3", name: "Turno Noche", startTime: "22:00", endTime: "06:00", days: ["Vie", "Sáb", "Dom"], active: false, employees: 3 },
];

export default function Turnos() {
  const navigate = useNavigate();
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Shift | null>(null);
  const [form, setForm] = useState({ name: "", startTime: "08:00", endTime: "16:00", days: [] as string[], active: true });

  const resetForm = () => { setForm({ name: "", startTime: "08:00", endTime: "16:00", days: [], active: true }); setEditing(null); };
  const openAdd = () => { resetForm(); setIsModalOpen(true); };
  const openEdit = (s: Shift) => {
    setEditing(s);
    setForm({ name: s.name, startTime: s.startTime, endTime: s.endTime, days: [...s.days], active: s.active });
    setIsModalOpen(true);
  };

  const toggleDay = (day: string) => {
    setForm(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day],
    }));
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("El nombre es requerido"); return; }
    if (form.days.length === 0) { toast.error("Selecciona al menos un día"); return; }
    if (editing) {
      setShifts(prev => prev.map(s => s.id === editing.id ? { ...s, ...form } : s));
      toast.success("Turno actualizado");
    } else {
      setShifts(prev => [...prev, { ...form, id: Date.now().toString(), employees: 0 }]);
      toast.success("Turno creado");
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => { setShifts(prev => prev.filter(s => s.id !== id)); toast.success("Turno eliminado"); };
  const toggleActive = (id: string) => setShifts(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Turnos</h1>
            <p className="text-muted-foreground">Gestión de turnos de trabajo</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Agregar Turno</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Turnos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{shifts.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Turnos Activos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-success">{shifts.filter(s => s.active).length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Empleados Asignados</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-info">{shifts.reduce((s, t) => s + t.employees, 0)}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Turnos Configurados</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Turno</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Días</TableHead>
                  <TableHead>Empleados</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map(shift => (
                  <TableRow key={shift.id}>
                    <TableCell className="font-medium">{shift.name}</TableCell>
                    <TableCell>{shift.startTime} - {shift.endTime}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">{shift.days.map(d => <Badge key={d} variant="outline" className="text-xs">{d}</Badge>)}</div>
                    </TableCell>
                    <TableCell><div className="flex items-center gap-1"><Users className="h-3 w-3" />{shift.employees}</div></TableCell>
                    <TableCell>
                      <Badge variant={shift.active ? "default" : "secondary"} className="cursor-pointer" onClick={() => toggleActive(shift.id)}>
                        {shift.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(shift)}><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(shift.id)}><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {shifts.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No hay turnos configurados</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editing ? "Editar Turno" : "Agregar Turno"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nombre *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Turno Mañana" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Hora inicio</Label><Input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} /></div>
                <div className="space-y-2"><Label>Hora fin</Label><Input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} /></div>
              </div>
              <div className="space-y-2">
                <Label>Días de la semana *</Label>
                <div className="flex gap-2 flex-wrap">
                  {daysOfWeek.map(day => (
                    <Badge key={day} variant={form.days.includes(day) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleDay(day)}>{day}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Activo</Label>
                <Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>{editing ? "Guardar Cambios" : "Crear Turno"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
