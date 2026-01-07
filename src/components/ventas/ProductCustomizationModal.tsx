import { useState, useMemo } from "react";
import { Minus, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product, SelectedModifier } from "@/types/pos";

interface ProductCustomizationModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (
    product: Product,
    quantity: number,
    modifiers: SelectedModifier[],
    notes: string
  ) => void;
}

const quickNotes = [
  "Sin azúcar",
  "Con azúcar",
  "Sin sal",
  "Extra picante",
  "Sin cebolla",
  "Sin ajo",
  "Para llevar",
];

export function ProductCustomizationModal({
  product,
  open,
  onClose,
  onConfirm,
}: ProductCustomizationModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<
    Map<string, Set<string>>
  >(new Map());
  const [notes, setNotes] = useState("");

  // Reset state when product changes
  const resetState = () => {
    setQuantity(1);
    setSelectedModifiers(new Map());
    setNotes("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const toggleModifier = (groupId: string, modifierId: string, maxSelection: number) => {
    setSelectedModifiers((prev) => {
      const newMap = new Map(prev);
      const groupSelections = newMap.get(groupId) || new Set();

      if (maxSelection === 1) {
        // Single selection - replace
        newMap.set(groupId, new Set([modifierId]));
      } else {
        // Multiple selection
        if (groupSelections.has(modifierId)) {
          groupSelections.delete(modifierId);
        } else if (groupSelections.size < maxSelection) {
          groupSelections.add(modifierId);
        }
        newMap.set(groupId, groupSelections);
      }

      return newMap;
    });
  };

  const addQuickNote = (note: string) => {
    setNotes((prev) => {
      if (prev.includes(note)) return prev;
      return prev ? `${prev}, ${note}` : note;
    });
  };

  const getSelectedModifiersList = (): SelectedModifier[] => {
    if (!product?.modifierGroups) return [];

    const result: SelectedModifier[] = [];
    selectedModifiers.forEach((modifierIds, groupId) => {
      const group = product.modifierGroups?.find((g) => g.id === groupId);
      if (!group) return;

      modifierIds.forEach((modifierId) => {
        const modifier = group.modifiers.find((m) => m.id === modifierId);
        if (modifier) {
          result.push({
            groupId: group.id,
            groupName: group.name,
            modifierId: modifier.id,
            modifierName: modifier.name,
            price: modifier.price,
          });
        }
      });
    });
    return result;
  };

  const modifiersTotal = useMemo(() => {
    return getSelectedModifiersList().reduce((sum, m) => sum + m.price, 0);
  }, [selectedModifiers, product]);

  const unitPrice = (product?.price || 0) + modifiersTotal;
  const totalPrice = unitPrice * quantity;

  const formatCurrency = (amount: number) =>
    `RD$ ${amount.toLocaleString("es-DO")}`;

  const isValid = useMemo(() => {
    if (!product?.modifierGroups) return true;

    return product.modifierGroups.every((group) => {
      if (!group.required) return true;
      const selected = selectedModifiers.get(group.id);
      return selected && selected.size >= group.minSelection;
    });
  }, [product, selectedModifiers]);

  const handleConfirm = () => {
    if (!product || !isValid) return;
    onConfirm(product, quantity, getSelectedModifiersList(), notes);
    handleClose();
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{product.name}</DialogTitle>
              <p className="text-2xl font-bold text-primary mt-1">
                {formatCurrency(product.price)}
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh]">
          <div className="p-4 space-y-6">
            {/* Quantity */}
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
              <span className="font-medium">Cantidad</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center text-xl font-bold">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Modifier Groups */}
            {product.modifierGroups?.map((group) => (
              <div key={group.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{group.name}</h4>
                  {group.required && (
                    <Badge variant="destructive" className="text-xs">
                      Requerido
                    </Badge>
                  )}
                  {group.maxSelection > 1 && (
                    <Badge variant="secondary" className="text-xs">
                      Máx. {group.maxSelection}
                    </Badge>
                  )}
                </div>

                {group.maxSelection === 1 ? (
                  <RadioGroup
                    value={
                      Array.from(selectedModifiers.get(group.id) || [])[0] || ""
                    }
                    onValueChange={(value) =>
                      toggleModifier(group.id, value, 1)
                    }
                  >
                    <div className="space-y-2">
                      {group.modifiers.map((modifier) => (
                        <div
                          key={modifier.id}
                          className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem
                              value={modifier.id}
                              id={modifier.id}
                            />
                            <Label
                              htmlFor={modifier.id}
                              className="cursor-pointer"
                            >
                              {modifier.name}
                            </Label>
                          </div>
                          {modifier.price > 0 && (
                            <span className="text-sm font-medium text-primary">
                              +{formatCurrency(modifier.price)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    {group.modifiers.map((modifier) => {
                      const isSelected =
                        selectedModifiers.get(group.id)?.has(modifier.id) ||
                        false;
                      return (
                        <div
                          key={modifier.id}
                          className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id={modifier.id}
                              checked={isSelected}
                              onCheckedChange={() =>
                                toggleModifier(
                                  group.id,
                                  modifier.id,
                                  group.maxSelection
                                )
                              }
                            />
                            <Label
                              htmlFor={modifier.id}
                              className="cursor-pointer"
                            >
                              {modifier.name}
                            </Label>
                          </div>
                          {modifier.price > 0 && (
                            <span className="text-sm font-medium text-primary">
                              +{formatCurrency(modifier.price)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Notes */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">
                Notas especiales
              </h4>
              <div className="flex flex-wrap gap-2">
                {quickNotes.map((note) => (
                  <Button
                    key={note}
                    variant="outline"
                    size="sm"
                    className={`rounded-full ${
                      notes.includes(note)
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                    onClick={() => addQuickNote(note)}
                  >
                    {note}
                  </Button>
                ))}
              </div>
              <Textarea
                placeholder="Escribe instrucciones adicionales..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleConfirm}
              disabled={!isValid}
            >
              Agregar al pedido
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
