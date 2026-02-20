import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Award, Plus, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LoyaltyCard {
  id: string;
  customer: string;
  cardNumber: string;
  level: string;
  points: number;
  active: boolean;
}

const initialCards: LoyaltyCard[] = [
  { id: "lc1", customer: "Ana Perez", cardNumber: "LOY-1001", level: "Silver", points: 340, active: true },
  { id: "lc2", customer: "Carlos Diaz", cardNumber: "LOY-1002", level: "Gold", points: 1280, active: true },
  { id: "lc3", customer: "Marcos Ruiz", cardNumber: "LOY-1003", level: "Bronze", points: 90, active: false },
];

export default function TarjetaFidelidad() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<LoyaltyCard[]>(initialCards);
  const [enabled, setEnabled] = useState(true);
  const [autoAssign, setAutoAssign] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ customer: "", cardNumber: "", level: "Bronze", points: 0, active: true });

  const addCard = () => {
    if (!form.customer.trim() || !form.cardNumber.trim()) {
      toast.error("Cliente y numero de tarjeta son requeridos");
      return;
    }
    setCards((prev) => [...prev, { id: `lc${Date.now()}`, ...form }]);
    setIsOpen(false);
    setForm({ customer: "", cardNumber: "", level: "Bronze", points: 0, active: true });
    toast.success("Tarjeta de fidelidad creada");
  };

  const toggleCard = (id: string) => {
    setCards((prev) => prev.map((card) => (card.id === id ? { ...card, active: !card.active } : card)));
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Tarjeta de Fidelidad</h1>
            <p className="text-muted-foreground">Programa de puntos y tarjetas para clientes frecuentes</p>
          </div>
          <Button variant="outline" onClick={() => toast.success("Configuracion guardada")}> <Save className="h-4 w-4 mr-2" />Guardar ajustes </Button>
          <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Nueva tarjeta</Button>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Configuracion del programa</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-md border px-3 py-2"><Label>Programa activo</Label><Switch checked={enabled} onCheckedChange={setEnabled} /></div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2"><Label>Asignar tarjeta automatica</Label><Switch checked={autoAssign} onCheckedChange={setAutoAssign} /></div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Tarjetas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{cards.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Activas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">{cards.filter((card) => card.active).length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Puntos acumulados</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{cards.reduce((acc, card) => acc + card.points, 0).toLocaleString()}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Tarjetas registradas</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>Tarjeta</TableHead><TableHead>Nivel</TableHead><TableHead>Puntos</TableHead><TableHead>Estado</TableHead><TableHead className="w-[120px]">Accion</TableHead></TableRow></TableHeader>
              <TableBody>
                {cards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell className="font-medium">{card.customer}</TableCell>
                    <TableCell>{card.cardNumber}</TableCell>
                    <TableCell><Badge variant="secondary">{card.level}</Badge></TableCell>
                    <TableCell>{card.points}</TableCell>
                    <TableCell><Badge variant={card.active ? "default" : "secondary"}>{card.active ? "Activa" : "Inactiva"}</Badge></TableCell>
                    <TableCell><Button variant="outline" size="sm" onClick={() => toggleCard(card.id)}>{card.active ? "Bloquear" : "Activar"}</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nueva tarjeta de fidelidad</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 md:col-span-2"><Label>Cliente</Label><Input value={form.customer} onChange={(e) => setForm((prev) => ({ ...prev, customer: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Numero de tarjeta</Label><Input value={form.cardNumber} onChange={(e) => setForm((prev) => ({ ...prev, cardNumber: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Nivel</Label><Input value={form.level} onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Puntos iniciales</Label><Input type="number" min={0} value={form.points} onChange={(e) => setForm((prev) => ({ ...prev, points: Number(e.target.value) }))} /></div>
              <div className="space-y-2 flex items-center justify-between rounded-md border px-3 py-2"><Label>Activa</Label><Switch checked={form.active} onCheckedChange={(value) => setForm((prev) => ({ ...prev, active: value }))} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button><Button onClick={addCard}>Guardar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
