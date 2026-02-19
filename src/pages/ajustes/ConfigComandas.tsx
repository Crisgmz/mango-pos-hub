import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ClipboardList, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ConfigComandas() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    autoprint: true,
    showPrices: false,
    showNotes: true,
    groupByCategory: true,
    fontSize: "medium",
    headerText: "COMANDA DE COCINA",
    footerText: "",
    showDateTime: true,
    showWaiter: true,
    showTable: true,
    copiesCount: 1,
    soundAlert: true,
  });

  const handleSave = () => {
    toast.success("Configuración de comandas guardada");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Configuración de Comandas</h1>
            <p className="text-muted-foreground">Formato y comportamiento de comandas</p>
          </div>
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Guardar</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" />Impresión</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div><Label>Imprimir automáticamente</Label><p className="text-xs text-muted-foreground">Al confirmar una orden</p></div>
                <Switch checked={config.autoprint} onCheckedChange={v => setConfig({ ...config, autoprint: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Mostrar precios</Label><p className="text-xs text-muted-foreground">En la comanda impresa</p></div>
                <Switch checked={config.showPrices} onCheckedChange={v => setConfig({ ...config, showPrices: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Mostrar notas</Label><p className="text-xs text-muted-foreground">Notas especiales del cliente</p></div>
                <Switch checked={config.showNotes} onCheckedChange={v => setConfig({ ...config, showNotes: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Agrupar por categoría</Label><p className="text-xs text-muted-foreground">Organizar ítems por categoría</p></div>
                <Switch checked={config.groupByCategory} onCheckedChange={v => setConfig({ ...config, groupByCategory: v })} />
              </div>
              <div className="space-y-2">
                <Label>Cantidad de copias</Label>
                <Input type="number" min={1} max={5} value={config.copiesCount} onChange={e => setConfig({ ...config, copiesCount: Number(e.target.value) })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Contenido</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Texto de encabezado</Label>
                <Input value={config.headerText} onChange={e => setConfig({ ...config, headerText: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Texto de pie</Label>
                <Input value={config.footerText} onChange={e => setConfig({ ...config, footerText: e.target.value })} placeholder="Opcional" />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Mostrar fecha y hora</Label></div>
                <Switch checked={config.showDateTime} onCheckedChange={v => setConfig({ ...config, showDateTime: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Mostrar mesero</Label></div>
                <Switch checked={config.showWaiter} onCheckedChange={v => setConfig({ ...config, showWaiter: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Mostrar mesa</Label></div>
                <Switch checked={config.showTable} onCheckedChange={v => setConfig({ ...config, showTable: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Alerta sonora</Label><p className="text-xs text-muted-foreground">Al recibir nueva comanda</p></div>
                <Switch checked={config.soundAlert} onCheckedChange={v => setConfig({ ...config, soundAlert: v })} />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader><CardTitle>Vista Previa</CardTitle></CardHeader>
            <CardContent>
              <div className="max-w-xs mx-auto border border-dashed border-border rounded-lg p-4 font-mono text-xs space-y-2">
                <div className="text-center font-bold">{config.headerText}</div>
                <div className="border-t border-dashed border-border" />
                {config.showDateTime && <div>Fecha: 19/02/2026 10:30 AM</div>}
                {config.showWaiter && <div>Mesero: Juan Pérez</div>}
                {config.showTable && <div>Mesa: 5</div>}
                <div className="border-t border-dashed border-border" />
                <div className="space-y-1">
                  <div className="flex justify-between"><span>2x Hamburguesa Clásica</span>{config.showPrices && <span>RD$ 500</span>}</div>
                  {config.showNotes && <div className="text-muted-foreground pl-4">→ Sin cebolla</div>}
                  <div className="flex justify-between"><span>1x Papas Fritas</span>{config.showPrices && <span>RD$ 150</span>}</div>
                  <div className="flex justify-between"><span>1x Ensalada César</span>{config.showPrices && <span>RD$ 250</span>}</div>
                </div>
                {config.footerText && <>
                  <div className="border-t border-dashed border-border" />
                  <div className="text-center">{config.footerText}</div>
                </>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
