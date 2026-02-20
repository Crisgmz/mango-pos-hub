import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Warehouse } from "lucide-react";
import { useNavigate } from "react-router-dom";

const rows = [
  { product: "Arroz Premium 25lb", warehouse: "Principal", stock: 45, min: 20, value: 51750 },
  { product: "Aceite Vegetal 1L", warehouse: "Principal", stock: 12, min: 18, value: 1560 },
  { product: "Pechuga de Pollo", warehouse: "Sucursal Norte", stock: 32, min: 25, value: 6720 },
  { product: "Queso Mozzarella", warehouse: "Sucursal Este", stock: 8, min: 10, value: 2240 },
];

export default function InformeInventario() {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => navigate('/ajustes')}><ArrowLeft className="h-5 w-5" /></Button><div className="flex-1"><h1 className="text-2xl font-bold">Informe de Inventario</h1><p className="text-muted-foreground">Stock, valor de inventario y alertas de reposicion</p></div><Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button></div>
        <Card><CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-3"><Input placeholder="Producto" /><Input placeholder="Almacen" defaultValue="Todos" /><Input type="date" defaultValue="2026-02-20" /></CardContent></Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Items</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{rows.length}</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Bajo minimo</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-destructive">{rows.filter((r)=>r.stock<r.min).length}</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Valor</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">RD$ {rows.reduce((a,r)=>a+r.value,0).toLocaleString()}</p></CardContent></Card></div>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Warehouse className="h-5 w-5" />Detalle de stock</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Producto</TableHead><TableHead>Almacen</TableHead><TableHead>Stock</TableHead><TableHead>Minimo</TableHead><TableHead>Valor</TableHead></TableRow></TableHeader><TableBody>{rows.map((r)=><TableRow key={r.product+r.warehouse}><TableCell>{r.product}</TableCell><TableCell>{r.warehouse}</TableCell><TableCell><Badge variant={r.stock<r.min?"destructive":"secondary"}>{r.stock}</Badge></TableCell><TableCell>{r.min}</TableCell><TableCell>RD$ {r.value.toLocaleString()}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
      </div>
    </MainLayout>
  );
}
