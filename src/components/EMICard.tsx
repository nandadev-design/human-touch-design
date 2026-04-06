import { EMIEntry } from "@/types/emi";
import { cn } from "@/lib/utils";

interface EMICardProps {
  entry: EMIEntry;
  onEdit: (entry: EMIEntry) => void;
  onRemove: (id: string) => void;
}

export function EMICard({ entry, onEdit, onRemove }: EMICardProps) {
  const paidPercent = entry.totalAmount > 0
    ? Math.round(((entry.totalAmount - entry.balanceRemaining) / entry.totalAmount) * 100)
    : 0;

  return (
    <div className="rounded-lg border border-border/40 bg-card p-4 transition-all hover:shadow-md hover:-translate-y-0.5 duration-200">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-[10px] font-mono text-muted-foreground">{entry.initials}</span>
          </div>
          <div>
            <h3 className="text-[13px] font-body font-medium text-foreground leading-tight">{entry.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn(
                "text-[9px] px-1.5 py-[1px] rounded font-body uppercase tracking-wide",
                entry.type === "emi" ? "bg-primary/8 text-primary" : "bg-accent text-accent-foreground"
              )}>
                {entry.type === "emi" ? "EMI" : "Sub"}
              </span>
              {entry.interestRate && (
                <span className="text-[9px] font-mono text-warning">{entry.interestRate} p.a.</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(entry)}
            className="text-[10px] font-body text-muted-foreground px-2 py-1 rounded border border-border/40 hover:bg-muted transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onRemove(entry.id)}
            className="text-[10px] font-body text-destructive/60 px-2 py-1 rounded border border-border/30 hover:bg-destructive/5 transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {/* EMI view */}
      {entry.type === "emi" && (
        <>
          <div className="mb-2">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground/70 font-body mb-0.5">Balance remaining</p>
            <div className="flex items-baseline justify-between">
              <p className="font-nums text-lg font-semibold text-foreground leading-none">₹{entry.balanceRemaining.toLocaleString("en-IN")}</p>
              {entry.monthsRemaining > 0 && (
                <span className="text-[10px] text-muted-foreground font-body">~{entry.monthsRemaining} mo</span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground font-body mb-2">
            Monthly ₹{entry.monthlyPayment.toLocaleString("en-IN")}
          </p>
          {entry.totalAmount > 0 && (
            <div className="mb-2">
              <div className="h-1 rounded-full bg-border/50 overflow-hidden">
                <div className="h-full rounded-full bg-primary/60 transition-all" style={{ width: `${paidPercent}%` }} />
              </div>
              <p className="text-[9px] text-muted-foreground/60 mt-0.5 font-body">{paidPercent}% paid of ₹{entry.totalAmount.toLocaleString("en-IN")}</p>
            </div>
          )}
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70 font-body mb-2">
            <span>📅 Due {entry.dueDate}st</span>
            {entry.endDate && <span>· Ends {entry.endDate}</span>}
          </div>
          {entry.isOverdue ? (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-destructive/5 border border-destructive/10 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
              <div>
                <p className="text-[11px] font-body text-destructive/70">Overdue by {entry.overdueDays}d</p>
              </div>
            </div>
          ) : entry.lastPaidDate ? (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-success/5 border border-success/10 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              <div>
                <p className="text-[11px] font-body text-success/70">Paid</p>
                <p className="text-[9px] text-muted-foreground/60 font-body">Next due {entry.nextDueDate}</p>
              </div>
            </div>
          ) : null}
          <button className="w-full py-2 rounded-md bg-primary text-primary-foreground text-[13px] font-body font-medium hover:bg-primary/90 transition-colors">
            Pay ₹{entry.monthlyPayment.toLocaleString("en-IN")}
          </button>
        </>
      )}

      {/* Subscription view */}
      {entry.type === "subscription" && (
        <>
          <div className="flex items-baseline justify-between mb-1">
            <p className="font-nums text-lg font-semibold text-foreground leading-none">₹{entry.monthlyPayment.toLocaleString("en-IN")}</p>
            <span className="text-[10px] text-muted-foreground/60 font-body">/month</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70 font-body">
            <span>📅 Renews {entry.dueDate}th</span>
            {entry.endDate && <span>· Ends {entry.endDate}</span>}
          </div>
          {entry.notes && (
            <p className="text-[9px] text-muted-foreground/50 font-body mt-1">{entry.notes}</p>
          )}
        </>
      )}
    </div>
  );
}
