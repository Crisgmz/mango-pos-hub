import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Goal {
  id: string;
  name: string;
  period: string;
  target: number;
  current: number;
  owner: string;
}

const initialGoals: Goal[] = [
  { id: "gm1", name: "Ventas mensuales", period: "Feb 2026", target: 1250000, current: 840000, owner: "Gerencia" },
  { id: "gm2", name: "Ticket promedio", period: "Feb 2026", target: 1600, current: 1485, owner: "Caja" },
  { id: "gm3", name: "Compras optimizadas", period: "Q1 2026", target: 320000, current: 210000, owner: "Compras" },
];

export default function GestionMetas() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", period: "", target: 0, current: 0, owner: "" });

  const addGoal = () => {
    if (!form.name.trim() || !form.period.trim() || !form.owner.trim() || form.target <= 0) {
      toast.error("Completa la meta correctamente");
      return;
    }
    setGoals((prev) => [{ id: `gm${Date.now()}`, ...form }, ...prev]);
    setOpen(false);
    setForm({ name: "", period: "", target: 0, current: 0, owner: "" });
    toast.success("Meta creada");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1"><h1 className="text-2xl font-bold">Gestion de Metas</h1><p className="text-muted-foreground">Objetivos operativos y seguimiento de cumplimiento</p></div>
          <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" />Nueva meta</Button>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" />Metas activas</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Meta</TableHead><TableHead>Periodo</TableHead><TableHead>Objetivo</TableHead><TableHead>Actual</TableHead><TableHead>Avance</TableHead><TableHead>Responsable</TableHead></TableRow></TableHeader>
              <TableBody>
                {goals.map((goal) => {
                  const progress = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
                  return (
                    <TableRow key={goal.id}>
                      <TableCell className="font-medium">{goal.name}</TableCell>
                      <TableCell>{goal.period}</TableCell>
                      <TableCell>{goal.target.toLocaleString()}</TableCell>
                      <TableCell>{goal.current.toLocaleString()}</TableCell>
                      <TableCell><Badge variant={progress >= 80 ? "default" : "secondary"}>{progress}%</Badge></TableCell>
                      <TableCell>{goal.owner}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nueva meta</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 md:col-span-2"><Label>Nombre</Label><Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Periodo</Label><Input value={form.period} onChange={(e) => setForm((prev) => ({ ...prev, period: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Responsable</Label><Input value={form.owner} onChange={(e) => setForm((prev) => ({ ...prev, owner: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Objetivo</Label><Input type="number" min={1} value={form.target} onChange={(e) => setForm((prev) => ({ ...prev, target: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Valor actual</Label><Input type="number" min={0} value={form.current} onChange={(e) => setForm((prev) => ({ ...prev, current: Number(e.target.value) }))} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={addGoal}>Guardar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
