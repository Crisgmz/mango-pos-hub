import { useState, useEffect } from "react";
import { Delete, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logoMangopos from "@/assets/logo-mangopos.png";
import { cn } from "@/lib/utils";

interface PinLoginProps {
  onLogin: (pin: string, user: MockUser) => void;
}

interface MockUser {
  id: string;
  name: string;
  role: string;
  pin: string;
}

const MOCK_USERS: MockUser[] = [
  { id: "1", name: "Carlos Rodríguez", role: "Administrador", pin: "0000" },
  { id: "2", name: "María González", role: "Supervisor", pin: "1111" },
  { id: "3", name: "Pedro Martínez", role: "Cajero", pin: "2222" },
  { id: "4", name: "Ana Pérez", role: "Mesero", pin: "1234" },
  { id: "5", name: "Luis García", role: "Mesero", pin: "5678" },
  { id: "6", name: "José Hernández", role: "Cocina", pin: "3333" },
];

const PIN_PAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"];

export function PinLogin({ onLogin }: PinLoginProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);

  useEffect(() => {
    if (pin.length === 4) {
      // Check PIN
      const user = selectedUser 
        ? (selectedUser.pin === pin ? selectedUser : null)
        : MOCK_USERS.find((u) => u.pin === pin);

      if (user) {
        onLogin(pin, user);
      } else {
        setError("PIN incorrecto");
        setIsShaking(true);
        setTimeout(() => {
          setPin("");
          setIsShaking(false);
        }, 500);
      }
    }
  }, [pin, onLogin, selectedUser]);

  const handleKeyPress = (key: string) => {
    if (key === "delete") {
      setPin((prev) => prev.slice(0, -1));
      setError("");
    } else if (pin.length < 4) {
      setPin((prev) => prev + key);
      setError("");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const roleColors: Record<string, string> = {
    Administrador: "bg-primary text-primary-foreground",
    Supervisor: "bg-info text-white",
    Cajero: "bg-success text-white",
    Mesero: "bg-warning text-warning-foreground",
    Cocina: "bg-destructive text-destructive-foreground",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Logo */}
        <div className="text-center">
          <img 
            src={logoMangopos} 
            alt="MangoPOS" 
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-foreground">Bienvenido</h1>
          <p className="text-muted-foreground">Ingresa tu PIN para continuar</p>
        </div>

        <div className="card-elevated p-6 space-y-6">
          {/* User Selection or Selected User */}
          {!selectedUser ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Selecciona tu usuario o ingresa tu PIN directamente
              </p>
              <div className="grid grid-cols-3 gap-2">
                {MOCK_USERS.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className={cn("font-medium", roleColors[user.role])}>
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="text-xs font-medium text-foreground line-clamp-1">
                        {user.name.split(" ")[0]}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{user.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4 p-4 bg-accent/50 rounded-lg">
              <Avatar className="h-14 w-14">
                <AvatarFallback className={cn("font-medium text-lg", roleColors[selectedUser.role])}>
                  {getInitials(selectedUser.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{selectedUser.name}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.role}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedUser(null);
                  setPin("");
                  setError("");
                }}
                className="ml-auto"
              >
                Cambiar
              </Button>
            </div>
          )}

          {/* PIN Display */}
          <div className="space-y-2">
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
          </div>

          {/* PIN Pad */}
          <div className="grid grid-cols-3 gap-3">
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
                    className="h-16 text-lg"
                    onClick={() => handleKeyPress(key)}
                    disabled={pin.length === 0}
                  >
                    <Delete className="w-6 h-6" />
                  </Button>
                );
              }
              return (
                <Button
                  key={key}
                  variant="outline"
                  size="lg"
                  className="h-16 text-2xl font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleKeyPress(key)}
                >
                  {key}
                </Button>
              );
            })}
          </div>

          {/* Quick Login Hint */}
          <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
            <p>PIN de prueba: <strong>1234</strong> (Mesero) | <strong>0000</strong> (Admin)</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          MangoPOS v1.0 • Sistema de Punto de Venta
        </p>
      </div>
    </div>
  );
}
