import { useState, useEffect } from "react";
import { EMIEntry } from "@/types/emi";
import { sampleEntries } from "@/data/sampleData";

const STORAGE_KEY = "emi-tracker-entries";

function loadEntries(): EMIEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return sampleEntries;
}

function saveEntries(entries: EMIEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useEntries() {
  const [entries, setEntries] = useState<EMIEntry[]>(loadEntries);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const addEntry = (entry: Omit<EMIEntry, "id">) => {
    const newEntry: EMIEntry = { ...entry, id: crypto.randomUUID() };
    setEntries((prev) => [...prev, newEntry]);
  };

  const updateEntry = (id: string, updates: Partial<EMIEntry>) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return { entries, addEntry, updateEntry, removeEntry };
}
