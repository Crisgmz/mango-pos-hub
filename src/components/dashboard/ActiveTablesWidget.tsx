import { Link } from "react-router-dom";
import { Users, Clock, ArrowRight } from "lucide-react";

const activeTables = [
  { id: "SP01", zone: "Salón Principal", guests: 4, time: "45:23", total: 2850 },
  { id: "SP03", zone: "Salón Principal", guests: 2, time: "28:10", total: 1200 },
  { id: "TR02", zone: "Terraza", guests: 6, time: "1:12:45", total: 5400 },
];

export function ActiveTablesWidget() {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">Mesas Activas</h2>
        <span className="badge-warning">{activeTables.length} ocupadas</span>
      </div>

      <div className="space-y-3">
        {activeTables.map((table) => (
          <div
            key={table.id}
            className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-warning">{table.id}</span>
              </div>
              <div>
                <p className="font-medium text-foreground">{table.zone}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{table.guests} personas</span>
                  <Clock className="w-3 h-3 ml-1" />
                  <span>{table.time}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-foreground">
                RD$ {table.total.toLocaleString("es-DO")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/ventas"
        className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border text-primary font-medium hover:underline"
      >
        Ver todas las mesas
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
