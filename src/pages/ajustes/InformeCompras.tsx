import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

const rows = [
  { supplier: "Distribuidora Centro", invoices: 8, amount: 82400, paid: 62000, pending: 20400 },
  { supplier: "Alimentos Caribe", invoices: 6, amount: 59300, paid: 59300, pending: 0 },
  { supplier: "Lacteos Nacional", invoices: 4, amount: 28100, paid: 14300, pending: 13800 },
];

export default function InformeCompras() {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => navigate('/ajustes')}><ArrowLeft className="h-5 w-5" /></Button><div className="flex-1"><h1 className="text-2xl font-bold">Informe de Compras</h1><p className="text-muted-foreground">Consolidado por proveedor y estado de pago</p></div><Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button></div>
        <Card><CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-3"><Input type="date" defaultValue="2026-02-01" /><Input type="date" defaultValue="2026-02-20" /><Input placeholder="Proveedor" defaultValue="Todos" /></CardContent></Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total compras</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">RD$ {rows.reduce((a,r)=>a+r.amount,0).toLocaleString()}</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pagado</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">RD$ {rows.reduce((a,r)=>a+r.paid,0).toLocaleString()}</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pendiente</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-destructive">RD$ {rows.reduce((a,r)=>a+r.pending,0).toLocaleString()}</p></CardContent></Card></div>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" />Detalle por proveedor</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Proveedor</TableHead><TableHead>Facturas</TableHead><TableHead>Monto</TableHead><TableHead>Pagado</TableHead><TableHead>Pendiente</TableHead></TableRow></TableHeader><TableBody>{rows.map((r)=><TableRow key={r.supplier}><TableCell>{r.supplier}</TableCell><TableCell>{r.invoices}</TableCell><TableCell>RD$ {r.amount.toLocaleString()}</TableCell><TableCell>RD$ {r.paid.toLocaleString()}</TableCell><TableCell>RD$ {r.pending.toLocaleString()}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
      </div>
    </MainLayout>
  );
}
