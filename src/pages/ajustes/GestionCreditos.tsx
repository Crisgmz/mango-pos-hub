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
import { ArrowLeft, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CreditAccount {
  id: string;
  customer: string;
  document: string;
  total: number;
  paid: number;
  dueDate: string;
}

const initialAccounts: CreditAccount[] = [
  { id: "gc1", customer: "Empresa Alfa", document: "CR-1901", total: 12400, paid: 4000, dueDate: "2026-03-05" },
  { id: "gc2", customer: "Oficina Delta", document: "CR-1882", total: 7600, paid: 0, dueDate: "2026-02-27" },
  { id: "gc3", customer: "Colegio Norte", document: "CR-1859", total: 9450, paid: 9450, dueDate: "2026-02-24" },
];

export default function GestionCreditos() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<CreditAccount[]>(initialAccounts);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [amount, setAmount] = useState(0);

  const totals = useMemo(() => {
    const total = accounts.reduce((acc, item) => acc + item.total, 0);
    const paid = accounts.reduce((acc, item) => acc + item.paid, 0);
    const balance = total - paid;
    return { total, paid, balance };
  }, [accounts]);

  const openPayment = (id: string) => {
    setSelectedId(id);
    setAmount(0);
    setPaymentOpen(true);
  };

  const applyPayment = () => {
    if (!selectedId) return;
    if (amount <= 0) {
      toast.error("Ingresa un monto valido");
      return;
    }

    setAccounts((prev) =>
      prev.map((item) => {
        if (item.id !== selectedId) return item;
        return { ...item, paid: Math.min(item.total, item.paid + amount) };
      })
    );

    setPaymentOpen(false);
    toast.success("Abono registrado");
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Gestion de Creditos</h1>
            <p className="text-muted-foreground">Cuentas por cobrar, saldos y registro de pagos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total otorgado</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">RD$ {totals.total.toLocaleString()}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total cobrado</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">RD$ {totals.paid.toLocaleString()}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Saldo pendiente</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-destructive">RD$ {totals.balance.toLocaleString()}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Cuentas de credito</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Pagado</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Vence</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[120px]">Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((item) => {
                  const balance = item.total - item.paid;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.customer}</TableCell>
                      <TableCell className="font-medium">{item.document}</TableCell>
                      <TableCell>RD$ {item.total.toLocaleString()}</TableCell>
                      <TableCell>RD$ {item.paid.toLocaleString()}</TableCell>
                      <TableCell>RD$ {balance.toLocaleString()}</TableCell>
                      <TableCell>{item.dueDate}</TableCell>
                      <TableCell><Badge variant={balance <= 0 ? "default" : "secondary"}>{balance <= 0 ? "Pagado" : "Pendiente"}</Badge></TableCell>
                      <TableCell><Button variant="outline" size="sm" disabled={balance <= 0} onClick={() => openPayment(item.id)}>Abonar</Button></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar abono</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <Label>Monto</Label>
              <Input type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPaymentOpen(false)}>Cancelar</Button>
              <Button onClick={applyPayment}>Guardar abono</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
