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
  interestRate?: string;
  dueDate: number;
  monthsRemaining: number;
  totalMonths: number;
  endDate?: string;
  notes?: string;
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
