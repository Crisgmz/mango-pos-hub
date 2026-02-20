import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface MembershipLevel {
  id: string;
  name: string;
  minPoints: number;
  discount: number;
  benefits: string;
  members: number;
}

const initialLevels: MembershipLevel[] = [
  { id: "ml1", name: "Bronze", minPoints: 0, discount: 2, benefits: "Acceso base", members: 124 },
  { id: "ml2", name: "Silver", minPoints: 500, discount: 5, benefits: "Promos exclusivas", members: 52 },
  { id: "ml3", name: "Gold", minPoints: 1200, discount: 10, benefits: "Promos + prioridad", members: 18 },
];

export default function NivelesMembresias() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState<MembershipLevel[]>(initialLevels);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", minPoints: 0, discount: 0, benefits: "", members: 0 });

  const addLevel = () => {
    if (!form.name.trim()) {
      toast.error("Nombre del nivel requerido");
      return;
    }
    setLevels((prev) => [...prev, { id: `ml${Date.now()}`, ...form }]);
    setIsOpen(false);
    setForm({ name: "", minPoints: 0, discount: 0, benefits: "", members: 0 });
    toast.success("Nivel creado");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Niveles de Membresias</h1>
            <p className="text-muted-foreground">Segmentacion de clientes por puntos acumulados</p>
          </div>
          <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Nuevo nivel</Button>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><UserCheck className="h-5 w-5" />Niveles configurados</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Nivel</TableHead><TableHead>Puntos min.</TableHead><TableHead>Descuento</TableHead><TableHead>Beneficios</TableHead><TableHead>Miembros</TableHead></TableRow></TableHeader>
              <TableBody>
                {levels.map((level) => (
                  <TableRow key={level.id}>
                    <TableCell className="font-medium">{level.name}</TableCell>
                    <TableCell>{level.minPoints}</TableCell>
                    <TableCell><Badge variant="secondary">{level.discount}%</Badge></TableCell>
                    <TableCell>{level.benefits}</TableCell>
                    <TableCell>{level.members}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo nivel de membresia</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 md:col-span-2"><Label>Nombre</Label><Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Puntos minimos</Label><Input type="number" min={0} value={form.minPoints} onChange={(e) => setForm((prev) => ({ ...prev, minPoints: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Descuento (%)</Label><Input type="number" min={0} max={100} value={form.discount} onChange={(e) => setForm((prev) => ({ ...prev, discount: Number(e.target.value) }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Beneficios</Label><Input value={form.benefits} onChange={(e) => setForm((prev) => ({ ...prev, benefits: e.target.value }))} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button><Button onClick={addLevel}>Guardar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
