import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, BarChart3, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const rows = [
  { indicator: "Margen bruto", current: 58.4, target: 60, trend: "+1.2" },
  { indicator: "Ticket promedio", current: 1485, target: 1600, trend: "+35" },
  { indicator: "Rotacion inventario", current: 4.1, target: 4.5, trend: "+0.3" },
  { indicator: "Costo sobre ventas", current: 41.6, target: 38, trend: "-0.8" },
  { indicator: "Asistencia personal", current: 92, target: 95, trend: "+1" },
];

export default function Indicadores() {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => navigate('/ajustes')}><ArrowLeft className="h-5 w-5" /></Button><div className="flex-1"><h1 className="text-2xl font-bold">Indicadores Graficos</h1><p className="text-muted-foreground">KPIs ejecutivos para seguimiento del negocio</p></div><Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button></div>
        <Card><CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-3"><Input type="date" defaultValue="2026-02-01" /><Input type="date" defaultValue="2026-02-20" /><Input placeholder="Sucursal" defaultValue="Todas" /></CardContent></Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">KPI en objetivo</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">{rows.filter((r)=>r.current>=r.target).length}</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">KPI fuera objetivo</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-destructive">{rows.filter((r)=>r.current<r.target).length}</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Promedio avance</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{Math.round(rows.reduce((a,r)=>a+Math.min(100,(r.current/r.target)*100),0)/rows.length)}%</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Indicadores</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{rows.length}</p></CardContent></Card></div>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Tablero de indicadores</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Indicador</TableHead><TableHead>Actual</TableHead><TableHead>Meta</TableHead><TableHead>Avance</TableHead><TableHead>Tendencia</TableHead></TableRow></TableHeader><TableBody>{rows.map((r)=>{const p=Math.round((r.current/r.target)*100); return <TableRow key={r.indicator}><TableCell>{r.indicator}</TableCell><TableCell>{r.current}</TableCell><TableCell>{r.target}</TableCell><TableCell><Badge variant={p>=100?"default":"secondary"}>{p}%</Badge></TableCell><TableCell>{r.trend}</TableCell></TableRow>;})}</TableBody></Table></CardContent></Card>
      </div>
    </MainLayout>
  );
}
