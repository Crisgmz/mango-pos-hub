import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoyaltyEvent {
  id: string;
  date: string;
  customer: string;
  type: "Acumulacion" | "Canje" | "Ajuste";
  points: number;
  detail: string;
}

const initialEvents: LoyaltyEvent[] = [
  { id: "he1", date: "2026-02-19", customer: "Ana Perez", type: "Acumulacion", points: 35, detail: "Factura FAC-1201" },
  { id: "he2", date: "2026-02-19", customer: "Carlos Diaz", type: "Canje", points: -120, detail: "Canje por RD$ 120" },
  { id: "he3", date: "2026-02-18", customer: "Marta Lopez", type: "Ajuste", points: 20, detail: "Ajuste manual" },
  { id: "he4", date: "2026-02-17", customer: "Carlos Diaz", type: "Acumulacion", points: 48, detail: "Factura FAC-1189" },
];

export default function HistorialFidelidad() {
  const navigate = useNavigate();
  const [events] = useState<LoyaltyEvent[]>(initialEvents);
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<LoyaltyEvent | null>(null);

  const filtered = events.filter((event) => {
    const byType = typeFilter === "all" ? true : event.type === typeFilter;
    const q = search.toLowerCase();
    const bySearch = event.customer.toLowerCase().includes(q) || event.detail.toLowerCase().includes(q);
    return byType && bySearch;
  });

  const netPoints = useMemo(() => filtered.reduce((acc, event) => acc + event.points, 0), [filtered]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1"><h1 className="text-2xl font-bold">Historial de Fidelidad</h1><p className="text-muted-foreground">Registro completo de movimientos de puntos</p></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Eventos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{filtered.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Acumulaciones</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">{filtered.filter((event) => event.type === "Acumulacion").length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Balance neto</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{netPoints}</p></CardContent></Card>
        </div>

        <Card>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Buscar cliente o detalle" value={search} onChange={(e) => setSearch(e.target.value)} className="md:col-span-2" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Acumulacion">Acumulacion</SelectItem>
                <SelectItem value="Canje">Canje</SelectItem>
                <SelectItem value="Ajuste">Ajuste</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Eventos de fidelidad</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Cliente</TableHead><TableHead>Tipo</TableHead><TableHead>Puntos</TableHead><TableHead>Detalle</TableHead><TableHead className="w-[90px]">Accion</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.date}</TableCell>
                    <TableCell className="font-medium">{event.customer}</TableCell>
                    <TableCell><Badge variant="secondary">{event.type}</Badge></TableCell>
                    <TableCell className={event.points < 0 ? "text-destructive" : "text-success"}>{event.points}</TableCell>
                    <TableCell>{event.detail}</TableCell>
                    <TableCell><Button variant="outline" size="sm" onClick={() => setSelected(event)}>Ver</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Detalle de evento</DialogTitle></DialogHeader>
            {selected && (
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Fecha:</span> {selected.date}</p>
                <p><span className="text-muted-foreground">Cliente:</span> {selected.customer}</p>
                <p><span className="text-muted-foreground">Tipo:</span> {selected.type}</p>
                <p><span className="text-muted-foreground">Puntos:</span> {selected.points}</p>
                <p><span className="text-muted-foreground">Detalle:</span> {selected.detail}</p>
              </div>
            )}
            <DialogFooter><Button onClick={() => setSelected(null)}>Cerrar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
