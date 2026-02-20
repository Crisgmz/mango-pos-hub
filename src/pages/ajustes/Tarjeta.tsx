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
import { ArrowLeft, CreditCard, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Terminal {
  id: string;
  name: string;
  provider: string;
  commission: number;
  allowsInstallments: boolean;
  active: boolean;
}

const initialTerminals: Terminal[] = [
  { id: "t1", name: "Verifone Principal", provider: "CardNet", commission: 3.25, allowsInstallments: false, active: true },
  { id: "t2", name: "Azul POS Barra", provider: "AZUL", commission: 2.95, allowsInstallments: true, active: true },
  { id: "t3", name: "Datafono Secundario", provider: "Popular", commission: 3.45, allowsInstallments: false, active: false },
];

export default function Tarjeta() {
  const navigate = useNavigate();
  const [terminals, setTerminals] = useState<Terminal[]>(initialTerminals);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    provider: "CardNet",
    commission: 0,
    allowsInstallments: false,
    active: true,
  });

  const createTerminal = () => {
    if (!form.name.trim()) {
      toast.error("Nombre del terminal requerido");
      return;
    }

    setTerminals((prev) => [...prev, { id: `t${Date.now()}`, ...form }]);
    setIsOpen(false);
    setForm({ name: "", provider: "CardNet", commission: 0, allowsInstallments: false, active: true });
    toast.success("Terminal de tarjeta creado");
  };

  const toggleActive = (id: string) => {
    setTerminals((prev) => prev.map((terminal) => (terminal.id === id ? { ...terminal, active: !terminal.active } : terminal)));
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Tarjeta</h1>
            <p className="text-muted-foreground">Configuracion de pagos con tarjeta y terminales</p>
          </div>
          <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Nuevo terminal</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Terminales</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{terminals.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Activos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">{terminals.filter((terminal) => terminal.active).length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Comision promedio</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{(terminals.reduce((acc, terminal) => acc + terminal.commission, 0) / terminals.length).toFixed(2)}%</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Terminales configurados</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Terminal</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Comision</TableHead>
                  <TableHead>Cuotas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[120px]">Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {terminals.map((terminal) => (
                  <TableRow key={terminal.id}>
                    <TableCell className="font-medium">{terminal.name}</TableCell>
                    <TableCell>{terminal.provider}</TableCell>
                    <TableCell>{terminal.commission}%</TableCell>
                    <TableCell><Badge variant="secondary">{terminal.allowsInstallments ? "Permitido" : "No"}</Badge></TableCell>
                    <TableCell><Badge variant={terminal.active ? "default" : "secondary"}>{terminal.active ? "Activo" : "Inactivo"}</Badge></TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => toggleActive(terminal.id)}>
                        {terminal.active ? "Desactivar" : "Activar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo terminal de tarjeta</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 md:col-span-2"><Label>Nombre terminal</Label><Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} /></div>
              <div className="space-y-2">
                <Label>Proveedor</Label>
                <Select value={form.provider} onValueChange={(value) => setForm((prev) => ({ ...prev, provider: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CardNet">CardNet</SelectItem>
                    <SelectItem value="AZUL">AZUL</SelectItem>
                    <SelectItem value="Popular">Popular</SelectItem>
                    <SelectItem value="Banreservas">Banreservas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Comision (%)</Label><Input type="number" min={0} step="0.01" value={form.commission} onChange={(e) => setForm((prev) => ({ ...prev, commission: Number(e.target.value) }))} /></div>
              <div className="space-y-2 flex items-center justify-between md:col-span-2 rounded-md border px-3 py-2"><Label>Permitir cuotas</Label><Switch checked={form.allowsInstallments} onCheckedChange={(value) => setForm((prev) => ({ ...prev, allowsInstallments: value }))} /></div>
              <div className="space-y-2 flex items-center justify-between md:col-span-2 rounded-md border px-3 py-2"><Label>Activo</Label><Switch checked={form.active} onCheckedChange={(value) => setForm((prev) => ({ ...prev, active: value }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={createTerminal}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
