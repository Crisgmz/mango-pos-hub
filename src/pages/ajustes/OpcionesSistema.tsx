import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Cog, Save, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function OpcionesSistema() {
  const navigate = useNavigate();
  const [systemName, setSystemName] = useState("MangoPOS Hub");
  const [timezone, setTimezone] = useState("America/Santo_Domingo");
  const [autoLogout, setAutoLogout] = useState(30);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [requirePinForVoid, setRequirePinForVoid] = useState(true);
  const [enableAuditLogs, setEnableAuditLogs] = useState(true);
  const [dailyBackup, setDailyBackup] = useState(true);
  const [backupHour, setBackupHour] = useState("03:00");
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [maintenanceDate, setMaintenanceDate] = useState("2026-02-25");
  const [maintenanceTime, setMaintenanceTime] = useState("02:00");

  const saveOptions = () => {
    toast.success("Opciones del sistema guardadas");
  };

  const scheduleMaintenance = () => {
    toast.success(`Mantenimiento programado para ${maintenanceDate} ${maintenanceTime}`);
    setMaintenanceOpen(false);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}> <ArrowLeft className="h-5 w-5" /> </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Opciones del Sistema</h1>
            <p className="text-muted-foreground">Configuracion general operativa y de seguridad</p>
          </div>
          <Button variant="outline" onClick={() => setMaintenanceOpen(true)}><Wrench className="h-4 w-4 mr-2" />Programar mantenimiento</Button>
          <Button onClick={saveOptions}><Save className="h-4 w-4 mr-2" />Guardar</Button>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Cog className="h-5 w-5" />General</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Nombre del sistema</Label><Input value={systemName} onChange={(e) => setSystemName(e.target.value)} /></div>
            <div className="space-y-2">
              <Label>Zona horaria</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Santo_Domingo">America/Santo_Domingo</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Seguridad</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Auto logout (minutos)</Label><Input type="number" min={5} value={autoLogout} onChange={(e) => setAutoLogout(Number(e.target.value))} /></div>
            <div className="space-y-2"><Label>Intentos maximos de login</Label><Input type="number" min={1} value={maxLoginAttempts} onChange={(e) => setMaxLoginAttempts(Number(e.target.value))} /></div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2"><Label>PIN obligatorio para anulaciones</Label><Switch checked={requirePinForVoid} onCheckedChange={setRequirePinForVoid} /></div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2"><Label>Registrar logs de auditoria</Label><Switch checked={enableAuditLogs} onCheckedChange={setEnableAuditLogs} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Respaldo</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-md border px-3 py-2"><Label>Backup diario</Label><Switch checked={dailyBackup} onCheckedChange={setDailyBackup} /></div>
            <div className="space-y-2"><Label>Hora de respaldo</Label><Input type="time" value={backupHour} onChange={(e) => setBackupHour(e.target.value)} disabled={!dailyBackup} /></div>
          </CardContent>
        </Card>

        <Dialog open={maintenanceOpen} onOpenChange={setMaintenanceOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Programar ventana de mantenimiento</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={maintenanceDate} onChange={(e) => setMaintenanceDate(e.target.value)} /></div>
              <div className="space-y-2"><Label>Hora</Label><Input type="time" value={maintenanceTime} onChange={(e) => setMaintenanceTime(e.target.value)} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMaintenanceOpen(false)}>Cancelar</Button>
              <Button onClick={scheduleMaintenance}>Programar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
