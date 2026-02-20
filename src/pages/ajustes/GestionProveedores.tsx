import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, MoreHorizontal, Pencil, Plus, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  rnc: string;
  creditDays: number;
  active: boolean;
}

const initialSuppliers: Supplier[] = [
  { id: "p1", name: "Distribuidora Centro", contact: "Luis Torres", phone: "809-555-1001", email: "luis@centro.com", rnc: "130-445566-1", creditDays: 15, active: true },
  { id: "p2", name: "Alimentos Caribe", contact: "Sonia Castillo", phone: "809-555-1002", email: "sonia@caribe.com", rnc: "131-778899-2", creditDays: 30, active: true },
  { id: "p3", name: "Lacteos Nacional", contact: "Maria Cruz", phone: "809-555-1003", email: "maria@lacteos.com", rnc: "132-112233-4", creditDays: 10, active: false },
];

export default function GestionProveedores() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    rnc: "",
    creditDays: 0,
    active: true,
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", contact: "", phone: "", email: "", rnc: "", creditDays: 0, active: true });
    setIsOpen(true);
  };

  const openEdit = (supplier: Supplier) => {
    setEditing(supplier);
    setForm({
      name: supplier.name,
      contact: supplier.contact,
      phone: supplier.phone,
      email: supplier.email,
      rnc: supplier.rnc,
      creditDays: supplier.creditDays,
      active: supplier.active,
    });
    setIsOpen(true);
  };

  const saveSupplier = () => {
    if (!form.name.trim() || !form.contact.trim()) {
      toast.error("Nombre y contacto son requeridos");
      return;
    }

    if (editing) {
      setSuppliers((prev) => prev.map((supplier) => (supplier.id === editing.id ? { ...supplier, ...form } : supplier)));
      toast.success("Proveedor actualizado");
    } else {
      setSuppliers((prev) => [...prev, { id: `p${Date.now()}`, ...form }]);
      toast.success("Proveedor creado");
    }

    setIsOpen(false);
  };

  const toggleActive = (id: string) => {
    setSuppliers((prev) => prev.map((supplier) => (supplier.id === id ? { ...supplier, active: !supplier.active } : supplier)));
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Gestion de Proveedores</h1>
            <p className="text-muted-foreground">Catalogo y condiciones de compra por proveedor</p>
          </div>
          <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Nuevo proveedor</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total proveedores</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{suppliers.length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Activos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">{suppliers.filter((supplier) => supplier.active).length}</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Inactivos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-destructive">{suppliers.filter((supplier) => !supplier.active).length}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5" />Proveedores</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Telefono</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>RNC</TableHead>
                  <TableHead>Credito</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.rnc}</TableCell>
                    <TableCell>{supplier.creditDays} dias</TableCell>
                    <TableCell><Badge variant={supplier.active ? "default" : "secondary"}>{supplier.active ? "Activo" : "Inactivo"}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(supplier)}><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleActive(supplier.id)}>{supplier.active ? "Desactivar" : "Activar"}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Editar proveedor" : "Nuevo proveedor"}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 md:col-span-2"><Label>Nombre</Label><Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Contacto</Label><Input value={form.contact} onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Telefono</Label><Input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Correo</Label><Input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} /></div>
              <div className="space-y-2"><Label>RNC</Label><Input value={form.rnc} onChange={(e) => setForm((prev) => ({ ...prev, rnc: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Dias de credito</Label><Input type="number" min={0} value={form.creditDays} onChange={(e) => setForm((prev) => ({ ...prev, creditDays: Number(e.target.value) }))} /></div>
              <div className="space-y-2 flex items-center justify-between md:col-span-2 rounded-md border px-3 py-2">
                <Label>Activo</Label>
                <Switch checked={form.active} onCheckedChange={(value) => setForm((prev) => ({ ...prev, active: value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={saveSupplier}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
