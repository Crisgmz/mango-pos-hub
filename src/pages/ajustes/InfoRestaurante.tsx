import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Building, Plus, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface BusinessHour {
  id: string;
  day: string;
  open: string;
  close: string;
}

const initialHours: BusinessHour[] = [
  { id: "h1", day: "Lunes", open: "08:00", close: "22:00" },
  { id: "h2", day: "Martes", open: "08:00", close: "22:00" },
  { id: "h3", day: "Miercoles", open: "08:00", close: "22:00" },
  { id: "h4", day: "Jueves", open: "08:00", close: "22:00" },
  { id: "h5", day: "Viernes", open: "08:00", close: "23:00" },
  { id: "h6", day: "Sabado", open: "09:00", close: "23:00" },
  { id: "h7", day: "Domingo", open: "09:00", close: "20:00" },
];

export default function InfoRestaurante() {
  const navigate = useNavigate();
  const [name, setName] = useState("Restaurante Demo");
  const [rnc, setRnc] = useState("123-45678-9");
  const [phone, setPhone] = useState("809-555-0000");
  const [email, setEmail] = useState("admin@restaurante.com");
  const [address, setAddress] = useState("Av. Principal #123, Santo Domingo");
  const [hours, setHours] = useState<BusinessHour[]>(initialHours);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ day: "", open: "08:00", close: "22:00" });

  const saveInfo = () => {
    toast.success("Informacion del restaurante guardada");
  };

  const addHour = () => {
    if (!form.day.trim()) {
      toast.error("Dia requerido");
      return;
    }

    setHours((prev) => [...prev, { id: `h${Date.now()}`, ...form }]);
    setModalOpen(false);
    setForm({ day: "", open: "08:00", close: "22:00" });
    toast.success("Horario agregado");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Informacion del Restaurante</h1>
            <p className="text-muted-foreground">Datos legales y operativos del negocio</p>
          </div>
          <Button onClick={saveInfo}><Save className="h-4 w-4 mr-2" />Guardar</Button>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" />Datos generales</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Nombre comercial</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>RNC</Label><Input value={rnc} onChange={(e) => setRnc(e.target.value)} /></div>
            <div className="space-y-2"><Label>Telefono</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <div className="space-y-2"><Label>Correo</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Direccion</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Horario de operaciones</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}><Plus className="h-4 w-4 mr-2" />Agregar</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Dia</TableHead><TableHead>Apertura</TableHead><TableHead>Cierre</TableHead></TableRow></TableHeader>
              <TableBody>
                {hours.map((hour) => (
                  <TableRow key={hour.id}><TableCell>{hour.day}</TableCell><TableCell>{hour.open}</TableCell><TableCell>{hour.close}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Agregar horario</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2"><Label>Dia</Label><Input value={form.day} onChange={(e) => setForm((prev) => ({ ...prev, day: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Apertura</Label><Input type="time" value={form.open} onChange={(e) => setForm((prev) => ({ ...prev, open: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Cierre</Label><Input type="time" value={form.close} onChange={(e) => setForm((prev) => ({ ...prev, close: e.target.value }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button onClick={addHour}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
