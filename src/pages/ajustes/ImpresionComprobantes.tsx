import { Receipt } from "lucide-react";
import SettingsPlaceholder from "./SettingsPlaceholder";

export default function ImpresionComprobantes() {
  return (
    <SettingsPlaceholder
      title="Asignar Impresión de Comprobantes"
      description="Comprobantes por impresora"
      icon={Receipt}
    />
  );
}
