import { Expense } from './expense.type'
import { Carryover } from './carryover.type'

export type LedgerEntry = {
  date: Date
  carryovers: Carryover[]
  expenses: Expense[]
}
