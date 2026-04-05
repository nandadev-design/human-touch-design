import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  subtitle: string;
  accentColor?: string;
  barData?: number[];
}

const MiniBarChart = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[2px] h-5 mt-2">
      {data.map((val, i) => (
        <div
          key={i}
          className="w-[3px] rounded-sm transition-all"
          style={{
            height: `${Math.max((val / max) * 100, 10)}%`,
            backgroundColor: val > max * 0.5 ? color : "hsl(var(--border))",
            opacity: val > max * 0.5 ? 0.7 : 0.35,
          }}
        />
      ))}
    </div>
  );
};

export function StatCard({ label, value, subtitle, accentColor = "hsl(var(--primary))", barData }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-5 flex flex-col justify-between min-h-[140px]">
      <p className="text-[11px] font-body uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <p className="font-mono text-2xl tracking-tight text-foreground">{value}</p>
      {barData && <MiniBarChart data={barData} color={accentColor} />}
      <div className="flex items-center gap-1.5 mt-2">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
        <span className="text-xs text-muted-foreground font-body">{subtitle}</span>
      </div>
    </div>
  );
}
