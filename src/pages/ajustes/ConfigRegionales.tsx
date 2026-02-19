import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Globe, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ConfigRegionales() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    language: "es-DO",
    timezone: "America/Santo_Domingo",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    numberFormat: "1,000.00",
    currencyPosition: "before",
  });

  const handleSave = () => toast.success("Configuraciones regionales guardadas");

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Configuraciones Regionales</h1>
            <p className="text-muted-foreground">Idioma, zona horaria y formato</p>
          </div>
          <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Guardar</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />Idioma y Región</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Idioma</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={config.language} onChange={e => setConfig({ ...config, language: e.target.value })}>
                  <option value="es-DO">Español (República Dominicana)</option>
                  <option value="es-ES">Español (España)</option>
                  <option value="en-US">English (United States)</option>
                  <option value="fr-FR">Français (France)</option>
                  <option value="pt-BR">Português (Brasil)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Zona Horaria</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={config.timezone} onChange={e => setConfig({ ...config, timezone: e.target.value })}>
                  <option value="America/Santo_Domingo">América/Santo Domingo (AST UTC-4)</option>
                  <option value="America/New_York">América/Nueva York (EST UTC-5)</option>
                  <option value="America/Chicago">América/Chicago (CST UTC-6)</option>
                  <option value="America/Bogota">América/Bogotá (COT UTC-5)</option>
                  <option value="Europe/Madrid">Europa/Madrid (CET UTC+1)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Formato de Datos</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Formato de fecha</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={config.dateFormat} onChange={e => setConfig({ ...config, dateFormat: e.target.value })}>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (19/02/2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (02/19/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (2026-02-19)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Formato de hora</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={config.timeFormat} onChange={e => setConfig({ ...config, timeFormat: e.target.value })}>
                  <option value="12h">12 horas (2:30 PM)</option>
                  <option value="24h">24 horas (14:30)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Formato numérico</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={config.numberFormat} onChange={e => setConfig({ ...config, numberFormat: e.target.value })}>
                  <option value="1,000.00">1,000.00 (coma para miles)</option>
                  <option value="1.000,00">1.000,00 (punto para miles)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Posición del símbolo de moneda</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={config.currencyPosition} onChange={e => setConfig({ ...config, currencyPosition: e.target.value })}>
                  <option value="before">Antes del monto (RD$ 1,000)</option>
                  <option value="after">Después del monto (1,000 RD$)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader><CardTitle>Vista Previa</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Fecha</p>
                  <p className="font-medium text-sm">{config.dateFormat === "DD/MM/YYYY" ? "19/02/2026" : config.dateFormat === "MM/DD/YYYY" ? "02/19/2026" : "2026-02-19"}</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Hora</p>
                  <p className="font-medium text-sm">{config.timeFormat === "12h" ? "2:30 PM" : "14:30"}</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Número</p>
                  <p className="font-medium text-sm">{config.numberFormat === "1,000.00" ? "1,500.75" : "1.500,75"}</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Precio</p>
                  <p className="font-medium text-sm">{config.currencyPosition === "before" ? "RD$ 1,500.75" : "1,500.75 RD$"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
