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
import { ArrowLeft, FileText, Plus, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface NcfSeries {
  id: string;
  type: string;
  prefix: string;
  from: number;
  to: number;
  current: number;
  active: boolean;
}

const initialSeries: NcfSeries[] = [
  { id: "n1", type: "Factura de Crédito Fiscal", prefix: "B01", from: 100000001, to: 100000500, current: 100000120, active: true },
  { id: "n2", type: "Consumidor Final", prefix: "B02", from: 200000001, to: 200000900, current: 200000411, active: true },
  { id: "n3", type: "Nota de Crédito", prefix: "B04", from: 400000001, to: 400000200, current: 400000018, active: false },
];

export default function ConfigCreditoFiscal() {
  const navigate = useNavigate();
  const [series, setSeries] = useState<NcfSeries[]>(initialSeries);
  const [ecfEnabled, setEcfEnabled] = useState(false);
  const [validateBeforePrint, setValidateBeforePrint] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    type: "",
    prefix: "",
    from: 0,
    to: 0,
    current: 0,
    active: true,
  });

  const saveConfig = () => {
    toast.success("Configuracion fiscal guardada");
  };

  const addSeries = () => {
    if (!form.type.trim() || !form.prefix.trim()) {
      toast.error("Tipo y prefijo requeridos");
      return;
    }
    if (form.from > form.to || form.current < form.from || form.current > form.to) {
      toast.error("Rango de secuencia invalido");
      return;
    }

    setSeries((prev) => [...prev, { id: `n${Date.now()}`, ...form }]);
    setIsOpen(false);
    setForm({ type: "", prefix: "", from: 0, to: 0, current: 0, active: true });
    toast.success("Serie fiscal agregada");
  };

  const toggleSeries = (id: string) => {
    setSeries((prev) => prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item)));
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Configuracion de Credito Fiscal</h1>
            <p className="text-muted-foreground">NCF, secuencias y validaciones DGII</p>
          </div>
          <Button variant="outline" onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Nueva serie</Button>
          <Button onClick={saveConfig}><Save className="h-4 w-4 mr-2" />Guardar</Button>
        </div>

        <Card>
          <CardHeader><CardTitle>Ajustes fiscales</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-md border px-3 py-2"><Label>Habilitar e-CF</Label><Switch checked={ecfEnabled} onCheckedChange={setEcfEnabled} /></div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2"><Label>Validar NCF antes de imprimir</Label><Switch checked={validateBeforePrint} onCheckedChange={setValidateBeforePrint} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Series NCF</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Prefijo</TableHead>
                  <TableHead>Desde</TableHead>
                  <TableHead>Hasta</TableHead>
                  <TableHead>Actual</TableHead>
                  <TableHead>Disponibles</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[120px]">Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {series.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.type}</TableCell>
                    <TableCell className="font-medium">{item.prefix}</TableCell>
                    <TableCell>{item.from}</TableCell>
                    <TableCell>{item.to}</TableCell>
                    <TableCell>{item.current}</TableCell>
                    <TableCell><Badge variant="secondary">{item.to - item.current}</Badge></TableCell>
                    <TableCell><Badge variant={item.active ? "default" : "secondary"}>{item.active ? "Activa" : "Inactiva"}</Badge></TableCell>
                    <TableCell><Button variant="outline" size="sm" onClick={() => toggleSeries(item.id)}>{item.active ? "Desactivar" : "Activar"}</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nueva serie fiscal</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 md:col-span-2"><Label>Tipo de comprobante</Label><Input value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Prefijo</Label><Input value={form.prefix} onChange={(e) => setForm((prev) => ({ ...prev, prefix: e.target.value.toUpperCase() }))} /></div>
              <div className="space-y-2"><Label>Actual</Label><Input type="number" min={0} value={form.current} onChange={(e) => setForm((prev) => ({ ...prev, current: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Desde</Label><Input type="number" min={0} value={form.from} onChange={(e) => setForm((prev) => ({ ...prev, from: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Hasta</Label><Input type="number" min={0} value={form.to} onChange={(e) => setForm((prev) => ({ ...prev, to: Number(e.target.value) }))} /></div>
              <div className="space-y-2 flex items-center justify-between rounded-md border px-3 py-2 md:col-span-2"><Label>Activa</Label><Switch checked={form.active} onCheckedChange={(value) => setForm((prev) => ({ ...prev, active: value }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={addSeries}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
