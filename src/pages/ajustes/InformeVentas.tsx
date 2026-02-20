import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const rows = [
  { date: "2026-02-19", tickets: 84, gross: 125400, discounts: 6200, net: 119200 },
  { date: "2026-02-18", tickets: 76, gross: 118100, discounts: 5400, net: 112700 },
  { date: "2026-02-17", tickets: 70, gross: 109800, discounts: 4900, net: 104900 },
];

export default function InformeVentas() {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1"><h1 className="text-2xl font-bold">Informe de Ventas</h1><p className="text-muted-foreground">Analisis por periodo y rendimiento comercial</p></div>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button>
        </div>
        <Card><CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-3"><Input type="date" defaultValue="2026-02-01" /><Input type="date" defaultValue="2026-02-20" /><Input placeholder="Sucursal / canal" defaultValue="Todas" /></CardContent></Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Ventas netas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">RD$ {rows.reduce((a, r) => a + r.net, 0).toLocaleString()}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Tickets</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{rows.reduce((a, r) => a + r.tickets, 0)}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Ticket promedio</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">RD$ {Math.round(rows.reduce((a, r) => a + r.net, 0) / rows.reduce((a, r) => a + r.tickets, 1)).toLocaleString()}</p></CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" />Detalle diario</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Tickets</TableHead><TableHead>Bruto</TableHead><TableHead>Descuentos</TableHead><TableHead>Neto</TableHead></TableRow></TableHeader><TableBody>{rows.map((r)=> <TableRow key={r.date}><TableCell>{r.date}</TableCell><TableCell>{r.tickets}</TableCell><TableCell>RD$ {r.gross.toLocaleString()}</TableCell><TableCell>RD$ {r.discounts.toLocaleString()}</TableCell><TableCell>RD$ {r.net.toLocaleString()}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
      </div>
    </MainLayout>
  );
}
