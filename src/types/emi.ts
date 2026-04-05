export type EntryType = "emi" | "subscription";
export type EntryStatus = "active" | "closed";

export interface EMIEntry {
  id: string;
  name: string;
  initials: string;
  type: EntryType;
  status: EntryStatus;
  balanceRemaining: number;
  totalAmount: number;
  monthlyPayment: number;
  interestRate?: number;
  dueDate: number; // day of month
  monthsRemaining: number;
  totalMonths: number;
  lastPaidDate?: string;
  nextDueDate?: string;
  isOverdue?: boolean;
  overdueDays?: number;
}

export interface TrackerStats {
  totalOutstanding: number;
  monthlyEMI: number;
  monthlySubs: number;
  totalMonthlyOut: number;
  activeEMIs: number;
  totalLoans: number;
  activeSubs: number;
}
