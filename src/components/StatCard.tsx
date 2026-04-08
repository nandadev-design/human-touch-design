interface StatCardProps {
  label: string;
  value: string;
  subtitle: string;
  accentColor?: string;
}

export function StatCard({ label, value, subtitle, accentColor = "hsl(var(--primary))" }: StatCardProps) {
  return (
    <div className="rounded-lg bg-card p-4 flex flex-col justify-between min-h-[100px]">
      <p className="text-[10px] font-body uppercase tracking-widest text-muted-foreground/70 mb-1">{label}</p>
      <p className="font-nums text-[32px] font-semibold tracking-tight text-foreground leading-none">{value}</p>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor, opacity: 0.6 }} />
        <span className="text-[11px] text-muted-foreground/60 font-body">{subtitle}</span>
      </div>
    </div>
  );
}
