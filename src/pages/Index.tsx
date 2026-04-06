import { useState, useMemo } from "react";
import { Sun, Moon } from "lucide-react";
import { sampleEntries } from "@/data/sampleData";
import { StatCard } from "@/components/StatCard";
import { EMICard } from "@/components/EMICard";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

type FilterType = "all" | "emi" | "subscription" | "closed";

const Index = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const filtered = useMemo(() => {
    if (filter === "all") return sampleEntries.filter((e) => e.status === "active");
    if (filter === "closed") return sampleEntries.filter((e) => e.status === "closed");
    return sampleEntries.filter((e) => e.type === filter && e.status === "active");
  }, [filter]);

  const stats = useMemo(() => {
    const active = sampleEntries.filter((e) => e.status === "active");
    const emis = active.filter((e) => e.type === "emi");
    const subs = active.filter((e) => e.type === "subscription");
    return {
      totalOutstanding: emis.reduce((s, e) => s + e.balanceRemaining, 0),
      monthlyEMI: emis.reduce((s, e) => s + e.monthlyPayment, 0),
      monthlySubs: subs.reduce((s, e) => s + e.monthlyPayment, 0),
      totalMonthlyOut: active.reduce((s, e) => s + e.monthlyPayment, 0),
      activeEMIs: emis.length,
      totalLoans: emis.length,
      activeSubs: subs.length,
    };
  }, []);

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "All", count: sampleEntries.filter((e) => e.status === "active").length },
    { key: "emi", label: "EMIs", count: sampleEntries.filter((e) => e.type === "emi" && e.status === "active").length },
    { key: "subscription", label: "Subscriptions", count: sampleEntries.filter((e) => e.type === "subscription" && e.status === "active").length },
    { key: "closed", label: "Closed", count: sampleEntries.filter((e) => e.status === "closed").length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Header */}
        <div className="mb-6">
          <p className="text-[11px] font-body uppercase tracking-[0.2em] text-muted-foreground/70 mb-1">
            ✦ Tracker / April 2026
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-foreground tracking-tight">
              EMI & Subscription Tracker
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-body font-medium hover:bg-primary/90 transition-colors">
                + Add
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-0">
          <StatCard
            label="Total outstanding"
            value={`₹${stats.totalOutstanding.toLocaleString("en-IN")}`}
            subtitle={`${stats.activeEMIs} active EMIs`}
            accentColor="hsl(0, 70%, 55%)"
          />
          <StatCard
            label="Monthly EMI"
            value={`₹${stats.monthlyEMI.toLocaleString("en-IN")}`}
            subtitle={`across ${stats.totalLoans} loans`}
            accentColor="hsl(24, 80%, 50%)"
          />
          <StatCard
            label="Monthly subs"
            value={`₹${stats.monthlySubs.toLocaleString("en-IN")}`}
            subtitle={`${stats.activeSubs} subscriptions`}
            accentColor="hsl(270, 60%, 55%)"
          />
          <StatCard
            label="Total monthly out"
            value={`₹${stats.totalMonthlyOut.toLocaleString("en-IN")}`}
            subtitle="EMIs + subscriptions"
            accentColor="hsl(190, 70%, 45%)"
          />
        </div>

        {/* Filter Tabs — below stats */}
        <div className="border-b border-border/60 mb-6 mt-1">
          <div className="flex items-stretch">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="relative group"
              >
                <span
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-3.5 text-sm font-body font-medium transition-colors",
                    filter === f.key
                      ? "text-foreground"
                      : "text-muted-foreground/50 hover:text-muted-foreground"
                  )}
                >
                  {f.label}
                  <span className={cn(
                    "font-mono text-[11px] tabular-nums",
                    filter === f.key ? "opacity-50" : "opacity-40"
                  )}>
                    {f.count}
                  </span>
                </span>
                {/* Active underline */}
                <span
                  className={cn(
                    "absolute bottom-[-1px] left-0 right-0 h-[2.5px] rounded-t-sm transition-all",
                    filter === f.key
                      ? "bg-foreground"
                      : "bg-transparent"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((entry) => (
            <EMICard key={entry.id} entry={entry} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-body text-sm">No entries found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
