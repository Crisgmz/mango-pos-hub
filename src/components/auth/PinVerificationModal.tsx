import { useState, useEffect } from "react";
import { Delete, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface PinVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
  title?: string;
  description?: string;
  requiredRole?: "any" | "supervisor" | "admin";
}

// Mock users for PIN verification (should match PinLogin)
const AUTHORIZED_USERS = [
  { id: "1", name: "Carlos Rodríguez", role: "Administrador", pin: "0000" },
  { id: "2", name: "María González", role: "Supervisor", pin: "1111" },
  { id: "3", name: "Pedro Martínez", role: "Cajero", pin: "2222" },
  { id: "4", name: "Ana Pérez", role: "Mesero", pin: "1234" },
  { id: "5", name: "Luis García", role: "Mesero", pin: "5678" },
  { id: "6", name: "José Hernández", role: "Cocina", pin: "3333" },
];

const PIN_PAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"];

export function PinVerificationModal({
  open,
  onOpenChange,
  onVerified,
  title = "Verificación Requerida",
  description = "Ingresa tu PIN para continuar",
  requiredRole = "any",
}: PinVerificationModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (!open) {
      setPin("");
      setError("");
    }
  }, [open]);

  useEffect(() => {
    if (pin.length === 4) {
      const user = AUTHORIZED_USERS.find((u) => u.pin === pin);

      if (user) {
        // Check role requirement
        const roleHierarchy: Record<string, number> = {
          Administrador: 3,
          Supervisor: 2,
          Cajero: 1,
          Mesero: 1,
          Cocina: 1,
        };

        const requiredLevel =
          requiredRole === "admin" ? 3 : requiredRole === "supervisor" ? 2 : 1;

        if (roleHierarchy[user.role] >= requiredLevel) {
          onVerified();
          onOpenChange(false);
        } else {
          setError(`Se requiere autorización de ${requiredRole === "admin" ? "Administrador" : "Supervisor"}`);
          setIsShaking(true);
          setTimeout(() => {
            setPin("");
            setIsShaking(false);
          }, 500);
        }
      } else {
        setError("PIN incorrecto");
        setIsShaking(true);
        setTimeout(() => {
          setPin("");
          setIsShaking(false);
        }, 500);
      }
    }
  }, [pin, onVerified, onOpenChange, requiredRole]);

  const handleKeyPress = (key: string) => {
    if (key === "delete") {
      setPin((prev) => prev.slice(0, -1));
      setError("");
    } else if (pin.length < 4) {
      setPin((prev) => prev + key);
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mb-2">
            {requiredRole === "any" ? (
              <Lock className="w-6 h-6 text-warning" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-warning" />
            )}
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* PIN Display */}
          <div
            className={cn(
              "flex justify-center gap-3 py-4",
              isShaking && "animate-shake"
            )}
          >
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={cn(
                  "w-4 h-4 rounded-full border-2 transition-all duration-200",
                  index < pin.length
                    ? "bg-primary border-primary scale-110"
                    : "border-muted-foreground/30"
                )}
              />
            ))}
          </div>
          {error && (
            <p className="text-center text-sm text-destructive animate-in fade-in">
              {error}
            </p>
          )}

          {/* PIN Pad */}
          <div className="grid grid-cols-3 gap-2">
            {PIN_PAD.map((key, index) => {
              if (key === "") {
                return <div key={index} />;
              }
              if (key === "delete") {
                return (
                  <Button
                    key={key}
                    variant="outline"
                    size="lg"
                    className="h-14 text-lg"
                    onClick={() => handleKeyPress(key)}
                    disabled={pin.length === 0}
                  >
                    <Delete className="w-5 h-5" />
                  </Button>
                );
              }
              return (
                <Button
                  key={key}
                  variant="outline"
                  size="lg"
                  className="h-14 text-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleKeyPress(key)}
                >
                  {key}
                </Button>
              );
            })}
          </div>

          <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
            <p>Ingresa el PIN de un usuario autorizado</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
