import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { ArrowLeft, Plus, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DeviceSession {
  id: string;
  deviceName: string;
  userRole: string;
  lastSync: string;
  status: "Activo" | "Bloqueado";
}

const initialDevices: DeviceSession[] = [
  { id: "d1", deviceName: "Tablet Salon 1", userRole: "Mesero", lastSync: "2026-02-19 10:22", status: "Activo" },
  { id: "d2", deviceName: "POS Movil Delivery", userRole: "Delivery", lastSync: "2026-02-19 09:40", status: "Activo" },
  { id: "d3", deviceName: "App Supervisor", userRole: "Supervisor", lastSync: "2026-02-18 22:10", status: "Bloqueado" },
];

export default function OpcionesApp() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<DeviceSession[]>(initialDevices);
  const [allowOffline, setAllowOffline] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [syncInterval, setSyncInterval] = useState(5);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ deviceName: "", userRole: "Mesero" });

  const addDevice = () => {
    if (!form.deviceName.trim()) {
      toast.error("Nombre del dispositivo requerido");
      return;
    }

    setDevices((prev) => [
      {
        id: `d${Date.now()}`,
        deviceName: form.deviceName,
        userRole: form.userRole,
        lastSync: "2026-02-19 10:30",
        status: "Activo",
      },
      ...prev,
    ]);
    setIsOpen(false);
    setForm({ deviceName: "", userRole: "Mesero" });
    toast.success("Dispositivo autorizado");
  };

  const toggleStatus = (id: string) => {
    setDevices((prev) => prev.map((device) => (device.id === id ? { ...device, status: device.status === "Activo" ? "Bloqueado" : "Activo" } : device)));
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Opciones de APP MangoPOS</h1>
            <p className="text-muted-foreground">Control de sincronizacion y dispositivos moviles</p>
          </div>
          <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Autorizar dispositivo</Button>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5" />Configuracion movil</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between rounded-md border px-3 py-2"><Label>Modo offline</Label><Switch checked={allowOffline} onCheckedChange={setAllowOffline} /></div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2"><Label>Notificaciones push</Label><Switch checked={pushNotifications} onCheckedChange={setPushNotifications} /></div>
            <div className="space-y-2"><Label>Sincronizacion (min)</Label><Input type="number" min={1} value={syncInterval} onChange={(e) => setSyncInterval(Number(e.target.value))} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Dispositivos conectados</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dispositivo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Ult. sync</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[120px]">Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.deviceName}</TableCell>
                    <TableCell>{device.userRole}</TableCell>
                    <TableCell>{device.lastSync}</TableCell>
                    <TableCell><Badge variant={device.status === "Activo" ? "default" : "secondary"}>{device.status}</Badge></TableCell>
                    <TableCell><Button variant="outline" size="sm" onClick={() => toggleStatus(device.id)}>{device.status === "Activo" ? "Bloquear" : "Activar"}</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Autorizar dispositivo</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-2"><Label>Nombre del dispositivo</Label><Input value={form.deviceName} onChange={(e) => setForm((prev) => ({ ...prev, deviceName: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Rol principal</Label><Input value={form.userRole} onChange={(e) => setForm((prev) => ({ ...prev, userRole: e.target.value }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={addDevice}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
