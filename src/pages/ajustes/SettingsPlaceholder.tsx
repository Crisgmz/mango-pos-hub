import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Construction } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface SettingsPlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function SettingsPlaceholder({ title, description, icon: Icon }: SettingsPlaceholderProps) {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ajustes")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="rounded-full bg-muted p-4">
              <Icon className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Construction className="h-5 w-5" />
              <span className="text-lg font-medium">Próximamente</span>
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Esta sección está en desarrollo. Pronto podrás configurar todo lo relacionado con {title.toLowerCase()}.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
