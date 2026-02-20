import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Award, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface RewardBalance {
  id: string;
  customer: string;
  points: number;
  tier: string;
}

const initialBalances: RewardBalance[] = [
  { id: "rb1", customer: "Ana Perez", points: 340, tier: "Silver" },
  { id: "rb2", customer: "Carlos Diaz", points: 1280, tier: "Gold" },
  { id: "rb3", customer: "Marta Lopez", points: 95, tier: "Bronze" },
];

export default function PuntosRecompensa() {
  const navigate = useNavigate();
  const [balances, setBalances] = useState<RewardBalance[]>(initialBalances);
  const [earnRate, setEarnRate] = useState(1);
  const [redemptionRate, setRedemptionRate] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [delta, setDelta] = useState(0);

  const saveRules = () => {
    toast.success("Reglas de puntos guardadas");
  };

  const openAdjust = (id: string) => {
    setSelectedId(id);
    setDelta(0);
    setOpen(true);
  };

  const applyAdjust = () => {
    if (!selectedId || delta === 0) {
      toast.error("Ingresa una variacion de puntos");
      return;
    }
    setBalances((prev) =>
      prev.map((item) => (item.id === selectedId ? { ...item, points: Math.max(0, item.points + delta) } : item))
    );
    setOpen(false);
    toast.success("Puntos ajustados");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1"><h1 className="text-2xl font-bold">Puntos de Recompensa</h1><p className="text-muted-foreground">Reglas de acumulacion y canje de puntos</p></div>
          <Button onClick={saveRules}><Save className="h-4 w-4 mr-2" />Guardar reglas</Button>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Reglas</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Puntos por RD$ 100</Label><Input type="number" min={0} value={earnRate} onChange={(e) => setEarnRate(Number(e.target.value))} /></div>
            <div className="space-y-2"><Label>RD$ por cada 100 puntos</Label><Input type="number" min={0} value={redemptionRate} onChange={(e) => setRedemptionRate(Number(e.target.value))} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Balance por cliente</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>Puntos</TableHead><TableHead>Nivel</TableHead><TableHead className="w-[120px]">Accion</TableHead></TableRow></TableHeader>
              <TableBody>
                {balances.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.customer}</TableCell>
                    <TableCell>{item.points}</TableCell>
                    <TableCell><Badge variant="secondary">{item.tier}</Badge></TableCell>
                    <TableCell><Button variant="outline" size="sm" onClick={() => openAdjust(item.id)}>Ajustar</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Ajustar puntos</DialogTitle></DialogHeader>
            <div className="space-y-2"><Label>Variacion (puede ser negativa)</Label><Input type="number" value={delta} onChange={(e) => setDelta(Number(e.target.value))} /></div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={applyAdjust}>Aplicar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
