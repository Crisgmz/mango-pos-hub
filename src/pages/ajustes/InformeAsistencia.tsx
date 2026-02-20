import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const rows = [
  { employee: "Lucia Gomez", role: "Cajera", expected: 22, attended: 21, lateness: 1 },
  { employee: "Pedro Soto", role: "Delivery", expected: 22, attended: 22, lateness: 0 },
  { employee: "Maria Ruiz", role: "Mesera", expected: 22, attended: 20, lateness: 2 },
  { employee: "Carlos Pena", role: "Cocina", expected: 22, attended: 19, lateness: 3 },
];

export default function InformeAsistencia() {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => navigate('/ajustes')}><ArrowLeft className="h-5 w-5" /></Button><div className="flex-1"><h1 className="text-2xl font-bold">Informe de Asistencia</h1><p className="text-muted-foreground">Control de asistencia y tardanzas del personal</p></div><Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button></div>
        <Card><CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-3"><Input type="date" defaultValue="2026-02-01" /><Input type="date" defaultValue="2026-02-20" /><Input placeholder="Area / rol" defaultValue="Todos" /></CardContent></Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Colaboradores</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{rows.length}</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Asistencia promedio</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{Math.round((rows.reduce((a,r)=>a+r.attended,0)/rows.reduce((a,r)=>a+r.expected,1))*100)}%</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Tardanzas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-warning">{rows.reduce((a,r)=>a+r.lateness,0)}</p></CardContent></Card></div>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Detalle por colaborador</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Rol</TableHead><TableHead>Dias esperados</TableHead><TableHead>Dias asistidos</TableHead><TableHead>Tardanzas</TableHead><TableHead>Cumplimiento</TableHead></TableRow></TableHeader><TableBody>{rows.map((r)=><TableRow key={r.employee}><TableCell>{r.employee}</TableCell><TableCell>{r.role}</TableCell><TableCell>{r.expected}</TableCell><TableCell>{r.attended}</TableCell><TableCell>{r.lateness}</TableCell><TableCell><Badge variant={r.attended/r.expected>=0.9?"default":"secondary"}>{Math.round((r.attended/r.expected)*100)}%</Badge></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
      </div>
    </MainLayout>
  );
}
