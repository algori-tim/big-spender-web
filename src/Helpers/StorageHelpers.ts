import { Expense } from '../types/expense.type'
import { LedgerEntry } from '../types/ledgerEntry.type'

export const saveExpensesToLocal = (expenses: Expense[]): void => {
  localStorage.setItem('expenses', JSON.stringify(expenses))
}

export const saveExpenseMapToLocal = (expenseMap: Map<string, number>): void => {
  console.log(JSON.stringify(Object.fromEntries(expenseMap.entries())))
  localStorage.setItem('expenseMapEntries', JSON.stringify(Object.fromEntries(expenseMap.entries())))
}

export const saveLedgerEntryToLocal = (ledgerEntry: LedgerEntry): void => {
  console.log(JSON.stringify(ledgerEntry))
  localStorage.setItem(`ledger`, JSON.stringify(ledgerEntry))
}

export const clearLocalData = (createBackup: boolean = false): void => {
  if (createBackup) {
    localStorage.setItem('expenses.backup', localStorage.getItem('expenses') ?? '[]')
    localStorage.setItem('expenseMapEntries.backup', localStorage.getItem('expenseMapEntries') ?? '[]')
    localStorage.setItem('ledger.backup', localStorage.getItem('ledger') ?? '{}')
  }
  localStorage.setItem('expenses', '[]')
  localStorage.setItem('expenseMapEntries', '[]')
  localStorage.setItem('ledger', 'null')
}
