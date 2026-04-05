import { useState, useMemo } from "react";
import { sampleEntries } from "@/data/sampleData";
import { StatCard } from "@/components/StatCard";
import { EMICard } from "@/components/EMICard";
import { cn } from "@/lib/utils";

type FilterType = "all" | "emi" | "subscription" | "closed";

const Index = () => {
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return sampleEntries;
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
    { key: "all", label: "All", count: sampleEntries.length },
    { key: "emi", label: "EMI", count: sampleEntries.filter((e) => e.type === "emi").length },
    { key: "subscription", label: "Subscriptions", count: sampleEntries.filter((e) => e.type === "subscription").length },
    { key: "closed", label: "Closed", count: sampleEntries.filter((e) => e.status === "closed").length },
  ];

  const barDataSets = [
    [8, 12, 6, 14, 9, 11, 7, 13, 5, 10, 8, 6, 12, 9, 4],
    [5, 9, 12, 8, 14, 6, 11, 7, 10, 13, 5, 8, 9, 6, 11],
    [3, 5, 7, 4, 6, 8, 3, 5, 7, 9, 4, 6, 8, 5, 3],
    [6, 10, 8, 12, 7, 14, 9, 11, 5, 13, 8, 6, 10, 7, 12],
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-body uppercase tracking-[0.2em] text-muted-foreground mb-1">
            ✦ Tracker / April 2026
          </p>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground tracking-tight">
            EMI & Subscription Tracker
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Local only · Export/import JSON for an extra backup
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-body font-medium hover:bg-primary/90 transition-colors">
            + Add
          </button>
          <button className="px-4 py-2 rounded-md border border-border/60 text-sm font-body text-foreground hover:bg-muted transition-colors">
            Export JSON
          </button>
          <button className="px-4 py-2 rounded-md border border-border/60 text-sm font-body text-foreground hover:bg-muted transition-colors">
            Import…
          </button>

          <div className="flex items-center gap-1 ml-2 bg-muted/50 rounded-md p-0.5">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "px-3 py-1.5 rounded text-sm font-body transition-colors",
                  filter === f.key
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
                <span className={cn(
                  "ml-1.5 text-[10px] font-mono",
                  filter === f.key ? "text-background/70" : "text-muted-foreground/60"
                )}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          <StatCard
            label="Total outstanding"
            value={`₹${stats.totalOutstanding.toLocaleString("en-IN")}`}
            subtitle={`${stats.activeEMIs} active EMIs`}
            accentColor="hsl(0, 70%, 55%)"
            barData={barDataSets[0]}
          />
          <StatCard
            label="Monthly EMI"
            value={`₹${stats.monthlyEMI.toLocaleString("en-IN")}`}
            subtitle={`across ${stats.totalLoans} loans`}
            accentColor="hsl(24, 80%, 50%)"
            barData={barDataSets[1]}
          />
          <StatCard
            label="Monthly subs"
            value={`₹${stats.monthlySubs.toLocaleString("en-IN")}`}
            subtitle={`${stats.activeSubs} subscriptions`}
            accentColor="hsl(270, 60%, 55%)"
            barData={barDataSets[2]}
          />
          <StatCard
            label="Total monthly out"
            value={`₹${stats.totalMonthlyOut.toLocaleString("en-IN")}`}
            subtitle="EMIs + subscriptions"
            accentColor="hsl(190, 70%, 45%)"
            barData={barDataSets[3]}
          />
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((entry) => (
            <EMICard key={entry.id} entry={entry} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-body">No entries found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
