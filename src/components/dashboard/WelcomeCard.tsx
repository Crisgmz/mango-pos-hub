import { DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WelcomeCard() {
  const currentDate = new Date().toLocaleDateString("es-DO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="card-elevated p-6 bg-gradient-to-br from-primary/5 via-card to-card">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground capitalize">{currentDate}</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            ¡Bienvenido a <span className="text-gradient-mango">MangoPOS</span>!
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Restaurante Demo
            </span>
            <span>•</span>
            <span>Usuario: Admin</span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              Caja #001
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-warning/10 rounded-lg">
            <Clock className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-warning">Caja cerrada</span>
          </div>
          <Button className="btn-mango">
            <DollarSign className="w-4 h-4 mr-2" />
            Aperturar Caja
          </Button>
        </div>
      </div>
    </div>
  );
}
