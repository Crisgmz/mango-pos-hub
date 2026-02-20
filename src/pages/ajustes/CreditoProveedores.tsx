import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, CreditCard, MoreHorizontal, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CreditPurchase {
  id: string;
  supplier: string;
  document: string;
  issueDate: string;
  dueDate: string;
  total: number;
  paid: number;
}

const initialCredits: CreditPurchase[] = [
  { id: "cp1", supplier: "Distribuidora Centro", document: "FAC-1023", issueDate: "2026-02-10", dueDate: "2026-02-25", total: 28500, paid: 10000 },
  { id: "cp2", supplier: "Alimentos Caribe", document: "FAC-1021", issueDate: "2026-02-08", dueDate: "2026-03-08", total: 14300, paid: 14300 },
  { id: "cp3", supplier: "Lacteos Nacional", document: "FAC-1019", issueDate: "2026-02-07", dueDate: "2026-02-22", total: 9200, paid: 2000 },
];

export default function CreditoProveedores() {
  const navigate = useNavigate();
  const [credits, setCredits] = useState<CreditPurchase[]>(initialCredits);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState({
    supplier: "",
    document: "",
    issueDate: "2026-02-19",
    dueDate: "2026-03-05",
    total: 0,
    paid: 0,
  });

  const [paymentAmount, setPaymentAmount] = useState(0);

  const totals = useMemo(() => {
    const total = credits.reduce((acc, credit) => acc + credit.total, 0);
    const paid = credits.reduce((acc, credit) => acc + credit.paid, 0);
    const balance = total - paid;
    return { total, paid, balance };
  }, [credits]);

  const createCredit = () => {
    if (!createForm.supplier.trim() || !createForm.document.trim()) {
      toast.error("Proveedor y documento son requeridos");
      return;
    }

    setCredits((prev) => [
      {
        id: `cp${Date.now()}`,
        supplier: createForm.supplier,
        document: createForm.document,
        issueDate: createForm.issueDate,
        dueDate: createForm.dueDate,
        total: Number(createForm.total),
        paid: Number(createForm.paid),
      },
      ...prev,
    ]);

    setCreateForm({ supplier: "", document: "", issueDate: "2026-02-19", dueDate: "2026-03-05", total: 0, paid: 0 });
    setIsCreateOpen(false);
    toast.success("Credito registrado");
  };

  const openPayment = (id: string) => {
    setSelectedId(id);
    setPaymentAmount(0);
    setIsPaymentOpen(true);
  };

  const applyPayment = () => {
    if (!selectedId) return;
    if (paymentAmount <= 0) {
      toast.error("Ingresa un monto valido");
      return;
    }

    setCredits((prev) =>
      prev.map((credit) => {
        if (credit.id !== selectedId) return credit;
        const nextPaid = Math.min(credit.total, credit.paid + paymentAmount);
        return { ...credit, paid: nextPaid };
      })
    );

    setIsPaymentOpen(false);
    toast.success("Pago aplicado");
  };

  const getStatus = (credit: CreditPurchase) => {
    const balance = credit.total - credit.paid;
    if (balance <= 0) return "Pagado";
    if (credit.paid > 0) return "Parcial";
    return "Pendiente";
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Credito de Compras a Proveedores</h1>
            <p className="text-muted-foreground">Control de cuentas por pagar y abonos</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}><Plus className="h-4 w-4 mr-2" />Nuevo credito</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total credito</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">RD$ {totals.total.toLocaleString()}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total abonado</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">RD$ {totals.paid.toLocaleString()}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Saldo pendiente</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-destructive">RD$ {totals.balance.toLocaleString()}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Creditos vigentes</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Fecha emision</TableHead>
                  <TableHead>Fecha vencimiento</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Pagado</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {credits.map((credit) => {
                  const balance = credit.total - credit.paid;
                  const status = getStatus(credit);
                  return (
                    <TableRow key={credit.id}>
                      <TableCell className="font-medium">{credit.supplier}</TableCell>
                      <TableCell>{credit.document}</TableCell>
                      <TableCell>{credit.issueDate}</TableCell>
                      <TableCell>{credit.dueDate}</TableCell>
                      <TableCell>RD$ {credit.total.toLocaleString()}</TableCell>
                      <TableCell>RD$ {credit.paid.toLocaleString()}</TableCell>
                      <TableCell className={balance > 0 ? "text-destructive" : "text-success"}>RD$ {balance.toLocaleString()}</TableCell>
                      <TableCell><Badge variant={status === "Pagado" ? "default" : "secondary"}>{status}</Badge></TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled={balance <= 0} onClick={() => openPayment(credit.id)}>Registrar pago</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo credito</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 md:col-span-2"><Label>Proveedor</Label><Input value={createForm.supplier} onChange={(e) => setCreateForm((prev) => ({ ...prev, supplier: e.target.value }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Documento</Label><Input value={createForm.document} onChange={(e) => setCreateForm((prev) => ({ ...prev, document: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Fecha emision</Label><Input type="date" value={createForm.issueDate} onChange={(e) => setCreateForm((prev) => ({ ...prev, issueDate: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Fecha vencimiento</Label><Input type="date" value={createForm.dueDate} onChange={(e) => setCreateForm((prev) => ({ ...prev, dueDate: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Total</Label><Input type="number" min={0} value={createForm.total} onChange={(e) => setCreateForm((prev) => ({ ...prev, total: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Pago inicial</Label><Input type="number" min={0} value={createForm.paid} onChange={(e) => setCreateForm((prev) => ({ ...prev, paid: Number(e.target.value) }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
              <Button onClick={createCredit}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar abono</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <Label>Monto</Label>
              <Input type="number" min={1} value={paymentAmount} onChange={(e) => setPaymentAmount(Number(e.target.value))} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>Cancelar</Button>
              <Button onClick={applyPayment}>Aplicar pago</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
