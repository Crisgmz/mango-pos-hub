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
import { ArrowLeft, Plus, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Integration {
  id: string;
  platform: string;
  account: string;
  syncCustomers: boolean;
  syncCampaigns: boolean;
  active: boolean;
}

const initialIntegrations: Integration[] = [
  { id: "m1", platform: "Meta Ads", account: "Mango POS RD", syncCustomers: true, syncCampaigns: true, active: true },
  { id: "m2", platform: "Mailchimp", account: "mango-hub-list", syncCustomers: true, syncCampaigns: false, active: true },
  { id: "m3", platform: "Google Ads", account: "GC-112299", syncCustomers: false, syncCampaigns: true, active: false },
];

export default function IntegracionMarketing() {
  const navigate = useNavigate();
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    platform: "",
    account: "",
    syncCustomers: true,
    syncCampaigns: true,
    active: true,
  });

  const addIntegration = () => {
    if (!form.platform.trim() || !form.account.trim()) {
      toast.error("Plataforma y cuenta requeridas");
      return;
    }

    setIntegrations((prev) => [...prev, { id: `m${Date.now()}`, ...form }]);
    setIsOpen(false);
    setForm({ platform: "", account: "", syncCustomers: true, syncCampaigns: true, active: true });
    toast.success("Integracion creada");
  };

  const toggleActive = (id: string) => {
    setIntegrations((prev) => prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item)));
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Integracion con Marketing</h1>
            <p className="text-muted-foreground">Conexion con canales de campañas y automatizacion</p>
          </div>
          <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Nueva integracion</Button>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" />Canales integrados</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Cuenta</TableHead>
                  <TableHead>Sync clientes</TableHead>
                  <TableHead>Sync campañas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[120px]">Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {integrations.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.platform}</TableCell>
                    <TableCell>{item.account}</TableCell>
                    <TableCell><Badge variant="secondary">{item.syncCustomers ? "Si" : "No"}</Badge></TableCell>
                    <TableCell><Badge variant="secondary">{item.syncCampaigns ? "Si" : "No"}</Badge></TableCell>
                    <TableCell><Badge variant={item.active ? "default" : "secondary"}>{item.active ? "Activo" : "Inactivo"}</Badge></TableCell>
                    <TableCell><Button variant="outline" size="sm" onClick={() => toggleActive(item.id)}>{item.active ? "Desactivar" : "Activar"}</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nueva integracion</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-2"><Label>Plataforma</Label><Input value={form.platform} onChange={(e) => setForm((prev) => ({ ...prev, platform: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Cuenta</Label><Input value={form.account} onChange={(e) => setForm((prev) => ({ ...prev, account: e.target.value }))} /></div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2"><Label>Sincronizar clientes</Label><Switch checked={form.syncCustomers} onCheckedChange={(value) => setForm((prev) => ({ ...prev, syncCustomers: value }))} /></div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2"><Label>Sincronizar campañas</Label><Switch checked={form.syncCampaigns} onCheckedChange={(value) => setForm((prev) => ({ ...prev, syncCampaigns: value }))} /></div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2"><Label>Activo</Label><Switch checked={form.active} onCheckedChange={(value) => setForm((prev) => ({ ...prev, active: value }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={addIntegration}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
