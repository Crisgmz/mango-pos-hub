import { ClipboardList } from "lucide-react";
import SettingsPlaceholder from "./SettingsPlaceholder";

export default function ImpresionComandas() {
  return (
    <SettingsPlaceholder
      title="Asignar Impresión de Comandas"
      description="Comandas por impresora"
      icon={ClipboardList}
    />
  );
}
