import { Carryover } from './carryover.type'
import { Expense } from './expense.type'

export type LedgerEntry = {
  reconciledDate: Date
  carryovers: Carryover[]
  expenses: Expense[]
}
