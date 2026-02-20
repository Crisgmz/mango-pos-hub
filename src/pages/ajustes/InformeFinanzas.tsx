import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const rows = [
  { concept: "Ventas netas", amount: 336800, kind: "Ingreso" },
  { concept: "Compras", amount: 169800, kind: "Egreso" },
  { concept: "Nomina", amount: 72000, kind: "Egreso" },
  { concept: "Servicios", amount: 18000, kind: "Egreso" },
];

export default function InformeFinanzas() {
  const navigate = useNavigate();
  const ingresos = rows.filter((r) => r.kind === "Ingreso").reduce((a, r) => a + r.amount, 0);
  const egresos = rows.filter((r) => r.kind === "Egreso").reduce((a, r) => a + r.amount, 0);
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => navigate('/ajustes')}><ArrowLeft className="h-5 w-5" /></Button><div className="flex-1"><h1 className="text-2xl font-bold">Informe de Finanzas</h1><p className="text-muted-foreground">Resumen financiero de ingresos, egresos y utilidad</p></div><Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button></div>
        <Card><CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-3"><Input type="date" defaultValue="2026-02-01" /><Input type="date" defaultValue="2026-02-20" /><Input placeholder="Centro de costo" defaultValue="General" /></CardContent></Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Ingresos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">RD$ {ingresos.toLocaleString()}</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Egresos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-destructive">RD$ {egresos.toLocaleString()}</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Utilidad</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">RD$ {(ingresos-egresos).toLocaleString()}</p></CardContent></Card></div>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Desglose</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Concepto</TableHead><TableHead>Tipo</TableHead><TableHead>Monto</TableHead></TableRow></TableHeader><TableBody>{rows.map((r)=><TableRow key={r.concept}><TableCell>{r.concept}</TableCell><TableCell>{r.kind}</TableCell><TableCell>RD$ {r.amount.toLocaleString()}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
      </div>
    </MainLayout>
  );
}
