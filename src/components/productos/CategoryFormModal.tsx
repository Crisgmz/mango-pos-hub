import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/pos";

const CATEGORY_ICONS = ["🍽️", "🍲", "🥗", "🍟", "🥤", "🦐", "🍰", "🍕", "🍔", "🌮", "🍣", "🥩"];

interface CategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (category: Omit<Category, "id" | "productCount">) => Category;
}

export function CategoryFormModal({ open, onOpenChange, onSave }: CategoryFormModalProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🍽️");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (name.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return;
    }

    const newCategory = onSave({
      name: name.trim(),
      icon: selectedIcon,
    });

    // Reset form
    setName("");
    setSelectedIcon("🍽️");
    setError("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setName("");
    setSelectedIcon("🍽️");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Categoría</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Nombre de la Categoría *</Label>
            <Input
              id="category-name"
              placeholder="Ej: Postres, Entradas..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label>Icono</Label>
            <div className="grid grid-cols-6 gap-2">
              {CATEGORY_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`p-3 text-2xl rounded-lg border transition-all ${
                    selectedIcon === icon
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="btn-mango">
            Guardar Categoría
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
