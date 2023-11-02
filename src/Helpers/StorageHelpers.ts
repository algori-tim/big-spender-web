import { Expense } from '../types/expense.type'

export const saveExpensesToLocal = (expenses: Expense[]): void => {
  localStorage.setItem('expenses', JSON.stringify(expenses))
}

export const clearExpensesFromLocal = (createBackup: boolean = false): void => {
  if (createBackup) {
    localStorage.setItem('expenses.backup', localStorage.getItem('expenses') ?? '[]')
  }
  localStorage.setItem('expenses', '[]')
}
