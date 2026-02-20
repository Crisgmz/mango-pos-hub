import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { ArrowLeft, Download, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface UpdateItem {
  id: string;
  version: string;
  date: string;
  type: "Estable" | "Beta" | "Hotfix";
  notes: string;
}

const changelog: UpdateItem[] = [
  { id: "u1", version: "v2.4.0", date: "2026-02-15", type: "Estable", notes: "Mejoras en inventario y compras" },
  { id: "u2", version: "v2.3.4", date: "2026-02-02", type: "Hotfix", notes: "Correcciones de impresion" },
  { id: "u3", version: "v2.3.0", date: "2026-01-20", type: "Estable", notes: "Nuevos reportes y permisos" },
];

export default function Actualizaciones() {
  const navigate = useNavigate();
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [allowBeta, setAllowBeta] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("v2.4.0");

  const runUpdate = () => {
    toast.success(`Actualizacion ${selectedVersion} iniciada`);
    setIsOpen(false);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Actualizaciones</h1>
            <p className="text-muted-foreground">Versiones del sistema y politica de actualizacion</p>
          </div>
          <Button onClick={() => setIsOpen(true)}><Download className="h-4 w-4 mr-2" />Actualizar ahora</Button>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />Politica de versionado</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-md border px-3 py-2"><Label>Actualizacion automatica</Label><Switch checked={autoUpdate} onCheckedChange={setAutoUpdate} /></div>
            <div className="flex items-center justify-between rounded-md border px-3 py-2"><Label>Permitir canal beta</Label><Switch checked={allowBeta} onCheckedChange={setAllowBeta} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Historial de versiones</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Version</TableHead><TableHead>Fecha</TableHead><TableHead>Tipo</TableHead><TableHead>Notas</TableHead></TableRow></TableHeader>
              <TableBody>
                {changelog.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.version}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell><Badge variant={item.type === "Estable" ? "default" : "secondary"}>{item.type}</Badge></TableCell>
                    <TableCell>{item.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Ejecutar actualizacion</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <Label>Version objetivo</Label>
              <Input value={selectedVersion} onChange={(e) => setSelectedVersion(e.target.value)} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={runUpdate}>Iniciar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
