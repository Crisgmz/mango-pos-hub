import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, Plus, Coins, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
  active: boolean;
}

const initialCurrencies: Currency[] = [
  { id: "1", name: "Peso Dominicano", code: "DOP", symbol: "RD$", exchangeRate: 1, isDefault: true, active: true },
  { id: "2", name: "Dólar Estadounidense", code: "USD", symbol: "US$", exchangeRate: 58.50, isDefault: false, active: true },
  { id: "3", name: "Euro", code: "EUR", symbol: "€", exchangeRate: 63.20, isDefault: false, active: false },
];

export default function Monedas() {
  const navigate = useNavigate();
  const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Currency | null>(null);
  const [form, setForm] = useState({ name: "", code: "", symbol: "", exchangeRate: 1, isDefault: false, active: true });

  const resetForm = () => { setForm({ name: "", code: "", symbol: "", exchangeRate: 1, isDefault: false, active: true }); setEditing(null); };
  const openAdd = () => { resetForm(); setIsModalOpen(true); };
  const openEdit = (c: Currency) => {
    setEditing(c);
    setForm({ name: c.name, code: c.code, symbol: c.symbol, exchangeRate: c.exchangeRate, isDefault: c.isDefault, active: c.active });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.code.trim()) { toast.error("Nombre y código son requeridos"); return; }
    if (editing) {
      setCurrencies(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } : c));
      toast.success("Moneda actualizada");
    } else {
      setCurrencies(prev => [...prev, { ...form, id: Date.now().toString() }]);
      toast.success("Moneda agregada");
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => { setCurrencies(prev => prev.filter(c => c.id !== id)); toast.success("Moneda eliminada"); };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Monedas</h1>
            <p className="text-muted-foreground">Configuración de divisas y tasas de cambio</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Agregar Moneda</Button>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Coins className="h-5 w-5" />Monedas Configuradas</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Moneda</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Símbolo</TableHead>
                  <TableHead>Tasa de Cambio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currencies.map(cur => (
                  <TableRow key={cur.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{cur.name}</span>
                        {cur.isDefault && <Badge variant="secondary" className="text-xs">Principal</Badge>}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{cur.code}</Badge></TableCell>
                    <TableCell className="font-mono">{cur.symbol}</TableCell>
                    <TableCell className="font-mono">{cur.isDefault ? "—" : `1 ${cur.code} = ${cur.exchangeRate} DOP`}</TableCell>
                    <TableCell><Badge variant={cur.active ? "default" : "secondary"}>{cur.active ? "Activa" : "Inactiva"}</Badge></TableCell>
                    <TableCell>
                      {!cur.isDefault && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(cur)}><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(cur.id)}><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editing ? "Editar Moneda" : "Agregar Moneda"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nombre *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Dólar Estadounidense" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Código *</Label><Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="USD" maxLength={3} /></div>
                <div className="space-y-2"><Label>Símbolo</Label><Input value={form.symbol} onChange={e => setForm({ ...form, symbol: e.target.value })} placeholder="US$" /></div>
              </div>
              <div className="space-y-2"><Label>Tasa de cambio (1 {form.code || "XXX"} = ? DOP)</Label><Input type="number" step="0.01" value={form.exchangeRate} onChange={e => setForm({ ...form, exchangeRate: Number(e.target.value) })} /></div>
              <div className="flex items-center justify-between"><Label>Activa</Label><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>{editing ? "Guardar Cambios" : "Agregar Moneda"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
