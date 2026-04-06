import { useState, useEffect } from "react";
import { EMIEntry, EntryType, EntryStatus } from "@/types/emi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EntryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: EMIEntry | null;
  onSave: (data: Omit<EMIEntry, "id">) => void;
}

const defaultForm = {
  name: "",
  type: "emi" as EntryType,
  status: "active" as EntryStatus,
  balanceRemaining: 0,
  totalAmount: 0,
  monthlyPayment: 0,
  dueDate: 1,
  monthsRemaining: 0,
  totalMonths: 0,
  interestRate: "",
  endDate: "",
  notes: "",
};

function makeInitials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function EntryFormDialog({ open, onOpenChange, entry, onSave }: EntryFormDialogProps) {
  const [form, setForm] = useState(defaultForm);
  const isEdit = !!entry;

  useEffect(() => {
    if (entry) {
      setForm({
        name: entry.name,
        type: entry.type,
        status: entry.status,
        balanceRemaining: entry.balanceRemaining,
        totalAmount: entry.totalAmount,
        monthlyPayment: entry.monthlyPayment,
        dueDate: entry.dueDate,
        monthsRemaining: entry.monthsRemaining,
        totalMonths: entry.totalMonths,
        interestRate: entry.interestRate || "",
        endDate: entry.endDate || "",
        notes: entry.notes || "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [entry, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      name: form.name.trim(),
      initials: makeInitials(form.name.trim()),
      type: form.type,
      status: form.status,
      balanceRemaining: Number(form.balanceRemaining),
      totalAmount: Number(form.totalAmount),
      monthlyPayment: Number(form.monthlyPayment),
      dueDate: Number(form.dueDate),
      monthsRemaining: Number(form.monthsRemaining),
      totalMonths: Number(form.totalMonths),
      ...(form.interestRate ? { interestRate: form.interestRate } : {}),
      ...(form.endDate ? { endDate: form.endDate } : {}),
      ...(form.notes ? { notes: form.notes } : {}),
    });
    onOpenChange(false);
  };

  const set = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">{isEdit ? "Edit Entry" : "Add Entry"}</DialogTitle>
          <DialogDescription className="font-body text-sm">
            {isEdit ? "Update the details below." : "Fill in the details to add a new entry."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs font-body">Name</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Navi Loans" required />
            </div>
            <div>
              <Label className="text-xs font-body">Type</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="emi">EMI</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-body">Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-body">Monthly Payment</Label>
              <Input type="number" value={form.monthlyPayment} onChange={(e) => set("monthlyPayment", e.target.value)} min={0} />
            </div>
            <div>
              <Label className="text-xs font-body">Due Date (day)</Label>
              <Input type="number" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} min={1} max={31} />
            </div>
            {form.type === "emi" && (
              <>
                <div>
                  <Label className="text-xs font-body">Balance Remaining</Label>
                  <Input type="number" value={form.balanceRemaining} onChange={(e) => set("balanceRemaining", e.target.value)} min={0} />
                </div>
                <div>
                  <Label className="text-xs font-body">Total Amount</Label>
                  <Input type="number" value={form.totalAmount} onChange={(e) => set("totalAmount", e.target.value)} min={0} />
                </div>
                <div>
                  <Label className="text-xs font-body">Months Remaining</Label>
                  <Input type="number" value={form.monthsRemaining} onChange={(e) => set("monthsRemaining", e.target.value)} min={0} />
                </div>
                <div>
                  <Label className="text-xs font-body">Total Months</Label>
                  <Input type="number" value={form.totalMonths} onChange={(e) => set("totalMonths", e.target.value)} min={0} />
                </div>
                <div>
                  <Label className="text-xs font-body">Interest Rate</Label>
                  <Input value={form.interestRate} onChange={(e) => set("interestRate", e.target.value)} placeholder="e.g. 23%" />
                </div>
              </>
            )}
            <div>
              <Label className="text-xs font-body">End Date</Label>
              <Input value={form.endDate} onChange={(e) => set("endDate", e.target.value)} placeholder="e.g. Sep 2027" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs font-body">Notes</Label>
              <Input value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Optional notes" />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-body font-medium hover:bg-primary/90 transition-colors"
          >
            {isEdit ? "Save Changes" : "Add Entry"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
