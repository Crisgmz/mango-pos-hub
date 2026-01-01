import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

const salesData = [
  { day: "Lun", ventas: 45200 },
  { day: "Mar", ventas: 52800 },
  { day: "Mié", ventas: 48300 },
  { day: "Jue", ventas: 61500 },
  { day: "Vie", ventas: 78900 },
  { day: "Sáb", ventas: 92400 },
  { day: "Dom", ventas: 67800 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function SalesChart() {
  const totalSales = salesData.reduce((sum, day) => sum + day.ventas, 0);
  const avgSales = totalSales / salesData.length;
  const maxSales = Math.max(...salesData.map((d) => d.ventas));

  return (
    <div className="card-elevated p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="section-title mb-0">Resumen de Ventas</h2>
          <p className="text-sm text-muted-foreground">Últimos 7 días</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-sm font-medium text-secondary-foreground hover:bg-accent transition-colors">
          <Calendar className="w-4 h-4" />
          Esta semana
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-success/5 rounded-xl border border-success/20">
          <p className="text-xs text-muted-foreground mb-1">Total Ventas</p>
          <p className="text-xl font-bold text-success">{formatCurrency(totalSales)}</p>
        </div>
        <div className="p-4 bg-info/5 rounded-xl border border-info/20">
          <p className="text-xs text-muted-foreground mb-1">Promedio Diario</p>
          <p className="text-xl font-bold text-info">{formatCurrency(avgSales)}</p>
        </div>
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">Día Récord</p>
          <p className="text-xl font-bold text-primary">{formatCurrency(maxSales)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 88%)" vertical={false} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: "hsl(20, 10%, 45%)", fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: "hsl(20, 10%, 45%)", fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(30, 15%, 88%)",
                borderRadius: "12px",
                boxShadow: "0 4px 12px hsl(20 14% 12% / 0.08)",
              }}
              formatter={(value: number) => [formatCurrency(value), "Ventas"]}
            />
            <Area
              type="monotone"
              dataKey="ventas"
              stroke="hsl(25, 95%, 53%)"
              strokeWidth={2}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Indicator */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5 text-success">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+12.5%</span>
        </div>
        <span className="text-sm text-muted-foreground">vs. semana anterior</span>
      </div>
    </div>
  );
}
