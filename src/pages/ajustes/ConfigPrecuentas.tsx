import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Receipt, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ConfigPrecuentas() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    showLogo: true,
    showBusinessName: true,
    businessName: "Restaurante Demo",
    showRNC: true,
    rnc: "123-45678-9",
    showAddress: true,
    address: "Av. Principal #123, Santo Domingo",
    showPhone: true,
    phone: "809-555-0123",
    showTax: true,
    showSubtotal: true,
    showTip: true,
    tipPercentage: 10,
    showWaiter: true,
    showTable: true,
    footerMessage: "¡Gracias por su visita!",
    showQR: false,
  });

  const handleSave = () => toast.success("Configuración de precuentas guardada");

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Configuración de Precuentas</h1>
            <p className="text-muted-foreground">Formato de precuentas</p>
          </div>
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Guardar</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" />Encabezado</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Mostrar logo</Label>
                <Switch checked={config.showLogo} onCheckedChange={v => setConfig({ ...config, showLogo: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Mostrar nombre del negocio</Label>
                <Switch checked={config.showBusinessName} onCheckedChange={v => setConfig({ ...config, showBusinessName: v })} />
              </div>
              <div className="space-y-2"><Label>Nombre del negocio</Label><Input value={config.businessName} onChange={e => setConfig({ ...config, businessName: e.target.value })} /></div>
              <div className="flex items-center justify-between">
                <Label>Mostrar RNC</Label>
                <Switch checked={config.showRNC} onCheckedChange={v => setConfig({ ...config, showRNC: v })} />
              </div>
              <div className="space-y-2"><Label>RNC</Label><Input value={config.rnc} onChange={e => setConfig({ ...config, rnc: e.target.value })} /></div>
              <div className="space-y-2"><Label>Dirección</Label><Input value={config.address} onChange={e => setConfig({ ...config, address: e.target.value })} /></div>
              <div className="space-y-2"><Label>Teléfono</Label><Input value={config.phone} onChange={e => setConfig({ ...config, phone: e.target.value })} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Detalles y Pie</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Mostrar subtotal</Label>
                <Switch checked={config.showSubtotal} onCheckedChange={v => setConfig({ ...config, showSubtotal: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Mostrar ITBIS (18%)</Label>
                <Switch checked={config.showTax} onCheckedChange={v => setConfig({ ...config, showTax: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Mostrar propina sugerida</Label>
                <Switch checked={config.showTip} onCheckedChange={v => setConfig({ ...config, showTip: v })} />
              </div>
              {config.showTip && (
                <div className="space-y-2"><Label>% Propina</Label><Input type="number" value={config.tipPercentage} onChange={e => setConfig({ ...config, tipPercentage: Number(e.target.value) })} /></div>
              )}
              <div className="flex items-center justify-between">
                <Label>Mostrar mesero</Label>
                <Switch checked={config.showWaiter} onCheckedChange={v => setConfig({ ...config, showWaiter: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Mostrar mesa</Label>
                <Switch checked={config.showTable} onCheckedChange={v => setConfig({ ...config, showTable: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Mostrar código QR</Label>
                <Switch checked={config.showQR} onCheckedChange={v => setConfig({ ...config, showQR: v })} />
              </div>
              <div className="space-y-2"><Label>Mensaje de pie</Label><Textarea value={config.footerMessage} onChange={e => setConfig({ ...config, footerMessage: e.target.value })} /></div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader><CardTitle>Vista Previa</CardTitle></CardHeader>
            <CardContent>
              <div className="max-w-xs mx-auto border border-dashed border-border rounded-lg p-4 font-mono text-xs space-y-2">
                {config.showBusinessName && <div className="text-center font-bold text-sm">{config.businessName}</div>}
                {config.showRNC && <div className="text-center">RNC: {config.rnc}</div>}
                {config.showAddress && <div className="text-center">{config.address}</div>}
                {config.showPhone && <div className="text-center">Tel: {config.phone}</div>}
                <div className="border-t border-dashed border-border" />
                <div className="text-center font-bold">PRE-CUENTA</div>
                {config.showTable && <div>Mesa: 5</div>}
                {config.showWaiter && <div>Mesero: Juan Pérez</div>}
                <div>Fecha: 19/02/2026 10:30 AM</div>
                <div className="border-t border-dashed border-border" />
                <div className="flex justify-between"><span>2x Hamburguesa</span><span>RD$ 500</span></div>
                <div className="flex justify-between"><span>1x Papas Fritas</span><span>RD$ 150</span></div>
                <div className="flex justify-between"><span>1x Refresco</span><span>RD$ 100</span></div>
                <div className="border-t border-dashed border-border" />
                {config.showSubtotal && <div className="flex justify-between"><span>Subtotal:</span><span>RD$ 750</span></div>}
                {config.showTax && <div className="flex justify-between"><span>ITBIS (18%):</span><span>RD$ 135</span></div>}
                <div className="flex justify-between font-bold"><span>TOTAL:</span><span>RD$ 885</span></div>
                {config.showTip && <div className="flex justify-between text-muted-foreground"><span>Propina sugerida ({config.tipPercentage}%):</span><span>RD$ {Math.round(885 * config.tipPercentage / 100)}</span></div>}
                {config.footerMessage && <>
                  <div className="border-t border-dashed border-border" />
                  <div className="text-center">{config.footerMessage}</div>
                </>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
