import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, BarChart3, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LiveSale {
  id: string;
  time: string;
  channel: "Salon" | "Delivery" | "Rapida";
  ticket: string;
  amount: number;
  cashier: string;
  status: "Cobrada" | "En proceso";
}

const initialSales: LiveSale[] = [
  { id: "mv1", time: "10:20", channel: "Salon", ticket: "T-1201", amount: 1850, cashier: "Lucia", status: "Cobrada" },
  { id: "mv2", time: "10:22", channel: "Delivery", ticket: "D-402", amount: 1220, cashier: "Pedro", status: "En proceso" },
  { id: "mv3", time: "10:24", channel: "Rapida", ticket: "R-91", amount: 340, cashier: "Maria", status: "Cobrada" },
  { id: "mv4", time: "10:26", channel: "Salon", ticket: "T-1202", amount: 910, cashier: "Lucia", status: "En proceso" },
];

export default function MonitorVentas() {
  const navigate = useNavigate();
  const [sales] = useState<LiveSale[]>(initialSales);
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState("all");

  const filtered = sales.filter((sale) => {
    const byChannel = channel === "all" ? true : sale.channel === channel;
    const q = search.toLowerCase();
    const bySearch = sale.ticket.toLowerCase().includes(q) || sale.cashier.toLowerCase().includes(q);
    return byChannel && bySearch;
  });

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Monitor de Ventas</h1>
            <p className="text-muted-foreground">Visualizacion operativa en tiempo real</p>
          </div>
          <Button variant="outline" onClick={() => toast.success("Datos actualizados")}><RefreshCw className="h-4 w-4 mr-2" />Refrescar</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Transacciones</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{filtered.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total monitor</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">RD$ {filtered.reduce((acc, sale) => acc + sale.amount, 0).toLocaleString()}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Cobradas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">{filtered.filter((sale) => sale.status === "Cobrada").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">En proceso</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-warning">{filtered.filter((sale) => sale.status === "En proceso").length}</p></CardContent></Card>
        </div>

        <Card>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Buscar por ticket o cajero" value={search} onChange={(e) => setSearch(e.target.value)} className="md:col-span-2" />
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los canales</SelectItem>
                <SelectItem value="Salon">Salon</SelectItem>
                <SelectItem value="Delivery">Delivery</SelectItem>
                <SelectItem value="Rapida">Rapida</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Actividad reciente</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Hora</TableHead><TableHead>Canal</TableHead><TableHead>Ticket</TableHead><TableHead>Monto</TableHead><TableHead>Cajero</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.time}</TableCell>
                    <TableCell><Badge variant="secondary">{sale.channel}</Badge></TableCell>
                    <TableCell>{sale.ticket}</TableCell>
                    <TableCell>RD$ {sale.amount.toLocaleString()}</TableCell>
                    <TableCell>{sale.cashier}</TableCell>
                    <TableCell><Badge variant={sale.status === "Cobrada" ? "default" : "secondary"}>{sale.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
