import { Users, Clock, User } from "lucide-react";

interface TableCardProps {
  code: string;
  status: "disponible" | "ocupado" | "pagando";
  guests?: number;
  time?: string;
  total?: number;
  waiterName?: string;
  isOwnTable?: boolean;
  onClick?: () => void;
}

export function TableCard({ 
  code, 
  status, 
  guests, 
  time, 
  total, 
  waiterName,
  isOwnTable,
  onClick 
}: TableCardProps) {
  const isOccupied = status === "ocupado";

  return (
    <button
      onClick={onClick}
      className={`table-card w-full text-left ${
        isOccupied ? "table-occupied" : "table-available"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">{code}</h3>
          <span
            className={`text-xs font-medium ${
              isOccupied ? "text-warning" : "text-success"
            }`}
          >
            {isOccupied ? "Ocupado" : "Disponible"}
          </span>
        </div>
        {isOccupied && total !== undefined && (
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">
              RD$ {total.toLocaleString("es-DO")}
            </p>
          </div>
        )}
      </div>

      {isOccupied && (
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          {guests !== undefined && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{guests}</span>
            </div>
          )}
          {time && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>
          )}
        </div>
      )}

      {/* Waiter info */}
      {isOccupied && waiterName && (
        <div className={`flex items-center gap-1.5 mt-2 text-xs ${
          isOwnTable ? "text-success" : "text-muted-foreground"
        }`}>
          <User className="w-3 h-3" />
          <span className="truncate">{waiterName}</span>
          {isOwnTable && (
            <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded">
              Tu mesa
            </span>
          )}
        </div>
      )}

      {!isOccupied && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-sm text-muted-foreground">
            Toca para asignar
          </span>
        </div>
      )}
    </button>
  );
}
