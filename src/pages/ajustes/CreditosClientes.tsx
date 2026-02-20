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
import { ArrowLeft, Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ClientCredit {
  id: string;
  client: string;
  phone: string;
  limit: number;
  used: number;
  termsDays: number;
  active: boolean;
}

const initialClients: ClientCredit[] = [
  { id: "cc1", client: "Empresa Alfa", phone: "809-555-2201", limit: 50000, used: 18400, termsDays: 30, active: true },
  { id: "cc2", client: "Oficina Delta", phone: "809-555-2202", limit: 25000, used: 7600, termsDays: 15, active: true },
  { id: "cc3", client: "Colegio Norte", phone: "809-555-2203", limit: 18000, used: 0, termsDays: 20, active: false },
];

export default function CreditosClientes() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientCredit[]>(initialClients);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    client: "",
    phone: "",
    limit: 0,
    used: 0,
    termsDays: 30,
    active: true,
  });

  const createClient = () => {
    if (!form.client.trim()) {
      toast.error("Nombre de cliente requerido");
      return;
    }

    setClients((prev) => [...prev, { id: `cc${Date.now()}`, ...form }]);
    setIsOpen(false);
    setForm({ client: "", phone: "", limit: 0, used: 0, termsDays: 30, active: true });
    toast.success("Cliente de credito agregado");
  };

  const toggleActive = (id: string) => {
    setClients((prev) => prev.map((client) => (client.id === id ? { ...client, active: !client.active } : client)));
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Creditos de Clientes</h1>
            <p className="text-muted-foreground">Perfiles de credito, limites y dias de plazo por cliente</p>
          </div>
          <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Nuevo cliente credito</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Clientes</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{clients.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Linea total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">RD$ {clients.reduce((acc, client) => acc + client.limit, 0).toLocaleString()}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Utilizado</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-warning">RD$ {clients.reduce((acc, client) => acc + client.used, 0).toLocaleString()}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Clientes con credito</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Telefono</TableHead>
                  <TableHead>Limite</TableHead>
                  <TableHead>Utilizado</TableHead>
                  <TableHead>Disponible</TableHead>
                  <TableHead>Plazo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[120px]">Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => {
                  const available = client.limit - client.used;
                  return (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.client}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>RD$ {client.limit.toLocaleString()}</TableCell>
                      <TableCell>RD$ {client.used.toLocaleString()}</TableCell>
                      <TableCell className={available < 0 ? "text-destructive" : "text-success"}>RD$ {available.toLocaleString()}</TableCell>
                      <TableCell>{client.termsDays} dias</TableCell>
                      <TableCell><Badge variant={client.active ? "default" : "secondary"}>{client.active ? "Activo" : "Inactivo"}</Badge></TableCell>
                      <TableCell><Button size="sm" variant="outline" onClick={() => toggleActive(client.id)}>{client.active ? "Desactivar" : "Activar"}</Button></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo cliente de credito</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 md:col-span-2"><Label>Cliente</Label><Input value={form.client} onChange={(e) => setForm((prev) => ({ ...prev, client: e.target.value }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Telefono</Label><Input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Limite de credito</Label><Input type="number" min={0} value={form.limit} onChange={(e) => setForm((prev) => ({ ...prev, limit: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Saldo utilizado</Label><Input type="number" min={0} value={form.used} onChange={(e) => setForm((prev) => ({ ...prev, used: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Plazo (dias)</Label><Input type="number" min={1} value={form.termsDays} onChange={(e) => setForm((prev) => ({ ...prev, termsDays: Number(e.target.value) }))} /></div>
              <div className="space-y-2 flex items-center justify-between rounded-md border px-3 py-2"><Label>Activo</Label><Switch checked={form.active} onCheckedChange={(value) => setForm((prev) => ({ ...prev, active: value }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={createClient}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
