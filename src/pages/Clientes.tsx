import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  Search, 
  Plus, 
  Upload, 
  Download, 
  MoreHorizontal,
  Mail,
  Phone,
  ShoppingBag,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
}

const clients: Client[] = [
  { id: "1", name: "María García", email: "maria@email.com", phone: "809-555-0101", totalOrders: 45, totalSpent: 125000, lastOrder: "2024-01-15" },
  { id: "2", name: "Juan Pérez", email: "juan@email.com", phone: "809-555-0102", totalOrders: 32, totalSpent: 89000, lastOrder: "2024-01-14" },
  { id: "3", name: "Ana Rodríguez", email: "ana@email.com", phone: "809-555-0103", totalOrders: 28, totalSpent: 76500, lastOrder: "2024-01-13" },
  { id: "4", name: "Carlos Martínez", email: "carlos@email.com", phone: "809-555-0104", totalOrders: 22, totalSpent: 58000, lastOrder: "2024-01-12" },
  { id: "5", name: "Laura Sánchez", email: "laura@email.com", phone: "809-555-0105", totalOrders: 18, totalSpent: 45000, lastOrder: "2024-01-11" },
];

const Clientes = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery)
  );

  return (
    <MainLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Clientes</h1>
            <p className="text-muted-foreground">Gestión de clientes y contactos</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Importar
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button className="btn-mango gap-2">
              <Plus className="w-4 h-4" />
              Agregar Cliente
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{clients.length}</p>
            <p className="text-sm text-muted-foreground">Total Clientes</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-success">145</p>
            <p className="text-sm text-muted-foreground">Pedidos Este Mes</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-info" />
              </div>
            </div>
            <p className="text-2xl font-bold text-info">89%</p>
            <p className="text-sm text-muted-foreground">Con Email</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-warning">95%</p>
            <p className="text-sm text-muted-foreground">Con Teléfono</p>
          </div>
        </div>

        {/* Search */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-search"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead className="text-center">Pedidos</TableHead>
                  <TableHead className="text-right">Total Gastado</TableHead>
                  <TableHead className="text-right">Último Pedido</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-secondary/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-mango flex items-center justify-center text-primary-foreground font-semibold">
                          {client.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.email}</TableCell>
                    <TableCell className="text-muted-foreground">{client.phone}</TableCell>
                    <TableCell className="text-center">
                      <span className="badge-info">{client.totalOrders}</span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      RD$ {client.totalSpent.toLocaleString("es-DO")}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(client.lastOrder).toLocaleDateString("es-DO")}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Clientes;
