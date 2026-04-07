import { EMIEntry } from "@/types/emi";
import { cn } from "@/lib/utils";
import iconEdit from "@/assets/icon-edit.svg";
import iconClose from "@/assets/icon-close.svg";
import iconCalendar from "@/assets/icon-calendar.svg";
import iconUndo from "@/assets/icon-undo.svg";

interface EMICardProps {
  entry: EMIEntry;
  onEdit: (entry: EMIEntry) => void;
  onRemove: (id: string) => void;
}

export function EMICard({ entry, onEdit, onRemove }: EMICardProps) {
  return (
    <div className="rounded-xl bg-card p-5 sm:p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 duration-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-body font-semibold text-muted-foreground">{entry.initials}</span>
          </div>
          <div>
            <h3 className="text-[15px] font-body font-semibold text-foreground leading-tight">{entry.name}</h3>
            <span className={cn(
              "text-[11px] font-body font-semibold uppercase tracking-wide",
              entry.type === "emi" ? "text-primary" : "text-primary"
            )}>
              {entry.type === "emi" ? "EMI" : "Subscription"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(entry)}
            className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <img src={iconEdit} alt="Edit" className="w-4 h-4 opacity-50 dark:invert" />
          </button>
          <button
            onClick={() => onRemove(entry.id)}
            className="w-9 h-9 rounded-lg border border-destructive/30 flex items-center justify-center hover:bg-destructive/5 transition-colors"
          >
            <img src={iconClose} alt="Remove" className="w-3.5 h-3.5 opacity-70" style={{ filter: "invert(19%) sepia(99%) saturate(7452%) hue-rotate(0deg) brightness(101%) contrast(110%)" }} />
          </button>
        </div>
      </div>

      {/* EMI view */}
      {entry.type === "emi" && (
        <>
          <div className="mb-4">
            <p className="text-xs font-body text-muted-foreground mb-1">Balance Remaining</p>
            <div className="flex items-baseline justify-between">
              <p className="font-nums text-3xl font-semibold text-foreground leading-none tracking-tight">
                ₹{entry.balanceRemaining.toLocaleString("en-IN")}
              </p>
              {entry.monthsRemaining > 0 && (
                <span className="text-sm text-muted-foreground font-body">~{entry.monthsRemaining} mo left</span>
              )}
            </div>
          </div>

          <p className="text-sm text-foreground font-body mb-4">
            Monthly <span className="font-nums font-semibold">₹{entry.monthlyPayment.toLocaleString("en-IN")}</span>
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-5">
            <img src={iconCalendar} alt="" className="w-4 h-4 opacity-40 dark:invert" />
            <span>Due {entry.dueDate}st of every month</span>
          </div>

          {/* Payment status */}
          {entry.isOverdue ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/5 border border-destructive/10">
              <span className="w-2 h-2 rounded-full bg-destructive flex-shrink-0" />
              <div>
                <p className="text-sm font-body text-destructive font-medium">Overdue by {entry.overdueDays}d</p>
              </div>
            </div>
          ) : entry.lastPaidDate ? (
            <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-muted/50 border border-border/30">
              <span className="w-2 h-2 rounded-full bg-success flex-shrink-0 mt-1.5" />
              <div>
                <p className="text-sm font-body text-success font-medium">Paid on {entry.lastPaidDate}</p>
                {entry.nextDueDate && (
                  <p className="text-xs text-muted-foreground font-body mt-0.5">Next Due on {entry.nextDueDate}</p>
                )}
              </div>
            </div>
          ) : null}

          {/* Spacer to push button box to bottom */}
          <div className="flex-1" />

          {/* Pay button + undo in separate box */}
          <div className="bg-button-box rounded-b-xl px-5 py-[25px] -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 mt-5">
            <div className="flex items-center gap-2">
              <button className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-body font-semibold hover:bg-primary/90 transition-colors">
                Pay ₹{entry.monthlyPayment.toLocaleString("en-IN")}
              </button>
              <button className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors flex-shrink-0">
                <img src={iconUndo} alt="Undo" className="w-4 h-4 opacity-40 dark:invert" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Subscription view */}
      {entry.type === "subscription" && (
        <>
          <div className="flex items-baseline justify-between mb-4">
            <p className="font-nums text-3xl font-semibold text-foreground leading-none tracking-tight">
              ₹{entry.monthlyPayment.toLocaleString("en-IN")}
            </p>
            <span className="text-sm text-muted-foreground font-body">/month</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-3">
            <img src={iconCalendar} alt="" className="w-4 h-4 opacity-40 dark:invert" />
            <span>Renews {entry.dueDate}th</span>
            {entry.endDate && <span>· Ends {entry.endDate}</span>}
          </div>
          {entry.notes && (
            <p className="text-xs text-muted-foreground/60 font-body">{entry.notes}</p>
          )}
        </>
      )}
    </div>
  );
}
