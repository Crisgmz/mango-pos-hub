import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Gift, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface GiftCardItem {
  id: string;
  code: string;
  owner: string;
  initialAmount: number;
  balance: number;
  expiresAt: string;
  status: "Activa" | "Consumida" | "Vencida";
}

const initialCards: GiftCardItem[] = [
  { id: "g1", code: "GC-10001", owner: "Ana Perez", initialAmount: 3000, balance: 1200, expiresAt: "2026-12-31", status: "Activa" },
  { id: "g2", code: "GC-10002", owner: "Carlos Diaz", initialAmount: 1500, balance: 0, expiresAt: "2026-08-31", status: "Consumida" },
  { id: "g3", code: "GC-10003", owner: "Marta Lopez", initialAmount: 2500, balance: 2500, expiresAt: "2026-01-31", status: "Vencida" },
];

export default function GiftCards() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<GiftCardItem[]>(initialCards);
  const [createOpen, setCreateOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [redeemAmount, setRedeemAmount] = useState(0);
  const [form, setForm] = useState({ code: "", owner: "", initialAmount: 0, expiresAt: "2026-12-31" });

  const createCard = () => {
    if (!form.code.trim() || !form.owner.trim() || form.initialAmount <= 0) {
      toast.error("Datos de gift card invalidos");
      return;
    }
    setCards((prev) => [
      { id: `g${Date.now()}`, code: form.code.toUpperCase(), owner: form.owner, initialAmount: form.initialAmount, balance: form.initialAmount, expiresAt: form.expiresAt, status: "Activa" },
      ...prev,
    ]);
    setCreateOpen(false);
    setForm({ code: "", owner: "", initialAmount: 0, expiresAt: "2026-12-31" });
    toast.success("Gift card creada");
  };

  const openRedeem = (id: string) => {
    setSelectedId(id);
    setRedeemAmount(0);
    setRedeemOpen(true);
  };

  const redeem = () => {
    if (!selectedId || redeemAmount <= 0) {
      toast.error("Monto invalido");
      return;
    }
    setCards((prev) =>
      prev.map((item) => {
        if (item.id !== selectedId || item.status !== "Activa") return item;
        const next = Math.max(0, item.balance - redeemAmount);
        return { ...item, balance: next, status: next === 0 ? "Consumida" : "Activa" };
      })
    );
    setRedeemOpen(false);
    toast.success("Consumo aplicado a gift card");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1"><h1 className="text-2xl font-bold">Gift Cards y Bonos</h1><p className="text-muted-foreground">Emision y consumo de tarjetas de regalo</p></div>
          <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-2" />Emitir gift card</Button>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Gift className="h-5 w-5" />Gift cards</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Codigo</TableHead><TableHead>Cliente</TableHead><TableHead>Monto inicial</TableHead><TableHead>Balance</TableHead><TableHead>Expira</TableHead><TableHead>Estado</TableHead><TableHead className="w-[120px]">Accion</TableHead></TableRow></TableHeader>
              <TableBody>
                {cards.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.owner}</TableCell>
                    <TableCell>RD$ {item.initialAmount.toLocaleString()}</TableCell>
                    <TableCell>RD$ {item.balance.toLocaleString()}</TableCell>
                    <TableCell>{item.expiresAt}</TableCell>
                    <TableCell><Badge variant={item.status === "Activa" ? "default" : "secondary"}>{item.status}</Badge></TableCell>
                    <TableCell><Button variant="outline" size="sm" disabled={item.status !== "Activa"} onClick={() => openRedeem(item.id)}>Consumir</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Emitir gift card</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Codigo</Label><Input value={form.code} onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Cliente</Label><Input value={form.owner} onChange={(e) => setForm((prev) => ({ ...prev, owner: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Monto inicial</Label><Input type="number" min={1} value={form.initialAmount} onChange={(e) => setForm((prev) => ({ ...prev, initialAmount: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Expira</Label><Input type="date" value={form.expiresAt} onChange={(e) => setForm((prev) => ({ ...prev, expiresAt: e.target.value }))} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button><Button onClick={createCard}>Guardar</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={redeemOpen} onOpenChange={setRedeemOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Consumir gift card</DialogTitle></DialogHeader>
            <div className="space-y-2"><Label>Monto a consumir</Label><Input type="number" min={1} value={redeemAmount} onChange={(e) => setRedeemAmount(Number(e.target.value))} /></div>
            <DialogFooter><Button variant="outline" onClick={() => setRedeemOpen(false)}>Cancelar</Button><Button onClick={redeem}>Aplicar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
