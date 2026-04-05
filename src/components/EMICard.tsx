import { EMIEntry } from "@/types/emi";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface EMICardProps {
  entry: EMIEntry;
}

export function EMICard({ entry }: EMICardProps) {
  const paidPercent = entry.totalAmount > 0
    ? Math.round(((entry.totalAmount - entry.balanceRemaining) / entry.totalAmount) * 100)
    : 0;

  const statusColors: Record<string, string> = {
    active: "bg-success/10 text-success",
    closed: "bg-muted text-muted-foreground",
  };

  const typeColors: Record<string, string> = {
    emi: "bg-primary/8 text-primary",
    subscription: "bg-accent text-accent-foreground",
  };

  return (
    <div className="rounded-lg border border-border/50 bg-card overflow-hidden transition-shadow hover:shadow-sm">
      {/* Header */}
      <div className="p-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-mono text-muted-foreground">{entry.initials}</span>
          </div>
          <div>
            <h3 className="text-sm font-body font-medium text-foreground">{entry.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-body", typeColors[entry.type])}>
                {entry.type.toUpperCase()}
              </span>
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-body", statusColors[entry.status])}>
                {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button className="text-[11px] font-body text-muted-foreground px-2.5 py-1 rounded border border-border/60 hover:bg-muted transition-colors">
            Edit
          </button>
          <button className="text-[11px] font-body text-destructive/70 px-2.5 py-1 rounded border border-destructive/20 hover:bg-destructive/5 transition-colors">
            Remove
          </button>
        </div>
      </div>

      {entry.interestRate && (
        <div className="px-4 pb-1">
          <span className="text-[10px] font-mono text-warning">{entry.interestRate}% p.a.</span>
        </div>
      )}

      {/* Balance Section */}
      {entry.type === "emi" && (
        <div className="px-4 pb-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5 font-body">Balance remaining</p>
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-xl text-foreground">₹{entry.balanceRemaining.toLocaleString("en-IN")}</p>
            {entry.monthsRemaining > 0 && (
              <span className="text-[11px] text-muted-foreground font-body">~{entry.monthsRemaining} mo left</span>
            )}
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xs text-muted-foreground font-body">
              Monthly ₹{entry.monthlyPayment.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Progress */}
          {entry.totalAmount > 0 && (
            <div className="mt-3">
              <Progress value={paidPercent} className="h-1.5 bg-muted" />
              <p className="text-[10px] text-muted-foreground mt-1 font-body">
                {paidPercent}% paid of ₹{entry.totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
          )}

          {/* Due info */}
          <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground font-body">
            <span>📅 Due {entry.dueDate}st</span>
            {entry.monthsRemaining > 0 && (
              <span>🕐 ~{entry.monthsRemaining} months remaining</span>
            )}
          </div>

          {/* Status badge */}
          {entry.isOverdue ? (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-md bg-destructive/5 border border-destructive/10">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
              <div>
                <p className="text-xs font-body text-destructive/80">Overdue by {entry.overdueDays}d</p>
                <p className="text-[10px] text-muted-foreground font-body">Was due 10 Mar</p>
              </div>
            </div>
          ) : entry.lastPaidDate ? (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-md bg-success/5 border border-success/10">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              <div>
                <p className="text-xs font-body text-success/80">Paid today</p>
                <p className="text-[10px] text-muted-foreground font-body">Next due {entry.nextDueDate} · in 25d</p>
              </div>
            </div>
          ) : null}

          {/* Pay button */}
          <button className="mt-3 w-full py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-body font-medium hover:bg-primary/90 transition-colors">
            Pay ₹{entry.monthlyPayment.toLocaleString("en-IN")}
          </button>
        </div>
      )}

      {/* Subscription view */}
      {entry.type === "subscription" && (
        <div className="px-4 pb-4">
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-xl text-foreground">₹{entry.monthlyPayment.toLocaleString("en-IN")}</p>
            <span className="text-[11px] text-muted-foreground font-body">/month</span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground font-body">
            <span>📅 Renews on {entry.dueDate}th</span>
          </div>
        </div>
      )}
    </div>
  );
}
